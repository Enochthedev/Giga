/**
 * Template engine interfaces
 */

import {
  EmailTemplate,
  RenderedTemplate,
  Template,
  TemplateDefinition,
  TemplateFilters,
  TemplatePreview,
  TemplateVariables,
  ValidationResult
} from '../types';

export interface ITemplateEngine {
  // Template rendering
  renderTemplate(templateId: string, variables: TemplateVariables, language?: string): Promise<RenderedTemplate>;
  renderEmailTemplate(templateId: string, variables: TemplateVariables, language?: string): Promise<EmailTemplate>;
  renderSMSTemplate(templateId: string, variables: TemplateVariables, language?: string): Promise<string>;
  renderPushTemplate(templateId: string, variables: TemplateVariables, language?: string): Promise<{ title: string; body: string }>;
  renderInAppTemplate(templateId: string, variables: TemplateVariables, language?: string): Promise<{ title: string; body: string; actionText?: string }>;

  // Template management
  createTemplate(template: TemplateDefinition): Promise<Template>;
  updateTemplate(templateId: string, updates: Partial<TemplateDefinition>): Promise<Template>;
  deleteTemplate(templateId: string): Promise<boolean>;
  getTemplate(templateId: string): Promise<Template>;
  listTemplates(filters?: TemplateFilters): Promise<Template[]>;

  // Template validation
  validateTemplate(template: TemplateDefinition): Promise<ValidationResult>;
  validateTemplateVariables(templateId: string, variables: TemplateVariables): Promise<ValidationResult>;
  previewTemplate(templateId: string, sampleData: TemplateVariables, language?: string): Promise<TemplatePreview>;

  // Template versioning
  createTemplateVersion(templateId: string, content: any, changelog?: string): Promise<Template>;
  activateTemplateVersion(templateId: string, versionId: string): Promise<Template>;
  getTemplateVersions(templateId: string): Promise<Template>;

  // Template compilation and caching
  compileTemplate(templateId: string, language?: string): Promise<void>;
  clearTemplateCache(templateId?: string): Promise<void>;

  // Bulk operations
  importTemplates(templates: TemplateDefinition[]): Promise<{ imported: Template[]; failed: Array<{ template: TemplateDefinition; error: string }> }>;
  exportTemplates(templateIds?: string[]): Promise<TemplateDefinition[]>;
}