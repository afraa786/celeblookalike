# Face Matching Application

Streamlit-based web application to match the uploaded face with a celebrity face.

## Project Description
- A web application using streamlit to match the uploaded face with a celebrity face
- The pipeline uses the VGGFace model to extract features from the uploaded image and uses cosine distance to find the most similar celebrity face with the uploaded image

## Files and data description

<pre>
├───artifacts
│   ├───extracted_features
│   ├───pickle_format_data
│   └───upload
├───config
├───data
├───logs
├───src
│   ├───utils
│   │   └───__pycache__
│   └───__pycache__
└───src.egg-info

</pre>

## Running Files
<pre>
Step 1: Create Virtual Environment:
    - conda create --name face_match_env python=3.8
    - conda activate face_match_env
Step 2 : Install packages
    - conda install --file requirements.txt
Step 3 : Run the Application
    - python run.py
</pre>