import argparse
import os
import logging
import pickle
import numpy as np
from tqdm import tqdm
from keras_preprocessing.image import load_img, img_to_array
from keras_vggface.utils import preprocess_input
from keras_vggface.vggface import VGGFace
from src.utils.all_utils import read_yaml, create_directory

# Configure logging 
logging_str = "[%(asctime)s: %(levelname)s: %(module)s]: %(message)s"
log_dir = 'logs'
os.makedirs(log_dir, exist_ok=True)
logging.basicConfig(
    filename=os.path.join(log_dir, "running_log.log"),
    level=logging.INFO,
    format=logging_str,
    filemode='a'
)

def extractor(img_path, model):
    """
    Convert image to feature vector using the specified model
    
    Args:
        img_path (str): Path to image file
        model (VGGFace): Pretrained VGGFace model
        
    Returns:
        np.array: Extracted features as flattened array
    """
    try:
        # Load and preprocess image
        img = load_img(img_path, target_size=(224, 224))
        img_array = img_to_array(img)
        expanded_img = np.expand_dims(img_array, axis=0)
        preprocessed_img = preprocess_input(expanded_img)
        
        # Extract features
        result = model.predict(preprocessed_img).flatten()
        return result
    except Exception as e:
        logging.error(f"Error processing image {img_path}: {str(e)}")
        raise

def feature_extractor(config_path, params_path):
    """
    Main feature extraction pipeline
    
    Args:
        config_path (str): Path to config YAML file
        params_path (str): Path to params YAML file
    """
    try:
        # Load configuration
        config = read_yaml(config_path)
        params = read_yaml(params_path)
        
        # Setup paths
        artifacts = config['artifacts']
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        # Input pickle file paths
        pickle_format_data_dir = artifacts['pickle_format_data_dir']
        img_pickle_file_name = artifacts['img_pickle_file_name']
        img_pickle_file = os.path.join(
            base_dir,
            artifacts['artifacts_dir'],
            pickle_format_data_dir,
            img_pickle_file_name
        )
        
        # Validate input pickle
        if not os.path.exists(img_pickle_file):
            raise FileNotFoundError(f"Image pickle file not found at {img_pickle_file}")
        if os.path.getsize(img_pickle_file) == 0:
            raise ValueError(f"Image pickle file is empty: {img_pickle_file}")
            
        # Load image paths
        with open(img_pickle_file, 'rb') as f:
            filenames = pickle.load(f)
        logging.info(f"Successfully loaded {len(filenames)} image paths")
        
        # Initialize model
        model = VGGFace(
            model=params['base']['BASE_MODEL'],
            include_top=params['base']['include_top'],
            pooling=params['base']['pooling'],
            input_shape=(224, 224, 3)
        )
        logging.info(f"Initialized {params['base']['BASE_MODEL']} model")
        
        # Setup output directory
        feature_extraction_path = os.path.join(
            base_dir,
            artifacts['artifacts_dir'],
            artifacts['feature_extraction_dir']
        )
        create_directory(dirs=[feature_extraction_path])
        
        # Extract features
        features = []
        failed_files = []
        
        for file in tqdm(filenames, desc="Extracting features"):
            try:
                features.append(extractor(file, model))
            except Exception as e:
                failed_files.append(file)
                logging.warning(f"Skipped {file}: {str(e)}")
                continue
        
        # Validate extracted features
        if not features:
            raise ValueError("No features were extracted successfully")
        if len(features) != len(filenames) - len(failed_files):
            raise ValueError("Mismatch between processed files and extracted features")
        
        # Save features
        feature_name = os.path.join(
            feature_extraction_path,
            artifacts['extracted_features_name']
        )
        
        with open(feature_name, 'wb') as f:
            pickle.dump(features, f)
        
        logging.info(f"Successfully saved {len(features)} features to {feature_name}")
        
        if failed_files:
            logging.warning(f"Failed to process {len(failed_files)} files")
            with open(os.path.join(feature_extraction_path, 'failed_files.txt'), 'w') as f:
                f.write('\n'.join(failed_files))
        
    except Exception as e:
        logging.error(f"Feature extraction failed: {str(e)}")
        raise
    finally:
        # Clean up
        if 'model' in locals():
            del model

if __name__ == '__main__':
    # Argument parsing
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', '-c', default='config/config.yaml', 
                       help='Path to config file')
    parser.add_argument('--params', '-p', default='params.yaml',
                       help='Path to params file')
    args = parser.parse_args()
    
    try:
        logging.info(">>>>> Stage 02 feature extraction started")
        feature_extractor(config_path=args.config, params_path=args.params)
        logging.info("<<<<< Stage 02 completed successfully")
    except Exception as e:
        logging.exception(f"Stage 02 failed: {str(e)}")
        raise