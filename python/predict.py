import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
import joblib
import warnings
warnings.filterwarnings('ignore')

# Enhanced synthetic data generation with more realistic health patterns
def generate_enhanced_synthetic_data(n_samples=5000):
    np.random.seed(42)
    
    # Generate features with realistic correlations
    age = np.random.randint(18, 85, n_samples)
    gender = np.random.choice(['male', 'female'], n_samples)
    
    # Weight and height with realistic distributions
    height_cm = np.random.normal(170, 10, n_samples)  # cm
    height_cm = np.clip(height_cm, 140, 210)
    
    # Weight correlated with height and age
    base_weight = (height_cm - 100) * 0.9  # Rough BMI calculation
    weight_variation = np.random.normal(0, 10, n_samples)
    age_weight_factor = (age - 25) * 0.2  # Weight tends to increase with age
    weight = base_weight + weight_variation + age_weight_factor
    weight = np.clip(weight, 35, 200)
    
    # Calculate BMI
    bmi = weight / ((height_cm / 100) ** 2)
    
    # Exercise frequency influenced by age and BMI
    exercise_base = np.random.choice([0, 1, 2, 3, 4, 5, 6, 7], n_samples, 
                                   p=[0.15, 0.1, 0.15, 0.2, 0.15, 0.1, 0.1, 0.05])
    age_exercise_penalty = np.where(age > 60, np.random.choice([-2, -1, 0], n_samples), 0)
    bmi_exercise_penalty = np.where(bmi > 30, np.random.choice([-2, -1, 0], n_samples), 0)
    exercise_frequency = np.clip(exercise_base + age_exercise_penalty + bmi_exercise_penalty, 0, 7)
    
    # Sleep hours with realistic distribution
    sleep_hours = np.random.normal(7.5, 1.2, n_samples)
    sleep_hours = np.clip(sleep_hours, 4, 12)
    
    # Sleep quality correlated with stress and age
    stress_level = np.random.randint(1, 11, n_samples)
    sleep_quality_base = np.random.choice(['poor', 'fair', 'average', 'good', 'excellent'], n_samples,
                                        p=[0.1, 0.2, 0.4, 0.25, 0.05])
    
    # Diet quality influenced by age, education, and income (simulated)
    diet_quality = np.random.randint(1, 11, n_samples)
    
    # Smoking status with age correlation
    smoking_prob = np.where(age < 30, 0.15, np.where(age < 50, 0.25, 0.2))
    smoking_status = np.random.choice(['non-smoker', 'former-smoker', 'occasional', 'regular'], 
                                    n_samples, p=[0.6, 0.25, 0.1, 0.05])
    
    # Alcohol consumption
    alcohol_consumption = np.random.choice(['none', 'occasional', 'moderate', 'heavy'], 
                                         n_samples, p=[0.3, 0.4, 0.25, 0.05])
    
    # Blood pressure influenced by age, BMI, stress, and genetics
    bp_risk = (age - 20) * 0.02 + (bmi - 25) * 0.05 + stress_level * 0.03
    bp_categories = ['normal', 'elevated', 'stage1', 'stage2']
    bp_probs = np.array([0.6, 0.2, 0.15, 0.05])
    
    # Adjust probabilities based on risk factors
    bp_risk_normalized = np.clip(bp_risk / 10, 0, 1)
    blood_pressure = []
    for i in range(n_samples):
        risk = bp_risk_normalized[i]
        adjusted_probs = bp_probs * (1 - risk) + np.array([0.1, 0.2, 0.4, 0.3]) * risk
        adjusted_probs = adjusted_probs / adjusted_probs.sum()
        blood_pressure.append(np.random.choice(bp_categories, p=adjusted_probs))
    
    # Cholesterol levels
    chol_risk = (age - 20) * 0.015 + (bmi - 25) * 0.03 + (diet_quality < 5) * 0.2
    chol_categories = ['normal', 'borderline', 'high']
    cholesterol_levels = []
    for i in range(n_samples):
        risk = np.clip(chol_risk[i] / 8, 0, 1)
        chol_probs = np.array([0.7, 0.2, 0.1]) * (1 - risk) + np.array([0.2, 0.4, 0.4]) * risk
        chol_probs = chol_probs / chol_probs.sum()
        cholesterol_levels.append(np.random.choice(chol_categories, p=chol_probs))
    
    # Blood sugar levels
    diabetes_risk = (age - 20) * 0.01 + (bmi - 25) * 0.04 + (exercise_frequency < 2) * 0.15
    bs_categories = ['70-100', '101-125', '126+', 'dont-know']
    blood_sugar_levels = []
    for i in range(n_samples):
        risk = np.clip(diabetes_risk[i] / 6, 0, 1)
        bs_probs = np.array([0.75, 0.15, 0.05, 0.05]) * (1 - risk) + np.array([0.3, 0.4, 0.25, 0.05]) * risk
        bs_probs = bs_probs / bs_probs.sum()
        blood_sugar_levels.append(np.random.choice(bs_categories, p=bs_probs))
    
    # Family history with genetic correlation
    family_conditions = ['heart-disease', 'diabetes', 'cancer', 'hypertension', 'stroke', 'mental-health', 'none']
    family_history = []
    for i in range(n_samples):
        # Higher chance of family history with age
        num_conditions = np.random.poisson(0.8 + age[i] * 0.01)
        if num_conditions == 0:
            family_history.append(['none'])
        else:
            conditions = np.random.choice(family_conditions[:-1], 
                                        min(num_conditions, 3), replace=False)
            family_history.append(list(conditions))
    
    # Existing conditions influenced by age, family history, and lifestyle
    existing_conditions = []
    for i in range(n_samples):
        conditions = []
        
        # Heart disease risk
        heart_risk = (age[i] > 60) * 0.1 + ('heart-disease' in family_history[i]) * 0.15 + \
                    (blood_pressure[i] in ['stage1', 'stage2']) * 0.1 + (smoking_status[i] == 'regular') * 0.08
        if np.random.random() < heart_risk:
            conditions.append('heart-disease')
        
        # Diabetes risk
        diabetes_risk_val = (age[i] > 50) * 0.08 + ('diabetes' in family_history[i]) * 0.2 + \
                           (bmi[i] > 30) * 0.12 + (exercise_frequency[i] < 2) * 0.06
        if np.random.random() < diabetes_risk_val:
            conditions.append('diabetes')
        
        # Hypertension
        if blood_pressure[i] in ['stage1', 'stage2']:
            conditions.append('hypertension')
        
        # Mental health
        mental_risk = (stress_level[i] > 7) * 0.15 + ('mental-health' in family_history[i]) * 0.12 + \
                     (sleep_hours[i] < 6) * 0.08
        if np.random.random() < mental_risk:
            conditions.append('mental-health')
        
        if not conditions:
            conditions = ['none']
        
        existing_conditions.append(conditions)
    
    # Create DataFrame
    data = pd.DataFrame({
        'age': age,
        'gender': gender,
        'weight': weight,
        'height': height_cm,
        'bmi': bmi,
        'exercise_frequency': exercise_frequency,
        'sleep_hours': sleep_hours,
        'sleep_quality': sleep_quality_base,
        'diet_quality': diet_quality,
        'stress_level': stress_level,
        'smoking_status': smoking_status,
        'alcohol_consumption': alcohol_consumption,
        'blood_pressure': blood_pressure,
        'cholesterol_levels': cholesterol_levels,
        'blood_sugar_levels': blood_sugar_levels,
        'family_history': family_history,
        'existing_conditions': existing_conditions
    })
    
    return data

