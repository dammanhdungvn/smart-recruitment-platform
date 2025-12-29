# Tài Liệu Thiết Kế AI/ML - Hệ Thống Tuyển Dụng Thông Minh

## 📋 Mục Lục
1. [Tổng Quan](#1-tổng-quan)
2. [Công Nghệ Sử Dụng](#2-công-nghệ-sử-dụng)
3. [Cấu Trúc Thư Mục](#3-cấu-trúc-thư-mục)
4. [Dataset](#4-dataset)
5. [Mô Hình ML](#5-mô-hình-ml)
6. [API Service](#6-api-service)
7. [Training Pipeline](#7-training-pipeline)
8. [Setup và Triển Khai](#8-setup-và-triển-khai)

---

## 1. Tổng Quan

AI Service cung cấp các tính năng Machine Learning cho hệ thống tuyển dụng, bao gồm phân loại CV, gợi ý công việc, xếp hạng ứng viên và dự đoán mức lương.

### 1.1. Các Tính Năng AI
1. **Resume Classification**: Phân loại CV vào 24 lĩnh vực nghề nghiệp
2. **Job Recommendation**: Gợi ý công việc phù hợp cho ứng viên
3. **Candidate Ranking**: Xếp hạng ứng viên phù hợp với công việc
4. **Salary Prediction**: Dự đoán mức lương dựa trên thông tin công việc
5. **Resume Parsing**: Trích xuất thông tin từ CV (NLP)

---

## 2. Công Nghệ Sử Dụng

```json
{
  "language": "Python 3.9+",
  "framework": "Flask hoặc FastAPI",
  "ml_libraries": [
    "scikit-learn",
    "pandas",
    "numpy",
    "nltk",
    "spacy",
    "joblib"
  ],
  "nlp": "spaCy hoặc NLTK",
  "vectorization": "TF-IDF, Word2Vec",
  "deployment": "Flask API"
}
```

### 2.1. Dependencies

```txt
# requirements.txt
flask==3.0.0
flask-cors==4.0.0
pandas==2.1.4
numpy==1.26.2
scikit-learn==1.3.2
nltk==3.8.1
spacy==3.7.2
joblib==1.3.2
python-dotenv==1.0.0
gunicorn==21.2.0

# Optional
fastapi==0.108.0
uvicorn==0.25.0
```

---

## 3. Cấu Trúc Thư Mục

```
ai/
├── data/
│   ├── resumes.csv                 # Preprocessed resume data
│   ├── jobs.csv                    # Preprocessed job data
│   ├── cv_files/                   # PDF files (if needed)
│   └── models/                     # Saved models
│       ├── resume_classifier.pkl
│       ├── tfidf_vectorizer.pkl
│       └── job_recommender.pkl
├── models/
│   ├── __init__.py
│   ├── resume_classifier.py        # Resume classification model
│   ├── job_recommender.py          # Job recommendation model
│   ├── candidate_ranker.py         # Candidate ranking model
│   └── salary_predictor.py         # Salary prediction model
├── services/
│   ├── __init__.py
│   ├── resume_parser.py            # Resume parsing (NLP)
│   └── preprocessor.py             # Text preprocessing
├── utils/
│   ├── __init__.py
│   └── helpers.py                  # Utility functions
├── notebooks/
│   ├── 01_data_exploration.ipynb
│   ├── 02_resume_classification.ipynb
│   ├── 03_job_recommendation.ipynb
│   └── 04_salary_prediction.ipynb
├── tests/
│   └── test_models.py
├── app.py                          # Flask API application
├── train.py                        # Training script
├── requirements.txt
├── .env
└── README.md
```

---

## 4. Dataset

### 4.1. Resume Data (Đã Preprocessed)

**File**: `data/resumes.csv`  
**Số lượng**: 2,484 hồ sơ

**Cấu trúc**:
```
ID,Resume_str,Resume_html,Category
```

**24 Categories**:
- HR
- ENGINEERING
- INFORMATION-TECHNOLOGY
- FINANCE
- HEALTHCARE
- SALES
- BUSINESS-DEVELOPMENT
- TEACHER
- ACCOUNTANT
- DESIGNER
- CHEF
- CONSULTANT
- DIGITAL-MEDIA
- AVIATION
- BANKING
- CONSTRUCTION
- ADVOCATE
- FITNESS
- PUBLIC-RELATIONS
- AGRICULTURE
- APPAREL
- ARTS
- AUTOMOBILE
- BPO

### 4.2. Job Data (Đã Preprocessed)

**File**: `data/jobs.csv`  
**Số lượng**: 85,470 tin tuyển dụng

**Cấu trúc**:
```csv
id,job_title,job_type,position_level,city,experience,skills,job_fields,salary,salary_min,salary_max,unit
```

**Lưu ý**: Dataset đã được preprocessed sẵn, không cần xử lý dữ liệu thô (raw data).

---

## 5. Mô Hình ML

### 5.1. Resume Classification Model

**Mục đích**: Phân loại CV vào 24 lĩnh vực nghề nghiệp

#### Implementation

```python
# models/resume_classifier.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix
import joblib
import re

class ResumeClassifier:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 2),
            stop_words='english',
            min_df=2
        )
        self.model = LogisticRegression(
            max_iter=1000,
            C=1.0,
            random_state=42,
            multi_class='multinomial'
        )
        self.categories = None
    
    def preprocess_text(self, text):
        """Preprocess resume text"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove URLs
        text = re.sub(r'http\S+|www\S+', '', text)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Remove special characters but keep spaces
        text = re.sub(r'[^a-z\s]', ' ', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        return text
    
    def train(self, df):
        """Train the classifier"""
        print("Preprocessing texts...")
        df['Resume_clean'] = df['Resume_str'].apply(self.preprocess_text)
        
        X = df['Resume_clean']
        y = df['Category']
        
        # Store categories
        self.categories = sorted(y.unique().tolist())
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        
        print("Vectorizing texts...")
        X_train_vec = self.vectorizer.fit_transform(X_train)
        X_test_vec = self.vectorizer.transform(X_test)
        
        print("Training model...")
        self.model.fit(X_train_vec, y_train)
        
        # Evaluate
        y_pred = self.model.predict(X_test_vec)
        accuracy = (y_pred == y_test).mean()
        
        print(f"\nAccuracy: {accuracy:.4f}")
        print("\nClassification Report:")
        print(classification_report(y_test, y_pred))
        
        return accuracy
    
    def predict(self, resume_text):
        """Predict category and confidence for a resume"""
        # Preprocess
        clean_text = self.preprocess_text(resume_text)
        
        # Vectorize
        text_vec = self.vectorizer.transform([clean_text])
        
        # Predict
        prediction = self.model.predict(text_vec)[0]
        probabilities = self.model.predict_proba(text_vec)[0]
        confidence = max(probabilities)
        
        return {
            'category': prediction,
            'confidence': float(confidence),
            'all_probabilities': {
                cat: float(prob) 
                for cat, prob in zip(self.categories, probabilities)
            }
        }
    
    def save(self, path='data/models/resume_classifier.pkl'):
        """Save the model"""
        joblib.dump({
            'vectorizer': self.vectorizer,
            'model': self.model,
            'categories': self.categories
        }, path)
        print(f"Model saved to {path}")
    
    def load(self, path='data/models/resume_classifier.pkl'):
        """Load the model"""
        data = joblib.load(path)
        self.vectorizer = data['vectorizer']
        self.model = data['model']
        self.categories = data['categories']
        print(f"Model loaded from {path}")
```

---

### 5.2. Job Recommendation Model

**Mục đích**: Gợi ý công việc phù hợp cho ứng viên

#### Implementation

```python
# models/job_recommender.py
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib

class JobRecommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=3000,
            ngram_range=(1, 2),
            stop_words='english'
        )
        self.jobs_df = None
        self.job_vectors = None
    
    def load_jobs(self, jobs_csv_path='data/jobs.csv'):
        """Load preprocessed job data"""
        self.jobs_df = pd.read_csv(jobs_csv_path)
        print(f"Loaded {len(self.jobs_df)} jobs")
    
    def fit(self):
        """Fit the recommender with job data"""
        if self.jobs_df is None:
            raise ValueError("Load jobs data first using load_jobs()")
        
        # Combine job text fields
        job_texts = (
            self.jobs_df['job_title'].fillna('') + ' ' +
            self.jobs_df['job_fields'].fillna('') + ' ' +
            self.jobs_df['skills'].fillna('')
        )
        
        print("Vectorizing job descriptions...")
        self.job_vectors = self.vectorizer.fit_transform(job_texts)
        print("Job recommender fitted successfully")
    
    def recommend(self, resume_text, candidate_skills='', n=10):
        """Recommend top N jobs for a candidate"""
        if self.job_vectors is None:
            raise ValueError("Fit the model first using fit()")
        
        # Combine resume text and skills
        candidate_text = resume_text + ' ' + candidate_skills
        
        # Vectorize candidate profile
        candidate_vector = self.vectorizer.transform([candidate_text])
        
        # Calculate cosine similarities
        similarities = cosine_similarity(candidate_vector, self.job_vectors)[0]
        
        # Get top N indices
        top_indices = similarities.argsort()[-n:][::-1]
        
        # Prepare recommendations
        recommendations = []
        for idx in top_indices:
            job = self.jobs_df.iloc[idx]
            similarity_score = similarities[idx]
            
            # Calculate skill match
            skill_match = self._calculate_skill_match(
                candidate_skills, 
                job.get('skills', '')
            )
            
            # Weighted final score
            final_score = 0.7 * similarity_score + 0.3 * skill_match
            
            recommendations.append({
                'job_id': int(job.get('id', idx)),
                'job_title': job.get('job_title', ''),
                'company': job.get('company', 'N/A'),
                'city': job.get('city', ''),
                'salary_min': float(job.get('salary_min', 0)) if pd.notna(job.get('salary_min')) else None,
                'salary_max': float(job.get('salary_max', 0)) if pd.notna(job.get('salary_max')) else None,
                'score': float(final_score),
                'text_similarity': float(similarity_score),
                'skill_match': float(skill_match)
            })
        
        return recommendations
    
    def _calculate_skill_match(self, candidate_skills, job_skills):
        """Calculate skill match percentage"""
        if pd.isna(job_skills) or not job_skills:
            return 0.5  # Default score if no skills specified
        
        if not candidate_skills:
            return 0.0
        
        # Convert to sets
        candidate_set = set(str(candidate_skills).lower().split(','))
        job_set = set(str(job_skills).lower().split(','))
        
        # Clean whitespace
        candidate_set = {s.strip() for s in candidate_set if s.strip()}
        job_set = {s.strip() for s in job_set if s.strip()}
        
        if not job_set:
            return 0.5
        
        # Calculate Jaccard similarity
        intersection = candidate_set.intersection(job_set)
        union = candidate_set.union(job_set)
        
        return len(intersection) / len(union) if union else 0.0
    
    def save(self, path='data/models/job_recommender.pkl'):
        """Save the model"""
        joblib.dump({
            'vectorizer': self.vectorizer,
            'jobs_df': self.jobs_df,
            'job_vectors': self.job_vectors
        }, path)
        print(f"Job recommender saved to {path}")
    
    def load(self, path='data/models/job_recommender.pkl'):
        """Load the model"""
        data = joblib.load(path)
        self.vectorizer = data['vectorizer']
        self.jobs_df = data['jobs_df']
        self.job_vectors = data['job_vectors']
        print(f"Job recommender loaded from {path}")
```

---

### 5.3. Candidate Ranking Model

```python
# models/candidate_ranker.py
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

class CandidateRanker:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=3000,
            ngram_range=(1, 2),
            stop_words='english'
        )
    
    def rank_candidates(self, job_description, job_skills, candidates_data, n=50):
        """
        Rank candidates for a specific job
        
        Args:
            job_description: Job description text
            job_skills: Required skills (comma-separated)
            candidates_data: List of dicts with 'id', 'name', 'resume_text', 'skills'
            n: Number of top candidates to return
        
        Returns:
            List of ranked candidates with scores
        """
        if not candidates_data:
            return []
        
        # Create DataFrame
        candidates_df = pd.DataFrame(candidates_data)
        
        # Vectorize job description
        job_vector = self.vectorizer.fit_transform([job_description])
        
        # Vectorize candidate resumes
        resume_texts = candidates_df['resume_text'].fillna('')
        resume_vectors = self.vectorizer.transform(resume_texts)
        
        # Calculate text similarities
        similarities = cosine_similarity(job_vector, resume_vectors)[0]
        
        # Rank candidates
        results = []
        for idx, similarity in enumerate(similarities):
            candidate = candidates_df.iloc[idx]
            
            # Calculate skill match
            skill_match = self._calculate_skill_match(
                job_skills,
                candidate.get('skills', '')
            )
            
            # Weighted score
            final_score = 0.6 * similarity + 0.4 * skill_match
            
            results.append({
                'candidate_id': int(candidate['id']),
                'name': candidate.get('name', 'N/A'),
                'email': candidate.get('email', ''),
                'score': float(final_score),
                'text_similarity': float(similarity),
                'skill_match': float(skill_match),
                'experience_years': candidate.get('experience_years', 0)
            })
        
        # Sort by score descending
        results.sort(key=lambda x: x['score'], reverse=True)
        
        return results[:n]
    
    def _calculate_skill_match(self, job_skills, candidate_skills):
        """Calculate skill match percentage"""
        if pd.isna(job_skills) or not job_skills:
            return 0.5
        
        if pd.isna(candidate_skills) or not candidate_skills:
            return 0.0
        
        job_set = set(str(job_skills).lower().split(','))
        candidate_set = set(str(candidate_skills).lower().split(','))
        
        job_set = {s.strip() for s in job_set if s.strip()}
        candidate_set = {s.strip() for s in candidate_set if s.strip()}
        
        if not job_set:
            return 0.5
        
        intersection = job_set.intersection(candidate_set)
        return len(intersection) / len(job_set)
```

---

### 5.4. Salary Prediction Model

```python
# models/salary_predictor.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
import joblib

class SalaryPredictor:
    def __init__(self):
        self.model_min = RandomForestRegressor(n_estimators=100, random_state=42)
        self.model_max = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.encoders = {}
    
    def train(self, jobs_df):
        """Train salary prediction models"""
        # Prepare features
        df = jobs_df.copy()
        
        # Remove rows with no salary data
        df = df.dropna(subset=['salary_min', 'salary_max'])
        
        # Feature engineering
        features = self._prepare_features(df, is_training=True)
        
        # Targets
        y_min = df['salary_min'].values
        y_max = df['salary_max'].values
        
        # Split data
        X_train, X_test, y_min_train, y_min_test, y_max_train, y_max_test = train_test_split(
            features, y_min, y_max, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train models
        print("Training salary_min predictor...")
        self.model_min.fit(X_train_scaled, y_min_train)
        
        print("Training salary_max predictor...")
        self.model_max.fit(X_train_scaled, y_max_train)
        
        # Evaluate
        from sklearn.metrics import mean_absolute_error, r2_score
        
        y_min_pred = self.model_min.predict(X_test_scaled)
        y_max_pred = self.model_max.predict(X_test_scaled)
        
        print(f"\nSalary Min - MAE: {mean_absolute_error(y_min_test, y_min_pred):,.0f}")
        print(f"Salary Min - R2: {r2_score(y_min_test, y_min_pred):.4f}")
        print(f"Salary Max - MAE: {mean_absolute_error(y_max_test, y_max_pred):,.0f}")
        print(f"Salary Max - R2: {r2_score(y_max_test, y_max_pred):.4f}")
    
    def predict(self, job_data):
        """
        Predict salary range for a job
        
        Args:
            job_data: dict with keys: 'job_title', 'city', 'position_level', 
                     'experience', 'skills'
        
        Returns:
            dict with 'salary_min' and 'salary_max'
        """
        # Convert to DataFrame
        df = pd.DataFrame([job_data])
        
        # Prepare features
        features = self._prepare_features(df, is_training=False)
        
        # Scale
        features_scaled = self.scaler.transform(features)
        
        # Predict
        salary_min = self.model_min.predict(features_scaled)[0]
        salary_max = self.model_max.predict(features_scaled)[0]
        
        return {
            'salary_min': max(0, float(salary_min)),
            'salary_max': max(0, float(salary_max))
        }
    
    def _prepare_features(self, df, is_training=True):
        """Prepare features for model"""
        features = pd.DataFrame()
        
        # Encode categorical features
        categorical_cols = ['job_title', 'city', 'position_level']
        
        for col in categorical_cols:
            if col in df.columns:
                if is_training:
                    self.encoders[col] = LabelEncoder()
                    features[col] = self.encoders[col].fit_transform(df[col].fillna('unknown'))
                else:
                    # Handle unseen categories
                    values = df[col].fillna('unknown')
                    features[col] = values.map(
                        lambda x: self.encoders[col].transform([x])[0] 
                        if x in self.encoders[col].classes_ 
                        else -1
                    )
        
        # Extract experience years
        if 'experience' in df.columns:
            features['experience_years'] = df['experience'].apply(self._extract_years)
        
        # Count skills
        if 'skills' in df.columns:
            features['skill_count'] = df['skills'].fillna('').apply(
                lambda x: len(str(x).split(',')) if x else 0
            )
        
        return features
    
    def _extract_years(self, exp_str):
        """Extract years from experience string"""
        if pd.isna(exp_str):
            return 0
        
        import re
        matches = re.findall(r'(\d+)', str(exp_str))
        return int(matches[0]) if matches else 0
    
    def save(self, path='data/models/salary_predictor.pkl'):
        """Save models"""
        joblib.dump({
            'model_min': self.model_min,
            'model_max': self.model_max,
            'scaler': self.scaler,
            'encoders': self.encoders
        }, path)
        print(f"Salary predictor saved to {path}")
    
    def load(self, path='data/models/salary_predictor.pkl'):
        """Load models"""
        data = joblib.load(path)
        self.model_min = data['model_min']
        self.model_max = data['model_max']
        self.scaler = data['scaler']
        self.encoders = data['encoders']
        print(f"Salary predictor loaded from {path}")
```

---

## 6. API Service

```python
# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load models
from models.resume_classifier import ResumeClassifier
from models.job_recommender import JobRecommender
from models.candidate_ranker import CandidateRanker
from models.salary_predictor import SalaryPredictor
from services.resume_parser import ResumeParser

load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize models
print("Loading models...")

resume_classifier = ResumeClassifier()
resume_classifier.load('data/models/resume_classifier.pkl')

job_recommender = JobRecommender()
job_recommender.load('data/models/job_recommender.pkl')

candidate_ranker = CandidateRanker()

salary_predictor = SalaryPredictor()
salary_predictor.load('data/models/salary_predictor.pkl')

resume_parser = ResumeParser()

print("Models loaded successfully!")

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'AI Service'}), 200

@app.route('/classify-resume', methods=['POST'])
def classify_resume():
    """Classify resume into category"""
    try:
        data = request.json
        resume_text = data.get('resume_text', '')
        
        if not resume_text:
            return jsonify({'error': 'resume_text is required'}), 400
        
        result = resume_classifier.predict(resume_text)
        
        return jsonify({
            'success': True,
            'category': result['category'],
            'confidence': result['confidence'],
            'all_probabilities': result['all_probabilities']
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/recommend-jobs', methods=['POST'])
def recommend_jobs():
    """Recommend jobs for a candidate"""
    try:
        data = request.json
        resume_text = data.get('resume_text', '')
        skills = data.get('skills', '')
        n = data.get('n', 10)
        
        if not resume_text:
            return jsonify({'error': 'resume_text is required'}), 400
        
        recommendations = job_recommender.recommend(resume_text, skills, n)
        
        return jsonify({
            'success': True,
            'recommendations': recommendations,
            'count': len(recommendations)
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/rank-candidates', methods=['POST'])
def rank_candidates():
    """Rank candidates for a job"""
    try:
        data = request.json
        job_description = data.get('job_description', '')
        job_skills = data.get('job_skills', '')
        candidates = data.get('candidates', [])
        n = data.get('n', 50)
        
        if not job_description or not candidates:
            return jsonify({'error': 'job_description and candidates are required'}), 400
        
        rankings = candidate_ranker.rank_candidates(
            job_description, job_skills, candidates, n
        )
        
        return jsonify({
            'success': True,
            'rankings': rankings,
            'count': len(rankings)
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/predict-salary', methods=['POST'])
def predict_salary():
    """Predict salary range for a job"""
    try:
        data = request.json
        job_data = {
            'job_title': data.get('job_title', ''),
            'city': data.get('city', ''),
            'position_level': data.get('position_level', ''),
            'experience': data.get('experience', ''),
            'skills': data.get('skills', '')
        }
        
        result = salary_predictor.predict(job_data)
        
        return jsonify({
            'success': True,
            'salary_min': result['salary_min'],
            'salary_max': result['salary_max'],
            'currency': 'VND'
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/parse-resume', methods=['POST'])
def parse_resume():
    """Parse resume and extract information"""
    try:
        data = request.json
        resume_text = data.get('resume_text', '')
        
        if not resume_text:
            return jsonify({'error': 'resume_text is required'}), 400
        
        parsed_data = resume_parser.parse(resume_text)
        
        return jsonify({
            'success': True,
            'data': parsed_data
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=False)
```

---

## 7. Training Pipeline

```python
# train.py
import pandas as pd
import os
from models.resume_classifier import ResumeClassifier
from models.job_recommender import JobRecommender
from models.salary_predictor import SalaryPredictor

def train_all():
    """Train all models"""
    
    # Create models directory if not exists
    os.makedirs('data/models', exist_ok=True)
    
    print("=" * 60)
    print("TRAINING RESUME CLASSIFIER")
    print("=" * 60)
    
    # Load preprocessed resume data
    resumes_df = pd.read_csv('data/resumes.csv')
    print(f"Loaded {len(resumes_df)} resumes")
    
    classifier = ResumeClassifier()
    accuracy = classifier.train(resumes_df)
    classifier.save('data/models/resume_classifier.pkl')
    
    print("\n" + "=" * 60)
    print("TRAINING JOB RECOMMENDER")
    print("=" * 60)
    
    # Load preprocessed job data
    recommender = JobRecommender()
    recommender.load_jobs('data/jobs.csv')
    recommender.fit()
    recommender.save('data/models/job_recommender.pkl')
    
    print("\n" + "=" * 60)
    print("TRAINING SALARY PREDICTOR")
    print("=" * 60)
    
    jobs_df = pd.read_csv('data/jobs.csv')
    print(f"Loaded {len(jobs_df)} jobs")
    
    predictor = SalaryPredictor()
    predictor.train(jobs_df)
    predictor.save('data/models/salary_predictor.pkl')
    
    print("\n" + "=" * 60)
    print("ALL MODELS TRAINED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Train ML models')
    parser.add_argument('--model', type=str, choices=['resume_classifier', 'job_recommender', 'salary_predictor', 'all'],
                        default='all', help='Which model to train')
    
    args = parser.parse_args()
    
    if args.model == 'all':
        train_all()
    else:
        print(f"Training {args.model} only...")
        # Add individual model training logic here
```

---

## 8. Setup và Triển Khai

### 8.1. Environment Variables

```env
# .env
FLASK_ENV=development
FLASK_PORT=5001
MODEL_PATH=./data/models
DATA_PATH=./data
```

### 8.2. Installation Steps

```bash
# 1. Navigate to AI directory
cd ai

# 2. Create virtual environment
python -m venv venv

# On Windows
venv\Scripts\activate

# On Linux/Mac
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Download NLTK data (if using NLTK)
python -c "import nltk; nltk.download('stopwords'); nltk.download('punkt'); nltk.download('wordnet')"

# 5. Download spaCy model (if using spaCy)
python -m spacy download en_core_web_sm

# 6. Verify data files exist
# Ensure data/resumes.csv and data/jobs.csv are present

# 7. Train models (first time only)
python train.py --model all

# 8. Start the service
python app.py
```

### 8.3. Testing the API

```bash
# Test health endpoint
curl http://localhost:5001/health

# Test resume classification
curl -X POST http://localhost:5001/classify-resume \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Experienced software engineer with 5 years of experience in Python, Java, and React. Built multiple web applications..."
  }'

# Test job recommendations
curl -X POST http://localhost:5001/recommend-jobs \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "Software engineer with React, Node.js experience",
    "skills": "React, Node.js, MongoDB",
    "n": 5
  }'
```

### 8.4. Resume Parser Service

```python
# services/resume_parser.py
import re
import spacy

class ResumeParser:
    def __init__(self):
        try:
            self.nlp = spacy.load('en_core_web_sm')
        except:
            print("Warning: spaCy model not loaded. Install with: python -m spacy download en_core_web_sm")
            self.nlp = None
    
    def parse(self, resume_text):
        """Parse resume and extract structured information"""
        
        result = {
            'personal_info': self._extract_personal_info(resume_text),
            'skills': self._extract_skills(resume_text),
            'education': self._extract_education(resume_text),
            'experience': self._extract_experience(resume_text)
        }
        
        return result
    
    def _extract_personal_info(self, text):
        """Extract personal information"""
        return {
            'email': self._extract_email(text),
            'phone': self._extract_phone(text),
            'linkedin': self._extract_linkedin(text)
        }
    
    def _extract_email(self, text):
        """Extract email address"""
        pattern = r'[\w\.-]+@[\w\.-]+\.\w+'
        matches = re.findall(pattern, text)
        return matches[0] if matches else None
    
    def _extract_phone(self, text):
        """Extract phone number"""
        # Support multiple formats
        patterns = [
            r'\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',  # US format
            r'\+?\d{10,12}',  # Simple format
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text)
            if matches:
                return matches[0]
        return None
    
    def _extract_linkedin(self, text):
        """Extract LinkedIn URL"""
        pattern = r'(?:https?://)?(?:www\.)?linkedin\.com/in/[\w-]+'
        matches = re.findall(pattern, text)
        return matches[0] if matches else None
    
    def _extract_skills(self, text):
        """Extract technical skills"""
        # Common technical skills database
        skills_db = [
            # Programming Languages
            'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
            'swift', 'kotlin', 'scala', 'r', 'matlab',
            
            # Web Technologies
            'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
            'spring', 'asp.net', 'jquery', 'bootstrap', 'tailwind',
            
            # Databases
            'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'sql server', 'sqlite',
            'cassandra', 'elasticsearch',
            
            # Cloud & DevOps
            'aws', 'azure', 'google cloud', 'docker', 'kubernetes', 'jenkins', 'gitlab',
            'terraform', 'ansible',
            
            # Data Science & ML
            'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
            'pandas', 'numpy', 'data analysis', 'statistics',
            
            # Others
            'git', 'agile', 'scrum', 'rest api', 'graphql', 'microservices',
            'linux', 'unix', 'networking'
        ]
        
        text_lower = text.lower()
        found_skills = []
        
        for skill in skills_db:
            if skill in text_lower:
                found_skills.append(skill)
        
        return list(set(found_skills))  # Remove duplicates
    
    def _extract_education(self, text):
        """Extract education information"""
        education = []
        
        # Common degree keywords
        degrees = ['bachelor', 'master', 'phd', 'doctorate', 'mba', 'b.s.', 'm.s.', 'b.a.', 'm.a.']
        
        lines = text.split('\n')
        for i, line in enumerate(lines):
            line_lower = line.lower()
            for degree in degrees:
                if degree in line_lower:
                    education.append({
                        'line': line.strip(),
                        'type': degree
                    })
                    break
        
        return education
    
    def _extract_experience(self, text):
        """Extract work experience"""
        # This is simplified - in production, use more sophisticated NLP
        experience = []
        
        # Look for common experience keywords
        keywords = ['experience', 'worked', 'position', 'role', 'employment']
        
        if self.nlp:
            doc = self.nlp(text)
            
            # Extract organizations
            orgs = [ent.text for ent in doc.ents if ent.label_ == 'ORG']
            
            # Extract dates
            dates = [ent.text for ent in doc.ents if ent.label_ == 'DATE']
            
            if orgs:
                experience.append({
                    'organizations': orgs[:5],  # Limit to 5
                    'dates': dates[:5]
                })
        
        return experience
```

### 8.5. Model Performance Metrics

#### Resume Classification
```
Expected Performance:
- Accuracy: 85-92%
- Precision: 80-90% per class
- Recall: 80-90% per class
- F1-Score: 82-90% per class
```

#### Job Recommendation
```
Evaluation Metrics:
- Cosine Similarity Score: 0.3-0.8
- Skill Match: 0-100%
- Final Weighted Score: 0-1.0

Quality Metrics:
- Top-10 Precision@10: Manual evaluation
- User Satisfaction: Feedback-based
```

#### Salary Prediction
```
Expected Performance:
- MAE (Mean Absolute Error): 2-5 million VND
- R² Score: 0.6-0.8
- RMSE: 3-7 million VND
```

### 8.6. Model Retraining

```python
# retrain.py
import schedule
import time
from train import train_all

def scheduled_retraining():
    """Retrain models periodically"""
    print("Starting scheduled retraining...")
    train_all()
    print("Retraining completed!")

# Schedule retraining every month
schedule.every().month.do(scheduled_retraining)

# Or retrain weekly
# schedule.every().week.do(scheduled_retraining)

if __name__ == '__main__':
    print("Model retraining scheduler started...")
    while True:
        schedule.run_pending()
        time.sleep(3600)  # Check every hour
```

### 8.7. Error Handling & Fallbacks

```python
# Add to app.py

from functools import wraps

def handle_ml_errors(f):
    """Decorator for handling ML service errors"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            print(f"ML Error in {f.__name__}: {str(e)}")
            return jsonify({
                'success': False,
                'error': 'AI service temporarily unavailable',
                'message': 'Please try again later',
                'fallback': True
            }), 503
    return decorated_function

# Apply to routes
@app.route('/classify-resume', methods=['POST'])
@handle_ml_errors
def classify_resume():
    # ... existing code
```

### 8.8. Logging

```python
# Add to app.py
import logging
from logging.handlers import RotatingFileHandler
import os

# Setup logging
if not os.path.exists('logs'):
    os.mkdir('logs')

file_handler = RotatingFileHandler(
    'logs/ai_service.log',
    maxBytes=10240000,  # 10MB
    backupCount=10
)

file_handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
))

file_handler.setLevel(logging.INFO)
app.logger.addHandler(file_handler)
app.logger.setLevel(logging.INFO)
app.logger.info('AI Service startup')

# Use in routes
@app.route('/classify-resume', methods=['POST'])
def classify_resume():
    app.logger.info('Resume classification request received')
    # ... rest of code
```

---

## 9. Deployment Considerations

### 9.1. Production Deployment

```bash
# Use Gunicorn for production
gunicorn -w 4 -b 0.0.0.0:5001 app:app

# Or with more options
gunicorn -w 4 -b 0.0.0.0:5001 --timeout 120 --log-level info app:app
```

### 9.2. Docker Deployment (Optional)

```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download spaCy model
RUN python -m spacy download en_core_web_sm

COPY . .

EXPOSE 5001

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5001", "--timeout", "120", "app:app"]
```

### 9.3. Performance Optimization

1. **Model Caching**: Models loaded once at startup
2. **Request Batching**: Process multiple requests together (advanced)
3. **Async Processing**: Use FastAPI with async/await for better performance
4. **Response Caching**: Cache frequent requests (Redis)

### 9.4. Monitoring

```python
# Add basic metrics endpoint
@app.route('/metrics', methods=['GET'])
def metrics():
    """Service metrics"""
    return jsonify({
        'total_requests': request_count,
        'uptime': get_uptime(),
        'model_versions': {
            'resume_classifier': '1.0',
            'job_recommender': '1.0',
            'salary_predictor': '1.0'
        }
    })
```

---

## 10. Best Practices

1. **Data Quality**: Ensure preprocessed data is clean and consistent
2. **Model Versioning**: Keep track of model versions and performance
3. **Error Handling**: Graceful degradation when ML fails
4. **Logging**: Log all predictions for monitoring and debugging
5. **Testing**: Test models with edge cases
6. **Documentation**: Keep API documentation updated
7. **Security**: Validate all inputs, prevent injection attacks
8. **Performance**: Monitor response times and optimize bottlenecks

---

## 11. Troubleshooting

### Common Issues

**Issue**: Model loading fails
```
Solution: Check if model files exist in data/models/
         Retrain models using: python train.py
```

**Issue**: Low accuracy
```
Solution: Check data quality
         Retrain with more data
         Tune hyperparameters
```

**Issue**: Slow inference
```
Solution: Reduce model complexity
         Use smaller vectorizer (max_features)
         Implement caching
```

**Issue**: Memory errors
```
Solution: Reduce batch size
         Use smaller models
         Increase server memory
```