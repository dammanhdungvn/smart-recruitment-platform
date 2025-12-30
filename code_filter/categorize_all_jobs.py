#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to categorize ALL jobs from CSV based on job_fields and job_title
Improved logic with better scoring system
"""

import csv
import os
from collections import Counter

# Category mapping - improved with weighted scoring
CATEGORY_MAPPING = {
    # Technology & IT (highest priority for exact matches)
    'công nghệ thông tin': ('INFORMATION-TECHNOLOGY', 3),
    'it ': ('INFORMATION-TECHNOLOGY', 3),
    'phần mềm': ('INFORMATION-TECHNOLOGY', 2),
    'lập trình': ('INFORMATION-TECHNOLOGY', 2),
    'thiết kế web': ('INFORMATION-TECHNOLOGY', 2),
    
    # Digital & Online
    'digital': ('DIGITAL-MEDIA', 2),
    'thương mại điện tử': ('DIGITAL-MEDIA', 2),
    'tiếp thị trực tuyến': ('DIGITAL-MEDIA', 2),
    'tiếp thị online': ('DIGITAL-MEDIA', 2),
    
    # Sales & Marketing (lower weight for "kinh doanh" when combined with others)
    'bán hàng': ('SALES', 2),
    'bán sỉ': ('SALES', 2),
    'bán lẻ': ('SALES', 2),
    'marketing': ('SALES', 2),
    'tiếp thị': ('SALES', 2),
    'kinh doanh': ('BUSINESS-DEVELOPMENT', 1),  # Lower weight
    
    # Finance & Accounting
    'kế toán': ('ACCOUNTANT', 3),
    'kiểm toán': ('ACCOUNTANT', 3),
    'tài chính': ('FINANCE', 2),
    'ngân hàng': ('BANKING', 3),
    'đầu tư': ('FINANCE', 2),
    'bảo hiểm': ('FINANCE', 2),
    
    # Construction & Real Estate (lower weight)
    'xây dựng': ('CONSTRUCTION', 2),
    'kiến trúc': ('CONSTRUCTION', 3),
    'nội ngoại thất': ('CONSTRUCTION', 1),
    'bất động sản': ('CONSTRUCTION', 2),
    
    # Engineering
    'điện': ('ENGINEERING', 2),
    'điện tử': ('ENGINEERING', 2),
    'điện lạnh': ('ENGINEERING', 2),
    'cơ khí': ('ENGINEERING', 3),
    'điện công nghiệp': ('ENGINEERING', 2),
    'tự động hóa': ('ENGINEERING', 2),
    'ô tô': ('AUTOMOBILE', 3),
    'dầu khí': ('ENGINEERING', 2),
    
    # Manufacturing & Production
    'vận hành sản xuất': ('ENGINEERING', 2),
    'sản xuất': ('ENGINEERING', 1),
    'quản lý chất lượng': ('ENGINEERING', 2),
    'qc)': ('ENGINEERING', 2),
    'qa': ('ENGINEERING', 2),
    
    # Healthcare
    'y tế': ('HEALTHCARE', 3),
    'dược phẩm': ('HEALTHCARE', 3),
    'dược': ('HEALTHCARE', 2),
    'chăm sóc sức khỏe': ('HEALTHCARE', 2),
    'thẩm mỹ': ('HEALTHCARE', 2),
    'làm đẹp': ('HEALTHCARE', 2),
    'hóa mỹ phẩm': ('HEALTHCARE', 2),
    
    # Human Resources
    'nhân sự': ('HR', 3),
    'hành chính': ('HR', 2),
    'thư ký': ('HR', 2),
    
    # Legal & Consulting
    'luật': ('ADVOCATE', 3),
    'pháp lý': ('ADVOCATE', 3),
    'tư vấn': ('CONSULTANT', 1),
    
    # Education
    'giáo dục': ('TEACHER', 3),
    'đào tạo': ('TEACHER', 2),
    
    # Hospitality & Food
    'nhà hàng': ('CHEF', 3),
    'khách sạn': ('CHEF', 3),
    'thực phẩm': ('CHEF', 2),
    'đồ uống': ('CHEF', 2),
    'dinh dưỡng': ('CHEF', 2),
    
    # Fashion & Textile
    'dệt may': ('APPAREL', 3),
    'thời trang': ('APPAREL', 3),
    'da giày': ('APPAREL', 3),
    
    # Design & Arts
    'thiết kế': ('DESIGNER', 2),
    'nghệ thuật': ('ARTS', 2),
    'mỹ thuật': ('ARTS', 2),
    
    # Logistics & BPO
    'giao nhận': ('BPO', 2),
    'vận chuyển': ('BPO', 2),
    'kho vận': ('BPO', 2),
    'xuất nhập khẩu': ('BPO', 2),
    'dịch vụ khách hàng': ('BPO', 2),
    'chăm sóc khách hàng': ('BPO', 2),
    
    # Media & PR
    'truyền thông': ('PUBLIC-RELATIONS', 3),
    'quảng cáo': ('PUBLIC-RELATIONS', 3),
    'đối ngoại': ('PUBLIC-RELATIONS', 2),
    
    # Agriculture
    'nông nghiệp': ('AGRICULTURE', 3),
    'lâm nghiệp': ('AGRICULTURE', 3),
    
    # Translation
    'biên phiên dịch': ('TEACHER', 2),
    
    # Management
    'quản lý điều hành': ('BUSINESS-DEVELOPMENT', 1),
}

def normalize_text(text):
    """Normalize Vietnamese text for matching"""
    if not text:
        return ''
    return text.lower().strip()

def categorize_job(job_fields, job_title):
    """
    Categorize job based on job_fields and job_title with weighted scoring
    Returns standardized category
    """
    if not job_fields and not job_title:
        return 'BUSINESS-DEVELOPMENT'
    
    # Normalize texts
    fields_text = normalize_text(job_fields)
    title_text = normalize_text(job_title)
    
    # Score each category
    category_scores = Counter()
    
    for keyword, (category, weight) in CATEGORY_MAPPING.items():
        # Check in job_fields (higher priority)
        if keyword in fields_text:
            category_scores[category] += weight * 2
        
        # Check in job_title (lower priority)
        if keyword in title_text:
            category_scores[category] += weight
    
    # Return the category with highest score
    if category_scores:
        return category_scores.most_common(1)[0][0]
    
    # Default category
    return 'BUSINESS-DEVELOPMENT'

def process_jobs_csv(input_file, output_file, limit=None):
    """
    Process jobs CSV and add category column
    
    Args:
        input_file: Path to input CSV
        output_file: Path to output CSV
        limit: Optional limit on number of rows to process
    """
    print(f"\n📖 Reading jobs from: {input_file}")
    
    jobs_processed = 0
    category_counts = Counter()
    
    with open(input_file, 'r', encoding='utf-8') as infile, \
         open(output_file, 'w', encoding='utf-8', newline='') as outfile:
        
        reader = csv.DictReader(infile)
        
        # Add 'category' to fieldnames
        fieldnames = reader.fieldnames + ['category']
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for row in reader:
            if limit and jobs_processed >= limit:
                break
            
            # Categorize the job
            job_fields = row.get('job_fields', '')
            job_title = row.get('job_title', '')
            category = categorize_job(job_fields, job_title)
            
            # Add category to row
            row['category'] = category
            writer.writerow(row)
            
            jobs_processed += 1
            category_counts[category] += 1
            
            # Progress indicator
            if jobs_processed % 5000 == 0:
                print(f"  ✓ Processed {jobs_processed:,} jobs...")
    
    print(f"\n✅ Completed! Processed {jobs_processed:,} jobs")
    print(f"📁 Output saved to: {output_file}")
    
    # Print category distribution
    print("\n" + "="*80)
    print("📊 CATEGORY DISTRIBUTION")
    print("="*80)
    total = sum(category_counts.values())
    for category, count in category_counts.most_common():
        percentage = (count / total) * 100
        bar = "█" * int(percentage / 2)
        print(f"{category:30s}: {count:6,d} ({percentage:5.2f}%) {bar}")
    print("="*80)

def main():
    # File paths
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    input_file = os.path.join(project_root, 'data', 'jobs.csv')
    output_file = os.path.join(os.path.dirname(__file__), 'jobs_with_category.csv')
    
    # Check if input file exists
    if not os.path.exists(input_file):
        print(f"❌ Error: Input file not found: {input_file}")
        return
    
    print("="*80)
    print("🏷️  JOB CATEGORIZATION SCRIPT - FULL DATASET")
    print("="*80)
    print("\n⚙️  Processing ALL jobs from dataset...")
    print("   (This will take a few minutes)")
    
    process_jobs_csv(input_file, output_file, limit=None)
    
    print("\n✅ DONE! You can now use this categorized data.")
    print(f"📁 File location: {output_file}\n")

if __name__ == '__main__':
    main()
