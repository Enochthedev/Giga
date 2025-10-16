import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Multi-Sided Platform - Upload Service',
      version: '1.0.0',
      description: `
# Upload Service API

A comprehensive file upload and management service supporting multiple file types, image processing, and secure file delivery.

## Features

- **Multi-Format Support**: Images, documents, videos, and more
- **Image Processing**: Automatic resizing, format conversion, and thumbnail generation
- **Secure Storage**: Local and cloud storage with encryption support
- **File Validation**: Malware scanning, content validation, and integrity checks
- **CDN Integration**: Fast file delivery with caching
- **Retention Management**: GDPR compliance and automated cleanup
- **Queue Processing**: Asynchronous file processing with Bull queues
- **Comprehensive Monitoring**: Health checks, metrics, and performance monitoring

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

## File Upload Limits

- **Maximum file size**: 10MB (configurable)
- **Maximum files per request**: 10
- **Supported formats**: Images (JPEG, PNG, WebP, GIF), Documents (PDF, DOC, DOCX), Text files

## Rate Limiting

Upload endpoints are rate-limited:
- **Upload endpoints**: 50 requests per 15 minutes
- **General API**: 100 requests per 15 minutes

## Error Handling

All errors follow a consistent format:

\`\`\`json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
\`\`\`

## File Processing

Files are processed asynchronously:
1. Upload returns immediately with file metadata
2. Processing happens in background queues
3. Use status endpoints to check processing progress
4. Webhooks available for completion notifications
      `,
      contact: {
        name: 'Upload Service Support',
        email: 'upload-support@platform.example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3005',
        description: 'Development server',
      },
      {
        url: 'https://upload-api-staging.platform.example.com',
        description: 'Staging server',
      },
      {
        url: 'https://upload-api.platform.example.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        FileMetadata: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clr123abc',
            },
            originalName: {
              type: 'string',
              example: 'document.pdf',
            },
            fileName: {
              type: 'string',
              example: 'clr123abc_document.pdf',
            },
            mimeType: {
              type: 'string',
              example: 'application/pdf',
            },
            size: {
              type: 'number',
              example: 1024000,
            },
            url: {
              type: 'string',
              example: 'https://cdn.example.com/files/clr123abc_document.pdf',
            },
            cdnUrl: {
              type: 'string',
              nullable: true,
              example: 'https://cdn.example.com/files/clr123abc_document.pdf',
            },
            status: {
              type: 'string',
              enum: ['UPLOADING', 'PROCESSING', 'READY', 'FAILED', 'DELETED'],
              example: 'READY',
            },
            entityType: {
              type: 'string',
              enum: ['USER_PROFILE', 'PRODUCT', 'PROPERTY', 'VEHICLE', 'DOCUMENT', 'ADVERTISEMENT'],
              example: 'DOCUMENT',
            },
            entityId: {
              type: 'string',
              example: 'user123',
            },
            uploadedBy: {
              type: 'string',
              example: 'user123',
            },
            accessLevel: {
              type: 'string',
              enum: ['PUBLIC', 'PRIVATE', 'RESTRICTED'],
              example: 'PRIVATE',
            },
            thumbnails: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ThumbnailInfo',
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ThumbnailInfo: {
          type: 'object',
          properties: {
            size: {
              type: 'string',
              example: '150x150',
            },
            url: {
              type: 'string',
              example: 'https://cdn.example.com/thumbnails/clr123abc_150x150.jpg',
            },
            width: {
              type: 'number',
              example: 150,
            },
            height: {
              type: 'number',
              example: 150,
            },
          },
        },
        UploadResult: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              $ref: '#/components/schemas/FileMetadata',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        BatchUploadResult: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              properties: {
                results: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'string',
                        example: 'clr123abc',
                      },
                      success: {
                        type: 'boolean',
                        example: true,
                      },
                      file: {
                        $ref: '#/components/schemas/FileMetadata',
                      },
                      error: {
                        type: 'string',
                        nullable: true,
                        example: null,
                      },
                    },
                  },
                },
                totalProcessed: {
                  type: 'number',
                  example: 3,
                },
                successCount: {
                  type: 'number',
                  example: 2,
                },
                errorCount: {
                  type: 'number',
                  example: 1,
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ProcessingStatus: {
          type: 'object',
          properties: {
            fileId: {
              type: 'string',
              example: 'clr123abc',
            },
            status: {
              type: 'string',
              enum: ['queued', 'processing', 'completed', 'failed'],
              example: 'processing',
            },
            progress: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              example: 75,
            },
            message: {
              type: 'string',
              example: 'Generating thumbnails...',
            },
            startedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            error: {
              type: 'string',
              nullable: true,
            },
          },
        },
        HealthStatus: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['healthy', 'degraded', 'unhealthy'],
              example: 'healthy',
            },
            checks: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    enum: ['pass', 'fail', 'warn'],
                  },
                  responseTime: {
                    type: 'number',
                  },
                  message: {
                    type: 'string',
                  },
                },
              },
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'File too large',
            },
            code: {
              type: 'string',
              example: 'FILE_TOO_LARGE',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
  ],
};

const specs = swaggerJsdoc(options);
export default specs;