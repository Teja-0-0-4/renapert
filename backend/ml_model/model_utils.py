import pickle
import numpy as np

class CKDModel:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.load_model()
    
    def load_model(self):
        try:
            with open('ml_model/model.pkl', 'rb') as f:
                self.model = pickle.load(f)
            with open('ml_model/scaler.pkl', 'rb') as f:
                self.scaler = pickle.load(f)
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            raise
    
    def predict(self, features):
        """
        Predict CKD stage and health score based on input features
        
        Args:
            features (dict): Dictionary containing patient biomarkers
            
        Returns:
            dict: Prediction results including CKD stage and health score
        """
        try:
            # Convert features to array
            feature_array = np.array([[
                features['age'],
                features['bp'],
                features['sg'],
                features['al'],
                features['su'],
                features['bgr'],
                features['bu'],
                features['sc'],
                features['sod'],
                features['pot'],
                features['hemo'],
                features['pcv'],
                features['wc'],
                features['rc'],
                features['rbc'],
                features['pc'],
                features['pcc'],
                features['ba'],
                features['htn'],
                features['dm'],
                features['cad'],
                features['appet'],
                features['pe'],
                features['ane']
            ]])
            
            # Scale features
            scaled_features = self.scaler.transform(feature_array)
            
            # Get prediction probability
            prob = self.model.predict_proba(scaled_features)[0][1]
            
            # Calculate health score (0-100)
            health_score = int(prob * 100)
            
            # Determine CKD stage based on probability
            if prob < 0.25:
                stage = "No CKD"
            elif prob < 0.5:
                stage = "Early Stage"
            elif prob < 0.75:
                stage = "Moderate Stage"
            else:
                stage = "Advanced Stage"
            
            return {
                "health_score": health_score,
                "ckd_stage": stage,
                "probability": float(prob)
            }
            
        except Exception as e:
            print(f"Error making prediction: {str(e)}")
            raise 