# Enhanced risk calculation functions with medical accuracy
def calculate_enhanced_cardiovascular_risk(row):
    """Calculate cardiovascular risk using Framingham-inspired scoring"""
    risk_score = 0
    
    # Age factor (major risk factor)
    if row['age'] >= 65:
        risk_score += 25
    elif row['age'] >= 55:
        risk_score += 15
    elif row['age'] >= 45:
        risk_score += 8
    elif row['age'] >= 35:
        risk_score += 3
    
    # Gender factor
    if row['gender'] == 'male' and row['age'] >= 45:
        risk_score += 8
    elif row['gender'] == 'female' and row['age'] >= 55:
        risk_score += 6
    
    # BMI factor
    if row['bmi'] >= 35:
        risk_score += 15
    elif row['bmi'] >= 30:
        risk_score += 10
    elif row['bmi'] >= 25:
        risk_score += 5
    
    # Blood pressure (major factor)
    bp_scores = {'normal': 0, 'elevated': 5, 'stage1': 12, 'stage2': 20}
    risk_score += bp_scores.get(row['blood_pressure'], 0)
    
    # Cholesterol
    chol_scores = {'normal': 0, 'borderline': 8, 'high': 15}
    risk_score += chol_scores.get(row['cholesterol_levels'], 0)
    
    # Smoking (major factor)
    smoking_scores = {'non-smoker': 0, 'former-smoker': 5, 'occasional': 12, 'regular': 20}
    risk_score += smoking_scores.get(row['smoking_status'], 0)
    
    # Diabetes
    if 'diabetes' in row['existing_conditions'] or row['blood_sugar_levels'] in ['126+']:
        risk_score += 18
    elif row['blood_sugar_levels'] == '101-125':
        risk_score += 8
    
    # Family history
    if 'heart-disease' in row['family_history']:
        risk_score += 10
    if 'stroke' in row['family_history']:
        risk_score += 8
    
    # Exercise (protective factor)
    if row['exercise_frequency'] >= 5:
        risk_score -= 8
    elif row['exercise_frequency'] >= 3:
        risk_score -= 5
    elif row['exercise_frequency'] <= 1:
        risk_score += 8
    
    # Stress
    if row['stress_level'] >= 8:
        risk_score += 6
    
    return max(5, min(85, risk_score))

def calculate_enhanced_metabolic_risk(row):
    """Calculate metabolic syndrome risk"""
    risk_score = 0
    
    # Central obesity (waist circumference approximated by BMI)
    if row['bmi'] >= 35:
        risk_score += 20
    elif row['bmi'] >= 30:
        risk_score += 15
    elif row['bmi'] >= 25:
        risk_score += 8
    
    # Blood sugar
    if row['blood_sugar_levels'] == '126+':
        risk_score += 25
    elif row['blood_sugar_levels'] == '101-125':
        risk_score += 15
    
    # Blood pressure
    bp_scores = {'normal': 0, 'elevated': 5, 'stage1': 12, 'stage2': 18}
    risk_score += bp_scores.get(row['blood_pressure'], 0)
    
    # Cholesterol (HDL approximated inversely from total cholesterol)
    if row['cholesterol_levels'] == 'high':
        risk_score += 12
    elif row['cholesterol_levels'] == 'borderline':
        risk_score += 6
    
    # Age factor
    if row['age'] >= 60:
        risk_score += 10
    elif row['age'] >= 45:
        risk_score += 5
    
    # Family history
    if 'diabetes' in row['family_history']:
        risk_score += 12
    
    # Lifestyle factors
    if row['exercise_frequency'] <= 1:
        risk_score += 10
    elif row['exercise_frequency'] >= 5:
        risk_score -= 8
    
    if row['diet_quality'] <= 4:
        risk_score += 8
    elif row['diet_quality'] >= 8:
        risk_score -= 5
    
    # Existing conditions
    if 'diabetes' in row['existing_conditions']:
        risk_score += 20
    if 'hypertension' in row['existing_conditions']:
        risk_score += 10
    
    return max(5, min(80, risk_score))

