from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
import httpx
import openai
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create a custom httpx client without proxy settings
http_client = httpx.Client(
    base_url="https://api.openai.com",
    follow_redirects=True,
    timeout=httpx.Timeout(timeout=60.0)
)

# Set up OpenAI client using the custom http client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    http_client=http_client
)

app = FastAPI(title="Patient Chat API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define data models
class CloseContacts(BaseModel):
    name: str
    relationship: str
    location: str
    phone_number: str

class PatientInfo(BaseModel):
    full_name: str
    location: str
    age: int
    pre_existing_conditions: list[str]
    current_symptoms: list[str]
    diagnosis: str
    allergies: str
    medications: list[str]
    close_contacts: list[CloseContacts]

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

class PatientTimestamp(BaseModel):
    room_number: str
    predicted_symptoms: list[str]
    timestamps: list[Timestamp]
    danger_level: str
    description: str
    vitals: Vitals
    admission_date: str

class CombinedData(BaseModel):
    patient_info: PatientInfo
    patient_timestamp: PatientTimestamp

class ChatRequest(BaseModel):
    room_number: str
    message: str

class ChatResponse(BaseModel):
    response: str

@app.get("/")
def read_root():
    return {"message": "Patient Chat API is running"}

def load_data(patient_info_path: str, patient_timestamp_path: str) -> CombinedData:
    """Load and validate patient data from two separate JSON files."""
    try:
        # Load patient info data
        with open(patient_info_path, 'r') as f:
            patient_info_data = json.load(f)
        patient_info = PatientInfo(**patient_info_data)
        
        # Load patient timestamp data
        with open(patient_timestamp_path, 'r') as f:
            patient_timestamp_data = json.load(f)
        patient_timestamp = PatientTimestamp(**patient_timestamp_data)
        
        return CombinedData(
            patient_info=patient_info,
            patient_timestamp=patient_timestamp
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading patient data: {str(e)}")

def generate_contacts_summary(contacts: List[CloseContacts]) -> str:
    """Generate a summary of the close contacts for the system prompt."""
    summary = ""
    for contact in contacts:
        summary += f"- {contact.name} ({contact.relationship}): {contact.phone_number}, {contact.location}\n"
    return summary

def generate_timestamps_summary(timestamps: List[Timestamp]) -> str:
    """Generate a summary of the timestamps for the system prompt."""
    summary = ""
    for i, ts in enumerate(timestamps):
        summary += f"Observation {i+1} ({ts.start_time} to {ts.end_time}):\n"
        summary += f"- Symptoms: {', '.join(ts.symptoms)}\n"
        summary += f"- Confidence: {ts.confidence}\n"
        summary += f"- Danger Level: {ts.danger_level}\n"
        summary += f"- Description: {ts.description}\n\n"
    return summary

def create_system_prompt(combined_data: CombinedData) -> str:
    """Create a system prompt for the LLM with patient data context."""
    patient_info = combined_data.patient_info
    patient_timestamp = combined_data.patient_timestamp
    
    return f"""You are Florence, an AI medical assistant that has analyzed a patient through a surveillance camera system.
You have access to the following patient information:

Patient Name: {patient_info.full_name}
Age: {patient_info.age}
Location: {patient_info.location}
Diagnosis: {patient_info.diagnosis}
Pre-existing Conditions: {', '.join(patient_info.pre_existing_conditions)}
Current Symptoms: {', '.join(patient_info.current_symptoms)}
Allergies: {patient_info.allergies}
Medications: {', '.join(patient_info.medications)}

Close Contacts:
{generate_contacts_summary(patient_info.close_contacts)}

Room Number: {patient_timestamp.room_number}
Admission Date: {patient_timestamp.admission_date}
Predicted Symptoms: {', '.join(patient_timestamp.predicted_symptoms)}
Overall Danger Level: {patient_timestamp.danger_level}
Overall Description: {patient_timestamp.description}

Vitals:
- Heart Rate: {patient_timestamp.vitals.heart_rate} bpm
- Blood Pressure: {patient_timestamp.vitals.blood_pressure}
- Blood Oxygen: {patient_timestamp.vitals.blood_oxygen}%
- Blood Glucose: {patient_timestamp.vitals.blood_glucose} mg/dL
- Temperature: {patient_timestamp.vitals.temperature}°C
- Respiratory Rate: {patient_timestamp.vitals.respiratory_rate} breaths/min
- Pulse Rate: {patient_timestamp.vitals.pulse_rate} bpm

Detailed Observations:
{generate_timestamps_summary(patient_timestamp.timestamps)}

Respond to the user's questions about this patient in a clear, concise, and medically appropriate manner.
Base your answers strictly on the data provided. If information is not available, say so rather than making assumptions.
"""

def ask_llm(system_prompt: str, user_query: str) -> str:
    """Get a response from the LLM based on the patient data and user query."""
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # You can change to a different model if needed
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_query}
            ],
            temperature=0.3,
            max_tokens=1000
        )
        return response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error querying the AI model: {str(e)}")

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    """Process a chat message and return an AI response based on patient data."""
    try:
        # Build file paths
        patient_info_path = f"patientinfo/room{request.room_number}.json"
        patient_timestamp_path = f"timelineinfo/room{request.room_number}.json"
        
        # Check if files exist
        if not os.path.exists(patient_info_path):
            raise HTTPException(status_code=404, detail=f"Patient info not found for room {request.room_number}")
        if not os.path.exists(patient_timestamp_path):
            raise HTTPException(status_code=404, detail=f"Timeline info not found for room {request.room_number}")
        
        # Load data
        combined_data = load_data(patient_info_path, patient_timestamp_path)
        
        # Create system prompt
        system_prompt = create_system_prompt(combined_data)
        
        # Query LLM
        response = ask_llm(system_prompt, request.message)
        
        return {"response": response}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True) 