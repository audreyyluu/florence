# CareCam

## Overview

CareCam is a web application designed to help caregivers monitor and support their loved ones through intelligent camera monitoring and real-time alerts.

This project uses the following tech stack:
- Next.js 15 (for client framework)
- React 19 (for frontend components)
- Tailwind v4 (for styling)
- Shadcn UI (for UI components library)
- Lucide Icons (for icons)
- FastAPI (for backend server)
- Framer Motion (for animations)
- Three.js (for landing page 3D graphics)

All relevant files live in the 'src' directory.

## Features

- Real-time video monitoring
- Intelligent fall detection
- Emergency alert system
- Caregiver dashboard
- Activity logging and reporting
- Privacy-focused design

## Setup

To set up the project locally:

1. Clone the repository
2. Run `pnpm install` to install the frontend dependencies
3. Create and activate a Python virtual environment (recommended)
4. Navigate to the Backend directory and install Python dependencies:
   ```bash
   cd Backend
   pip install -r requirements.txt
   ```
5. Start the FastAPI backend server:
   ```bash
   python app.py
   ```
6. In a separate terminal, start the frontend development server:
   ```bash
   pnpm dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=http://localhost:8000  # FastAPI backend URL
```

Additional environment variables may be required based on your deployment environment.

## Project Structure

- `/src` - Frontend application code
  - `/app` - Next.js pages and routing
  - `/components` - Reusable React components
  - `/lib` - Utility functions and configurations
  - `/styles` - Global styles and Tailwind configuration
- `/Backend` - FastAPI server and ML models
  - `/models` - Machine learning models for detection
  - `/routes` - API endpoints
  - `/utils` - Helper functions and utilities

## License

[Add your license information here] 