def calculate_enhanced_sleep_risk(row):
    """Calculate sleep disorder risk"""
    risk_score = 0
    
    # Sleep duration
    if row['sleep_hours'] < 5:
        risk_score += 25
    elif row['sleep_hours'] < 6:
        risk_score += 15
    elif row['sleep_hours'] < 7:
        risk_score += 8
    elif row['sleep_hours'] > 9:
        risk_score += 10
    
    # Sleep quality
    quality_scores = {'poor': 20, 'fair': 12, 'average': 5, 'good': 0, 'excellent': -5}
    risk_score += quality_scores.get(row['sleep_quality'], 0)
    
    # Age factor
    if row['age'] >= 65:
        risk_score += 8
    elif row['age'] >= 50:
        risk_score += 5
    
    # BMI (sleep apnea risk)
    if row['bmi'] >= 35:
        risk_score += 15
    elif row['bmi'] >= 30:
        risk_score += 10
    
    # Stress level
    if row['stress_level'] >= 8:
        risk_score += 12
    elif row['stress_level'] >= 6:
        risk_score += 6
    
    # Alcohol
    if row['alcohol_consumption'] in ['moderate', 'heavy']:
        risk_score += 8
    
    # Exercise (protective)
    if row['exercise_frequency'] >= 4:
        risk_score -= 8
    elif row['exercise_frequency'] <= 1:
        risk_score += 6
    
    # Mental health conditions
    if 'mental-health' in row['existing_conditions']:
        risk_score += 12
    
    return max(5, min(75, risk_score))

def calculate_enhanced_mental_risk(row):
    """Calculate mental health risk"""
    risk_score = 0
    
    # Stress level (primary factor)
    if row['stress_level'] >= 9:
        risk_score += 25
    elif row['stress_level'] >= 7:
        risk_score += 15
    elif row['stress_level'] >= 5:
        risk_score += 8
    
    # Sleep quality
    quality_scores = {'poor': 15, 'fair': 10, 'average': 5, 'good': 0, 'excellent': -5}
    risk_score += quality_scores.get(row['sleep_quality'], 0)
    
    # Sleep duration
    if row['sleep_hours'] < 6:
        risk_score += 12
    elif row['sleep_hours'] > 9:
        risk_score += 8
    
    # Age factors
    if 18 <= row['age'] <= 25:
        risk_score += 8  # Higher risk in young adults
    elif 45 <= row['age'] <= 65:
        risk_score += 5  # Midlife stress
    
    # Gender factor
    if row['gender'] == 'female':
        risk_score += 5  # Higher prevalence in women
    
    # Family history
    if 'mental-health' in row['family_history']:
        risk_score += 15
    
    # Existing conditions
    if 'mental-health' in row['existing_conditions']:
        risk_score += 20
    
    # Lifestyle factors
    if row['exercise_frequency'] <= 1:
        risk_score += 10
    elif row['exercise_frequency'] >= 5:
        risk_score -= 8
    
    # Substance use
    if row['smoking_status'] in ['occasional', 'regular']:
        risk_score += 8
    if row['alcohol_consumption'] == 'heavy':
        risk_score += 10
    
    # Physical health impact
    chronic_conditions = ['heart-disease', 'diabetes', 'hypertension']
    if any(cond in row['existing_conditions'] for cond in chronic_conditions):
        risk_score += 8
    
    return max(5, min(80, risk_score))

def calculate_enhanced_immune_risk(row):
    """Calculate immune system risk"""
    risk_score = 0
    
    # Age factor (immune senescence)
    if row['age'] >= 75:
        risk_score += 20
    elif row['age'] >= 65:
        risk_score += 12
    elif row['age'] >= 50:
        risk_score += 6
    elif row['age'] <= 5:
        risk_score += 10  # Immature immune system
    
    # Chronic conditions that affect immunity
    immune_affecting_conditions = ['diabetes', 'heart-disease']
    for condition in immune_affecting_conditions:
        if condition in row['existing_conditions']:
            risk_score += 10
    
    # Lifestyle factors
    if row['smoking_status'] in ['occasional', 'regular']:
        risk_score += 15
    
    if row['alcohol_consumption'] == 'heavy':
        risk_score += 12
    
    # Sleep (crucial for immune function)
    if row['sleep_hours'] < 6:
        risk_score += 12
    elif row['sleep_quality'] == 'poor':
        risk_score += 8
    
    # Stress (immunosuppressive)
    if row['stress_level'] >= 8:
        risk_score += 10
    elif row['stress_level'] >= 6:
        risk_score += 5
    
    # Exercise (immune boosting)
    if row['exercise_frequency'] >= 4:
        risk_score -= 10
    elif row['exercise_frequency'] <= 1:
        risk_score += 8
    
    # Nutrition (approximated by diet quality)
    if row['diet_quality'] <= 4:
        risk_score += 10
    elif row['diet_quality'] >= 8:
        risk_score -= 8
    
    # BMI (obesity affects immune function)
    if row['bmi'] >= 35:
        risk_score += 12
    elif row['bmi'] >= 30:
        risk_score += 8
    
    return max(5, min(75, risk_score))

def calculate_enhanced_chronic_disease_risk(row):
    """Calculate overall chronic disease risk"""
    risk_score = 0
    
    # Age (primary factor)
    if row['age'] >= 70:
        risk_score += 25
    elif row['age'] >= 60:
        risk_score += 18
    elif row['age'] >= 50:
        risk_score += 12
    elif row['age'] >= 40:
        risk_score += 6
    
    # Family history (genetic predisposition)
    high_risk_family = ['heart-disease', 'diabetes', 'cancer']
    family_risk_count = sum(1 for condition in high_risk_family if condition in row['family_history'])
    risk_score += family_risk_count * 8
    
    # Existing conditions
    risk_score += len([c for c in row['existing_conditions'] if c != 'none']) * 10
    
    # Lifestyle factors
    if row['smoking_status'] in ['occasional', 'regular']:
        risk_score += 15
    
    if row['alcohol_consumption'] == 'heavy':
        risk_score += 10
    
    # Physical activity (major protective factor)
    if row['exercise_frequency'] <= 1:
        risk_score += 15
    elif row['exercise_frequency'] >= 5:
        risk_score -= 12
    
    # Diet quality
    if row['diet_quality'] <= 4:
        risk_score += 12
    elif row['diet_quality'] >= 8:
        risk_score -= 8
    
    # BMI
    if row['bmi'] >= 35:
        risk_score += 15
    elif row['bmi'] >= 30:
        risk_score += 10
    elif row['bmi'] < 18.5:
        risk_score += 8
    
    # Metabolic markers
    if row['blood_pressure'] in ['stage1', 'stage2']:
        risk_score += 10
    if row['cholesterol_levels'] == 'high':
        risk_score += 8
    if row['blood_sugar_levels'] in ['101-125', '126+']:
        risk_score += 12
    
    # Sleep and stress
    if row['sleep_hours'] < 6 or row['sleep_quality'] == 'poor':
        risk_score += 8
    if row['stress_level'] >= 8:
        risk_score += 8
    
    return max(5, min(85, risk_score))

