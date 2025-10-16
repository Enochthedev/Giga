/**
 * Template Controller
 * Handles HTTP requests for template management operations
 */

import { Request, Response } from 'express';
import logger from '../lib/logger';
import { TemplateEngineService } from '../services/template.service';
import {
  NotificationCategory,
  NotificationChannel,
  TemplateDefinition,
  TemplateFilters,
} from '../types';

export class TemplateController {
  private templateService: TemplateEngineService;

  constructor() {
    this.templateService = new TemplateEngineService();
  }

  /**
   * Create a new template
   * POST /api/templates
   */
  async createTemplate(req: Request, res: Response): Promise<void> {
    try {
      const templateDef: TemplateDefinition = req.body;

      // Validate required fields
      if (
        !templateDef.name ||
        !templateDef.category ||
        !templateDef.channels ||
        !templateDef.content
      ) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: name, category, channels, content',
        });
        return;
      }

      const template = await this.templateService.createTemplate(templateDef);

      res.status(201).json({
        success: true,
        data: template,
      });
    } catch (error) {
      logger.error('Failed to create template', { error, body: req.body });
      res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to create template',
      });
    }
  }

  /**
   * Get template by ID
   * GET /api/templates/:id
   */
  async getTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Template ID is required',
        });
        return;
      }

      const template = await this.templateService.getTemplate(id);

      res.json({
        success: true,
        data: template,
      });
    } catch (error) {
      logger.error('Failed to get template', {
        error,
        templateId: req.params.id,
      });

      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: 'Template not found',
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to get template',
        });
      }
    }
  }

  /**
   * List templates with optional filters
   * GET /api/templates
   */
  async listTemplates(req: Request, res: Response): Promise<void> {
    try {
      const filters: TemplateFilters = {};

      // Parse query parameters
      if (req.query.category) {
        filters.category = req.query.category as NotificationCategory;
      }

      if (req.query.channels) {
        const channelsParam = req.query.channels as string;
        filters.channels = channelsParam.split(',') as NotificationChannel[];
      }

      if (req.query.languages) {
        const languagesParam = req.query.languages as string;
        filters.languages = languagesParam.split(',');
      }

      if (req.query.isActive !== undefined) {
        filters.isActive = req.query.isActive === 'true';
      }

      if (req.query.createdBy) {
        filters.createdBy = req.query.createdBy as string;
      }

      if (req.query.search) {
        filters.search = req.query.search as string;
      }

      if (req.query.limit) {
        filters.limit = parseInt(req.query.limit as string, 10);
      }

      if (req.query.offset) {
        filters.offset = parseInt(req.query.offset as string, 10);
      }

      const templates = await this.templateService.listTemplates(filters);

      res.json({
        success: true,
        data: templates,
        pagination: {
          limit: filters.limit,
          offset: filters.offset,
          total: templates.length,
        },
      });
    } catch (error) {
      logger.error('Failed to list templates', { error, query: req.query });
      res.status(500).json({
        success: false,
        error: 'Failed to list templates',
      });
    }
  }

  /**
   * Update template
   * PUT /api/templates/:id
   */
  async updateTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updates: Partial<TemplateDefinition> = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Template ID is required',
        });
        return;
      }

      const template = await this.templateService.updateTemplate(id, updates);

      res.json({
        success: true,
        data: template,
      });
    } catch (error) {
      logger.error('Failed to update template', {
        error,
        templateId: req.params.id,
        updates: req.body,
      });

      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: 'Template not found',
        });
      } else {
        res.status(400).json({
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to update template',
        });
      }
    }
  }

  /**
   * Delete template
   * DELETE /api/templates/:id
   */
  async deleteTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Template ID is required',
        });
        return;
      }

      const success = await this.templateService.deleteTemplate(id);

      if (success) {
        res.json({
          success: true,
          message: 'Template deleted successfully',
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Template not found',
        });
      }
    } catch (error) {
      logger.error('Failed to delete template', {
        error,
        templateId: req.params.id,
      });
      res.status(500).json({
        success: false,
        error: 'Failed to delete template',
      });
    }
  }

  /**
   * Validate template
   * POST /api/templates/validate
   */
  async validateTemplate(req: Request, res: Response): Promise<void> {
    try {
      const templateDef: TemplateDefinition = req.body;

      if (!templateDef || Object.keys(templateDef).length === 0) {
        res.status(400).json({
          success: false,
          error: 'Template definition is required',
        });
        return;
      }

      const validation =
        await this.templateService.validateTemplate(templateDef);

      res.json({
        success: true,
        data: validation,
      });
    } catch (error) {
      logger.error('Failed to validate template', { error, body: req.body });
      res.status(500).json({
        success: false,
        error: 'Failed to validate template',
      });
    }
  }

  /**
   * Preview template with sample data
   * POST /api/templates/:id/preview
   */
  async previewTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { variables, language = 'en' } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Template ID is required',
        });
        return;
      }

      if (!variables) {
        res.status(400).json({
          success: false,
          error: 'Variables are required for preview',
        });
        return;
      }

      const preview = await this.templateService.previewTemplate(
        id,
        variables,
        language
      );

      res.json({
        success: true,
        data: preview,
      });
    } catch (error) {
      logger.error('Failed to preview template', {
        error,
        templateId: req.params.id,
        body: req.body,
      });

      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: 'Template not found',
        });
      } else {
        res.status(400).json({
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to preview template',
        });
      }
    }
  }

  /**
   * Render template
   * POST /api/templates/:id/render
   */
  async renderTemplate(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { variables, language = 'en', channel } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Template ID is required',
        });
        return;
      }

      if (!variables) {
        res.status(400).json({
          success: false,
          error: 'Variables are required for rendering',
        });
        return;
      }

      let rendered;

      if (channel) {
        // Render for specific channel
        switch (channel) {
          case NotificationChannel.EMAIL:
            rendered = await this.templateService.renderEmailTemplate(
              id,
              variables,
              language
            );
            break;
          case NotificationChannel.SMS:
            rendered = await this.templateService.renderSMSTemplate(
              id,
              variables,
              language
            );
            break;
          case NotificationChannel.PUSH:
            rendered = await this.templateService.renderPushTemplate(
              id,
              variables,
              language
            );
            break;
          case NotificationChannel.IN_APP:
            rendered = await this.templateService.renderInAppTemplate(
              id,
              variables,
              language
            );
            break;
          default:
            res.status(400).json({
              success: false,
              error: 'Invalid channel specified',
            });
            return;
        }
      } else {
        // Render for all channels
        rendered = await this.templateService.renderTemplate(
          id,
          variables,
          language
        );
      }

      res.json({
        success: true,
        data: rendered,
      });
    } catch (error) {
      logger.error('Failed to render template', {
        error,
        templateId: req.params.id,
        body: req.body,
      });

      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: 'Template not found',
        });
      } else {
        res.status(400).json({
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to render template',
        });
      }
    }
  }

  /**
   * Create template version
   * POST /api/templates/:id/versions
   */
  async createTemplateVersion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { content, changelog } = req.body;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Template ID is required',
        });
        return;
      }

      if (!content) {
        res.status(400).json({
          success: false,
          error: 'Content is required for new version',
        });
        return;
      }

      const template = await this.templateService.createTemplateVersion(
        id,
        content,
        changelog
      );

      res.status(201).json({
        success: true,
        data: template,
      });
    } catch (error) {
      logger.error('Failed to create template version', {
        error,
        templateId: req.params.id,
        body: req.body,
      });

      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: 'Template not found',
        });
      } else {
        res.status(400).json({
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to create template version',
        });
      }
    }
  }

  /**
   * Activate template version
   * PUT /api/templates/:id/versions/:versionId/activate
   */
  async activateTemplateVersion(req: Request, res: Response): Promise<void> {
    try {
      const { id, versionId } = req.params;

      if (!id || !versionId) {
        res.status(400).json({
          success: false,
          error: 'Template ID and version ID are required',
        });
        return;
      }

      const template = await this.templateService.activateTemplateVersion(
        id,
        versionId
      );

      res.json({
        success: true,
        data: template,
      });
    } catch (error) {
      logger.error('Failed to activate template version', {
        error,
        templateId: req.params.id,
        versionId: req.params.versionId,
      });

      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: 'Template or version not found',
        });
      } else {
        res.status(400).json({
          success: false,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to activate template version',
        });
      }
    }
  }

  /**
   * Import templates
   * POST /api/templates/import
   */
  async importTemplates(req: Request, res: Response): Promise<void> {
    try {
      const { templates } = req.body;

      if (!templates || !Array.isArray(templates)) {
        res.status(400).json({
          success: false,
          error: 'Templates array is required',
        });
        return;
      }

      const result = await this.templateService.importTemplates(templates);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Failed to import templates', { error, body: req.body });
      res.status(500).json({
        success: false,
        error: 'Failed to import templates',
      });
    }
  }

  /**
   * Export templates
   * GET /api/templates/export
   */
  async exportTemplates(req: Request, res: Response): Promise<void> {
    try {
      let templateIds: string[] | undefined;

      if (req.query.ids) {
        templateIds = (req.query.ids as string).split(',');
      }

      const templates = await this.templateService.exportTemplates(templateIds);

      res.json({
        success: true,
        data: templates,
      });
    } catch (error) {
      logger.error('Failed to export templates', { error, query: req.query });
      res.status(500).json({
        success: false,
        error: 'Failed to export templates',
      });
    }
  }

  /**
   * Clear template cache
   * DELETE /api/templates/cache
   */
  async clearTemplateCache(req: Request, res: Response): Promise<void> {
    try {
      const { templateId } = req.query;

      await this.templateService.clearTemplateCache(templateId as string);

      res.json({
        success: true,
        message: templateId
          ? `Cache cleared for template ${templateId}`
          : 'All template caches cleared',
      });
    } catch (error) {
      logger.error('Failed to clear template cache', {
        error,
        query: req.query,
      });
      res.status(500).json({
        success: false,
        error: 'Failed to clear template cache',
      });
    }
  }
}

export default TemplateController;
