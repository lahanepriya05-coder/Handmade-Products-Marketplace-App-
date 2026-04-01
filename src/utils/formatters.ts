// ==================== CURRENCY FORMATTING ====================

export const formatCurrency = (
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatPrice = (price: number): string => {
  return formatCurrency(price, 'INR', 'en-IN');
};

export const formatDiscountedPrice = (original: number, discounted: number): string => {
  return `₹${discounted.toLocaleString('en-IN')} <s class="text-gray-500">₹${original.toLocaleString('en-IN')}</s>`;
};

export const calculateDiscount = (original: number, discounted: number): number => {
  return Math.round(((original - discounted) / original) * 100);
};

// ==================== DATE FORMATTING ====================

export const formatDate = (date: Date | string, format: string = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const options: Intl.DateTimeFormatOptions = {
    short: { year: '2-digit', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' },
    datetime: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
  };

  return new Intl.DateTimeFormat('en-IN', options[format as keyof typeof options]).format(dateObj);
};

export const formatDateShort = (date: Date | string): string => {
  return formatDate(date, 'short');
};

export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, 'datetime');
};

export const formatDateFull = (date: Date | string): string => {
  return formatDate(date, 'full');
};

export const getRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const intervals: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [key, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

// ==================== NUMBER FORMATTING ====================

export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals);
};

export const formatPercentage = (num: number, decimals: number = 1): string => {
  return `${num.toFixed(decimals)}%`;
};

export const abbreviateNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

// ==================== STRING FORMATTING ====================

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const capitalizeWords = (str: string): string => {
  return str
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const truncate = (str: string, length: number, suffix: string = '...'): string => {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
};

export const highlightText = (text: string, query: string): string => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

export const removeHtml = (html: string): string => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

// ==================== PHONE FORMATTING ====================

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

export const formatPhoneShort = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

// ==================== ADDRESS FORMATTING ====================

export const formatAddress = (address: {
  street: string;
  city: string;
  state: string;
  postalCode?: string;
  pincode?: string;
  country?: string;
}): string => {
  const code = address.postalCode || address.pincode || '';
  return `${address.street}, ${address.city}, ${address.state} ${code}${
    address.country ? `, ${address.country}` : ''
  }`;
};

export const formatAddressShort = (address: {
  city: string;
  state: string;
  postalCode?: string;
  pincode?: string;
}): string => {
  const code = address.postalCode || address.pincode || '';
  return `${address.city}, ${address.state} ${code}`;
};

// ==================== SIZE FORMATTING ====================

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// ==================== RATING FORMATTING ====================

export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const getRatingText = (rating: number): string => {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4) return 'Very Good';
  if (rating >= 3.5) return 'Good';
  if (rating >= 3) return 'Average';
  return 'Poor';
};

// ==================== ORDER FORMATTING ====================

export const formatOrderId = (id: string): string => {
  return `#${id.toUpperCase().slice(-8)}`;
};

export const formatOrderStatus = (status: string): string => {
  return capitalizeWords(status.replace('-', ' '));
};

export const getOrderStatusColor = (status: string): string => {
  const colors: { [key: string]: string } = {
    pending: 'yellow',
    confirmed: 'blue',
    processing: 'blue',
    shipped: 'purple',
    delivered: 'green',
    cancelled: 'red',
  };
  return colors[status] || 'gray';
};

export const getOrderStatusBadge = (
  status: string
): { color: string; bgColor: string; textColor: string } => {
  const statusMap: {
    [key: string]: { color: string; bgColor: string; textColor: string };
  } = {
    pending: { color: 'yellow', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700' },
    confirmed: { color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
    processing: { color: 'blue', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
    shipped: { color: 'purple', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
    delivered: { color: 'green', bgColor: 'bg-green-50', textColor: 'text-green-700' },
    cancelled: { color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-700' },
  };
  return statusMap[status] || { color: 'gray', bgColor: 'bg-gray-50', textColor: 'text-gray-700' };
};