# Generate enhanced dataset
print("Generating enhanced synthetic health data...")
data = generate_enhanced_synthetic_data(5000)

# Calculate risk scores
print("Calculating enhanced risk scores...")
data['cardiovascular_risk'] = data.apply(calculate_enhanced_cardiovascular_risk, axis=1)
data['metabolic_risk'] = data.apply(calculate_enhanced_metabolic_risk, axis=1)
data['sleep_risk'] = data.apply(calculate_enhanced_sleep_risk, axis=1)
data['mental_risk'] = data.apply(calculate_enhanced_mental_risk, axis=1)
data['immune_risk'] = data.apply(calculate_enhanced_immune_risk, axis=1)
data['chronic_risk'] = data.apply(calculate_enhanced_chronic_disease_risk, axis=1)

# Convert to binary classification for model training
risk_threshold = 50  # Above 50% is considered high risk
data['cardiovascular_high_risk'] = (data['cardiovascular_risk'] > risk_threshold).astype(int)
data['metabolic_high_risk'] = (data['metabolic_risk'] > risk_threshold).astype(int)
data['sleep_high_risk'] = (data['sleep_risk'] > risk_threshold).astype(int)
data['mental_high_risk'] = (data['mental_risk'] > risk_threshold).astype(int)
data['immune_high_risk'] = (data['immune_risk'] > risk_threshold).astype(int)
data['chronic_high_risk'] = (data['chronic_risk'] > risk_threshold).astype(int)

# Prepare features for machine learning
def prepare_features(df):
    """Prepare features for machine learning"""
    feature_df = df.copy()
    
    # Encode categorical variables
    le_gender = LabelEncoder()
    feature_df['gender_encoded'] = le_gender.fit_transform(feature_df['gender'])
    
    le_smoking = LabelEncoder()
    feature_df['smoking_encoded'] = le_smoking.fit_transform(feature_df['smoking_status'])
    
    le_alcohol = LabelEncoder()
    feature_df['alcohol_encoded'] = le_alcohol.fit_transform(feature_df['alcohol_consumption'])
    
    le_sleep_quality = LabelEncoder()
    feature_df['sleep_quality_encoded'] = le_sleep_quality.fit_transform(feature_df['sleep_quality'])
    
    le_bp = LabelEncoder()
    feature_df['bp_encoded'] = le_bp.fit_transform(feature_df['blood_pressure'])
    
    le_chol = LabelEncoder()
    feature_df['chol_encoded'] = le_chol.fit_transform(feature_df['cholesterol_levels'])
    
    le_bs = LabelEncoder()
    feature_df['bs_encoded'] = le_bs.fit_transform(feature_df['blood_sugar_levels'])
    
    # Create family history features
    family_conditions = ['heart-disease', 'diabetes', 'cancer', 'hypertension', 'stroke', 'mental-health']
    for condition in family_conditions:
        feature_df[f'family_{condition.replace("-", "_")}'] = feature_df['family_history'].apply(
            lambda x: 1 if condition in x else 0
        )
    
    # Create existing condition features
    existing_conditions = ['heart-disease', 'diabetes', 'hypertension', 'mental-health']
    for condition in existing_conditions:
        feature_df[f'has_{condition.replace("-", "_")}'] = feature_df['existing_conditions'].apply(
            lambda x: 1 if condition in x else 0
        )
    
    # Select numerical features
    feature_columns = [
        'age', 'weight', 'height', 'bmi', 'exercise_frequency', 'sleep_hours', 
        'diet_quality', 'stress_level', 'gender_encoded', 'smoking_encoded', 
        'alcohol_encoded', 'sleep_quality_encoded', 'bp_encoded', 'chol_encoded', 'bs_encoded'
    ] + [f'family_{c.replace("-", "_")}' for c in family_conditions] + \
        [f'has_{c.replace("-", "_")}' for c in existing_conditions]
    
    return feature_df[feature_columns], {
        'gender': le_gender, 'smoking': le_smoking, 'alcohol': le_alcohol,
        'sleep_quality': le_sleep_quality, 'bp': le_bp, 'chol': le_chol, 'bs': le_bs
    }

# Prepare features
X, encoders = prepare_features(data)
print(f"Feature matrix shape: {X.shape}")

# Define target variables
targets = {
    'cardiovascular': data['cardiovascular_high_risk'],
    'metabolic': data['metabolic_high_risk'],
    'sleep': data['sleep_high_risk'],
    'mental': data['mental_high_risk'],
    'immune': data['immune_high_risk'],
    'chronic': data['chronic_high_risk']
}

# Train enhanced models
models = {}
scalers = {}
model_performance = {}

print("\nTraining enhanced machine learning models...")

