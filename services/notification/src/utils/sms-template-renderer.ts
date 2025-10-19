/**
 * SMS Template Rendering Utilities
 */

import Handlebars from 'handlebars';
import { TemplateVariables } from '../types';

export interface SMSTemplateOptions {
  maxLength?: number;
  truncateStrategy?: 'end' | 'middle' | 'smart';
  preserveUrls?: boolean;
  removeEmojis?: boolean;
}

export interface SMSRenderResult {
  content: string;
  length: number;
  segmentCount: number;
  truncated: boolean;
  warnings: string[];
}

/**
 * Render SMS template with variables
 */
export const renderSMSTemplate = (
  template: string,
  variables: TemplateVariables,
  options: SMSTemplateOptions = {}
): SMSRenderResult => {
  const {
    maxLength = 1600, // Twilio's default limit
    truncateStrategy = 'smart',
    preserveUrls = true,
    removeEmojis = false,
  } = options;

  const warnings: string[] = [];

  try {
    // Compile and render template
    const compiledTemplate = Handlebars.compile(template);
    let rendered = compiledTemplate(variables);

    // Remove emojis if requested
    if (removeEmojis) {
      rendered = removeEmojiCharacters(rendered);
    }

    // Clean up whitespace
    rendered = rendered.replace(/\s+/g, ' ').trim();

    // Check if truncation is needed
    let truncated = false;
    if (rendered.length > maxLength) {
      rendered = truncateMessage(
        rendered,
        maxLength,
        truncateStrategy,
        preserveUrls
      );
      truncated = true;
      warnings.push(
        `Message truncated from ${rendered.length} to ${maxLength} characters`
      );
    }

    // Calculate segment count (SMS segments)
    const segmentCount = calculateSMSSegments(rendered);

    // Add warnings for potential issues
    if (segmentCount > 1) {
      warnings.push(`Message will be sent as ${segmentCount} SMS segments`);
    }

    if (hasUnicodeCharacters(rendered)) {
      warnings.push(
        'Message contains Unicode characters which may affect segment count'
      );
    }

    return {
      content: rendered,
      length: rendered.length,
      segmentCount,
      truncated,
      warnings,
    };
  } catch (error) {
    throw new Error(
      `SMS template rendering failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

/**
 * Validate SMS template syntax
 */
export const validateSMSTemplate = (
  template: string
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Check if template can be compiled
    Handlebars.compile(template);
  } catch (error) {
    errors.push(
      `Template compilation error: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  // Check for common issues
  if (template.length > 1600) {
    warnings.push(
      'Template is longer than typical SMS limit (1600 characters)'
    );
  }

  if (hasUnicodeCharacters(template)) {
    warnings.push(
      'Template contains Unicode characters which may reduce SMS segment size'
    );
  }

  // Check for potentially problematic patterns
  const problematicPatterns = [
    {
      pattern: /\{\{\s*#each\s+/,
      message: 'Each loops in SMS templates may cause length issues',
    },
    {
      pattern: /\{\{\s*#if\s+/,
      message: 'Conditional blocks may cause inconsistent message lengths',
    },
    {
      pattern: /https?:\/\/[^\s]+/g,
      message: 'URLs detected - consider using URL shorteners',
    },
  ];

  problematicPatterns.forEach(({ pattern, message }) => {
    if (pattern.test(template)) {
      warnings.push(message);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Extract variables from SMS template
 */
export const extractSMSTemplateVariables = (template: string): string[] => {
  const variablePattern = /\{\{\s*([^}]+)\s*\}\}/g;
  const variables = new Set<string>();
  let match;

  while ((match = variablePattern.exec(template)) !== null) {
    const variable = match[1].trim();

    // Skip Handlebars helpers and control structures
    if (
      !variable.startsWith('#') &&
      !variable.startsWith('/') &&
      !variable.startsWith('else')
    ) {
      // Extract just the variable name (remove any helpers or modifiers)
      const cleanVariable = variable.split(' ')[0].split('.')[0];
      variables.add(cleanVariable);
    }
  }

  return Array.from(variables);
};

/**
 * Create SMS template with personalization
 */
export const createPersonalizedSMSTemplate = (
  baseTemplate: string,
  personalizationRules: Record<string, string>
): string => {
  let personalizedTemplate = baseTemplate;

  Object.entries(personalizationRules).forEach(([condition, replacement]) => {
    // Simple personalization based on conditions
    // In a real implementation, this would be more sophisticated
    personalizedTemplate = personalizedTemplate.replace(
      new RegExp(`\\{\\{${condition}\\}\\}`, 'g'),
      replacement
    );
  });

  return personalizedTemplate;
};

/**
 * Private helper functions
 */

function truncateMessage(
  message: string,
  maxLength: number,
  strategy: 'end' | 'middle' | 'smart',
  preserveUrls: boolean
): string {
  if (message.length <= maxLength) {
    return message;
  }

  switch (strategy) {
    case 'end':
      return message.substring(0, maxLength - 3) + '...';

    case 'middle':
      const halfLength = Math.floor((maxLength - 3) / 2);
      return (
        message.substring(0, halfLength) +
        '...' +
        message.substring(message.length - halfLength)
      );

    case 'smart':
      return smartTruncate(message, maxLength, preserveUrls);

    default:
      return message.substring(0, maxLength - 3) + '...';
  }
}

function smartTruncate(
  message: string,
  maxLength: number,
  preserveUrls: boolean
): string {
  // Extract URLs if we need to preserve them
  const urls: string[] = [];
  let messageWithPlaceholders = message;

  if (preserveUrls) {
    const urlPattern = /https?:\/\/[^\s]+/g;
    let match;
    let urlIndex = 0;

    while ((match = urlPattern.exec(message)) !== null) {
      const placeholder = `__URL_${urlIndex}__`;
      urls.push(match[0]);
      messageWithPlaceholders = messageWithPlaceholders.replace(
        match[0],
        placeholder
      );
      urlIndex++;
    }
  }

  // Truncate at word boundaries when possible
  if (messageWithPlaceholders.length <= maxLength) {
    // Restore URLs
    urls.forEach((url, index) => {
      messageWithPlaceholders = messageWithPlaceholders.replace(
        `__URL_${index}__`,
        url
      );
    });
    return messageWithPlaceholders;
  }

  // Find the best truncation point
  const truncateLength = maxLength - 3; // Reserve space for '...'
  let truncatePoint = truncateLength;

  // Try to truncate at a word boundary
  const lastSpace = messageWithPlaceholders.lastIndexOf(' ', truncateLength);
  if (lastSpace > truncateLength * 0.8) {
    // Don't truncate too early
    truncatePoint = lastSpace;
  }

  let truncated = messageWithPlaceholders.substring(0, truncatePoint) + '...';

  // Restore URLs
  urls.forEach((url, index) => {
    truncated = truncated.replace(`__URL_${index}__`, url);
  });

  return truncated;
}

function calculateSMSSegments(message: string): number {
  // SMS segment calculation based on character encoding
  const hasUnicode = hasUnicodeCharacters(message);
  const maxSingleSegment = hasUnicode ? 70 : 160;
  const maxMultiSegment = hasUnicode ? 67 : 153; // Account for UDH (User Data Header)

  if (message.length <= maxSingleSegment) {
    return 1;
  }

  return Math.ceil(message.length / maxMultiSegment);
}

function hasUnicodeCharacters(text: string): boolean {
  // Check for characters outside the GSM 7-bit character set
  const gsmCharset =
    /^[A-Za-z0-9@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&'()*+,\-./:;<=>?¡ÄÖÑÜ§¿äöñüà^{}\\[~]|€]*$/;
  return !gsmCharset.test(text);
}

function removeEmojiCharacters(text: string): string {
  // Remove emoji characters (simplified regex)
  return text.replace(
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu,
    ''
  );
}

/**
 * Register custom Handlebars helpers for SMS templates
 */
export const registerSMSHelpers = (): void => {
  // Helper to truncate text
  Handlebars.registerHelper(
    'truncate',
    function (text: string, length: number) {
      if (typeof text !== 'string') return '';
      return text.length > length
        ? text.substring(0, length - 3) + '...'
        : text;
    }
  );

  // Helper to format phone numbers
  Handlebars.registerHelper('formatPhone', function (phone: string) {
    if (typeof phone !== 'string') return '';
    // Simple formatting - in production, use a proper phone formatting library
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  });

  // Helper to uppercase text
  Handlebars.registerHelper('upper', function (text: string) {
    if (typeof text !== 'string') return '';
    return text.toUpperCase();
  });

  // Helper to lowercase text
  Handlebars.registerHelper('lower', function (text: string) {
    if (typeof text !== 'string') return '';
    return text.toLowerCase();
  });

  // Helper to format currency
  Handlebars.registerHelper(
    'currency',
    function (amount: number, currency: string = 'USD') {
      if (typeof amount !== 'number') return '';
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
      }).format(amount);
    }
  );

  // Helper to format dates
  Handlebars.registerHelper(
    'formatDate',
    function (date: Date | string, format: string = 'short') {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return '';

      switch (format) {
        case 'short':
          return dateObj.toLocaleDateString();
        case 'long':
          return dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        case 'time':
          return dateObj.toLocaleTimeString();
        default:
          return dateObj.toLocaleDateString();
      }
    }
  );

  // Helper for conditional text based on value
  Handlebars.registerHelper(
    'ifEquals',
    function (this: any, arg1: any, arg2: any, options: any) {
      return arg1 == arg2 ? options.fn(this) : options.inverse(this);
    }
  );
};

// Initialize SMS helpers
registerSMSHelpers();
