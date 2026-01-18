// Security and Sanitization Module
// DOMPurify is loaded globally from libs/purify.min.js
// Access it via window.DOMPurify or directly as DOMPurify

class Sanitizer {
  constructor() {
    // Check if DOMPurify is available
    this.useDOMPurify = typeof DOMPurify !== 'undefined';
    
    if (!this.useDOMPurify) {
      console.warn('DOMPurify not loaded from libs/purify.min.js, using custom sanitization fallback');
    } else {
      console.log('✓ DOMPurify loaded successfully');
    }
  }

  // Sanitize HTML content
  sanitizeHTML(dirty) {
    if (this.useDOMPurify) {
      return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span', 'br'],
        ALLOWED_ATTR: []
      });
    }
    
    // Fallback: Custom sanitization
    return this.customSanitizeHTML(dirty);
  }

  // Custom HTML sanitization (fallback)
  customSanitizeHTML(str) {
    if (!str) return '';
    
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Sanitize text input (strips all HTML)
  sanitizeText(input) {
    if (!input) return '';
    
    return String(input)
      .replace(/[<>]/g, '') // Remove angle brackets
      .trim();
  }

  // Validate and sanitize date
  sanitizeDate(dateStr) {
    if (!dateStr) return null;
    
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return null;
    }
    
    return dateStr;
  }

  // Validate and sanitize time
  sanitizeTime(timeStr) {
    if (!timeStr) return null;
    
    // Check if time format is valid (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(timeStr)) {
      return null;
    }
    
    return timeStr;
  }

  // Validate UK postcode
  validatePostcode(postcode) {
    if (!postcode) return true; // Optional field
    
    // UK postcode regex pattern
    const postcodeRegex = /^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$/i;
    return postcodeRegex.test(postcode.trim());
  }

  // Sanitize postcode
  sanitizePostcode(postcode) {
    if (!postcode) return '';
    
    return postcode
      .toUpperCase()
      .replace(/[^A-Z0-9\s]/g, '')
      .trim();
  }

  // Sanitize form data
  sanitizeFormData(formData) {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(formData)) {
      if (key === 'date') {
        sanitized[key] = this.sanitizeDate(value);
      } else if (key === 'time') {
        sanitized[key] = this.sanitizeTime(value);
      } else if (key === 'postcode') {
        sanitized[key] = this.sanitizePostcode(value);
      } else if (key === 'notes' || key.includes('address')) {
        // Allow limited HTML for notes/address
        sanitized[key] = this.sanitizeHTML(value);
      } else {
        // Regular text fields
        sanitized[key] = this.sanitizeText(value);
      }
    }
    
    return sanitized;
  }

  // Validate required fields
  validateRequired(formData, schema) {
    const errors = [];
    
    schema.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        errors.push(`${field.label} is required`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Comprehensive validation and sanitization
  validateAndSanitize(formData, schema) {
    // First, sanitize all data
    const sanitized = this.sanitizeFormData(formData);
    
    // Then validate required fields
    const validation = this.validateRequired(sanitized, schema);
    
    // Additional validations
    if (sanitized.postcode && !this.validatePostcode(sanitized.postcode)) {
      validation.isValid = false;
      validation.errors.push('Invalid UK postcode format');
    }
    
    if (sanitized.date && !this.sanitizeDate(sanitized.date)) {
      validation.isValid = false;
      validation.errors.push('Invalid date format');
    }
    
    if (sanitized.time && !this.sanitizeTime(sanitized.time)) {
      validation.isValid = false;
      validation.errors.push('Invalid time format');
    }
    
    return {
      ...validation,
      data: sanitized
    };
  }

  // Escape HTML for safe display
  escapeHTML(str) {
    if (!str) return '';
    
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // SQL injection prevention (for future use if needed)
  preventSQLInjection(str) {
    if (!str) return '';
    
    return String(str)
      .replace(/['";\\]/g, '')
      .trim();
  }
}

// Create and export singleton instance
const sanitizer = new Sanitizer();
export default sanitizer;