for target_name, y in targets.items():
    print(f"\nTraining {target_name} model...")
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Try multiple algorithms and select the best
    algorithms = {
        'RandomForest': RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42),
        'GradientBoosting': GradientBoostingClassifier(n_estimators=200, max_depth=6, random_state=42),
        'LogisticRegression': LogisticRegression(random_state=42, max_iter=1000),
        'SVM': SVC(probability=True, random_state=42)
    }
    
    best_score = 0
    best_model = None
    best_algo_name = None
    
    for algo_name, model in algorithms.items():
        # Cross-validation
        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5, scoring='roc_auc')
        mean_score = cv_scores.mean()
        
        if mean_score > best_score:
            best_score = mean_score
            best_model = model
            best_algo_name = algo_name
    
    # Train the best model
    best_model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = best_model.predict(X_test_scaled)
    y_pred_proba = best_model.predict_proba(X_test_scaled)[:, 1]
    
    accuracy = accuracy_score(y_test, y_pred)
    auc_score = roc_auc_score(y_test, y_pred_proba)
    
    models[target_name] = best_model
    scalers[target_name] = scaler
    model_performance[target_name] = {
        'algorithm': best_algo_name,
        'accuracy': accuracy,
        'auc_score': auc_score,
        'cv_score': best_score
    }
    
    print(f"Best algorithm: {best_algo_name}")
    print(f"Accuracy: {accuracy:.4f}")
    print(f"AUC Score: {auc_score:.4f}")
    print(f"CV Score: {best_score:.4f}")

# Enhanced prediction function
def predict_enhanced_health_risks(user_data):
    """
    Enhanced prediction function with more accurate risk assessment
    """
    try:
        # Convert user data to DataFrame
        user_df = pd.DataFrame([user_data])
        
        # Calculate BMI if not provided
        if 'bmi' not in user_data and 'weight' in user_data and 'height' in user_data:
            height_m = float(user_data['height']) / 100
            user_df['bmi'] = float(user_data['weight']) / (height_m ** 2)
        
        # Map user input to model format
        feature_mapping = {
            'age': lambda x: int(x),
            'weight': lambda x: float(x),
            'height': lambda x: float(x),
            'bmi': lambda x: float(x),
            'exercise_frequency': lambda x: map_exercise_frequency(x),
            'sleep_hours': lambda x: float(x),
            'diet_quality': lambda x: map_diet_quality(x),
            'stress_level': lambda x: int(x),
            'gender_encoded': lambda x: 1 if user_data.get('gender') == 'male' else 0,
            'smoking_encoded': lambda x: map_smoking_status(user_data.get('smokingStatus', 'never')),
            'alcohol_encoded': lambda x: map_alcohol_consumption(user_data.get('alcoholConsumption', 'never')),
            'sleep_quality_encoded': lambda x: map_sleep_quality(user_data.get('sleepQuality', 'good')),
            'bp_encoded': lambda x: map_blood_pressure(user_data.get('bloodPressure', 'normal')),
            'chol_encoded': lambda x: map_cholesterol(user_data.get('cholesterolLevels', 'normal')),
            'bs_encoded': lambda x: map_blood_sugar(user_data.get('bloodSugarLevel', '70-100'))
        }
        
        # Create feature vector
        feature_vector = []
        feature_names = [
            'age', 'weight', 'height', 'bmi', 'exercise_frequency', 'sleep_hours', 
            'diet_quality', 'stress_level', 'gender_encoded', 'smoking_encoded', 
            'alcohol_encoded', 'sleep_quality_encoded', 'bp_encoded', 'chol_encoded', 'bs_encoded'
        ]
        
        for feature in feature_names:
            if feature in feature_mapping:
                try:
                    value = feature_mapping[feature](user_data.get(feature, 0))
                    feature_vector.append(value)
                except:
                    feature_vector.append(0)
            else:
                feature_vector.append(0)
        
        # Add family history features
        family_conditions = ['heart-disease', 'diabetes', 'cancer', 'hypertension', 'stroke', 'mental-health']
        family_history = user_data.get('familyHistory', [])
        for condition in family_conditions:
            feature_vector.append(1 if condition in family_history else 0)
        
        # Add existing condition features
        existing_conditions = ['heart-disease', 'diabetes', 'hypertension', 'mental-health']
        user_conditions = user_data.get('existingConditions', [])
        for condition in existing_conditions:
            feature_vector.append(1 if condition in user_conditions else 0)
        
        # Convert to numpy array
        X_user = np.array(feature_vector).reshape(1, -1)
        
        # Make predictions
        predictions = {}
        
        for risk_type, model in models.items():
            # Scale features
            X_user_scaled = scalers[risk_type].transform(X_user)
            
            # Get probability prediction
            risk_probability = model.predict_proba(X_user_scaled)[0][1]
            
            # Convert to percentage and apply clinical adjustments
            risk_percentage = int(risk_probability * 100)
            
            # Apply rule-based adjustments for clinical accuracy
            risk_percentage = apply_clinical_adjustments(risk_type, risk_percentage, user_data)
            
            # Generate detailed recommendations
            recommendations = generate_enhanced_recommendations(risk_type, risk_percentage, user_data)
            
            predictions[risk_type] = {
                "risk": risk_percentage,
                "factors": recommendations,
                "confidence": model_performance[risk_type]['auc_score']
            }
        
        return predictions
        
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return generate_fallback_predictions(user_data)

def map_exercise_frequency(freq_str):
    """Map exercise frequency string to numerical value"""
    mapping = {
        'daily': 7, '4-6-times-week': 5, '2-3-times-week': 2.5,
        'once-week': 1, 'rarely': 0.5, 'never': 0
    }
    return mapping.get(freq_str, 2)

def map_diet_quality(diet_type):
    """Map diet type to quality score"""
    mapping = {
        'mediterranean': 9, 'vegetarian': 8, 'vegan': 8,
        'omnivore': 6, 'other': 5, 'dont-know': 5
    }
    return mapping.get(diet_type, 5)

def map_smoking_status(status):
    """Map smoking status to numerical value"""
    mapping = {'never': 0, 'former': 1, 'occasional': 2, 'regular': 3}
    return mapping.get(status, 0)

