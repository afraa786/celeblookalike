import cv2
import uuid
import os

# Output folder for captured images
output_folder = "captured_images"
os.makedirs(output_folder, exist_ok=True)

# Start webcam
cap = cv2.VideoCapture(0)
print("[INFO] Press 'c' to capture photo, 'q' to quit.")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    cv2.imshow("Webcam - Press 'c' to capture", frame)

    key = cv2.waitKey(1)
    
    # Press 'c' to capture the image
    if key & 0xFF == ord('c'):
        filename = f"{uuid.uuid4().hex}.jpg"
        filepath = os.path.join(output_folder, filename)
        cv2.imwrite(filepath, frame)
        print(f"[INFO] Photo captured and saved to {filepath}")
        break

    # Press 'q' to quit without capturing
    elif key & 0xFF == ord('q'):
        print("[INFO] Quit without capturing.")
        break

cap.release()
cv2.destroyAllWindows()
