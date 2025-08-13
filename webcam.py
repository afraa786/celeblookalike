import streamlit as st
from streamlit_webrtc import webrtc_streamer, VideoTransformerBase
import av
import cv2
import numpy as np
from PIL import Image
import tempfile
import os

captured_image = None  # Will hold the latest captured frame

class VideoTransformer(VideoTransformerBase):
    def __init__(self):
        self.latest_frame = None

    def transform(self, frame: av.VideoFrame) -> np.ndarray:
        img = frame.to_ndarray(format="bgr24")
        self.latest_frame = img
        return img


st.title("📸 Live Camera Face Capture")

webrtc_ctx = webrtc_streamer(
    key="camera",
    video_transformer_factory=VideoTransformer,
    media_stream_constraints={"video": True, "audio": False},
)

if webrtc_ctx.video_transformer:
    if st.button("✅ Yes, This is Me!"):
        img = webrtc_ctx.video_transformer.latest_frame
        if img is not None:
            # Save temporarily
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as f:
                img_path = f.name
                cv2.imwrite(img_path, img)
                st.success("Image captured!")
                st.image(img, caption="Captured Image", channels="BGR")

                # Optional: pass to celeb detection function
                # features = extract_features(img_path, model, detector)
                # index_pos = recommend(feature_list, features)
                # st.image(filenames[index_pos], caption="Matched Celebrity")
        else:
            st.warning("No frame captured yet!")