def map_alcohol_consumption(consumption):
    """Map alcohol consumption to numerical value"""
    mapping = {'never': 0, 'rarely': 1, 'occasionally': 2, 'weekly': 3, 'daily': 4}
    return mapping.get(consumption, 0)

def map_sleep_quality(quality):
    """Map sleep quality to numerical value"""
    mapping = {'excellent': 4, 'good': 3, 'fair': 2, 'poor': 1, 'very-poor': 0}
    return mapping.get(quality, 3)

def map_blood_pressure(bp):
    """Map blood pressure to numerical value"""
    mapping = {'normal': 0, 'elevated': 1, 'stage1': 2, 'stage2': 3, 'low': 0, 'unknown': 1}
    return mapping.get(bp, 0)

def map_cholesterol(chol):
    """Map cholesterol to numerical value"""
    mapping = {'normal': 0, 'borderline': 1, 'high': 2, 'very-high': 3, 'unknown': 1}
    return mapping.get(chol, 0)

def map_blood_sugar(bs):
    """Map blood sugar to numerical value"""
    mapping = {
        '70-100': 0, 'less-than-140': 0, '101-125': 1, '140-199': 1,
        '126+': 2, '200+': 2, 'dont-know': 1
    }
    return mapping.get(bs, 0)

def apply_clinical_adjustments(risk_type, base_risk, user_data):
    """Apply clinical knowledge-based adjustments to ML predictions"""
    adjusted_risk = base_risk
    
    age = int(user_data.get('age', 30))
    bmi = float(user_data.get('bmi', 25))
    
    # Age-based adjustments
    if age >= 70:
        adjusted_risk = min(85, adjusted_risk + 5)
    elif age >= 60:
        adjusted_risk = min(80, adjusted_risk + 3)
    
    # Severe obesity adjustment
    if bmi >= 40:
        if risk_type in ['cardiovascular', 'metabolic', 'chronic']:
            adjusted_risk = min(85, adjusted_risk + 8)
    
    # Multiple risk factor syndrome
    risk_factors = 0
    if user_data.get('smokingStatus') in ['occasional', 'regular']:
        risk_factors += 1
    if user_data.get('bloodPressure') in ['stage1', 'stage2']:
        risk_factors += 1
    if user_data.get('cholesterolLevels') in ['high', 'very-high']:
        risk_factors += 1
    if user_data.get('bloodSugarLevel') in ['126+', '200+']:
        risk_factors += 1
    
    if risk_factors >= 3:
        adjusted_risk = min(85, adjusted_risk + 10)
    elif risk_factors >= 2:
        adjusted_risk = min(80, adjusted_risk + 5)
    
    return max(5, adjusted_risk)

