export const formatSalary = (min?: number, max?: number, unit: string = 'VND'): string => {
  if (!min && !max) return 'Thỏa thuận';
  
  const formatNumber = (num: number) => {
    if (unit === 'VND') {
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)} triệu`;
      }
      return `${num.toLocaleString('vi-VN')}`;
    }
    return `$${num.toLocaleString('en-US')}`;
  };

  if (min && max) {
    return `${formatNumber(min)} - ${formatNumber(max)} ${unit}`;
  }
  if (min) {
    return `Từ ${formatNumber(min)} ${unit}`;
  }
  if (max) {
    return `Đến ${formatNumber(max)} ${unit}`;
  }
  return 'Thỏa thuận';
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return 'N/A';

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} tháng trước`;
  
  return date.toLocaleDateString('vi-VN');
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
