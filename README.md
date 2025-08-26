# ✨ Face Matching Application

### A web application that allows users to upload an image and match their face with the closest celebrity face.

### The application uses the VGGFace deep learning model for feature extraction and compares faces using cosine similarity to find the most similar celebrity match.

## 📌 Features

### Upload any face image from your device

### Extracts deep facial embeddings using VGGFaceNet architecture

### Computes cosine similarity between uploaded image features and celebrity dataset features

### Displays the best matching celebrity face

### Deployed on Cloudflare

### 🏗️ Project Structure
<pre>
├── artifacts
│   ├── extracted_features     # Pre-computed celebrity embeddings
│   ├── pickle_format_data     # Pickle files storing feature vectors
│   └── upload                 # Uploaded user images
├── config                     # Configuration files
├── data                       # Raw celebrity images dataset
├── logs                       # Application logs
├── src
│   ├── utils                  # Helper functions
│   │   └── __pycache__        
│   └── __pycache__            
├── src.egg-info               # Metadata for packaging
├── run.py                     # Entry point for Streamlit app
├── requirements.txt           # Dependencies
└── README.md                  # Project documentation
</pre>

## ⚙️ Tech Stack
### 1. Next.js

Provides an interactive and lightweight web interface

Easy to build and deploy ML-based web apps

### 2. VGGFace (VGG16 / VGG19 Architecture)

A deep CNN model specifically trained on a large dataset of celebrity faces (VGGFace2)

Extracts facial embeddings (high-dimensional feature vectors)

Each embedding represents unique facial characteristics

## 🔍 VGGFace Architecture Details

### Input Size: 224 × 224 RGB image

### Convolutional Layers: 13 layers with 3×3 filters (for VGG16) or 16 layers (for VGG19)

### Activation Function: ReLU (Rectified Linear Unit)

### GPU acceleration support for faster inference

### Pooling Layers: Max pooling (2×2) after convolutional blocks

### Fully Connected Layers:

### Dense layers (4096 units each)

### Final softmax for classification (in pre-trained version)

### Modified for Face Recognition: Instead of softmax classification, we use the second-last FC layer (embeddings) as feature vectors

## 3. Cosine Similarity

## Computes the closeness between two feature vectors

Formula:

𝑠
𝑖
𝑚
𝑖
𝑙
𝑎
𝑟
𝑖
𝑡
𝑦
=
𝐴
⋅
𝐵
∣
∣
𝐴
∣
∣
  
∣
∣
𝐵
∣
∣
similarity=
∣∣A∣∣∣∣B∣∣
A⋅B
	​


### Helps identify which celebrity embedding is closest to the uploaded face

## 🚀 Installation & Running the Application
### Step 1: Create a Virtual Environment
```
conda create --name face_match_env python=3.8
conda activate face_match_env
```
### Step 2: Install Dependencies
```
pip install -r requirements.txt
```
### Step 3: Run the Streamlit Application
```
python run.py
```

## 📂 Data & Artifacts

### data/ → Contains celebrity dataset images

### artifacts/extracted_features/ → Pre-computed embeddings from VGGFace

### artifacts/pickle_format_data/ → Pickle files storing celebrity feature vectors

### artifacts/upload/ → Uploaded user images during runtime

## 🖼️ How It Works

### Upload Image → User uploads a face image

### Preprocessing → Resize to 224×224, normalization, and face detection

### Feature Extraction → VGGFace extracts embeddings (4096-d vector)

### Similarity Check → Compare uploaded image embeddings with celebrity dataset embeddings using cosine similarity

### Output → Display celebrity with the highest similarity score

### 📜 Example Usage

### Run the app → Upload your image → See your closest celebrity match

### Example: Upload an image → Output shows “Matched with Chris Hemsworth (Similarity: 0.92)