def generate_enhanced_recommendations(risk_type, risk_score, user_data):
    """Generate detailed, personalized recommendations"""
    recommendations = []
    
    age = int(user_data.get('age', 30))
    bmi = float(user_data.get('bmi', 25))
    exercise_freq = user_data.get('exerciseFrequency', 'rarely')
    
    if risk_type == 'cardiovascular':
        # Exercise recommendations
        if exercise_freq in ['rarely', 'never']:
            recommendations.append({
                "name": "Cardiovascular Exercise",
                "impact": "High negative impact",
                "suggestion": "Start with 150 minutes of moderate aerobic activity weekly, such as brisk walking",
                "timeframe": "immediate",
                "difficulty": "moderate",
                "evidence": "strong",
                "details": "Regular aerobic exercise strengthens the heart muscle, improves circulation, and can reduce cardiovascular disease risk by up to 35%. Start gradually and increase intensity over time."
            })
        
        # Blood pressure management
        if user_data.get('bloodPressure') in ['stage1', 'stage2']:
            recommendations.append({
                "name": "Blood Pressure Management",
                "impact": "High negative impact",
                "suggestion": "Reduce sodium intake to less than 2,300mg daily and consult your healthcare provider",
                "timeframe": "immediate",
                "difficulty": "moderate",
                "evidence": "strong",
                "details": "High blood pressure significantly increases cardiovascular risk. Dietary changes, weight management, and medication when necessary can effectively control blood pressure."
            })
        
        # Smoking cessation
        if user_data.get('smokingStatus') in ['occasional', 'regular']:
            recommendations.append({
                "name": "Smoking Cessation",
                "impact": "High negative impact",
                "suggestion": "Quit smoking immediately - consider nicotine replacement therapy or counseling",
                "timeframe": "immediate",
                "difficulty": "challenging",
                "evidence": "strong",
                "details": "Smoking increases cardiovascular disease risk by 2-4 times. Quitting smoking can reduce heart disease risk by 50% within one year of quitting."
            })
        
        # Weight management
        if bmi >= 30:
            recommendations.append({
                "name": "Weight Management",
                "impact": "Medium negative impact",
                "suggestion": "Aim for a 5-10% weight reduction through caloric deficit and increased physical activity",
                "timeframe": "medium-term",
                "difficulty": "challenging",
                "evidence": "strong",
                "details": "Obesity increases cardiovascular risk through multiple mechanisms. Even modest weight loss can significantly improve cardiovascular health markers."
            })
        
        # Cholesterol management
        if user_data.get('cholesterolLevels') in ['high', 'very-high']:
            recommendations.append({
                "name": "Cholesterol Management",
                "impact": "Medium negative impact",
                "suggestion": "Adopt a heart-healthy diet low in saturated fats and high in fiber",
                "timeframe": "short-term",
                "difficulty": "moderate",
                "evidence": "strong",
                "details": "High cholesterol contributes to atherosclerosis. A diet rich in fruits, vegetables, whole grains, and lean proteins can help lower cholesterol levels naturally."
            })
    
    elif risk_type == 'metabolic':
        # Physical activity
        if exercise_freq in ['rarely', 'never']:
            recommendations.append({
                "name": "Regular Physical Activity",
                "impact": "High negative impact",
                "suggestion": "Combine 150 minutes of aerobic exercise with 2 days of strength training weekly",
                "timeframe": "immediate",
                "difficulty": "moderate",
                "evidence": "strong",
                "details": "Exercise improves insulin sensitivity and glucose metabolism. Both aerobic and resistance training are important for metabolic health."
            })
        
        # Blood sugar management
        if user_data.get('bloodSugarLevel') in ['101-125', '126+', '140-199', '200+']:
            recommendations.append({
                "name": "Blood Sugar Management",
                "impact": "High negative impact",
                "suggestion": "Monitor blood glucose regularly and follow a low-glycemic diet",
                "timeframe": "immediate",
                "difficulty": "moderate",
                "evidence": "strong",
                "details": "Elevated blood sugar indicates prediabetes or diabetes. Lifestyle interventions can prevent or delay type 2 diabetes by up to 58%."
            })
        
        # Weight management for metabolic health
        if bmi >= 25:
            recommendations.append({
                "name": "Metabolic Weight Management",
                "impact": "High negative impact",
                "suggestion": "Focus on reducing abdominal fat through diet and exercise",
                "timeframe": "medium-term",
                "difficulty": "challenging",
                "evidence": "strong",
                "details": "Excess weight, especially abdominal fat, increases insulin resistance and metabolic syndrome risk. Even a 5% weight loss can improve metabolic markers."
            })
        
        # Dietary recommendations
        recommendations.append({
            "name": "Metabolic Diet Optimization",
            "impact": "Medium negative impact",
            "suggestion": "Emphasize whole foods, limit processed carbohydrates, and include healthy fats",
            "timeframe": "short-term",
            "difficulty": "moderate",
            "evidence": "strong",
            "details": "A Mediterranean-style diet with controlled portions can improve insulin sensitivity and reduce metabolic syndrome risk."
        })
    
    elif risk_type == 'sleep':
        # Sleep duration
        sleep_hours = float(user_data.get('sleepHours', 7))
        if sleep_hours < 7:
            recommendations.append({
                "name": "Sleep Duration Optimization",
                "impact": "High negative impact",
                "suggestion": f"Increase sleep duration to 7-9 hours nightly (currently {sleep_hours} hours)",
                "timeframe": "immediate",
                "difficulty": "moderate",
                "evidence": "strong",
                "details": "Insufficient sleep affects hormone regulation, immune function, and cognitive performance. Consistent sleep duration is crucial for health."
            })
        
        # Sleep quality
        if user_data.get('sleepQuality') in ['poor', 'fair']:
            recommendations.append({
                "name": "Sleep Quality Improvement",
                "impact": "High negative impact",
                "suggestion": "Establish a consistent bedtime routine and optimize sleep environment",
                "timeframe": "immediate",
                "difficulty": "easy",
                "evidence": "strong",
                "details": "Poor sleep quality can be improved through sleep hygiene practices: consistent schedule, cool dark room, avoiding screens before bed."
            })
        
        # Stress and sleep
        if int(user_data.get('stressLevel', 5)) >= 7:
            recommendations.append({
                "name": "Stress-Related Sleep Issues",
                "impact": "Medium negative impact",
                "suggestion": "Practice relaxation techniques before bedtime to manage stress",
                "timeframe": "short-term",
                "difficulty": "easy",
                "evidence": "moderate",
                "details": "High stress levels interfere with sleep quality. Meditation, deep breathing, or progressive muscle relaxation can improve sleep."
            })
    
    elif risk_type == 'mental':
        # Stress management
        stress_level = int(user_data.get('stressLevel', 5))
        if stress_level >= 8:
            recommendations.append({
                "name": "Stress Management",
                "impact": "High negative impact",
                "suggestion": "Consider professional counseling and learn stress reduction techniques",
                "timeframe": "immediate",
                "difficulty": "moderate",
                "evidence": "strong",
                "details": "Chronic high stress significantly impacts mental health. Professional support and stress management techniques can provide effective relief."
            })
        
        # Physical activity for mental health
        if exercise_freq in ['rarely', 'never']:
            recommendations.append({
                "name": "Exercise for Mental Health",
                "impact": "High negative impact",
                "suggestion": "Engage in regular physical activity, particularly outdoor activities",
                "timeframe": "immediate",
                "difficulty": "moderate",
                "evidence": "strong",
                "details": "Exercise is as effective as medication for mild to moderate depression and anxiety. Aim for at least 30 minutes of activity most days."
            })
        
        # Sleep and mental health
        if sleep_hours < 7 or user_data.get('sleepQuality') in ['poor', 'fair']:
            recommendations.append({
                "name": "Sleep for Mental Health",
                "impact": "Medium negative impact",
                "suggestion": "Prioritize sleep hygiene as poor sleep significantly affects mood",
                "timeframe": "immediate",
                "difficulty": "moderate",
                "evidence": "strong",
                "details": "Sleep and mental health are closely linked. Poor sleep can worsen anxiety and depression, while good sleep supports emotional regulation."
            })
        
        # Social connections
        recommendations.append({
            "name": "Social Connection",
            "impact": "Medium positive impact",
            "suggestion": "Maintain regular social interactions and consider joining community groups",
            "timeframe": "short-term",
            "difficulty": "easy",
            "evidence": "strong",
            "details": "Strong social connections are protective against mental health issues and can provide support during difficult times."
        })
    
    elif risk_type == 'immune':
        # Sleep for immunity
        if sleep_hours < 7:
            recommendations.append({
                "name": "Sleep for Immune Function",
                "impact": "High negative impact",
                "suggestion": "Prioritize 7-9 hours of quality sleep for optimal immune function",
                "timeframe": "immediate",
                "difficulty": "moderate",
                "evidence": "strong",
                "details": "Sleep is crucial for immune system function. During sleep, the body produces infection-fighting cells and antibodies."
            })
        
        # Nutrition for immunity
        recommendations.append({
            "name": "Immune-Supporting Nutrition",
            "impact": "Medium positive impact",
            "suggestion": "Eat a variety of colorful fruits and vegetables rich in vitamins and antioxidants",
            "timeframe": "immediate",
            "difficulty": "easy",
            "evidence": "strong",
            "details": "A diverse diet rich in vitamins C, D, zinc, and antioxidants supports immune system function and helps fight infections."
        })
        
        # Exercise for immunity
        if exercise_freq in ['rarely', 'never']:
            recommendations.append({
                "name": "Moderate Exercise for Immunity",
                "impact": "Medium negative impact",
                "suggestion": "Engage in moderate regular exercise to boost immune function",
                "timeframe": "immediate",
                "difficulty": "moderate",
                "evidence": "strong",
                "details": "Moderate exercise enhances immune function, while excessive exercise can temporarily suppress immunity. Aim for consistency over intensity."
            })
        
        # Stress and immunity
        if stress_level >= 7:
            recommendations.append({
                "name": "Stress Management for Immunity",
                "impact": "Medium negative impact",
                "suggestion": "Practice stress reduction as chronic stress suppresses immune function",
                "timeframe": "short-term",
                "difficulty": "moderate",
                "evidence": "strong",
                "details": "Chronic stress elevates cortisol levels, which can suppress immune system function and increase susceptibility to infections."
            })
    
    elif risk_type == 'chronic':
        # Comprehensive lifestyle approach
        recommendations.append({
            "name": "Comprehensive Lifestyle Modification",
            "impact": "High negative impact",
            "suggestion": "Adopt a holistic approach addressing diet, exercise, sleep, and stress management",
            "timeframe": "medium-term",
            "difficulty": "challenging",
            "evidence": "strong",
            "details": "Chronic disease prevention requires a comprehensive approach. Small changes in multiple areas can have significant cumulative effects."
        })
        
        # Regular health monitoring
        if age >= 40:
            recommendations.append({
                "name": "Regular Health Screenings",
                "impact": "Medium positive impact",
                "suggestion": "Schedule regular health checkups and screenings appropriate for your age",
                "timeframe": "short-term",
                "difficulty": "easy",
                "evidence": "strong",
                "details": "Early detection through regular screenings can prevent or catch chronic diseases in their early, more treatable stages."
            })
        
        # Family history considerations
        if user_data.get('familyHistory') and 'none' not in user_data.get('familyHistory', []):
            recommendations.append({
                "name": "Family History Awareness",
                "impact": "Medium negative impact",
                "suggestion": "Discuss your family history with healthcare providers for personalized prevention strategies",
                "timeframe": "short-term",
                "difficulty": "easy",
                "evidence": "strong",
                "details": "Family history provides important information about genetic predispositions and can guide personalized prevention strategies."
            })
    
    # Ensure we have at least 3 recommendations
    while len(recommendations) < 3:
        recommendations.append({
            "name": "General Health Maintenance",
            "impact": "Medium positive impact",
            "suggestion": "Maintain regular health habits and stay informed about health best practices",
            "timeframe": "long-term",
            "difficulty": "easy",
            "evidence": "moderate",
            "details": "Consistent healthy habits are the foundation of disease prevention and overall wellbeing."
        })
    
    return recommendations[:5]  # Return top 5 recommendations

