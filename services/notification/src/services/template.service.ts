/**
 * Template Engine Service with Handlebars integration
 */

import Handlebars from 'handlebars';
import { ITemplateEngine } from '../interfaces';
import { prisma } from '../lib/database';
import logger from '../lib/logger';
import {
  EmailTemplate,
  NotificationCategory,
  NotificationChannel,
  RenderedContent,
  RenderedTemplate,
  Template,
  TemplateContent,
  TemplateDefinition,
  TemplateFilters,
  TemplatePreview,
  TemplateVariables,
  ValidationResult,
} from '../types';

export class TemplateEngineService implements ITemplateEngine {
  private compiledTemplateCache = new Map<string, any>();
  private readonly CACHE_TTL = 3600000; // 1 hour in milliseconds

  constructor() {
    this.registerHandlebarsHelpers();
  }

  /**
   * Register custom Handlebars helpers
   */
  private registerHandlebarsHelpers(): void {
    // Date formatting helper
    Handlebars.registerHelper('formatDate', (date: Date, format: string) => {
      if (!date) return '';
      const d = new Date(date);

      switch (format) {
        case 'short':
          return d.toLocaleDateString();
        case 'long':
          return d.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        case 'time':
          return d.toLocaleTimeString();
        default:
          return d.toISOString();
      }
    });

    // Currency formatting helper
    Handlebars.registerHelper(
      'formatCurrency',
      (amount: number, currency = 'USD') => {
        if (typeof amount !== 'number') return amount;
        try {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
          }).format(amount);
        } catch (error) {
          // Fallback for invalid currency codes
          return `$${amount.toFixed(2)}`;
        }
      }
    );

    // Conditional helper
    Handlebars.registerHelper(
      'ifEquals',
      function (this: any, arg1: any, arg2: any, options: any) {
        return arg1 === arg2 ? options.fn(this) : options.inverse(this);
      }
    );

    // Uppercase helper
    Handlebars.registerHelper('uppercase', (str: string) => {
      return typeof str === 'string' ? str.toUpperCase() : str;
    });

    // Lowercase helper
    Handlebars.registerHelper('lowercase', (str: string) => {
      return typeof str === 'string' ? str.toLowerCase() : str;
    });

    // Truncate helper
    Handlebars.registerHelper('truncate', (str: string, length: number) => {
      if (typeof str !== 'string') return str;
      return str.length > length ? str.substring(0, length) + '...' : str;
    });
  }

  /**
   * Render template for any channel
   */
  async renderTemplate(
    templateId: string,
    variables: TemplateVariables,
    language = 'en'
  ): Promise<RenderedTemplate> {
    try {
      const template = await this.getTemplate(templateId);
      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }

      const activeVersion = template.versions.find(v => v.isActive);
      if (!activeVersion) {
        throw new Error(`No active version found for template: ${templateId}`);
      }

      const languageContent =
        activeVersion.content[language] ||
        activeVersion.content[template.defaultLanguage];

      if (!languageContent) {
        throw new Error(`No content found for language: ${language}`);
      }

      // Validate required variables
      const validation = await this.validateTemplateVariables(
        templateId,
        variables
      );
      if (!validation.isValid) {
        throw new Error(
          `Template validation failed: ${validation.errors.map(e => e.message).join(', ')}`
        );
      }

      const renderedContent: RenderedContent = {};

      // Render content for each channel
      for (const channel of template.channels) {
        const channelContent =
          languageContent[channel as keyof typeof languageContent];
        if (channelContent) {
          switch (channel) {
            case NotificationChannel.EMAIL:
              if (
                'subject' in channelContent &&
                'htmlBody' in channelContent &&
                'textBody' in channelContent
              ) {
                renderedContent.subject = await this.renderString(
                  channelContent.subject,
                  variables
                );
                renderedContent.htmlBody = await this.renderString(
                  channelContent.htmlBody,
                  variables
                );
                renderedContent.textBody = await this.renderString(
                  channelContent.textBody,
                  variables
                );
              }
              break;
            case NotificationChannel.SMS:
              if ('body' in channelContent) {
                renderedContent.smsBody = await this.renderString(
                  channelContent.body,
                  variables
                );
              }
              break;
            case NotificationChannel.PUSH:
              if ('title' in channelContent && 'body' in channelContent) {
                renderedContent.pushTitle = await this.renderString(
                  channelContent.title,
                  variables
                );
                renderedContent.pushBody = await this.renderString(
                  channelContent.body,
                  variables
                );
              }
              break;
            case NotificationChannel.IN_APP:
              if ('title' in channelContent && 'body' in channelContent) {
                renderedContent.inAppTitle = await this.renderString(
                  channelContent.title,
                  variables
                );
                renderedContent.inAppBody = await this.renderString(
                  channelContent.body,
                  variables
                );
                if (
                  'actionText' in channelContent &&
                  channelContent.actionText
                ) {
                  renderedContent.actionText = await this.renderString(
                    channelContent.actionText,
                    variables
                  );
                }
              }
              break;
          }
        }
      }

      return {
        channel: template.channels[0] as NotificationChannel, // Primary channel
        language,
        content: renderedContent,
        variables,
        renderedAt: new Date(),
      };
    } catch (error) {
      logger.error('Failed to render template', {
        templateId,
        language,
        error,
      });
      throw error;
    }
  }

  /**
   * Render email template specifically
   */
  async renderEmailTemplate(
    templateId: string,
    variables: TemplateVariables,
    language = 'en'
  ): Promise<EmailTemplate> {
    try {
      const template = await this.getTemplate(templateId);
      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }

      if (!template.channels.includes(NotificationChannel.EMAIL)) {
        throw new Error(
          `Template ${templateId} does not support email channel`
        );
      }

      const activeVersion = template.versions.find(v => v.isActive);
      if (!activeVersion) {
        throw new Error(`No active version found for template: ${templateId}`);
      }

      const languageContent =
        activeVersion.content[language] ||
        activeVersion.content[template.defaultLanguage];

      if (!languageContent?.email) {
        throw new Error(`No email content found for language: ${language}`);
      }

      // Validate required variables
      const validation = await this.validateTemplateVariables(
        templateId,
        variables
      );
      if (!validation.isValid) {
        throw new Error(
          `Template validation failed: ${validation.errors.map(e => e.message).join(', ')}`
        );
      }

      const emailContent = languageContent.email;

      return {
        subject: await this.renderString(emailContent.subject, variables),
        htmlBody: await this.renderString(emailContent.htmlBody, variables),
        textBody: await this.renderString(emailContent.textBody, variables),
        language,
        variables,
      };
    } catch (error) {
      logger.error('Failed to render email template', {
        templateId,
        language,
        error,
      });
      throw error;
    }
  }

  /**
   * Render SMS template specifically
   */
  async renderSMSTemplate(
    templateId: string,
    variables: TemplateVariables,
    language = 'en'
  ): Promise<string> {
    try {
      const template = await this.getTemplate(templateId);
      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }

      if (!template.channels.includes(NotificationChannel.SMS)) {
        throw new Error(`Template ${templateId} does not support SMS channel`);
      }

      const activeVersion = template.versions.find(v => v.isActive);
      if (!activeVersion) {
        throw new Error(`No active version found for template: ${templateId}`);
      }

      const languageContent =
        activeVersion.content[language] ||
        activeVersion.content[template.defaultLanguage];

      if (!languageContent?.sms) {
        throw new Error(`No SMS content found for language: ${language}`);
      }

      // Validate required variables
      const validation = await this.validateTemplateVariables(
        templateId,
        variables
      );
      if (!validation.isValid) {
        throw new Error(
          `Template validation failed: ${validation.errors.map(e => e.message).join(', ')}`
        );
      }

      return await this.renderString(languageContent.sms.body, variables);
    } catch (error) {
      logger.error('Failed to render SMS template', {
        templateId,
        language,
        error,
      });
      throw error;
    }
  }

  /**
   * Render push notification template specifically
   */
  async renderPushTemplate(
    templateId: string,
    variables: TemplateVariables,
    language = 'en'
  ): Promise<{ title: string; body: string }> {
    try {
      const template = await this.getTemplate(templateId);
      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }

      if (!template.channels.includes(NotificationChannel.PUSH)) {
        throw new Error(`Template ${templateId} does not support push channel`);
      }

      const activeVersion = template.versions.find(v => v.isActive);
      if (!activeVersion) {
        throw new Error(`No active version found for template: ${templateId}`);
      }

      const languageContent =
        activeVersion.content[language] ||
        activeVersion.content[template.defaultLanguage];

      if (!languageContent?.push) {
        throw new Error(`No push content found for language: ${language}`);
      }

      // Validate required variables
      const validation = await this.validateTemplateVariables(
        templateId,
        variables
      );
      if (!validation.isValid) {
        throw new Error(
          `Template validation failed: ${validation.errors.map(e => e.message).join(', ')}`
        );
      }

      const pushContent = languageContent.push;

      return {
        title: await this.renderString(pushContent.title, variables),
        body: await this.renderString(pushContent.body, variables),
      };
    } catch (error) {
      logger.error('Failed to render push template', {
        templateId,
        language,
        error,
      });
      throw error;
    }
  }

  /**
   * Render in-app notification template specifically
   */
  async renderInAppTemplate(
    templateId: string,
    variables: TemplateVariables,
    language = 'en'
  ): Promise<{ title: string; body: string; actionText?: string }> {
    try {
      const template = await this.getTemplate(templateId);
      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }

      if (!template.channels.includes(NotificationChannel.IN_APP)) {
        throw new Error(
          `Template ${templateId} does not support in-app channel`
        );
      }

      const activeVersion = template.versions.find(v => v.isActive);
      if (!activeVersion) {
        throw new Error(`No active version found for template: ${templateId}`);
      }

      const languageContent =
        activeVersion.content[language] ||
        activeVersion.content[template.defaultLanguage];

      if (!languageContent?.inApp) {
        throw new Error(`No in-app content found for language: ${language}`);
      }

      // Validate required variables
      const validation = await this.validateTemplateVariables(
        templateId,
        variables
      );
      if (!validation.isValid) {
        throw new Error(
          `Template validation failed: ${validation.errors.map(e => e.message).join(', ')}`
        );
      }

      const inAppContent = languageContent.inApp;

      const result = {
        title: await this.renderString(inAppContent.title, variables),
        body: await this.renderString(inAppContent.body, variables),
      } as { title: string; body: string; actionText?: string };

      if (inAppContent.actionText) {
        result.actionText = await this.renderString(
          inAppContent.actionText,
          variables
        );
      }

      return result;
    } catch (error) {
      logger.error('Failed to render in-app template', {
        templateId,
        language,
        error,
      });
      throw error;
    }
  }

  /**
   * Render a string template with variables
   */
  private async renderString(
    template: string,
    variables: TemplateVariables
  ): Promise<string> {
    try {
      const compiledTemplate = Handlebars.compile(template);
      return compiledTemplate(variables);
    } catch (error) {
      logger.error('Failed to render string template', {
        template,
        variables,
        error,
      });
      throw new Error(
        `Template rendering failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Create a new template
   */
  async createTemplate(templateDef: TemplateDefinition): Promise<Template> {
    try {
      // Validate template definition
      const validation = await this.validateTemplate(templateDef);
      if (!validation.isValid) {
        throw new Error(
          `Template validation failed: ${validation.errors.map(e => e.message).join(', ')}`
        );
      }

      const template = await prisma.template.create({
        data: {
          name: templateDef.name,
          description: templateDef.description,
          category: templateDef.category,
          channels: templateDef.channels,
          languages: templateDef.languages || ['en'],
          defaultLanguage: templateDef.defaultLanguage || 'en',
          requiredVariables: templateDef.requiredVariables || [],
          optionalVariables: templateDef.optionalVariables || [],
          variableSchema: templateDef.variableSchema || {},
          createdBy: 'system', // TODO: Get from context
          versions: {
            create: {
              version: '1.0.0',
              content: templateDef.content,
              isActive: true,
            },
          },
          activeVersion: '1.0.0',
        },
        include: {
          versions: true,
        },
      });

      // Clear cache for this template
      await this.clearTemplateCache(template.id);

      return this.mapPrismaTemplateToTemplate(template);
    } catch (error) {
      logger.error('Failed to create template', { templateDef, error });
      throw error;
    }
  }

  /**
   * Update an existing template
   */
  async updateTemplate(
    templateId: string,
    updates: Partial<TemplateDefinition>
  ): Promise<Template> {
    try {
      const existingTemplate = await prisma.template.findUnique({
        where: { id: templateId },
        include: { versions: true },
      });

      if (!existingTemplate) {
        throw new Error(`Template not found: ${templateId}`);
      }

      // If content is being updated, create a new version
      let newVersionData = undefined;
      if (updates.content) {
        const activeVersion = existingTemplate.versions.find(
          (v: any) => v.isActive
        );
        const currentVersion = activeVersion?.version || '1.0.0';
        const versionParts = currentVersion.split('.').map(Number);
        versionParts[1]++; // Increment minor version
        const newVersion = versionParts.join('.');

        newVersionData = {
          version: newVersion,
          content: updates.content,
          isActive: true,
        };

        // Deactivate current version
        if (activeVersion) {
          await prisma.templateVersion.update({
            where: { id: activeVersion.id },
            data: { isActive: false },
          });
        }
      }

      const updatedTemplate = await prisma.template.update({
        where: { id: templateId },
        data: {
          ...(updates.name && { name: updates.name }),
          ...(updates.description !== undefined && {
            description: updates.description,
          }),
          ...(updates.category && { category: updates.category }),
          ...(updates.channels && { channels: updates.channels }),
          ...(updates.languages && { languages: updates.languages }),
          ...(updates.defaultLanguage && {
            defaultLanguage: updates.defaultLanguage,
          }),
          ...(updates.requiredVariables && {
            requiredVariables: updates.requiredVariables,
          }),
          ...(updates.optionalVariables && {
            optionalVariables: updates.optionalVariables,
          }),
          ...(updates.variableSchema && {
            variableSchema: updates.variableSchema,
          }),
          ...(newVersionData && {
            versions: {
              create: newVersionData,
            },
            activeVersion: newVersionData.version,
          }),
        },
        include: {
          versions: true,
        },
      });

      // Clear cache for this template
      await this.clearTemplateCache(templateId);

      return this.mapPrismaTemplateToTemplate(updatedTemplate);
    } catch (error) {
      logger.error('Failed to update template', { templateId, updates, error });
      throw error;
    }
  }

  /**
   * Delete a template
   */
  async deleteTemplate(templateId: string): Promise<boolean> {
    try {
      await prisma.template.delete({
        where: { id: templateId },
      });

      // Clear cache for this template
      await this.clearTemplateCache(templateId);

      return true;
    } catch (error) {
      logger.error('Failed to delete template', { templateId, error });
      return false;
    }
  }

  /**
   * Get a template by ID
   */
  async getTemplate(templateId: string): Promise<Template> {
    try {
      const template = await prisma.template.findUnique({
        where: { id: templateId },
        include: { versions: true },
      });

      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }

      return this.mapPrismaTemplateToTemplate(template);
    } catch (error) {
      logger.error('Failed to get template', { templateId, error });
      throw error;
    }
  }

  /**
   * List templates with optional filters
   */
  async listTemplates(filters?: TemplateFilters): Promise<Template[]> {
    try {
      const where: any = {};

      if (filters?.category) {
        where.category = filters.category;
      }

      if (filters?.channels && filters.channels.length > 0) {
        where.channels = {
          hasSome: filters.channels,
        };
      }

      if (filters?.languages && filters.languages.length > 0) {
        where.languages = {
          hasSome: filters.languages,
        };
      }

      if (filters?.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      if (filters?.createdBy) {
        where.createdBy = filters.createdBy;
      }

      if (filters?.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const templates = await prisma.template.findMany({
        where,
        include: { versions: true },
        orderBy: { createdAt: 'desc' },
        ...(filters?.limit && { take: filters.limit }),
        ...(filters?.offset && { skip: filters.offset }),
      });

      return templates.map(this.mapPrismaTemplateToTemplate);
    } catch (error) {
      logger.error('Failed to list templates', { filters, error });
      throw error;
    }
  }

  /**
   * Validate template definition
   */
  async validateTemplate(
    template: TemplateDefinition
  ): Promise<ValidationResult> {
    const errors: any[] = [];
    const warnings: any[] = [];

    // Validate required fields
    if (!template.name || template.name.trim().length === 0) {
      errors.push({
        field: 'name',
        message: 'Template name is required',
        code: 'REQUIRED_FIELD',
      });
    }

    if (!template.category) {
      errors.push({
        field: 'category',
        message: 'Template category is required',
        code: 'REQUIRED_FIELD',
      });
    }

    if (!template.channels || template.channels.length === 0) {
      errors.push({
        field: 'channels',
        message: 'At least one channel is required',
        code: 'REQUIRED_FIELD',
      });
    }

    if (!template.content) {
      errors.push({
        field: 'content',
        message: 'Template content is required',
        code: 'REQUIRED_FIELD',
      });
    }

    // Validate content structure
    if (template.content) {
      const languages = template.languages || ['en'];
      for (const language of languages) {
        const languageContent = template.content[language];
        if (!languageContent) {
          errors.push({
            field: `content.${language}`,
            message: `Content for language '${language}' is missing`,
            code: 'MISSING_LANGUAGE_CONTENT',
          });
          continue;
        }

        // Validate channel-specific content
        for (const channel of template.channels) {
          const channelContent =
            languageContent[channel as keyof typeof languageContent];
          if (!channelContent) {
            errors.push({
              field: `content.${language}.${channel}`,
              message: `Content for channel '${channel}' in language '${language}' is missing`,
              code: 'MISSING_CHANNEL_CONTENT',
            });
            continue;
          }

          // Validate channel-specific required fields
          switch (channel) {
            case NotificationChannel.EMAIL:
              if (
                !('subject' in channelContent) ||
                !('htmlBody' in channelContent) ||
                !('textBody' in channelContent)
              ) {
                errors.push({
                  field: `content.${language}.${channel}`,
                  message: `Email content must have subject, htmlBody, and textBody`,
                  code: 'INVALID_EMAIL_CONTENT',
                });
              }
              break;
            case NotificationChannel.SMS:
              if (!('body' in channelContent)) {
                errors.push({
                  field: `content.${language}.${channel}`,
                  message: `SMS content must have body`,
                  code: 'INVALID_SMS_CONTENT',
                });
              }
              break;
            case NotificationChannel.PUSH:
              if (!('title' in channelContent) || !('body' in channelContent)) {
                errors.push({
                  field: `content.${language}.${channel}`,
                  message: `Push content must have title and body`,
                  code: 'INVALID_PUSH_CONTENT',
                });
              }
              break;
            case NotificationChannel.IN_APP:
              if (!('title' in channelContent) || !('body' in channelContent)) {
                errors.push({
                  field: `content.${language}.${channel}`,
                  message: `In-app content must have title and body`,
                  code: 'INVALID_IN_APP_CONTENT',
                });
              }
              break;
          }
        }
      }
    }

    // Validate template syntax
    if (template.content && errors.length === 0) {
      try {
        const languages = template.languages || ['en'];
        for (const language of languages) {
          const languageContent = template.content[language];
          if (languageContent) {
            for (const channel of template.channels) {
              const channelContent =
                languageContent[channel as keyof typeof languageContent];
              if (channelContent) {
                // Try to compile each template string
                Object.values(channelContent).forEach((templateString: any) => {
                  if (typeof templateString === 'string') {
                    try {
                      Handlebars.compile(templateString);
                    } catch (syntaxError) {
                      errors.push({
                        field: `content.${language}.${channel}`,
                        message: `Template syntax error: ${syntaxError instanceof Error ? syntaxError.message : 'Unknown error'}`,
                        code: 'TEMPLATE_SYNTAX_ERROR',
                      });
                    }
                  }
                });
              }
            }
          }
        }
      } catch (error) {
        errors.push({
          field: 'content',
          message: `Template validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          code: 'TEMPLATE_VALIDATION_ERROR',
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate template variables
   */
  async validateTemplateVariables(
    templateId: string,
    variables: TemplateVariables
  ): Promise<ValidationResult> {
    try {
      const template = await this.getTemplate(templateId);
      const errors: any[] = [];
      const warnings: any[] = [];

      // Check required variables
      for (const requiredVar of template.requiredVariables) {
        if (
          !(requiredVar in variables) ||
          variables[requiredVar] === undefined ||
          variables[requiredVar] === null
        ) {
          errors.push({
            field: requiredVar,
            message: `Required variable '${requiredVar}' is missing`,
            code: 'MISSING_REQUIRED_VARIABLE',
          });
        }
      }

      // Check for unknown variables (warnings only)
      const allKnownVariables = [
        ...template.requiredVariables,
        ...template.optionalVariables,
      ];
      for (const varName of Object.keys(variables)) {
        if (!allKnownVariables.includes(varName)) {
          warnings.push({
            field: varName,
            message: `Unknown variable '${varName}' provided`,
            code: 'UNKNOWN_VARIABLE',
          });
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      logger.error('Failed to validate template variables', {
        templateId,
        variables,
        error,
      });
      throw error;
    }
  }

  /**
   * Preview template with sample data
   */
  async previewTemplate(
    templateId: string,
    sampleData: TemplateVariables,
    language = 'en'
  ): Promise<TemplatePreview> {
    try {
      const rendered = await this.renderTemplate(
        templateId,
        sampleData,
        language
      );

      return {
        templateId,
        channel: rendered.channel,
        language,
        renderedContent: rendered.content,
        sampleData,
        previewedAt: new Date(),
      };
    } catch (error) {
      logger.error('Failed to preview template', {
        templateId,
        sampleData,
        language,
        error,
      });
      throw error;
    }
  }

  /**
   * Create a new template version
   */
  async createTemplateVersion(
    templateId: string,
    content: any,
    changelog?: string
  ): Promise<Template> {
    try {
      const template = await prisma.template.findUnique({
        where: { id: templateId },
        include: { versions: true },
      });

      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }

      // Generate new version number
      const versions = template.versions.map((v: any) => v.version).sort();
      const latestVersion = versions[versions.length - 1] || '1.0.0';
      const versionParts = latestVersion.split('.').map(Number);
      versionParts[1]++; // Increment minor version
      const newVersion = versionParts.join('.');

      // Deactivate current active version
      const activeVersion = template.versions.find((v: any) => v.isActive);
      if (activeVersion) {
        await prisma.templateVersion.update({
          where: { id: activeVersion.id },
          data: { isActive: false },
        });
      }

      // Create new version
      await prisma.templateVersion.create({
        data: {
          templateId,
          version: newVersion,
          content,
          changelog,
          isActive: true,
        },
      });

      // Update template's active version
      const updatedTemplate = await prisma.template.update({
        where: { id: templateId },
        data: { activeVersion: newVersion },
        include: { versions: true },
      });

      // Clear cache for this template
      await this.clearTemplateCache(templateId);

      return this.mapPrismaTemplateToTemplate(updatedTemplate);
    } catch (error) {
      logger.error('Failed to create template version', {
        templateId,
        content,
        changelog,
        error,
      });
      throw error;
    }
  }

  /**
   * Activate a specific template version
   */
  async activateTemplateVersion(
    templateId: string,
    versionId: string
  ): Promise<Template> {
    try {
      const template = await prisma.template.findUnique({
        where: { id: templateId },
        include: { versions: true },
      });

      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }

      const targetVersion = template.versions.find(
        (v: any) => v.id === versionId
      );
      if (!targetVersion) {
        throw new Error(`Version not found: ${versionId}`);
      }

      // Deactivate all versions
      await prisma.templateVersion.updateMany({
        where: { templateId },
        data: { isActive: false },
      });

      // Activate target version
      await prisma.templateVersion.update({
        where: { id: versionId },
        data: { isActive: true },
      });

      // Update template's active version
      const updatedTemplate = await prisma.template.update({
        where: { id: templateId },
        data: { activeVersion: targetVersion.version },
        include: { versions: true },
      });

      // Clear cache for this template
      await this.clearTemplateCache(templateId);

      return this.mapPrismaTemplateToTemplate(updatedTemplate);
    } catch (error) {
      logger.error('Failed to activate template version', {
        templateId,
        versionId,
        error,
      });
      throw error;
    }
  }

  /**
   * Get template versions
   */
  async getTemplateVersions(templateId: string): Promise<Template> {
    return this.getTemplate(templateId);
  }

  /**
   * Compile template for caching
   */
  async compileTemplate(templateId: string, language = 'en'): Promise<void> {
    try {
      const template = await this.getTemplate(templateId);
      const activeVersion = template.versions.find(v => v.isActive);

      if (!activeVersion) {
        throw new Error(`No active version found for template: ${templateId}`);
      }

      const languageContent =
        activeVersion.content[language] ||
        activeVersion.content[template.defaultLanguage];

      if (!languageContent) {
        throw new Error(`No content found for language: ${language}`);
      }

      // Compile templates for each channel
      for (const channel of template.channels) {
        const channelContent =
          languageContent[channel as keyof typeof languageContent];
        if (channelContent) {
          const compiledContent: any = {};

          // Compile each template string
          Object.entries(channelContent).forEach(([key, value]) => {
            if (typeof value === 'string') {
              compiledContent[key] = Handlebars.compile(value);
            }
          });

          // Store compiled template in database
          await prisma.compiledTemplate.upsert({
            where: {
              templateId_version_language_channel: {
                templateId,
                version: activeVersion.version,
                language,
                channel,
              },
            },
            update: {
              compiledContent,
              requiredVariables: template.requiredVariables,
              compiledAt: new Date(),
              expiresAt: new Date(Date.now() + this.CACHE_TTL),
            },
            create: {
              templateId,
              version: activeVersion.version,
              language,
              channel,
              compiledContent,
              requiredVariables: template.requiredVariables,
              expiresAt: new Date(Date.now() + this.CACHE_TTL),
            },
          });

          // Also store in memory cache
          const cacheKey = `${templateId}:${activeVersion.version}:${language}:${channel}`;
          this.compiledTemplateCache.set(cacheKey, {
            compiled: compiledContent,
            expiresAt: Date.now() + this.CACHE_TTL,
          });
        }
      }
    } catch (error) {
      logger.error('Failed to compile template', {
        templateId,
        language,
        error,
      });
      throw error;
    }
  }

  /**
   * Clear template cache
   */
  async clearTemplateCache(templateId?: string): Promise<void> {
    try {
      if (templateId) {
        // Clear specific template from memory cache
        for (const key of this.compiledTemplateCache.keys()) {
          if (key.startsWith(`${templateId}:`)) {
            this.compiledTemplateCache.delete(key);
          }
        }

        // Clear from database cache
        await prisma.compiledTemplate.deleteMany({
          where: { templateId },
        });
      } else {
        // Clear all caches
        this.compiledTemplateCache.clear();
        await prisma.compiledTemplate.deleteMany();
      }
    } catch (error) {
      logger.error('Failed to clear template cache', { templateId, error });
      throw error;
    }
  }

  /**
   * Import templates in bulk
   */
  async importTemplates(templates: TemplateDefinition[]): Promise<{
    imported: Template[];
    failed: Array<{ template: TemplateDefinition; error: string }>;
  }> {
    const imported: Template[] = [];
    const failed: Array<{ template: TemplateDefinition; error: string }> = [];

    for (const templateDef of templates) {
      try {
        const template = await this.createTemplate(templateDef);
        imported.push(template);
      } catch (error) {
        failed.push({
          template: templateDef,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return { imported, failed };
  }

  /**
   * Export templates
   */
  async exportTemplates(templateIds?: string[]): Promise<TemplateDefinition[]> {
    try {
      const where = templateIds ? { id: { in: templateIds } } : {};

      const templates = await prisma.template.findMany({
        where,
        include: { versions: true },
      });

      return templates.map((template: any) => {
        const activeVersion = template.versions.find((v: any) => v.isActive);
        return {
          name: template.name,
          description: template.description || undefined,
          category: template.category as NotificationCategory,
          channels: template.channels as NotificationChannel[],
          content: (activeVersion?.content as TemplateContent) || {},
          requiredVariables: template.requiredVariables,
          optionalVariables: template.optionalVariables,
          variableSchema:
            (template.variableSchema as Record<string, any>) || undefined,
          languages: template.languages,
          defaultLanguage: template.defaultLanguage,
        };
      });
    } catch (error) {
      logger.error('Failed to export templates', { templateIds, error });
      throw error;
    }
  }

  /**
   * Map Prisma template to domain template
   */
  private mapPrismaTemplateToTemplate(prismaTemplate: any): Template {
    return {
      id: prismaTemplate.id,
      name: prismaTemplate.name,
      description: prismaTemplate.description,
      category: prismaTemplate.category as NotificationCategory,
      channels: prismaTemplate.channels as NotificationChannel[],
      versions: prismaTemplate.versions.map((v: any) => ({
        id: v.id,
        version: v.version,
        content: v.content as TemplateContent,
        changelog: v.changelog,
        createdAt: v.createdAt,
        isActive: v.isActive,
      })),
      activeVersion: prismaTemplate.activeVersion,
      languages: prismaTemplate.languages,
      defaultLanguage: prismaTemplate.defaultLanguage,
      requiredVariables: prismaTemplate.requiredVariables,
      optionalVariables: prismaTemplate.optionalVariables,
      variableSchema: prismaTemplate.variableSchema,
      createdBy: prismaTemplate.createdBy,
      createdAt: prismaTemplate.createdAt,
      updatedAt: prismaTemplate.updatedAt,
      isActive: prismaTemplate.isActive,
    };
  }
}

export default TemplateEngineService;
