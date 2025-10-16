/**
 * Template management types and interfaces
 */

import {
  NotificationCategory,
  NotificationChannel,
  TemplateVariables,
} from './notification.types';

export interface Template {
  id: string;
  name: string;
  description?: string;
  category: NotificationCategory;
  channels: NotificationChannel[];

  // Template content
  versions: TemplateVersion[];
  activeVersion: string;

  // Localization
  languages: string[];
  defaultLanguage: string;

  // Variables and validation
  requiredVariables: string[];
  optionalVariables: string[];
  variableSchema?: Record<string, any>;

  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface TemplateVersion {
  id: string;
  version: string;
  content: TemplateContent;
  changelog?: string;
  createdAt: Date;
  isActive: boolean;
}

export interface TemplateContent {
  [language: string]: {
    email?: {
      subject: string;
      htmlBody: string;
      textBody: string;
    };
    sms?: {
      body: string;
    };
    push?: {
      title: string;
      body: string;
    };
    inApp?: {
      title: string;
      body: string;
      actionText?: string;
    };
  };
}

export interface TemplateDefinition {
  name: string;
  description?: string;
  category: NotificationCategory;
  channels: NotificationChannel[];
  content: TemplateContent;
  requiredVariables?: string[];
  optionalVariables?: string[];
  variableSchema?: Record<string, any>;
  languages?: string[];
  defaultLanguage?: string;
}

export interface RenderedTemplate {
  channel: NotificationChannel;
  language: string;
  content: RenderedContent;
  variables: TemplateVariables;
  renderedAt: Date;
}

export interface RenderedContent {
  subject?: string;
  htmlBody?: string;
  textBody?: string;
  smsBody?: string;
  pushTitle?: string;
  pushBody?: string;
  inAppTitle?: string;
  inAppBody?: string;
  actionText?: string;
}

export interface EmailTemplate {
  subject: string;
  htmlBody: string;
  textBody: string;
  language: string;
  variables: TemplateVariables;
}

export interface TemplateFilters {
  category?: NotificationCategory;
  channels?: NotificationChannel[];
  languages?: string[];
  isActive?: boolean;
  createdBy?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  code: string;
}

export interface CompiledTemplate {
  templateId: string;
  version: string;
  language: string;
  channel: NotificationChannel;
  compiledContent: any; // Handlebars compiled template
  requiredVariables: string[];
  compiledAt: Date;
}

export interface TemplatePreview {
  templateId: string;
  channel: NotificationChannel;
  language: string;
  renderedContent: RenderedContent;
  sampleData: TemplateVariables;
  previewedAt: Date;
}