def generate_fallback_predictions(user_data):
    """Generate basic predictions if ML model fails"""
    age = int(user_data.get('age', 30))
    bmi = float(user_data.get('bmi', 25))
    
    base_risk = 20 + (age - 30) * 0.5 + max(0, bmi - 25) * 2
    
    return {
        'cardiovascular': {"risk": int(base_risk), "factors": []},
        'metabolic': {"risk": int(base_risk * 0.8), "factors": []},
        'sleep': {"risk": int(base_risk * 0.6), "factors": []},
        'mental': {"risk": int(base_risk * 0.7), "factors": []},
        'immune': {"risk": int(base_risk * 0.5), "factors": []},
        'chronic': {"risk": int(base_risk * 1.2), "factors": []}
    }

# Print model performance summary
print("\n" + "="*50)
print("ENHANCED MODEL PERFORMANCE SUMMARY")
print("="*50)
for risk_type, performance in model_performance.items():
    print(f"\n{risk_type.upper()} RISK MODEL:")
    print(f"  Algorithm: {performance['algorithm']}")
    print(f"  Accuracy: {performance['accuracy']:.4f}")
    print(f"  AUC Score: {performance['auc_score']:.4f}")
    print(f"  Cross-validation Score: {performance['cv_score']:.4f}")

print(f"\nDataset size: {len(data)} samples")
print(f"Feature count: {X.shape[1]}")
print("\nModels trained and ready for enhanced predictions!")

# Example usage with enhanced prediction
if __name__ == "__main__":
    # Example user data
    example_user = {
        'age': '45',
        'gender': 'male',
        'weight': '85',
        'height': '175',
        'exerciseFrequency': '2-3-times-week',
        'sleepHours': '6.5',
        'sleepQuality': 'fair',
        'dietType': 'omnivore',
        'stressLevel': '7',
        'smokingStatus': 'former',
        'alcoholConsumption': 'occasionally',
        'bloodPressure': 'elevated',
        'cholesterolLevels': 'borderline',
        'bloodSugarLevel': '101-125',
        'familyHistory': ['heart-disease', 'diabetes'],
        'existingConditions': ['none']
    }
    
    # Get enhanced predictions
    predictions = predict_enhanced_health_risks(example_user)
    
    print("\n" + "="*50)
    print("ENHANCED HEALTH RISK PREDICTIONS")
    print("="*50)
    
    for category, result in predictions.items():
        print(f"\n{category.upper()} RISK: {result['risk']}%")
        print(f"Model Confidence: {result.get('confidence', 0.8):.3f}")
        print("Key Recommendations:")
        for i, factor in enumerate(result['factors'][:3], 1):
            print(f"  {i}. {factor['name']}: {factor['suggestion']}")
