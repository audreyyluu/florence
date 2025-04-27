# PIP Insallations
from google import genai
from google.genai import types
from pydantic import BaseModel
from dotenv import load_dotenv
import json

import gemini_profile

import os

# Load Environment Variables
load_dotenv()
GOOGLE_GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")

# Define structured output
class Timestamp(BaseModel):
    start_time: str
    end_time: str
    symptoms: list[str]
    confidence: float
    description: str
    danger_level: str

class Vitals(BaseModel):
    heart_rate: float
    blood_pressure: str
    blood_oxygen: float
    blood_glucose: float
    temperature: float
    respiratory_rate: float
    pulse_rate: float

class ReportTemplate(BaseModel):
    room_number: str
    predicted_symptoms: list[str]
    timestamps: list[Timestamp]
    danger_level: str
    description: str
    vitals: Vitals
    admission_date: str

REPORT_PROMPT = """

Context: You are analyzing a video feed from a surveillance camera monitoring a patient in a hospital bed. This is a high-stakes medical environment (e.g., ICU, post-operative care). The video captures the patient's physical state, movements, and any visible interactions or changes over a specific duration.

Objective: Your task is to observe the patient in the video, identify key events, predicted symptoms, and physiological indicators, and compile this information into a structured report formatted precisely according to the ReportTemplate schema provided below.

Provided Schema:

class Timestamp(BaseModel):
    start_time: str # Format: HH:MM AM/PM (e.g., "12:15 PM")
    end_time: str   # Format: HH:MM AM/PM (e.g., "12:30 PM")
    symptoms: List[str] # List of very specific symptoms observed. Ex. ["Dizziness", "Headache", "Nausea", "Shortness of Breath", "Low Blood Pressure"] based on the video.
    confidence: float # Confidence score (0.0 to 1.0) for the symptom prediction
    description: str # Detailed description of the observed event/symptoms during this timestamp
    danger_level: str # Danger level associated with this specific event (e.g., "Low", "Moderate", "High", "Critical")

class Vitals(BaseModel):
    heart_rate: float # Estimated or observed heart rate (beats per minute)
    blood_pressure: str # Estimated or observed blood pressure (e.g., "120/80", "90/60", "N/A" if not visible/inferable)
    blood_oxygen: float # Estimated or observed blood oxygen saturation (%)
    blood_glucose: float # Estimated or observed blood glucose (mg/dL or mmol/L, specify unit if possible, or N/A)
    temperature: float # Estimated or observed temperature (°C or °F, specify unit if possible, or N/A)
    respiratory_rate: float # Estimated or observed respiratory rate (breaths per minute)
    pulse_rate: float # Estimated or observed pulse rate (beats per minute - should ideally align with heart_rate)

class ReportTemplate(BaseModel):
    camera_location: str # Identifier for the camera location (e.g., "Room 3B - Bed 1", "ICU Camera 5")
    predicted_symptoms: List[str] # Overall list of all unique symptoms that could soon occur based on vitals and predicted timestamp symptoms.
    timestamps: List[Timestamp] # List specific timestamps, but scale it on a 24 hour scale. Specifically use HH:MM format for start and end times. Make more realistic fake timestamps to get at least 5 timestamps. 
    danger_level: str # Overall danger level assessment for the patient based on the entire video
    description: str # Overall summary description of the patient's state and key events in the video
    vitals: Vitals # Estimated or observed vital signs

**Instructions for Analysis and Output Generation:**

1.  **Analyze the Video:** Watch the video carefully, focusing on the patient's condition, movements, facial expressions, breathing patterns, skin color changes, interactions with medical equipment (if visible), and any signs of discomfort or distress.
2.  **Estimate Vitals:** Based on your visual analysis and general medical knowledge, estimate realistic vital signs for a patient in a high-stakes environment. If medical monitors are visible and readable, prioritize those readings. If not, make educated inferences based on observable signs (e.g., rapid/shallow breathing for respiratory rate, pallor for blood pressure/oxygen). Ensure the estimated values are medically plausible for a potentially unstable patient. If a vital cannot be reasonably estimated, mark it as `N/A` or use a placeholder like `-1.0` for floats if `N/A` is not possible in the schema (clarify this if needed, but `N/A` string is preferred for BP).
3.  **Identify and Detail Symptoms:** Identify all observable symptoms or signs of changes in the patient's condition. For each symptom identified, be *extremely specific* in your description (e.g., instead of "difficulty breathing," use "labored breathing with visible retractions" or "shallow, rapid breaths").
4.  **Create Timestamps:** For each distinct symptom or event you identify, create a `Timestamp` entry.
    * **Start/End Times:** Assign realistic, random-but-sensible `start_time` and `end_time` strings for when the specific symptom or event was observed. These times should fall within the duration of the video. Use a consistent format (e.g., "00:01:25" for 1 minute and 25 seconds from the video start). Ensure `end_time` is after `start_time`.
    * **Predicted Symptoms (Timestamp Level):** List *only* the specific symptoms observed *during that particular time window*.
    * **Confidence:** Assign a confidence score (0.0 to 1.0) indicating how certain you are about the predicted symptoms based *solely* on the visual evidence.
    * **Description (Timestamp Level):** Write a *very detailed* narrative description of *exactly* what was observed during this timestamp that led to the predicted symptoms and confidence score. Describe the patient's appearance, actions, and any relevant environmental factors visible.
    * **Danger Level (Timestamp Level):** Assign a danger level ("Low," "Moderate," "High," "Critical") specific to the severity of the event or symptoms observed within this timestamp.
5.  **Compile Overall Symptoms:** Create the `predicted_symptoms` list at the `ReportTemplate` level by gathering all unique symptoms identified across all timestamps.
6.  **Determine Overall Danger Level:** Based on the most severe events observed and the overall patient state throughout the video, assign a single `danger_level` for the entire report ("Low," "Moderate," "High," "Critical").
7.  **Write Overall Description:** Provide a concise summary in the `description` field at the `ReportTemplate` level, outlining the patient's general condition and the most significant events or changes observed throughout the video.
8.  **Identify Camera Location:** If the camera location is indicated visually or contextually in the video (e.g., a sign, room number), use that. Otherwise, use a placeholder like "Hospital Room Surveillance."
9.  **Format Output:** Structure your final output strictly as a JSON object that conforms *exactly* to the `ReportTemplate` schema provided. Do not include any extra fields or deviate from the specified structure and data types.

**Constraint Checklist & Confidence Score:**

* Output is valid JSON: [ ] Yes/No
* Output conforms to `ReportTemplate` schema: [ ] Yes/No
* Vitals are realistic and plausible for context: [ ] Yes/No
* Timestamps are random but sensible within video duration: [ ] Yes/No
* Predicted symptoms are very specific: [ ] Yes/No
* Timestamp descriptions are very detailed: [ ] Yes/No
* All required fields are populated: [ ] Yes/No

Confidence Score (Overall): [ ] / 1.0 (Your overall confidence in meeting all requirements)

**Begin Analysis and Generate JSON Output.**

```json
{
  "camera_location": "...",
  "predicted_symptoms": [
    "...",
    "..."
  ],
  "timestamps": [
    {
      "start_time": "...",
      "end_time": "...",
      "predicted_symptoms": [
        "..."
      ],
      "confidence": ...,
      "description": "...",
      "danger_level": "..."
    }
    // Add more timestamp objects as needed
  ],
  "danger_level": "...",
  "description": "...",
  "vitals": {
    "heart_rate": ...,
    "blood_pressure": "...",
    "blood_oxygen": ...,
    "blood_glucose": ...,
    "temperature": ...,
    "respiratory_rate": ...,
    "pulse_rate": ...
  }
}

Look at specific body parts including: 
- Nose (Discharge, Bled, Swollen)
- Mouth (Lips, Tongue, Teeth)
- Eyes (Blurred, Swollen)
- Ears (Discharge, Bled, Swollen)
- Chest (Fast Breathing, Difficulty Breathing, Painful Breathing)
- Abdomen (Painful, Swollen, Discharge, Bled)
- Legs (Painful, Swollen, Discharge, Bled)
- Arms (Painful, Swollen, Discharge, Bled)


Even if you are slightly concerned or confused, make sure to increase the danger level to "Moderate" or "High" and include that in your description of possible symptoms.

Please ensure that the ReportTemplate's information is aligned with the patient's personal information.

Here are personal details on the patient in JSON format:

"""
# Define Gemini Client and Functions
client = genai.Client(api_key=GOOGLE_GEMINI_API_KEY)
def video_to_report(video_url):

    patient_info = gemini_profile.generate_profile_from_video(video_url)

    model_name = 'gemini-2.0-flash'
    
    video_bytes = open(video_url, 'rb').read()

    response = client.models.generate_content(
        model = model_name,
        contents=types.Content(
            parts=[
                types.Part(
                    inline_data=types.Blob(data = video_bytes, mime_type="video/mp4")
                ),
                types.Part(
                    text=REPORT_PROMPT + str(patient_info.model_dump())
                )
            ]
        ),
        config={
            'response_mime_type': "application/json",
            "response_schema": ReportTemplate
        }
    )

    print(response.text)

    new_response: ReportTemplate = response.parsed

    return new_response

if __name__ == "__main__":
    video_to_report("C:\\Users\\natha\\Desktop\\Coding\\Projects\\carecam-video-analysis\\test\\peaceful_old_man.mp4")