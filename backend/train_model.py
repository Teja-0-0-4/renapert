import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import pickle
import os

# Based on research papers:
# 1. "Machine Learning for Prediction of CKD Progression" (Journal of Nephrology, 2022)
# 2. "Biomarkers in Chronic Kidney Disease" (Clinical Journal of the American Society of Nephrology, 2021)
# 3. "GFR Estimation in CKD" (Kidney International, 2023)

def generate_synthetic_data(n_samples=1000):
    """
    Generate synthetic data based on research findings
    """
    np.random.seed(42)
    
    # Generate features based on research ranges
    data = {
        'age': np.random.normal(60, 15, n_samples),  # CKD more common in older age
        'gender': np.random.binomial(1, 0.5, n_samples),  # 0: Male, 1: Female
        'race': np.random.binomial(1, 0.2, n_samples),  # 0: Non-Black, 1: Black
        
        # GFR-related features
        'sc': np.random.normal(1.2, 0.5, n_samples),  # Serum Creatinine
        'bu': np.random.normal(25, 10, n_samples),    # Blood Urea
        
        # Anemia markers
        'hemo': np.random.normal(12, 2, n_samples),   # Hemoglobin
        'rbc': np.random.normal(4.5, 0.5, n_samples), # RBC
        'pcv': np.random.normal(40, 5, n_samples),    # PCV
        
        # Electrolytes
        'sod': np.random.normal(140, 5, n_samples),   # Sodium
        'pot': np.random.normal(4.5, 0.5, n_samples), # Potassium
        
        # Other markers
        'bp': np.random.normal(130, 20, n_samples),   # Blood Pressure
        'bgr': np.random.normal(100, 20, n_samples),  # Blood Glucose
        'sg': np.random.normal(1.015, 0.005, n_samples), # Specific Gravity
        'al': np.random.normal(0.5, 0.5, n_samples),  # Albumin
        'su': np.random.normal(0.5, 0.5, n_samples),  # Sugar
        
        # Symptoms
        'htn': np.random.binomial(1, 0.4, n_samples), # Hypertension
        'dm': np.random.binomial(1, 0.3, n_samples),  # Diabetes
        'cad': np.random.binomial(1, 0.2, n_samples), # Coronary Artery Disease
        'pe': np.random.binomial(1, 0.3, n_samples),  # Pedal Edema
        'ane': np.random.binomial(1, 0.4, n_samples), # Anemia
    }
    
    # Calculate GFR using MDRD formula
    gfr = 175 * (data['sc'] ** -1.154) * (data['age'] ** -0.203)
    gfr[data['gender'] == 1] *= 0.742  # Female adjustment
    gfr[data['race'] == 1] *= 1.212    # Black adjustment
    
    # Generate labels based on GFR and research-based criteria
    labels = np.zeros(n_samples)
    
    # Stage 1-2 (GFR ≥ 60)
    mask1 = (gfr >= 60) & (data['sc'] < 1.5) & (data['bu'] < 30)
    labels[mask1] = 0
    
    # Stage 3a (GFR 45-59)
    mask2 = (gfr >= 45) & (gfr < 60) & (data['sc'] >= 1.5) & (data['sc'] < 2.0)
    labels[mask2] = 1
    
    # Stage 3b (GFR 30-44)
    mask3 = (gfr >= 30) & (gfr < 45) & (data['sc'] >= 2.0) & (data['sc'] < 3.0)
    labels[mask3] = 2
    
    # Stage 4 (GFR 15-29)
    mask4 = (gfr >= 15) & (gfr < 30) & (data['sc'] >= 3.0)
    labels[mask4] = 3
    
    # Stage 5 (GFR < 15)
    mask5 = gfr < 15
    labels[mask5] = 4
    
    # Add some noise based on other biomarkers
    # Anemia adjustment
    labels[data['hemo'] < 10] += 1
    labels[data['hemo'] < 10] = np.minimum(labels[data['hemo'] < 10], 4)
    
    # Electrolyte imbalance adjustment
    labels[(data['pot'] > 5.5) | (data['sod'] < 130)] += 1
    labels[(data['pot'] > 5.5) | (data['sod'] < 130)] = np.minimum(labels[(data['pot'] > 5.5) | (data['sod'] < 130)], 4)
    
    # Comorbidity adjustment
    labels[(data['htn'] == 1) & (data['dm'] == 1)] += 1
    labels[(data['htn'] == 1) & (data['dm'] == 1)] = np.minimum(labels[(data['htn'] == 1) & (data['dm'] == 1)], 4)
    
    return pd.DataFrame(data), labels

def train_model():
    """
    Train the ML model using research-based features
    """
    # Generate synthetic data
    X, y = generate_synthetic_data()
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42
    )
    model.fit(X_scaled, y)
    
    # Save model and scaler
    model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
    with open(model_path, 'wb') as f:
        pickle.dump({
            'model': model,
            'scaler': scaler,
            'feature_names': X.columns.tolist()
        }, f)
    
    print("Model trained and saved successfully!")
    print(f"Feature importance: {dict(zip(X.columns, model.feature_importances_))}")

if __name__ == '__main__':
    train_model() 