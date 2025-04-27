import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

def load_and_preprocess_data():
    # Load the dataset
    df = pd.read_csv('ml_model/sample_data.csv')
    
    # Convert categorical variables to numeric
    categorical_cols = ['rbc', 'pc', 'pcc', 'ba', 'htn', 'dm', 'cad', 'appet', 'pe', 'ane']
    for col in categorical_cols:
        df[col] = df[col].map({'normal': 1, 'abnormal': 0, 'present': 1, 'notpresent': 0, 
                              'yes': 1, 'no': 0, 'good': 1, 'poor': 0})
    
    # Convert numeric columns
    numeric_cols = ['age', 'bp', 'sg', 'al', 'su', 'bgr', 'bu', 'sc', 'sod', 'pot', 'hemo', 
                   'pcv', 'wc', 'rc']
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    
    # Fill missing values with median for each column
    for col in df.columns:
        if col != 'class':
            if df[col].dtype in ['int64', 'float64']:
                df[col] = df[col].fillna(df[col].median())
            else:
                df[col] = df[col].fillna(df[col].mode()[0])
    
    # Prepare features and target
    X = df.drop('class', axis=1)
    y = df['class'].map({'ckd': 1, 'notckd': 0})
    
    # Remove any rows where target is NaN
    mask = ~y.isna()
    X = X[mask]
    y = y[mask]
    
    return X, y

def train_and_save_model():
    # Load and preprocess data
    X, y = load_and_preprocess_data()
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Save model and scaler
    os.makedirs('ml_model', exist_ok=True)
    with open('ml_model/model.pkl', 'wb') as f:
        pickle.dump(model, f)
    with open('ml_model/scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    
    # Print model accuracy
    train_accuracy = model.score(X_train_scaled, y_train)
    test_accuracy = model.score(X_test_scaled, y_test)
    print(f"Training Accuracy: {train_accuracy:.2f}")
    print(f"Testing Accuracy: {test_accuracy:.2f}")

if __name__ == "__main__":
    train_and_save_model() 