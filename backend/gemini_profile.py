# PIP Insallations
from google import genai
from google.genai import types
from pydantic import BaseModel
from dotenv import load_dotenv

import os

# Load Environment Variables
load_dotenv()
GOOGLE_GEMINI_API_KEY = os.getenv("GOOGLE_GEMINI_API_KEY")

# Define structured output

class CloseContacts(BaseModel):
    name: str
    relationship: str
    location: str
    phone_number: str

class PatientProfile(BaseModel):
    full_name: str
    location: str
    age: int
    pre_existing_conditions: list[str]
    current_symptoms: list[str]
    diagnosis: str
    allergies: str
    medications: list[str]
    close_contacts: list[CloseContacts]


PATIENT_PROFILE_PROMPT = """

Context: You have access to the analysis of a video feed from a surveillance camera monitoring a patient in a hospital bed in a high-stakes medical environment. You also have general knowledge about typical patient profiles in such settings.

Objective: Your task is to create a realistic but entirely fictional PatientProfile and associated CloseContacts based on the video and the provided schemas. 

Provided Schemas:

class CloseContacts(BaseModel):
    name: str # Full name of the close contact
    relationship: str # Relationship to the patient (e.g., "Spouse", "Sibling", "Parent", "Child", "Friend")
    location: str # City/State or general location of the close contact
    phone_number: str # Realistic but fake phone number (e.g., "XXX-XXX-XXXX")

class PatientProfile(BaseModel):
    full_name: str # Full name of patient in video.
    location: str # Fictional city/state or general location of the patient's residence
    age: int # Realistic age for a patient in the video. Could be a kid, middle aged, or elderly.
    pre_existing_conditions: List[str] # List of plausible pre-existing medical conditions based on video.
    current_symptoms: List[str] # List of current symptoms, inferred from the video context or typical for the setting
    close_contacts: List[CloseContacts] # List of one or more fictional close contacts

Instructions for Profile Generation:

Gender and age of patient should exactly match with the video. If they look young their age should be less than 20. If they look middle aged it should be between 20 and 40. If they look elderly they should be 60+.

Invent Patient Identity: Create a plausible, entirely fictional full_name, age, and location for the patient. The age should be appropriate for someone likely to be in a high-stakes hospital unit.

Infer Medical History: Based on the context of a high-stakes medical environment (e.g., ICU, post-operative care) and general medical knowledge, infer a list of realistic pre_existing_conditions that could lead to hospitalization in such a unit.

Determine Current Symptoms: If you have access to the video analysis (or based on the general context of a patient in a critical care bed), list plausible current_symptoms. These should align with the pre-existing conditions and the type of medical environment.

Create Close Contacts: Generate a list of one or more fictional CloseContacts. For each contact:

Invent a realistic name.

Assign a plausible relationship to the patient.

Provide a fictional location (City/State).

Generate a realistic but fake phone_number in a standard format (e.g., "XXX-XXX-XXXX").

Ensure Consistency: All generated details (age, conditions, symptoms, contacts) should be internally consistent and medically plausible for the described scenario.

Format Output: Structure your final output strictly as a JSON object that conforms exactly to the PatientProfile schema provided. Do not include any extra fields or deviate from the specified structure and data types.

Constraint Checklist & Confidence Score:

Output is valid JSON: [ ] Yes/No

Output conforms to PatientProfile schema: [ ] Yes/No

Patient profile details are realistic and plausible for context: [ ] Yes/No

Pre-existing conditions are plausible for a high-stakes patient: [ ] Yes/No

Current symptoms align with context/conditions: [ ] Yes/No

Close contact details are realistic but fictional: [ ] Yes/No

All required fields are populated: [ ] Yes/No

Confidence Score (Overall): [ ] / 1.0 (Your overall confidence in meeting all requirements)

"""

client = genai.Client(api_key=GOOGLE_GEMINI_API_KEY)
def generate_profile_from_video(video_path):

    model_name = 'gemini-2.0-flash'

    response = client.models.generate_content(
        model=model_name,
        contents=types.Content(
            parts=[
                types.Part(
                    inline_data=types.Blob(data = open(video_path, 'rb').read(), mime_type="video/mp4")
                ),
                types.Part(
                    text=PATIENT_PROFILE_PROMPT
                )
            ]
        ),
        config={
            'response_mime_type': "application/json",
            "response_schema": PatientProfile
        }
    )

    print(response.text)

    new_response: PatientProfile = response.parsed

    return new_response

if __name__ == "__main__":
    generate_profile_from_video("C:\\Users\\natha\\Desktop\\Coding\\Projects\\carecam-video-analysis\\test\\panic.mp4")