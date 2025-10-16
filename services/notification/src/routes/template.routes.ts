/**
 * Template Routes
 * Defines HTTP routes for template management operations
 */

import { Router } from 'express';
import TemplateController from '../controllers/template.controller';

const router: Router = Router();
const templateController = new TemplateController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Template:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - category
 *         - channels
 *         - versions
 *         - activeVersion
 *         - languages
 *         - defaultLanguage
 *         - requiredVariables
 *         - optionalVariables
 *         - createdBy
 *         - createdAt
 *         - updatedAt
 *         - isActive
 *       properties:
 *         id:
 *           type: string
 *           description: Unique template identifier
 *         name:
 *           type: string
 *           description: Template name
 *         description:
 *           type: string
 *           description: Template description
 *         category:
 *           type: string
 *           enum: [authentication, security, transactional, marketing, system, social]
 *           description: Template category
 *         channels:
 *           type: array
 *           items:
 *             type: string
 *             enum: [email, sms, push, in_app]
 *           description: Supported notification channels
 *         versions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TemplateVersion'
 *           description: Template versions
 *         activeVersion:
 *           type: string
 *           description: Currently active version
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *           description: Supported languages
 *         defaultLanguage:
 *           type: string
 *           description: Default language
 *         requiredVariables:
 *           type: array
 *           items:
 *             type: string
 *           description: Required template variables
 *         optionalVariables:
 *           type: array
 *           items:
 *             type: string
 *           description: Optional template variables
 *         variableSchema:
 *           type: object
 *           description: Variable validation schema
 *         createdBy:
 *           type: string
 *           description: Template creator
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         isActive:
 *           type: boolean
 *           description: Whether template is active
 *
 *     TemplateVersion:
 *       type: object
 *       required:
 *         - id
 *         - version
 *         - content
 *         - createdAt
 *         - isActive
 *       properties:
 *         id:
 *           type: string
 *           description: Version identifier
 *         version:
 *           type: string
 *           description: Version number
 *         content:
 *           type: object
 *           description: Template content for different languages and channels
 *         changelog:
 *           type: string
 *           description: Version changelog
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Version creation timestamp
 *         isActive:
 *           type: boolean
 *           description: Whether this version is active
 *
 *     TemplateDefinition:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - channels
 *         - content
 *       properties:
 *         name:
 *           type: string
 *           description: Template name
 *         description:
 *           type: string
 *           description: Template description
 *         category:
 *           type: string
 *           enum: [authentication, security, transactional, marketing, system, social]
 *           description: Template category
 *         channels:
 *           type: array
 *           items:
 *             type: string
 *             enum: [email, sms, push, in_app]
 *           description: Supported notification channels
 *         content:
 *           type: object
 *           description: Template content for different languages and channels
 *         requiredVariables:
 *           type: array
 *           items:
 *             type: string
 *           description: Required template variables
 *         optionalVariables:
 *           type: array
 *           items:
 *             type: string
 *           description: Optional template variables
 *         variableSchema:
 *           type: object
 *           description: Variable validation schema
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *           description: Supported languages
 *         defaultLanguage:
 *           type: string
 *           description: Default language
 */

/**
 * @swagger
 * /api/templates:
 *   post:
 *     summary: Create a new template
 *     tags: [Templates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TemplateDefinition'
 *     responses:
 *       201:
 *         description: Template created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Template'
 *       400:
 *         description: Invalid template data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: string
 */
router.post('/', templateController.createTemplate.bind(templateController));

/**
 * @swagger
 * /api/templates:
 *   get:
 *     summary: List templates with optional filters
 *     tags: [Templates]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [authentication, security, transactional, marketing, system, social]
 *         description: Filter by category
 *       - in: query
 *         name: channels
 *         schema:
 *           type: string
 *         description: Comma-separated list of channels to filter by
 *       - in: query
 *         name: languages
 *         schema:
 *           type: string
 *         description: Comma-separated list of languages to filter by
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: createdBy
 *         schema:
 *           type: string
 *         description: Filter by creator
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name and description
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Maximum number of results
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: Templates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Template'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     limit:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *                     total:
 *                       type: integer
 */
router.get('/', templateController.listTemplates.bind(templateController));

