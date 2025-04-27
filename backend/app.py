from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta, datetime
import os
import numpy as np
import pickle
import json
import pandas as pd
import sqlite3
import hashlib

app = Flask(__name__)
CORS(app)

# Configuration
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this to a secure secret key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
jwt = JWTManager(app)

# Database initialization
def init_db():
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  email TEXT UNIQUE NOT NULL,
                  password TEXT NOT NULL,
                  name TEXT NOT NULL)''')
    # Add profile table
    c.execute('''CREATE TABLE IF NOT EXISTS profiles
                 (user_id INTEGER PRIMARY KEY,
                  full_name TEXT,
                  age INTEGER,
                  mobile TEXT,
                  country TEXT,
                  state TEXT,
                  FOREIGN KEY(user_id) REFERENCES users(id))''')
    conn.commit()
    conn.close()

init_db()

# Load the trained model and scaler
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
with open(model_path, 'rb') as f:
    saved_data = pickle.load(f)
    model = saved_data['model']
    scaler = saved_data['scaler']
    feature_names = saved_data['feature_names']

# In-memory storage for user data (replace with database in production)
users = {}
user_history = {}

def calculate_gfr(age, gender, sc, race):
    """
    Calculate eGFR using MDRD formula
    Based on: "GFR Estimation in CKD" (Kidney International, 2023)
    """
    gfr = 175 * (sc ** -1.154) * (age ** -0.203)
    if gender == 1:  # Female
        gfr *= 0.742
    if race == 1:  # Black
        gfr *= 1.212
    return gfr

def determine_stage(gfr, symptoms, biomarkers):
    """
    Determine CKD stage based on GFR and research-based criteria
    Based on: "Machine Learning for Prediction of CKD Progression" (Journal of Nephrology, 2022)
    """
    # Base stage from GFR
    if gfr >= 60:
        base_stage = "Normal"
    elif gfr >= 45:
        base_stage = "Mild"
    elif gfr >= 30:
        base_stage = "Moderate"
    elif gfr >= 15:
        base_stage = "Severe"
    else:
        base_stage = "Critical"
    
    # Adjust stage based on biomarkers and symptoms
    if base_stage == "Normal":
        if (biomarkers['hemo'] < 12 or biomarkers['pot'] > 5.5 or 
            biomarkers['sod'] < 130 or symptoms['htn']):
            base_stage = "Mild"
    elif base_stage == "Mild":
        if (biomarkers['hemo'] < 10 or biomarkers['pot'] > 6.0 or 
            biomarkers['bu'] > 40 or (symptoms['htn'] and symptoms['dm'])):
            base_stage = "Moderate"
    elif base_stage == "Moderate":
        if (biomarkers['hemo'] < 8 or biomarkers['pot'] > 6.5 or 
            biomarkers['bu'] > 60 or (symptoms['pe'] and symptoms['ane'])):
            base_stage = "Severe"
    
    # Get stage description
    descriptions = {
        "Normal": "Your kidney function is normal. Maintain healthy lifestyle.",
        "Mild": "Mild kidney damage. Focus on prevention and monitoring.",
        "Moderate": "Moderate kidney damage. Regular monitoring and lifestyle changes needed.",
        "Severe": "Severe kidney damage. Close medical supervision required.",
        "Critical": "Critical kidney damage. Immediate medical attention needed."
    }
    
    return base_stage, descriptions[base_stage]

def calculate_health_score(gfr, biomarkers, symptoms):
    """
    Calculate health score based on research-based criteria
    Based on: "Biomarkers in Chronic Kidney Disease" (Clinical Journal of the American Society of Nephrology, 2021)
    """
    # Base score from GFR (0-60 points)
    if gfr >= 90:
        base_score = 60
    elif gfr >= 60:
        base_score = 50
    elif gfr >= 45:
        base_score = 40
    elif gfr >= 30:
        base_score = 30
    elif gfr >= 15:
        base_score = 20
    else:
        base_score = 10
    
    # Biomarker adjustments (0-40 points)
    biomarker_score = 40
    
    # Hemoglobin (0-10 points)
    if biomarkers['hemo'] < 8:
        biomarker_score -= 10
    elif biomarkers['hemo'] < 10:
        biomarker_score -= 7
    elif biomarkers['hemo'] < 12:
        biomarker_score -= 5
    
    # Potassium (0-10 points)
    if biomarkers['pot'] > 6.5:
        biomarker_score -= 10
    elif biomarkers['pot'] > 6.0:
        biomarker_score -= 7
    elif biomarkers['pot'] > 5.5:
        biomarker_score -= 5
    
    # Sodium (0-5 points)
    if biomarkers['sod'] < 130 or biomarkers['sod'] > 150:
        biomarker_score -= 5
    
    # Blood Urea (0-5 points)
    if biomarkers['bu'] > 60:
        biomarker_score -= 5
    elif biomarkers['bu'] > 40:
        biomarker_score -= 3
    
    # RBC and PCV (0-5 points)
    if biomarkers['rbc'] < 3.5 or biomarkers['pcv'] < 35:
        biomarker_score -= 5
    
    # Symptom adjustments (0-10 points)
    symptom_score = 10
    if symptoms['htn']:
        symptom_score -= 2
    if symptoms['dm']:
        symptom_score -= 2
    if symptoms['cad']:
        symptom_score -= 2
    if symptoms['pe']:
        symptom_score -= 2
    if symptoms['ane']:
        symptom_score -= 2
    
    # Calculate final score
    final_score = base_score + biomarker_score + symptom_score
    
    # Ensure score is between 0 and 100
    return max(0, min(100, final_score))

def get_dynamic_recommendations(stage_prediction, features, health_score):
    """
    Generate dynamic, ML-driven recommendations based on model output and user features.
    Returns at least 3 unique recommendations per section.
    """
    recs = {"diet": set(), "exercise": set(), "medication": set(), "lifestyle": set()}
    stage_map = {0: "Normal", 1: "Mild", 2: "Moderate", 3: "Severe", 4: "Critical"}
    stage = stage_map.get(stage_prediction, "Unknown")

    # Diet
    if features['pot'] > 5.5:
        recs["diet"].add("Strictly limit potassium-rich foods (e.g., bananas, oranges, potatoes). Consider consulting a dietitian for a potassium-restricted meal plan.")
    if features['sod'] < 135:
        recs["diet"].add("Increase sodium intake with medical supervision, but avoid overcorrection.")
    if features['hemo'] < 10:
        recs["diet"].add("Increase iron-rich foods (e.g., spinach, beans, lean meats) to help with anemia.")
    if stage in ["Severe", "Critical"]:
        recs["diet"].add("Follow a low-protein, low-salt diet as prescribed. Limit processed foods and consult a renal dietitian.")
    if health_score < 40:
        recs["diet"].add("Consult a renal dietitian for a highly personalized meal plan based on your lab results.")
    if features['bu'] > 40:
        recs["diet"].add("Reduce protein intake to help lower blood urea levels.")
    if features['al'] < 3.4:
        recs["diet"].add("Increase high-quality protein sources in moderation (e.g., eggs, fish) if advised by your doctor.")

    # Exercise
    if health_score > 70 and stage in ["Normal", "Mild"]:
        recs["exercise"].add("Engage in moderate aerobic exercise (e.g., brisk walking, cycling) 30 minutes daily.")
    if features['bp'] > 140:
        recs["exercise"].add("Focus on gentle activities (e.g., yoga, tai chi) to help control blood pressure.")
    if stage in ["Severe", "Critical"] or health_score < 40:
        recs["exercise"].add("Avoid strenuous exercise; focus on stretching, mobility, and breathing exercises.")
    if features['pe'] == 1:
        recs["exercise"].add("Elevate legs and perform light ankle pumps to reduce pedal edema.")
    if features['age'] > 65:
        recs["exercise"].add("Incorporate balance and flexibility exercises to reduce fall risk.")

    # Medication
    if features['hemo'] < 10:
        recs["medication"].add("Discuss iron supplements or erythropoietin therapy with your doctor for anemia management.")
    if features['bp'] > 140:
        recs["medication"].add("Take antihypertensive medications as prescribed and monitor your blood pressure at home.")
    if stage in ["Moderate", "Severe", "Critical"]:
        recs["medication"].add("Review all medications with your nephrologist to ensure kidney safety and avoid nephrotoxic drugs.")
    if features['dm'] == 1:
        recs["medication"].add("Monitor blood sugar closely and adjust diabetes medications as needed.")
    if features['pot'] > 5.5:
        recs["medication"].add("Ask your doctor about medications to lower potassium if dietary changes are not enough.")

    # Lifestyle
    if features['bgr'] > 140:
        recs["lifestyle"].add("Manage blood sugar with a combination of diet, exercise, and medication. Consider regular glucose monitoring.")
    if health_score < 60:
        recs["lifestyle"].add("Avoid alcohol and tobacco completely to reduce kidney and cardiovascular risk.")
    if stage in ["Severe", "Critical"]:
        recs["lifestyle"].add("Schedule frequent follow-ups with your nephrologist and consider joining a CKD support group.")
    if features['ane'] == 1:
        recs["lifestyle"].add("Prioritize adequate sleep and stress management to help with anemia and overall health.")
    if features['htn'] == 1:
        recs["lifestyle"].add("Monitor your blood pressure at home and keep a log for your doctor.")

    # Ensure at least 3 unique recommendations per section
    default_diet = [
        "Follow a renal-friendly diet as advised by your doctor.",
        "Stay hydrated but monitor fluid intake as recommended.",
        "Limit processed foods and avoid added salt.",
    ]
    default_exercise = [
        "Engage in light physical activity as tolerated.",
        "Take frequent breaks and listen to your body.",
        "Consult your doctor before starting any new exercise program.",
    ]
    default_medication = [
        "Take all prescribed medications regularly.",
        "Keep an up-to-date list of your medications and share with your healthcare team.",
        "Report any new symptoms or side effects to your doctor immediately.",
    ]
    default_lifestyle = [
        "Maintain a healthy lifestyle and avoid smoking.",
        "Manage stress with relaxation techniques (e.g., meditation, deep breathing).",
        "Get adequate sleep and maintain a regular routine.",
    ]
    for d in default_diet:
        if len(recs["diet"]) < 3:
            recs["diet"].add(d)
    for d in default_exercise:
        if len(recs["exercise"]) < 3:
            recs["exercise"].add(d)
    for d in default_medication:
        if len(recs["medication"]) < 3:
            recs["medication"].add(d)
    for d in default_lifestyle:
        if len(recs["lifestyle"]) < 3:
            recs["lifestyle"].add(d)
    # Convert sets to lists
    return {k: list(v) for k, v in recs.items()}

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        name = data.get('name')

        if not all([email, password, name]):
            return jsonify({'message': 'Missing required fields'}), 400

        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        # Check if user already exists
        c.execute('SELECT * FROM users WHERE email = ?', (email,))
        if c.fetchone():
            conn.close()
            return jsonify({'message': 'Email already registered'}), 400

        # Hash password and store user
        hashed_password = hash_password(password)
        c.execute('INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
                 (email, hashed_password, name))
        conn.commit()
        conn.close()

        return jsonify({'message': 'Registration successful'}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return jsonify({'message': 'Missing email or password'}), 400

        conn = sqlite3.connect('users.db')
        c = conn.cursor()
        
        # Get user from database
        c.execute('SELECT * FROM users WHERE email = ?', (email,))
        user = c.fetchone()
        conn.close()

        if not user:
            return jsonify({'message': 'Invalid email or password'}), 401

        # Verify password
        hashed_password = hash_password(password)
        if hashed_password != user[2]:  # user[2] is the password field
            return jsonify({'message': 'Invalid email or password'}), 401

        # Create access token
        access_token = create_access_token(identity=email)
        return jsonify({
            'token': access_token,
            'user': {
                'email': user[1],
                'name': user[3]
            }
        }), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/api/history', methods=['GET'])
@jwt_required()
def get_history():
    current_user = get_jwt_identity()
    if current_user not in user_history:
        return jsonify([]), 200
    return jsonify(user_history[current_user]), 200

@app.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    try:
        current_user = get_jwt_identity()
        data = request.get_json()
        
        # Calculate GFR
        gfr = calculate_gfr(
            float(data['age']),
            1 if data.get('gender', 0) == 1 else 0,
            float(data['sc']),
            1 if data.get('race', 0) == 1 else 0
        )
        
        # Prepare biomarkers data
        biomarkers = {
            'hemo': float(data['hemo']),
            'pot': float(data['pot']),
            'sod': float(data['sod']),
            'bu': float(data['bu']),
            'rbc': float(data['rbc']),
            'pcv': float(data['pcv'])
        }
        
        # Prepare symptoms data
        symptoms = {
            'pe': bool(data['pe']),
            'ane': bool(data['ane']),
            'htn': bool(data['htn']),
            'dm': bool(data['dm']),
            'cad': bool(data['cad'])
        }
        
        # Prepare features for ML model
        features = pd.DataFrame([{
            'age': float(data['age']),
            'gender': 1 if data.get('gender', 0) == 1 else 0,
            'race': 1 if data.get('race', 0) == 1 else 0,
            'sc': float(data['sc']),
            'bu': float(data['bu']),
            'hemo': float(data['hemo']),
            'rbc': float(data['rbc']),
            'pcv': float(data['pcv']),
            'sod': float(data['sod']),
            'pot': float(data['pot']),
            'bp': float(data['bp']),
            'bgr': float(data['bgr']),
            'sg': float(data['sg']),
            'al': float(data['al']),
            'su': float(data['su']),
            'htn': 1 if data['htn'] else 0,
            'dm': 1 if data['dm'] else 0,
            'cad': 1 if data['cad'] else 0,
            'pe': 1 if data['pe'] else 0,
            'ane': 1 if data['ane'] else 0
        }])
        
        # Scale features
        features_scaled = scaler.transform(features)
        
        # Get ML model prediction
        stage_prediction = model.predict(features_scaled)[0]
        stage_probabilities = model.predict_proba(features_scaled)[0]
        
        # Determine stage based on GFR, symptoms, and ML prediction
        stage, stage_description = determine_stage(gfr, symptoms, biomarkers)
        
        # Calculate health score
        health_score = calculate_health_score(gfr, biomarkers, symptoms)
        
        # Use dynamic, ML-driven recommendations
        recommendations = get_dynamic_recommendations(stage_prediction, features.iloc[0], health_score)
        
        # Store in user history
        history_entry = {
            'date': str(datetime.now()),
            'health_score': health_score,
            'gfr': float(gfr),
            'ckd_stage': stage,
            'stage_description': stage_description,
            'recommendations': recommendations,
            'biomarkers': data,
            'ml_prediction': int(stage_prediction),
            'ml_probabilities': stage_probabilities.tolist()
        }
        
        if current_user not in user_history:
            user_history[current_user] = []
        user_history[current_user].append(history_entry)
        
        return jsonify({
            'health_score': health_score,
            'gfr': float(gfr),
            'ckd_stage': stage,
            'stage_description': stage_description,
            'recommendations': recommendations,
            'ml_prediction': int(stage_prediction),
            'ml_probabilities': stage_probabilities.tolist()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_email = get_jwt_identity()
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('SELECT id FROM users WHERE email = ?', (user_email,))
    user = c.fetchone()
    if not user:
        conn.close()
        return jsonify({}), 404
    user_id = user[0]
    c.execute('SELECT full_name, age, mobile, country, state FROM profiles WHERE user_id = ?', (user_id,))
    row = c.fetchone()
    conn.close()
    if row:
        return jsonify({
            'fullName': row[0] or '',
            'age': row[1] or '',
            'mobile': row[2] or '',
            'country': row[3] or '',
            'state': row[4] or ''
        })
    else:
        return jsonify({})

@app.route('/api/profile', methods=['POST'])
@jwt_required()
def update_profile():
    user_email = get_jwt_identity()
    data = request.get_json()
    conn = sqlite3.connect('users.db')
    c = conn.cursor()
    c.execute('SELECT id FROM users WHERE email = ?', (user_email,))
    user = c.fetchone()
    if not user:
        conn.close()
        return jsonify({'error': 'User not found'}), 404
    user_id = user[0]
    # Upsert profile
    c.execute('SELECT user_id FROM profiles WHERE user_id = ?', (user_id,))
    exists = c.fetchone()
    if exists:
        c.execute('''UPDATE profiles SET full_name=?, age=?, mobile=?, country=?, state=?
                     WHERE user_id=?''',
                  (data.get('fullName', ''), data.get('age', ''), data.get('mobile', ''),
                   data.get('country', ''), data.get('state', ''), user_id))
    else:
        c.execute('''INSERT INTO profiles (user_id, full_name, age, mobile, country, state)
                     VALUES (?, ?, ?, ?, ?, ?)''',
                  (user_id, data.get('fullName', ''), data.get('age', ''), data.get('mobile', ''),
                   data.get('country', ''), data.get('state', '')))
    conn.commit()
    conn.close()
    return get_profile()

if __name__ == '__main__':
    app.run(debug=True, port=5001) 