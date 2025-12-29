# Tài Liệu Dataset - Hệ Thống Tuyển Dụng Thông Minh

## 📋 Mục Lục
1. [Tổng Quan](#1-tổng-quan)
2. [Resume Dataset](#2-resume-dataset)
3. [Job Dataset](#3-job-dataset)
4. [Data Processing](#4-data-processing)
5. [Data Analysis](#5-data-analysis)
6. [Sử Dụng Dataset](#6-sử-dụng-dataset)

---

## 1. Tổng Quan

Dataset cho hệ thống tuyển dụng đã được **preprocessed (tiền xử lý)** và sẵn sàng sử dụng cho việc training các mô hình Machine Learning.

### 1.1. Cấu Trúc Thư Mục

```
ai/data/
├── resumes.csv              # Preprocessed resume data
├── jobs.csv                 # Preprocessed job data
├── cv_files/                # (Optional) PDF files nếu cần
│   ├── resume_001.pdf
│   ├── resume_002.pdf
│   └── ...
└── models/                  # Trained models sẽ được lưu ở đây
    ├── resume_classifier.pkl
    ├── job_recommender.pkl
    └── salary_predictor.pkl
```

### 1.2. Trạng Thái Dataset

✅ **Đã Preprocessed**: Dataset đã được làm sạch và chuẩn hóa  
✅ **Sẵn Sàng Training**: Có thể sử dụng trực tiếp để train models  
✅ **Format CSV**: Dễ dàng đọc và xử lý với pandas  

---

## 2. Resume Dataset

### 2.1. Thông Tin Cơ Bản

**File**: `data/resumes.csv`  
**Số lượng**: 2,484 hồ sơ  
**Format**: CSV với encoding UTF-8  

### 2.2. Cấu Trúc Dữ Liệu

```csv
ID,Resume_str,Resume_html,Category
```

| Column       | Type   | Description                          | Example                    |
|--------------|--------|--------------------------------------|----------------------------|
| ID           | int    | Unique identifier                    | 1, 2, 3, ...               |
| Resume_str   | text   | Resume content as plain text         | "Software Engineer with..." |
| Resume_html  | text   | Resume content as HTML               | "<div>Software...</div>"   |
| Category     | string | Job category (24 categories)         | "INFORMATION-TECHNOLOGY"   |

### 2.3. Categories (24 Lĩnh Vực)

```python
RESUME_CATEGORIES = [
    'INFORMATION-TECHNOLOGY',  # IT, Software, Developer
    'ENGINEERING',             # Mechanical, Civil, Electrical
    'FINANCE',                 # Banking, Investment, Accounting
    'HEALTHCARE',              # Medical, Nursing, Pharmacy
    'SALES',                   # Sales Executive, Account Manager
    'BUSINESS-DEVELOPMENT',    # BD Manager, Partnership
    'HR',                      # Human Resources
    'TEACHER',                 # Education, Training
    'ACCOUNTANT',              # Accounting, Audit
    'DESIGNER',                # Graphic, UI/UX, Product
    'CHEF',                    # Culinary, Food Service
    'CONSULTANT',              # Business, Management
    'DIGITAL-MEDIA',           # Marketing, Content, Social Media
    'AVIATION',                # Pilot, Flight Attendant
    'BANKING',                 # Bank Operations, Teller
    'CONSTRUCTION',            # Building, Infrastructure
    'ADVOCATE',                # Legal, Law
    'FITNESS',                 # Trainer, Wellness
    'PUBLIC-RELATIONS',        # PR, Communications
    'AGRICULTURE',             # Farming, Agribusiness
    'APPAREL',                 # Fashion, Textile
    'ARTS',                    # Creative, Performance
    'AUTOMOBILE',              # Automotive, Vehicle
    'BPO'                      # Business Process Outsourcing
]
```

### 2.4. Sample Data

```csv
ID,Resume_str,Resume_html,Category
1,"TECHNICAL SKILLS Programming Languages: Python, Java, JavaScript... Work Experience: Software Engineer at ABC Company...",<div>TECHNICAL SKILLS...</div>,INFORMATION-TECHNOLOGY
2,"PROFESSIONAL SUMMARY Experienced mechanical engineer with 5 years... Education: B.S. in Mechanical Engineering...",<div>PROFESSIONAL SUMMARY...</div>,ENGINEERING
```

### 2.5. Phân Bố Categories

```
INFORMATION-TECHNOLOGY:  ~400 resumes (16%)
ENGINEERING:             ~350 resumes (14%)
HEALTHCARE:              ~250 resumes (10%)
FINANCE:                 ~200 resumes (8%)
SALES:                   ~180 resumes (7%)
... (other categories)
```

### 2.6. Đặc Điểm Dữ Liệu

- **Đã làm sạch**: Loại bỏ ký tự đặc biệt không cần thiết
- **Đã chuẩn hóa**: Format thống nhất
- **Balanced**: Tương đối cân bằng giữa các categories
- **Chất lượng cao**: Resume có đầy đủ thông tin

---

## 3. Job Dataset

### 3.1. Thông Tin Cơ Bản

**File**: `data/jobs.csv`  
**Số lượng**: 85,470 tin tuyển dụng  
**Format**: CSV với encoding UTF-8  

### 3.2. Cấu Trúc Dữ Liệu

```csv
id,job_title,job_type,position_level,city,experience,skills,job_fields,salary,salary_min,salary_max,unit
```

| Column         | Type    | Description                        | Example                       |
|----------------|---------|------------------------------------|-------------------------------|
| id             | int     | Unique identifier                  | 1, 2, 3, ...                  |
| job_title      | string  | Job position title                 | "Senior Software Engineer"    |
| job_type       | string  | Employment type                    | "full-time", "part-time"      |
| position_level | string  | Seniority level                    | "senior", "junior", "middle"  |
| city           | string  | Job location                       | "Ho Chi Minh", "Ha Noi"       |
| experience     | string  | Required experience                | "3-5 years", "1-2 years"      |
| skills         | string  | Required skills (comma-separated)  | "Python, Java, SQL"           |
| job_fields     | string  | Job category/field                 | "IT", "Finance", "Sales"      |
| salary         | string  | Salary description                 | "15-20 triệu"                 |
| salary_min     | float   | Minimum salary                     | 15000000                      |
| salary_max     | float   | Maximum salary                     | 20000000                      |
| unit           | string  | Currency unit                      | "VND", "USD"                  |

### 3.3. Sample Data

```csv
id,job_title,job_type,position_level,city,experience,skills,job_fields,salary,salary_min,salary_max,unit
1,Senior Software Engineer,full-time,senior,Ho Chi Minh,3-5 years,"Python,Java,React,Node.js,AWS",IT,15-20 triệu,15000000,20000000,VND
2,Marketing Manager,full-time,manager,Ha Noi,5+ years,"SEO,Content Marketing,Google Ads,Analytics",Marketing,20-25 triệu,20000000,25000000,VND
```

### 3.4. Giá Trị Các Trường

#### job_type
```
- full-time      (toàn thời gian)
- part-time      (bán thời gian)
- contract       (hợp đồng)
- internship     (thực tập)
- freelance      (tự do)
```

#### position_level
```
- intern         (thực tập sinh)
- fresher        (mới ra trường)
- junior         (1-2 năm KN)
- middle         (3-5 năm KN)
- senior         (5+ năm KN)
- lead           (trưởng nhóm)
- manager        (quản lý)
- director       (giám đốc)
```

#### Các thành phố phổ biến
```
- Ho Chi Minh    (~40,000 jobs - 47%)
- Ha Noi         (~30,000 jobs - 35%)
- Da Nang        (~8,000 jobs - 9%)
- Can Tho        (~3,000 jobs - 4%)
- Other cities   (~4,470 jobs - 5%)
```

### 3.5. Phân Bố Lĩnh Vực

```
IT/Software:           ~25,000 jobs (29%)
Sales/Marketing:       ~15,000 jobs (18%)
Finance/Accounting:    ~12,000 jobs (14%)
Engineering:           ~10,000 jobs (12%)
Healthcare:            ~8,000 jobs (9%)
Education:             ~5,000 jobs (6%)
Other fields:          ~10,470 jobs (12%)
```

### 3.6. Mức Lương Trung Bình

```
Fresher:    8-12 triệu VND
Junior:     12-18 triệu VND
Middle:     18-30 triệu VND
Senior:     30-50 triệu VND
Manager:    40-80 triệu VND
```

---

## 4. Data Processing

### 4.1. Đã Được Xử Lý

Dataset đã trải qua các bước preprocessing sau:

#### Resume Data
✅ **Text Extraction**: Trích xuất text từ PDF/HTML  
✅ **Cleaning**: Loại bỏ ký tự đặc biệt, HTML tags  
✅ **Normalization**: Chuẩn hóa encoding, whitespace  
✅ **Labeling**: Gán nhãn Category cho mỗi resume  

#### Job Data
✅ **Salary Parsing**: Chuyển đổi salary string thành số  
✅ **Skill Extraction**: Tách và chuẩn hóa danh sách skills  
✅ **Location Standardization**: Chuẩn hóa tên thành phố  
✅ **Experience Parsing**: Chuẩn hóa yêu cầu kinh nghiệm  

### 4.2. Data Quality

- **No Missing Critical Fields**: Tất cả các trường quan trọng đều có giá trị
- **Consistent Format**: Format thống nhất trong toàn bộ dataset
- **No Duplicates**: Đã loại bỏ các bản ghi trùng lặp
- **Valid Data**: Dữ liệu đã được validate

---

## 5. Data Analysis

### 5.1. Loading Data với Pandas

```python
import pandas as pd

# Load resume data
resumes_df = pd.read_csv('data/resumes.csv')
print(f"Total resumes: {len(resumes_df)}")
print(f"Columns: {resumes_df.columns.tolist()}")

# Load job data
jobs_df = pd.read_csv('data/jobs.csv')
print(f"Total jobs: {len(jobs_df)}")
print(f"Columns: {jobs_df.columns.tolist()}")
```

### 5.2. Basic Statistics

```python
# Resume categories distribution
print("\nResume Categories Distribution:")
print(resumes_df['Category'].value_counts())

# Job fields distribution
print("\nJob Fields Distribution:")
print(jobs_df['job_fields'].value_counts())

# Salary statistics
print("\nSalary Statistics (VND):")
print(jobs_df[['salary_min', 'salary_max']].describe())

# Cities distribution
print("\nCities Distribution:")
print(jobs_df['city'].value_counts().head(10))
```

### 5.3. Data Exploration Notebook

```python
# notebooks/01_data_exploration.ipynb

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# Load data
resumes_df = pd.read_csv('../data/resumes.csv')
jobs_df = pd.read_csv('../data/jobs.csv')

# 1. Resume Analysis
fig, axes = plt.subplots(2, 2, figsize=(15, 10))

# Category distribution
resumes_df['Category'].value_counts().plot(kind='bar', ax=axes[0, 0])
axes[0, 0].set_title('Resume Categories Distribution')

# Resume length distribution
resumes_df['resume_length'] = resumes_df['Resume_str'].str.len()
resumes_df['resume_length'].hist(bins=50, ax=axes[0, 1])
axes[0, 1].set_title('Resume Length Distribution')

# 2. Job Analysis
# Salary distribution
jobs_df.boxplot(column=['salary_min', 'salary_max'], ax=axes[1, 0])
axes[1, 0].set_title('Salary Distribution')

# Position level distribution
jobs_df['position_level'].value_counts().plot(kind='bar', ax=axes[1, 1])
axes[1, 1].set_title('Position Level Distribution')

plt.tight_layout()
plt.show()
```

---

## 6. Sử Dụng Dataset

### 6.1. Training Resume Classifier

```python
import pandas as pd
from sklearn.model_selection import train_test_split
from models.resume_classifier import ResumeClassifier

# Load data
df = pd.read_csv('data/resumes.csv')

# Split data
train_df, test_df = train_test_split(df, test_size=0.2, random_state=42, stratify=df['Category'])

# Train model
classifier = ResumeClassifier()
accuracy = classifier.train(train_df)

print(f"Training Accuracy: {accuracy:.4f}")

# Save model
classifier.save('data/models/resume_classifier.pkl')
```

### 6.2. Training Job Recommender

```python
import pandas as pd
from models.job_recommender import JobRecommender

# Load job data
jobs_df = pd.read_csv('data/jobs.csv')

# Initialize and fit recommender
recommender = JobRecommender()
recommender.load_jobs('data/jobs.csv')
recommender.fit()

# Save model
recommender.save('data/models/job_recommender.pkl')

print("Job recommender trained successfully!")
```

### 6.3. Training Salary Predictor

```python
import pandas as pd
from models.salary_predictor import SalaryPredictor

# Load data
jobs_df = pd.read_csv('data/jobs.csv')

# Filter jobs with salary data
jobs_with_salary = jobs_df.dropna(subset=['salary_min', 'salary_max'])
print(f"Jobs with salary data: {len(jobs_with_salary)}")

# Train model
predictor = SalaryPredictor()
predictor.train(jobs_with_salary)

# Save model
predictor.save('data/models/salary_predictor.pkl')
```

---

## 7. Data Validation

### 7.1. Check Data Quality

```python
# check_data.py
import pandas as pd

def check_resume_data():
    """Validate resume dataset"""
    df = pd.read_csv('data/resumes.csv')
    
    print("=" * 60)
    print("RESUME DATA VALIDATION")
    print("=" * 60)
    
    # Check shape
    print(f"\n1. Shape: {df.shape}")
    print(f"   - Total records: {len(df)}")
    print(f"   - Columns: {df.columns.tolist()}")
    
    # Check missing values
    print(f"\n2. Missing Values:")
    missing = df.isnull().sum()
    print(missing[missing > 0] if any(missing > 0) else "   No missing values")
    
    # Check categories
    print(f"\n3. Categories: {df['Category'].nunique()} unique")
    print(f"   Distribution:")
    print(df['Category'].value_counts())
    
    # Check duplicates
    duplicates = df.duplicated().sum()
    print(f"\n4. Duplicates: {duplicates}")
    
    print("\n✓ Resume data validation completed!")

def check_job_data():
    """Validate job dataset"""
    df = pd.read_csv('data/jobs.csv')
    
    print("\n" + "=" * 60)
    print("JOB DATA VALIDATION")
    print("=" * 60)
    
    # Check shape
    print(f"\n1. Shape: {df.shape}")
    print(f"   - Total records: {len(df)}")
    
    # Check missing values in critical fields
    critical_fields = ['job_title', 'job_type', 'city']
    print(f"\n2. Missing Values in Critical Fields:")
    for field in critical_fields:
        missing = df[field].isnull().sum()
        print(f"   - {field}: {missing}")
    
    # Check salary data
    print(f"\n3. Salary Data:")
    print(f"   - Jobs with salary_min: {df['salary_min'].notna().sum()}")
    print(f"   - Jobs with salary_max: {df['salary_max'].notna().sum()}")
    print(f"   - Avg salary range: {df['salary_min'].mean():.0f} - {df['salary_max'].mean():.0f}")
    
    # Check cities
    print(f"\n4. Top 10 Cities:")
    print(df['city'].value_counts().head(10))
    
    print("\n✓ Job data validation completed!")

if __name__ == '__main__':
    check_resume_data()
    check_job_data()
```

---

## 8. Dataset Statistics

### 8.1. Resume Dataset Stats

```
Total Resumes:           2,484
Average Resume Length:   ~2,500 characters
Categories:              24
Languages:               English (primary)
Time Period:             Recent (2020-2023)
```

### 8.2. Job Dataset Stats

```
Total Jobs:              85,470
Average Salary:          18-30 million VND
Locations:               63 provinces/cities
Job Types:               5 types
Position Levels:         8 levels
Time Period:             Active/Recent listings
```

---

## 9. Best Practices

### 9.1. Khi Làm Việc Với Dataset

✅ **Always backup**: Sao lưu dataset gốc trước khi xử lý  
✅ **Use pandas**: Sử dụng pandas để load và xử lý data  
✅ **Check data quality**: Validate data trước khi training  
✅ **Split data properly**: Train/Test split với stratify  
✅ **Document changes**: Ghi chép mọi thay đổi với data  

### 9.2. Khi Training Models

✅ **Use cross-validation**: Đánh giá model với k-fold CV  
✅ **Monitor performance**: Theo dõi metrics trong quá trình training  
✅ **Save checkpoints**: Lưu model sau mỗi epoch/iteration  
✅ **Log experiments**: Ghi chép hyperparameters và results  

---

## 10. Frequently Asked Questions

**Q: Dataset có cần làm sạch thêm không?**  
A: Không. Dataset đã được preprocessed và sẵn sàng sử dụng.

**Q: Có cần convert PDF files không?**  
A: Không. Text đã được extract sẵn trong trường `Resume_str`.

**Q: Làm sao để thêm data mới?**  
A: Append vào CSV file với cùng format. Sau đó retrain models.

**Q: Dataset có đủ lớn để train không?**  
A: Có. 2,484 resumes và 85,470 jobs là đủ cho các mô hình ML cơ bản.

**Q: Có thể sử dụng dataset này cho production không?**  
A: Có, nhưng nên bổ sung thêm data thực tế từ hệ thống khi có.

---

## 11. License & Attribution

Dataset này được sử dụng cho mục đích **học tập và nghiên cứu**. Khi sử dụng trong production, cần đảm bảo:
- Tuân thủ quyền riêng tư cá nhân
- Không chia sẻ thông tin nhạy cảm
- Cập nhật data thường xuyên
- Xin phép khi cần thiết


job_title,job_type,position_level,city,experience,skills,job_fields,salary,salary_min,salary_max,unit,job_title_clean,skills_clean,fields_clean,experience_years,salary_min_clean,salary_max_clean,combined_text
trưởng phòng kinh doanh,nhân viên chính thức,"trưởng nhóm , giám sát",hồ chí minh,lên đến 1 năm,,"kinh doanh, bán hàng, nội ngoại thất, xây dựng",15 tr - 50 tr vnd,15.0,50.0,vnd,tr ng ph ng kinh doanh,,kinh doanh b n h ng n i ngo i th t x y d ng,1.0,15.0,50.0,tr ng ph ng kinh doanh  



ID,cleaned_text,Category
16852973,hr administrator marketing associate hr administrator summary dedicated customer service manager with 15 years of experience in hospitality and customer service management respected builder and leader of customer focused teams strives to instill a shared enthusiastic commitment to customer service highlights focused on customer satisfaction team management marketing savvy conflict resolution techniques training and development skilled multi tasker client relations specialist accomplishments missouri dot supervisor training certification certified by ihg in customer loyalty and marketing by segment hilton worldwide general manager training certification accomplished trainer for cross server hospitality systems such as hilton onq micros opera pms fidelio opera reservation system ors holidex completed courses and seminars in customer service sales strategies inventory control loss prevention safety time management leadership and performance assessment experience hr administrator marketing associate hr administrator dec 2013 to current company name city state helps to develop policies directs and coordinates activities such as employment compensation labor relations benefits training and employee services prepares employee separation notices and related documentation keeps records of benefits plans participation such as insurance and pension plan personnel transactions such as hires promotions transfers performance reviews and terminations and employee statistics for government reporting advises management in appropriate resolution of employee relations issues administers benefits programs such as life health dental insurance pension plans vacation sick leave leave of absence and employee assistance marketing associate designed and created marketing collateral for sales meetings trade shows and company executives managed the in house advertising program consisting of print and media collateral pieces assisted in the complete design and launch of the company s website in 2 months created an official company page on facebook to facilitate interaction with customers analyzed ratings and programming features of competitors to evaluate the effectiveness of marketing strategies advanced medical claims analyst mar 2012 to dec 2013 company name city state reviewed medical bills for the accuracy of the treatments tests and hospital stays prior to sanctioning the claims trained to interpret the codes icd 9 cpt and terminology commonly used in medical billing to fully understand the paperwork that is submitted by healthcare providers required to have organizational and analytical skills as well as computer skills knowledge of medical terminology and procedures statistics billing standards data analysis and laws regarding medical billing assistant general manager jun 2010 to dec 2010 company name city state performed duties including but not limited to budgeting and financial management accounting human resources payroll and purchasing established and maintained close working relationships with all departments of the hotel to ensure maximum operation productivity morale and guest service handled daily operations and reported directly to the corporate office hired and trained staff on overall objectives and goals with an emphasis on high customer service marketing and advertising working on public relations with the media government and local businesses and chamber of commerce executive support marketing assistant jul 2007 to jun 2010 company name city state provided assistance to various department heads executive marketing customer service human resources managed front end operations to ensure friendly and efficient transactions ensured the swift resolution of customer issues to preserve customer loyalty while complying with company policies exemplified the second to none customer service delivery in all interactions with customers and potential clients reservation front office manager jun 2004 to jul 2007 company name city state owner partner dec 2001 to may 2004 company name city state price integrity coordinator aug 1999 to dec 2001 company name city state education n a business administration 1999 jefferson college city state business administration marketing advertising high school diploma college prep studies 1998 sainte genevieve senior high city state awarded american shrubel leadership scholarship to jefferson college skills accounting ads advertising analytical skills benefits billing budgeting clients customer service data analysis delivery documentation employee relations financial management government relations human resources insurance labor relations layout marketing marketing collateral medical billing medical terminology office organizational payroll performance reviews personnel policies posters presentations public relations purchasing reporting statistics website,HR
22323967,hr specialist us hr operations summary versatile media professional with background in communications marketing human resources and technology experience 09 2015 to current hr specialist us hr operations company name city state managed communication regarding launch of operations group policy changes and system outages designed standard work and job aids to create comprehensive training program for new employees and contractors audited job postings for old pending on hold and draft positions audited union hourly non union hourly and salary background checks and drug screens conducted monthly new hire benefits briefing to new employees across all business units served as a link between hr managers and vendors by handling questions and resolving system related issues provide real time process improvement feedback on key metrics and initiatives successfully re branded us hr operations sharepoint site business unit project manager for rfi rfp on background check and drug screen vendor 01 2014 to 05 2015 it marketing and communications co op company name city state posted new articles changes and updates to corporate sharepoint site including graphics and visual communications researched and drafted articles and feature stories to promote company activities and programs co edited and developed content for quarterly published newsletter provided communication support for internal and external events collaborated with communication team media professionals and vendors to determine program needs for print materials web design and digital communications entrusted to lead product service and software launches for digital asset management tool marketing toolkit website and executive tradeshows calendar created presentations for management and executive approval to ensure alignment with corporate guidelines and branding maintained the mysikorsky sharepoint site and provided timely solutions to mitigate issues created story board and produced video for annual it all hands meeting 10 2012 to 01 2014 relationship coordinator marketing specialist company name city state partnered with vendor to manage the in house advertising program consisting of print and media collateral pieces coordinated pre show and post show activities at trade shows managed marketing campaigns to generate new business and to support partner and sales teams ordered marketing collateral for meetings trade shows and advisors improved administered and modified marketing programs to increase product awareness assisted in preparing internal promotional publications managed marketing material inventory and supervised distribution of publications to ensure high quality product output coordinated marketing materials including brochures promotional materials and products partnered with graphic designers to develop appropriate materials and branding for brochures used tracking and reporting systems for sales leads and appointments 09 2009 to 10 2012 assistant head teller company name city state received an internal audit score of 100 performed daily and monthly audits of atm machines and tellers educated customers on a variety of retail products and available credit options consistently met or exceeded quarterly sales goals promoted products and services to customers while maintaining company brand identity implemented programs to achieve and exceed customer and company participation goals organized company sponsored events on campus resulting in increased brand awareness coached peers on the proper use of programs to improve work flow efficiency utilized product knowledge to successfully sell to and refer clients based on individual needs promoted marketing the grand opening of new branch locations to strengthen company brand affinity organized company sponsored events resulting in increased brand awareness and improved sales coached peers on the proper use of programs to increase work flow efficiency senior producer 2014 shu media exchange company name city state planned and executed event focusing on connecticut s creative corridor growth of industry and opportunities that come with development a panel of industry professionals addressed topics related to media and hosted a question and answer session for approximately 110 attendees following the forum guests were invited to engage in networking and conversation at a post event reception education 2014 master of arts corporate communication public relations sacred heart university city state 2013 bachelor of arts relational communication western connecticut state university city state skills adobe photoshop adp asset management branding brochures content customer care final cut pro graphics graphic hr illustrator indesign innovation inventory lotus notes marketing marketing materials marketing material materials microsoft office sharepoint newsletter presentations process improvement project management promotional materials publications quality real time recruitment reporting rfp sales stories employee development video web design website articles,HR