/**
 * @swagger
 * /api/templates/validate:
 *   post:
 *     summary: Validate a template definition
 *     tags: [Templates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TemplateDefinition'
 *     responses:
 *       200:
 *         description: Template validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     isValid:
 *                       type: boolean
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: object
 *                     warnings:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.post(
  '/validate',
  templateController.validateTemplate.bind(templateController)
);

/**
 * @swagger
 * /api/templates/import:
 *   post:
 *     summary: Import multiple templates
 *     tags: [Templates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               templates:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/TemplateDefinition'
 *     responses:
 *       200:
 *         description: Templates import result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     imported:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Template'
 *                     failed:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.post(
  '/import',
  templateController.importTemplates.bind(templateController)
);

/**
 * @swagger
 * /api/templates/export:
 *   get:
 *     summary: Export templates
 *     tags: [Templates]
 *     parameters:
 *       - in: query
 *         name: ids
 *         schema:
 *           type: string
 *         description: Comma-separated list of template IDs to export
 *     responses:
 *       200:
 *         description: Templates exported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TemplateDefinition'
 */
router.get(
  '/export',
  templateController.exportTemplates.bind(templateController)
);

/**
 * @swagger
 * /api/templates/cache:
 *   delete:
 *     summary: Clear template cache
 *     tags: [Templates]
 *     parameters:
 *       - in: query
 *         name: templateId
 *         schema:
 *           type: string
 *         description: Specific template ID to clear cache for
 *     responses:
 *       200:
 *         description: Cache cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.delete(
  '/cache',
  templateController.clearTemplateCache.bind(templateController)
);

/**
 * @swagger
 * /api/templates/{id}:
 *   get:
 *     summary: Get template by ID
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     responses:
 *       200:
 *         description: Template retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Template'
 *       404:
 *         description: Template not found
 */
router.get('/:id', templateController.getTemplate.bind(templateController));

/**
 * @swagger
 * /api/templates/{id}:
 *   put:
 *     summary: Update template
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TemplateDefinition'
 *     responses:
 *       200:
 *         description: Template updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Template'
 *       404:
 *         description: Template not found
 */
router.put('/:id', templateController.updateTemplate.bind(templateController));

/**
 * @swagger
 * /api/templates/{id}:
 *   delete:
 *     summary: Delete template
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     responses:
 *       200:
 *         description: Template deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Template not found
 */
router.delete(
  '/:id',
  templateController.deleteTemplate.bind(templateController)
);

/**
 * @swagger
 * /api/templates/{id}/preview:
 *   post:
 *     summary: Preview template with sample data
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               variables:
 *                 type: object
 *                 description: Template variables for preview
 *               language:
 *                 type: string
 *                 description: Language for preview (default: en)
 *     responses:
 *       200:
 *         description: Template preview generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       404:
 *         description: Template not found
 */
router.post(
  '/:id/preview',
  templateController.previewTemplate.bind(templateController)
);

/**
 * @swagger
 * /api/templates/{id}/render:
 *   post:
 *     summary: Render template with variables
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               variables:
 *                 type: object
 *                 description: Template variables for rendering
 *               language:
 *                 type: string
 *                 description: Language for rendering (default: en)
 *               channel:
 *                 type: string
 *                 enum: [email, sms, push, in_app]
 *                 description: Specific channel to render for
 *     responses:
 *       200:
 *         description: Template rendered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       404:
 *         description: Template not found
 */
router.post(
  '/:id/render',
  templateController.renderTemplate.bind(templateController)
);

/**
 * @swagger
 * /api/templates/{id}/versions:
 *   post:
 *     summary: Create new template version
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: object
 *                 description: New template content
 *               changelog:
 *                 type: string
 *                 description: Version changelog
 *     responses:
 *       201:
 *         description: Template version created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Template'
 *       404:
 *         description: Template not found
 */
router.post(
  '/:id/versions',
  templateController.createTemplateVersion.bind(templateController)
);

/**
 * @swagger
 * /api/templates/{id}/versions/{versionId}/activate:
 *   put:
 *     summary: Activate specific template version
 *     tags: [Templates]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Template ID
 *       - in: path
 *         name: versionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Version ID to activate
 *     responses:
 *       200:
 *         description: Template version activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Template'
 *       404:
 *         description: Template or version not found
 */
router.put(
  '/:id/versions/:versionId/activate',
  templateController.activateTemplateVersion.bind(templateController)
);

export default router;
