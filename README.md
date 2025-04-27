# CKD Patient Assessment Web Application

A full-stack web application for Chronic Kidney Disease (CKD) patient assessment using machine learning.

## Features

- Patient registration and authentication
- Biomarker submission form
- ML-powered CKD stage prediction
- Health score calculation
- Personalized recommendations
- Clean, responsive UI

## Tech Stack

- Frontend: React (Vite)
- Backend: Flask
- ML: Scikit-learn
- Database: SQLite (development)

## Setup Instructions

### Backend Setup

1. Create and activate virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Train the ML model:
```bash
python ml_model/train_model.py
```

4. Run the Flask server:
```bash
python app.py
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:5173

## API Endpoints

### Authentication
- POST /api/auth/register - Register new patient
- POST /api/auth/login - Login patient

### Patient Data
- POST /api/patient/submit - Submit biomarkers and get prediction

## Environment Variables

Create a `.env` file in the backend directory with:
```
JWT_SECRET_KEY=your-secret-key
```

## Development

- Backend: Flask debug mode enabled
- Frontend: Vite hot reload enabled

## Testing

1. Train the model and verify accuracy
2. Test API endpoints using Postman or similar tool
3. Test frontend components and integration

## License

MIT 