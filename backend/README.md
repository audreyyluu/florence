# Patient Chat Backend

This is a FastAPI backend for the patient chat system. It loads patient data from JSON files and uses OpenAI to generate responses to user queries based on the patient data.

## Setup

1. Create a virtual environment:
   ```
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

5. Make sure you have the following directory structure:
   ```
   backend/
   ├── app.py
   ├── requirements.txt
   ├── .env
   ├── patientinfo/
   │   └── room_101.json
   │   └── room_102.json
   │   └── ...
   └── timelineinfo/
       └── room_101.json
       └── room_102.json
       └── ...
   ```

## Running the Backend

Start the server with:

```
python app.py
```

Or using uvicorn directly:

```
uvicorn app:app --reload
```

The server will run at `http://localhost:8000`.

## API Endpoints

### GET /

Health check endpoint.

### POST /chat

Send a chat message to the AI assistant.

**Request Body:**
```json
{
  "room_number": "101",
  "message": "What is the patient's current condition?"
}
```

**Response:**
```json
{
  "response": "The patient is currently experiencing symptoms consistent with congestive heart failure exacerbation..."
}
```

## Error Handling

- 404: Room data not found
- 500: Error loading data or OpenAI API error 