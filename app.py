import streamlit as st
from keras_vggface.utils import preprocess_input
from keras_vggface.vggface import VGGFace
from src.utils.all_utils import read_yaml, create_directory
import pickle
from sklearn.metrics.pairwise import cosine_similarity
from PIL import Image
import os
import cv2
from mtcnn import MTCNN
import numpy as np

# =========================
# Load configurations
# =========================
config = read_yaml('config/config.yaml')
params = read_yaml('params.yaml')

artifacts = config['artifacts']
artifacts_dir = artifacts['artifacts_dir']

upload_image_dir = artifacts['upload_image_dir']
uploadn_path = os.path.join(artifacts_dir, upload_image_dir)

pickle_format_data_dir = artifacts['pickle_format_data_dir']
img_pickle_file_name = artifacts['img_pickle_file_name']
raw_local_dir_path = os.path.join(artifacts_dir, pickle_format_data_dir)
pickle_file = os.path.join(raw_local_dir_path, img_pickle_file_name)

feature_extraction_dir = artifacts['feature_extraction_dir']
extracted_features_name = artifacts['extracted_features_name']
feature_extraction_path = os.path.join(artifacts_dir, feature_extraction_dir)
features_name = os.path.join(feature_extraction_path, extracted_features_name)

model_name = params['base']['BASE_MODEL']
include_tops = params['base']['include_top']
poolings = params['base']['pooling']

# =========================
# Load model & data
# =========================
detector = MTCNN()
model = VGGFace(model=model_name, include_top=include_tops,
                input_shape=(224, 224, 3), pooling=poolings)

feature_list = pickle.load(open(features_name, 'rb'))
filenames = pickle.load(open(pickle_file, 'rb'))

# =========================
# Helper functions
# =========================
def save_uploaded_image(uploaded_image):
    try:
        create_directory(dirs=[uploadn_path])
        with open(os.path.join(uploadn_path, uploaded_image.name), 'wb') as f:
            f.write(uploaded_image.getbuffer())
        return True
    except:
        return False

def extract_features(img_path, model, detector):
    img = cv2.imread(img_path)
    results = detector.detect_faces(img)
    if len(results) == 0:
        return None
    x, y, width, height = results[0]['box']
    face = img[y:y + height, x:x + width]
    image = Image.fromarray(face)
    image = image.resize((224, 224))
    face_array = np.asarray(image).astype('float32')
    expanded_img = np.expand_dims(face_array, axis=0)
    preprocessed_img = preprocess_input(expanded_img)
    result = model.predict(preprocessed_img).flatten()
    return result

def recommend(feature_list, features):
    similarity = []
    for i in range(len(feature_list)):
        sim = cosine_similarity(features.reshape(1, -1), feature_list[i].reshape(1, -1))[0][0]
        similarity.append(sim)
    index_pos = sorted(list(enumerate(similarity)), reverse=True, key=lambda x: x[1])[0][0]
    return index_pos, similarity[index_pos]

# =========================
# Streamlit UI Settings
# =========================
st.set_page_config(page_title="Bollywood Look-Alike fasreFinder  ✨ ", layout="wide")

# Custom CSS for styling
st.markdown("""
    <style>
        .title {
            font-family: 'Poppins', sans-serif;
            font-size: 36px;
            font-weight: bold;
            color: #FFD700;
            text-align: center;
        }
        .subtitle {
            font-size: 18px;
            color: #f0f0f0;
            text-align: center;
        }
        .result-card {
            border: 2px solid #FFD700;
            border-radius: 15px;
            padding: 10px;
            background-color: #111;
            text-align: center;
        }
        .stButton>button {
            background-color: #FFD700;
            color: black;
            border-radius: 8px;
            font-weight: bold;
            padding: 8px 20px;
        }
        .match-score {
            color: #FFD700;
            font-weight: bold;
            font-size: 20px;
        }
    </style>
""", unsafe_allow_html=True)

# =========================
# App Header
# =========================
col_logo, col_title = st.columns([1, 6])
with col_logo:
    st.image("logo.png", width=70)  # Replace with your logo file
with col_title:
    st.markdown("<div class='title'>Bollywood Look-Alike Finder  ✨ </div>", unsafe_allow_html=True)
    st.markdown("<div class='subtitle'>Find which Bollywood celebrity you resemble the most!</div>", unsafe_allow_html=True)

st.markdown("---")

# =========================
# Action Buttons
# =========================
col1, col2 = st.columns(2)
with col1:
    use_camera = st.button(" Capture Photo")
with col2:
    upload_btn = st.file_uploader(" Upload an Image", type=["jpg", "jpeg", "png"])

# =========================
# Webcam Capture
# =========================
if use_camera:
    camera_image = st.camera_input("Take a picture")
    if camera_image is not None:
        image = Image.open(camera_image).convert("RGB")
        create_directory([uploadn_path])
        temp_path = os.path.join(uploadn_path, "captured_image.jpg")
        image.save(temp_path)
        with st.spinner("Processing... "):
            features = extract_features(temp_path, model, detector)
        if features is not None:
            index_pos, score = recommend(feature_list, features)
            predicted_actor = " ".join(filenames[index_pos].split('\\')[1].split('_'))
            col1, col2 = st.columns(2)
            with col1:
                st.markdown("**Your Photo**")
                st.image(image, use_column_width=True)
            with col2:
                st.markdown("**Match Found!**")
                st.image(filenames[index_pos], use_column_width=True)
                st.markdown(f"<div class='match-score'> Match Score: {score*100:.2f}%</div>", unsafe_allow_html=True)
                st.success(f" You resemble: {predicted_actor}")
        else:
            st.warning("No face detected. Try again with better lighting.")

# =========================
# Image Upload
# =========================
if upload_btn is not None:
    if save_uploaded_image(upload_btn):
        display_image = Image.open(upload_btn)
        image_path = os.path.join(uploadn_path, upload_btn.name)
        with st.spinner("Processing... "):
            features = extract_features(image_path, model, detector)
        if features is not None:
            index_pos, score = recommend(feature_list, features)
            predicted_actor = " ".join(filenames[index_pos].split('\\')[1].split('_'))
            col1, col2 = st.columns(2)
            with col1:
                st.markdown("**Your Photo**")
                st.image(display_image, use_column_width=True)
            with col2:
                st.markdown("**Match Found!**")
                st.image(filenames[index_pos], use_column_width=True)
                st.markdown(f"<div class='match-score'> Match Score: {score*100:.2f}%</div>", unsafe_allow_html=True)
                st.success(f" You resemble: {predicted_actor}")
        else:
            st.warning("No face detected in uploaded image.")
