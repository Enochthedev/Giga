
// Simple validation functions without Zod for now
export const validatePaymentRequest = (data: any) => {
  if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
    throw new Error('Amount must be a positive number');
  }

  if (!data.currency || typeof data.currency !== 'string' || data.currency.length !== 3) {
    throw new Error('Currency must be a 3-letter ISO code');
  }

  if (!data.paymentMethodId && !data.paymentMethodData) {
    throw new Error('Either paymentMethodId or paymentMethodData must be provided');
  }

  return data;
};

export const validateRefundRequest = (data: any) => {
  if (!data.transactionId) {
    throw new Error('Transaction ID is required');
  }

  if (data.amount && (typeof data.amount !== 'number' || data.amount <= 0)) {
    throw new Error('Refund amount must be positive');
  }

  return data;
};

export const validateTransactionFilters = (data: any) => {
  const filters = {
    userId: data.userId,
    merchantId: data.merchantId,
    status: data.status,
    currency: data.currency,
    amountMin: data.amountMin ? Number(data.amountMin) : undefined,
    amountMax: data.amountMax ? Number(data.amountMax) : undefined,
    dateFrom: data.dateFrom,
    dateTo: data.dateTo,
    gatewayId: data.gatewayId,
    page: data.page ? Number(data.page) : 1,
    limit: data.limit ? Number(data.limit) : 20,
  };

  if (filters.page < 1) {
    throw new Error('Page must be a positive integer');
  }

  if (filters.limit < 1 || filters.limit > 100) {
    throw new Error('Limit must be between 1 and 100');
  }

  return filters;
};

export const validateAddress = (data: any) => {
  if (!data.line1) throw new Error('Address line 1 is required');
  if (!data.city) throw new Error('City is required');
  if (!data.postalCode) throw new Error('Postal code is required');
  if (!data.country || data.country.length !== 2) throw new Error('Country must be a 2-letter ISO code');

  return data;
};

export const validateCard = (data: any) => {
  if (!data.number || !/^\d{13,19}$/.test(data.number.replace(/\D/g, ''))) {
    throw new Error('Invalid card number');
  }

  if (!data.expiryMonth || data.expiryMonth < 1 || data.expiryMonth > 12) {
    throw new Error('Invalid expiry month');
  }

  if (!data.expiryYear || data.expiryYear < new Date().getFullYear()) {
    throw new Error('Invalid expiry year');
  }

  if (!data.cvc || !/^\d{3,4}$/.test(data.cvc)) {
    throw new Error('Invalid CVC');
  }

  if (!data.holderName) {
    throw new Error('Cardholder name is required');
  }

  return data;
};

// Currency validation
export const validateCurrency = (currency: string): boolean => {
  const supportedCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'SEK', 'NOK', 'DKK'];
  return supportedCurrencies.includes(currency.toUpperCase());
};

// Amount validation
export const validateAmount = (amount: number, currency: string): boolean => {
  // Minimum amounts by currency (in smallest unit)
  const minimumAmounts: Record<string, number> = {
    USD: 50, // $0.50
    EUR: 50, // €0.50
    GBP: 30, // £0.30
    CAD: 50, // C$0.50
    AUD: 50, // A$0.50
    JPY: 50, // ¥50
    CHF: 50, // CHF 0.50
    SEK: 300, // 3.00 SEK
    NOK: 300, // 3.00 NOK
    DKK: 250, // 2.50 DKK
  };

  const minAmount = minimumAmounts[currency.toUpperCase()] || 50;
  const amountInCents = Math.round(amount * 100);

  return amountInCents >= minAmount;
};

// Card number validation (Luhn algorithm)
export const validateCardNumber = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\D/g, '');

  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);

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
};

// Card brand detection
export const detectCardBrand = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\D/g, '');

  if (/^4/.test(cleanNumber)) return 'visa';
  if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'amex';
  if (/^6(?:011|5)/.test(cleanNumber)) return 'discover';
  if (/^(?:2131|1800|35\d{3})\d{11}$/.test(cleanNumber)) return 'jcb';
  if (/^3(?:0[0-5]|[68])/.test(cleanNumber)) return 'diners';

  return 'unknown';
};

// Expiry date validation
export const validateExpiryDate = (month: number, year: number): boolean => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  if (year > currentYear + 20) return false; // Cards typically don't expire more than 20 years in the future

  return true;
};