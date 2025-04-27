# PIP Installations

from ultralytics import YOLO
import cv2

pose_detection_model = YOLO("models/yolo11n-pose.pt")

# Train Hugging Face: https://huggingface.co/datasets/stable-bias/professions-v2

KEYPOINT_DICT = {  
    0: 'nose',
    1: 'left_eye',
    2: 'right_eye',
    3: 'left_ear',
    4: 'right_ear',
    5: 'left_shoulder',
    6: 'right_shoulder',
    7: 'left_elbow',
    8: 'right_elbow',
    9: 'left_wrist',
    10: 'right_wrist',
    11: 'left_hip',
    12: 'right_hip',
    13: 'left_knee',
    14: 'right_knee',
    15: 'left_ankle',
    16: 'right_ankle'
}

def generate_poses_from_video(video_path):
  
    video_capture = cv2.VideoCapture(video_path, label_title=None)

    if not video_capture.isOpened():
        print("Error opening video file")
        return

    frame_width, frame_height = int(video_capture.get(cv2.CAP_PROP_FRAME_WIDTH)), int(video_capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = video_capture.get(cv2.CAP_PROP_FPS)

    pose_detection_model.model.names = {0: label_title}
    video_name = video_path.split(".")[0]


    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    output_video = cv2.VideoWriter('output_video.mp4', fourcc, fps, (frame_width, frame_height))

    while True:
        ret, frame = video_capture.read()
        if not ret:
            break

        results = pose_detection_model.predict(frame)
        annotated_frame = results[0].plot(conf=False)

        output_video.write(annotated_frame)

    video_capture.release()
    output_video.release()
    cv2.destroyAllWindows()

#generate_poses_from_video("panic.mp4")