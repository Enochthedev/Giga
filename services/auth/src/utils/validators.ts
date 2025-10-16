/**
 * Email validation
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Password validation
 * Must be at least 8 characters long and contain:
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function validatePassword(password: string): boolean {
  if (password.length < 8) {
    return false;
  }

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
}

/**
 * Phone number validation (international format)
 */
export function validatePhone(phone: string): boolean {
  // Remove all non-digit characters except +
  const cleanPhone = phone.replace(/[^\d+]/g, '');

  // Check if it starts with + and has 10-15 digits
  const phoneRegex = /^\+\d{10,15}$/;
  return phoneRegex.test(cleanPhone);
}

/**
 * Name validation (first name, last name)
 */
export function validateName(name: string): boolean {
  if (!name || name.trim().length < 1) {
    return false;
  }

  // Allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(name.trim()) && name.trim().length <= 50;
}

/**
 * Username validation
 */
export function validateUsername(username: string): boolean {
  if (!username || username.length < 3 || username.length > 30) {
    return false;
  }

  // Allow letters, numbers, underscores, and hyphens
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  return usernameRegex.test(username);
}

/**
 * URL validation
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Date validation (YYYY-MM-DD format)
 */
export function validateDate(dateString: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Age validation (must be at least 13 years old)
 */
export function validateAge(birthDate: string): boolean {
  if (!validateDate(birthDate)) {
    return false;
  }

  const birth = new Date(birthDate);
  const today = new Date();
  const age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    return age - 1 >= 13;
  }

  return age >= 13;
}

/**
 * Postal code validation (flexible format)
 */
export function validatePostalCode(postalCode: string): boolean {
  if (!postalCode || postalCode.trim().length === 0) {
    return false;
  }

  // Allow various postal code formats
  const postalRegex = /^[a-zA-Z0-9\s-]{3,10}$/;
  return postalRegex.test(postalCode.trim());
}

/**
 * Credit card number validation (basic Luhn algorithm)
 */
export function validateCreditCard(cardNumber: string): boolean {
  const cleanNumber = cardNumber.replace(/\D/g, '');

  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * CVV validation
 */
export function validateCVV(cvv: string): boolean {
  const cvvRegex = /^\d{3,4}$/;
  return cvvRegex.test(cvv);
}

/**
 * Expiry date validation (MM/YY format)
 */
export function validateExpiryDate(expiryDate: string): boolean {
  const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
  if (!expiryRegex.test(expiryDate)) {
    return false;
  }

  const [month, year] = expiryDate.split('/');
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;

  const expYear = parseInt(year);
  const expMonth = parseInt(month);

  if (expYear < currentYear) {
    return false;
  }

  if (expYear === currentYear && expMonth < currentMonth) {
    return false;
  }

  return true;
}
