/**
 * Unit tests for SMS Template Renderer
 */

import { describe, expect, it } from 'vitest';
import {
  createPersonalizedSMSTemplate,
  extractSMSTemplateVariables,
  renderSMSTemplate,
  validateSMSTemplate,
} from '../utils/sms-template-renderer';

describe('SMS Template Renderer', () => {
  describe('renderSMSTemplate', () => {
    it('should render simple template with variables', () => {
      const template = 'Hello {{name}}, your order #{{orderNumber}} is ready!';
      const variables = {
        name: 'John',
        orderNumber: '12345',
      };

      const result = renderSMSTemplate(template, variables);

      expect(result.content).toBe('Hello John, your order #12345 is ready!');
      expect(result.length).toBe(42);
      expect(result.segmentCount).toBe(1);
      expect(result.truncated).toBe(false);
      expect(result.warnings).toHaveLength(0);
    });

    it('should handle missing variables gracefully', () => {
      const template = 'Hello {{name}}, your balance is {{balance}}.';
      const variables = {
        name: 'John',
        // balance is missing
      };

      const result = renderSMSTemplate(template, variables);

      expect(result.content).toBe('Hello John, your balance is .');
      expect(result.truncated).toBe(false);
    });

    it('should truncate long messages', () => {
      const template =
        'This is a very long message that exceeds the maximum length limit. ' +
        'It contains a lot of text that should be truncated to fit within SMS limits. ' +
        'The truncation should happen at a reasonable point to maintain readability.';
      const variables = {};

      const result = renderSMSTemplate(template, variables, { maxLength: 100 });

      expect(result.content.length).toBeLessThanOrEqual(100);
      expect(result.truncated).toBe(true);
      expect(result.content).toMatch(/\.\.\.$/);
      expect(result.warnings.some(w => w.includes('truncated'))).toBe(true);
    });

    it('should preserve URLs when truncating', () => {
      const template =
        'Check out this amazing offer at https://example.com/very-long-url-path?param=value&another=param. ' +
        'This message is too long and needs to be truncated but we want to keep the URL intact.';
      const variables = {};

      const result = renderSMSTemplate(template, variables, {
        maxLength: 120,
        preserveUrls: true,
      });

      expect(result.content).toContain(
        'https://example.com/very-long-url-path?param=value&another=param'
      );
      expect(result.truncated).toBe(true);
    });

    it('should remove emojis when requested', () => {
      const template = 'Hello {{name}}! 🎉 Your order is ready! 🚀';
      const variables = { name: 'John' };

      const result = renderSMSTemplate(template, variables, {
        removeEmojis: true,
      });

      expect(result.content).toBe('Hello John! Your order is ready!');
      expect(result.content).not.toMatch(/[🎉🚀]/);
    });

    it('should calculate SMS segments correctly for GSM characters', () => {
      const shortMessage = 'Short message';
      const mediumMessage = 'A'.repeat(160);
      const longMessage = 'A'.repeat(320);

      const shortResult = renderSMSTemplate(shortMessage, {});
      const mediumResult = renderSMSTemplate(mediumMessage, {});
      const longResult = renderSMSTemplate(longMessage, {});

      expect(shortResult.segmentCount).toBe(1);
      expect(mediumResult.segmentCount).toBe(1);
      expect(longResult.segmentCount).toBe(3); // 320 chars / 153 chars per segment (with UDH)
    });

    it('should calculate SMS segments correctly for Unicode characters', () => {
      const unicodeMessage =
        'Hello 世界! This message contains Unicode characters.';
      const result = renderSMSTemplate(unicodeMessage, {});

      expect(result.segmentCount).toBe(1);
      expect(result.warnings.some(w => w.includes('Unicode'))).toBe(true);
    });

    it('should handle Handlebars helpers', () => {
      const template =
        'Hello {{upper name}}, your balance is {{currency amount "USD"}}.';
      const variables = {
        name: 'john',
        amount: 123.45,
      };

      const result = renderSMSTemplate(template, variables);

      expect(result.content).toBe('Hello JOHN, your balance is $123.45.');
    });

    it('should handle conditional content', () => {
      const template =
        'Hello {{name}}{{#if premium}}, you are a premium member{{/if}}!';
      const variables = {
        name: 'John',
        premium: true,
      };

      const result = renderSMSTemplate(template, variables);

      expect(result.content).toBe('Hello John, you are a premium member!');
    });

    it('should handle date formatting', () => {
      const template = 'Your appointment is on {{formatDate date "short"}}.';
      const variables = {
        date: new Date('2023-12-25'),
      };

      const result = renderSMSTemplate(template, variables);

      expect(result.content).toMatch(
        /Your appointment is on \d{1,2}\/\d{1,2}\/\d{4}\./
      );
    });
  });

  describe('validateSMSTemplate', () => {
    it('should validate correct templates', () => {
      const validTemplates = [
        'Hello {{name}}!',
        'Your order #{{orderNumber}} is {{status}}.',
        'Welcome to our service, {{firstName}} {{lastName}}!',
      ];

      validTemplates.forEach(template => {
        const result = validateSMSTemplate(template);
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });

    it('should detect template compilation errors', () => {
      const invalidTemplates = [
        'Hello {{name}!', // Missing closing brace
        'Hello {{#if name}}{{name}{{/unless}}!', // Mismatched helpers
        'Hello {{name.invalid.syntax}}!', // Invalid syntax
      ];

      invalidTemplates.forEach(template => {
        const result = validateSMSTemplate(template);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    it('should warn about long templates', () => {
      const longTemplate = 'A'.repeat(2000);
      const result = validateSMSTemplate(longTemplate);

      expect(
        result.warnings.some(w => w.includes('longer than typical SMS limit'))
      ).toBe(true);
    });

    it('should warn about Unicode characters', () => {
      const unicodeTemplate = 'Hello 世界! Welcome to our service.';
      const result = validateSMSTemplate(unicodeTemplate);

      expect(result.warnings.some(w => w.includes('Unicode characters'))).toBe(
        true
      );
    });

    it('should warn about potentially problematic patterns', () => {
      const templatesWithWarnings = [
        {
          template: '{{#each items}}Item: {{name}}\n{{/each}}',
          warning: 'Each loops',
        },
        {
          template: '{{#if condition}}Yes{{else}}No{{/if}}',
          warning: 'Conditional blocks',
        },
        {
          template: 'Visit https://example.com/very-long-url',
          warning: 'URLs detected',
        },
      ];

      templatesWithWarnings.forEach(({ template, warning }) => {
        const result = validateSMSTemplate(template);
        expect(result.warnings.some(w => w.includes(warning))).toBe(true);
      });
    });
  });

  describe('extractSMSTemplateVariables', () => {
    it('should extract simple variables', () => {
      const template = 'Hello {{name}}, your order #{{orderNumber}} is ready!';
      const variables = extractSMSTemplateVariables(template);

      expect(variables).toContain('name');
      expect(variables).toContain('orderNumber');
      expect(variables).toHaveLength(2);
    });

    it('should extract nested variables', () => {
      const template =
        'Hello {{user.firstName}}, your account {{account.id}} is active.';
      const variables = extractSMSTemplateVariables(template);

      expect(variables).toContain('user');
      expect(variables).toContain('account');
      expect(variables).toHaveLength(2);
    });

    it('should ignore Handlebars helpers and control structures', () => {
      const template =
        '{{#if condition}}Hello {{name}}{{else}}Hi {{name}}{{/if}}';
      const variables = extractSMSTemplateVariables(template);

      expect(variables).toContain('condition');
      expect(variables).toContain('name');
      expect(variables).not.toContain('#if');
      expect(variables).not.toContain('else');
      expect(variables).not.toContain('/if');
    });

    it('should handle variables with helpers', () => {
      const template = 'Hello {{upper name}}, balance: {{currency amount}}';
      const variables = extractSMSTemplateVariables(template);

      expect(variables).toContain('name');
      expect(variables).toContain('amount');
      expect(variables).not.toContain('upper');
      expect(variables).not.toContain('currency');
    });

    it('should deduplicate variables', () => {
      const template = 'Hello {{name}}, {{name}}! Your name is {{name}}.';
      const variables = extractSMSTemplateVariables(template);

      expect(variables).toContain('name');
      expect(variables).toHaveLength(1);
    });
  });

  describe('createPersonalizedSMSTemplate', () => {
    it('should apply personalization rules', () => {
      const baseTemplate = 'Hello {{greeting}}, your {{item}} is ready!';
      const personalizationRules = {
        greeting: 'Dear Customer',
        item: 'order',
      };

      const personalized = createPersonalizedSMSTemplate(
        baseTemplate,
        personalizationRules
      );

      expect(personalized).toBe('Hello Dear Customer, your order is ready!');
    });

    it('should handle multiple occurrences', () => {
      const baseTemplate = '{{greeting}} {{name}}, {{greeting}} again!';
      const personalizationRules = {
        greeting: 'Hello',
      };

      const personalized = createPersonalizedSMSTemplate(
        baseTemplate,
        personalizationRules
      );

      expect(personalized).toBe('Hello {{name}}, Hello again!');
    });

    it('should leave unmatched variables unchanged', () => {
      const baseTemplate = 'Hello {{name}}, your {{status}} is {{value}}.';
      const personalizationRules = {
        status: 'order',
      };

      const personalized = createPersonalizedSMSTemplate(
        baseTemplate,
        personalizationRules
      );

      expect(personalized).toBe('Hello {{name}}, your order is {{value}}.');
    });
  });

  describe('Truncation Strategies', () => {
    const longMessage =
      'This is a very long message that needs to be truncated. ' +
      'It contains important information that should be preserved when possible. ' +
      'The truncation should be smart and maintain readability.';

    it('should truncate at end', () => {
      const result = renderSMSTemplate(
        longMessage,
        {},
        {
          maxLength: 100,
          truncateStrategy: 'end',
        }
      );

      expect(result.content.length).toBeLessThanOrEqual(100);
      expect(result.content).toMatch(/\.\.\.$/);
      expect(result.content).toMatch(/^This is a very long message/);
    });

    it('should truncate in middle', () => {
      const result = renderSMSTemplate(
        longMessage,
        {},
        {
          maxLength: 100,
          truncateStrategy: 'middle',
        }
      );

      expect(result.content.length).toBeLessThanOrEqual(100);
      expect(result.content).toMatch(/\.\.\./);
      expect(result.content).toMatch(/^This is a very/);
      expect(result.content).toMatch(/readability\.$/);
    });

    it('should use smart truncation', () => {
      const result = renderSMSTemplate(
        longMessage,
        {},
        {
          maxLength: 100,
          truncateStrategy: 'smart',
        }
      );

      expect(result.content.length).toBeLessThanOrEqual(100);
      expect(result.content).toMatch(/\.\.\.$/);
      // Smart truncation should try to break at word boundaries
      expect(result.content).not.toMatch(/\w\.\.\./); // Shouldn't break in middle of word
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty template', () => {
      const result = renderSMSTemplate('', {});

      expect(result.content).toBe('');
      expect(result.length).toBe(0);
      expect(result.segmentCount).toBe(1);
      expect(result.truncated).toBe(false);
    });

    it('should handle template with only whitespace', () => {
      const result = renderSMSTemplate('   \n\t   ', {});

      expect(result.content).toBe('');
      expect(result.length).toBe(0);
    });

    it('should handle template with no variables', () => {
      const template = 'This is a static message with no variables.';
      const result = renderSMSTemplate(template, {});

      expect(result.content).toBe(template);
      expect(result.segmentCount).toBe(1);
    });

    it('should handle complex nested objects', () => {
      const template =
        'Hello {{user.profile.name}}, order {{order.details.number}} shipped to {{order.shipping.address.city}}.';
      const variables = {
        user: {
          profile: {
            name: 'John Doe',
          },
        },
        order: {
          details: {
            number: 'ORD-123',
          },
          shipping: {
            address: {
              city: 'New York',
            },
          },
        },
      };

      const result = renderSMSTemplate(template, variables);

      expect(result.content).toBe(
        'Hello John Doe, order ORD-123 shipped to New York.'
      );
    });

    it('should handle arrays in templates', () => {
      const template =
        'Items: {{#each items}}{{name}}{{#unless @last}}, {{/unless}}{{/each}}.';
      const variables = {
        items: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Orange' }],
      };

      const result = renderSMSTemplate(template, variables);

      expect(result.content).toBe('Items: Apple, Banana, Orange.');
    });
  });
});
