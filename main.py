from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from keras_vggface.utils import preprocess_input
from keras_vggface.vggface import VGGFace
from src.utils.all_utils import read_yaml, create_directory
from sklearn.metrics.pairwise import cosine_similarity
from PIL import Image
from mtcnn import MTCNN
import numpy as np
import pickle
import os
import cv2
import shutil
import uuid
from fastapi.middleware.cors import CORSMiddleware


# --------------------
# Load configurations
# --------------------
config = read_yaml('config/config.yaml')
params = read_yaml('params.yaml')

artifacts = config['artifacts']
artifacts_dir = artifacts['artifacts_dir']

# Upload image dir
upload_image_dir = artifacts['upload_image_dir']
uploadn_path = os.path.join(artifacts_dir, upload_image_dir)

# Pickle data
pickle_format_data_dir = artifacts['pickle_format_data_dir']
img_pickle_file_name = artifacts['img_pickle_file_name']
raw_local_dir_path = os.path.join(artifacts_dir, pickle_format_data_dir)
pickle_file = os.path.join(raw_local_dir_path, img_pickle_file_name)

# Feature path
feature_extraction_dir = artifacts['feature_extraction_dir']
extracted_features_name = artifacts['extracted_features_name']
feature_extraction_path = os.path.join(artifacts_dir, feature_extraction_dir)
features_name = os.path.join(feature_extraction_path, extracted_features_name)

# Model params
model_name = params['base']['BASE_MODEL']
include_tops = params['base']['include_top']
poolings = params['base']['pooling']

# --------------------
# Load model & data
# --------------------
detector = MTCNN()
model = VGGFace(model=model_name, include_top=include_tops,
                input_shape=(224, 224, 3), pooling=poolings)

feature_list = pickle.load(open(features_name, 'rb'))
filenames = pickle.load(open(pickle_file, 'rb'))

# --------------------
# Helper functions
# --------------------
def extract_features(img_path):
    img = cv2.imread(img_path)
    results = detector.detect_faces(img)
    if len(results) == 0:
        return None
    x, y, width, height = results[0]['box']
    face = img[y:y + height, x:x + width]
    image = Image.fromarray(face).resize((224, 224))
    face_array = np.asarray(image).astype('float32')
    expanded_img = np.expand_dims(face_array, axis=0)
    preprocessed_img = preprocess_input(expanded_img)
    result = model.predict(preprocessed_img).flatten()
    return result

def recommend(features):
    similarity = []
    for i in range(len(feature_list)):
        sim = cosine_similarity(features.reshape(1, -1), feature_list[i].reshape(1, -1))[0][0]
        similarity.append(sim)
    sorted_list = sorted(list(enumerate(similarity)), reverse=True, key=lambda x: x[1])
    index_pos, best_score = sorted_list[0]
    return index_pos, best_score

# --------------------
# FastAPI App
# --------------------
app = FastAPI()

# CORS setup (allow all origins)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Koi bhi origin allowed
    allow_credentials=True,
    allow_methods=["*"],  # Sare methods allowed
    allow_headers=["*"],  # Sare headers allowed
)


# Static folder mount
STATIC_DIR = "static"
os.makedirs(STATIC_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.post("/predict")
async def predict_face(file: UploadFile = File(...)):
    try:
        # Save uploaded image
        create_directory([uploadn_path])
        image_path = os.path.join(uploadn_path, file.filename)
        with open(image_path, "wb") as f:
            f.write(await file.read())

        # Extract features
        features = extract_features(image_path)
        if features is None:
            return JSONResponse(content={"error": "No face detected"}, status_code=400)

        # Recommend
        index_pos, score = recommend(features)
        percentage = round(score * 100, 2)
        folder_name = os.path.basename(os.path.dirname(filenames[index_pos]))
        predicted_actor = folder_name.replace('_', ' ')

        # Copy matched image to static folder with unique name
        ext = os.path.splitext(filenames[index_pos])[1]
        unique_filename = f"{uuid.uuid4()}{ext}"
        static_path = os.path.join(STATIC_DIR, unique_filename)
        shutil.copy(filenames[index_pos], static_path)

        # Generate URLs
        matched_image_url = f"http://127.0.0.1:8000/static/{unique_filename}"

        return {
            "name": predicted_actor,
            "match_percentage": percentage,
            "matched_image_url": matched_image_url
        }

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
