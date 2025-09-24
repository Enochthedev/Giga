# Upload Service

Centralized file upload and media management service for the platform. Handles image processing, file validation, storage management, and delivery optimization across all platform services.

## Features

- ✅ **Multi-Service Support**: Handles uploads for profiles, products, properties, vehicles, documents, and advertisements
- ✅ **Image Processing**: Automatic resizing, format conversion, and thumbnail generation using Sharp
- ✅ **File Validation**: MIME type checking, size limits, malware scanning, and security validation
- ✅ **Storage Management**: Abstracted storage layer supporting local filesystem (with cloud storage ready)
- ✅ **Security**: File sanitization, access controls, and comprehensive validation
- ✅ **Performance**: Optimized image compression, CDN integration, and efficient processing

## Quick Start

### 1. Installation
```bash
cd services/upload
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Development Server
```bash
npm run dev
```

The service will be available at `http://localhost:3003`

## API Endpoints

### Upload Endpoints

#### Profile Photo Upload
```bash
POST /api/v1/upload/profile-photo
Content-Type: multipart/form-data

Body:
- photo: <image-file>
- userId: <user-id>
```

#### Product Image Upload
```bash
POST /api/v1/upload/product-image
Content-Type: multipart/form-data

Body:
- image: <image-file>
- productId: <product-id>
- vendorId: <vendor-id>
```

#### Property Photo Upload
```bash
POST /api/v1/upload/property-photo
Content-Type: multipart/form-data

Body:
- photo: <image-file>
- propertyId: <property-id>
- hostId: <host-id>
```

#### Vehicle Photo Upload
```bash
POST /api/v1/upload/vehicle-photo
Content-Type: multipart/form-data

Body:
- photo: <image-file>
- vehicleId: <vehicle-id>
- driverId: <driver-id>
```

#### Document Upload
```bash
POST /api/v1/upload/document
Content-Type: multipart/form-data

Body:
- document: <file>
- entityId: <entity-id>
- entityType: <entity-type>
- uploadedBy: <user-id>
```

#### Multiple Files Upload
```bash
POST /api/v1/upload/multiple
Content-Type: multipart/form-data

Body:
- files: <array-of-files>
- entityId: <entity-id>
- entityType: <entity-type>
- uploadedBy: <user-id>
```

### Management Endpoints

#### Delete File
```bash
DELETE /api/v1/upload/{fileId}
```

#### Get Statistics
```bash
GET /api/v1/upload/stats
```

### Health Endpoints

#### Health Check
```bash
GET /health
```

#### Readiness Check
```bash
GET /health/ready
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3003` |
| `NODE_ENV` | Environment | `development` |
| `BASE_URL` | Service base URL | `http://localhost:3003` |
| `UPLOAD_DIR` | Upload directory | `./uploads` |
| `MAX_FILE_SIZE` | Max file size in bytes | `5242880` (5MB) |
| `ALLOWED_IMAGE_TYPES` | Allowed image MIME types | `image/jpeg,image/jpg,image/png,image/webp` |
| `ALLOWED_DOCUMENT_TYPES` | Allowed document MIME types | `application/pdf,text/plain` |
| `CDN_BASE_URL` | CDN base URL | - |
| `CDN_ENABLED` | Enable CDN | `false` |

### File Processing

#### Image Processing Options
- **Automatic WebP conversion** for optimal compression
- **Smart resizing** based on upload type
- **Thumbnail generation** in multiple sizes
- **Quality optimization** with configurable settings

#### Supported File Types

**Images:**
- JPEG/JPG
- PNG
- WebP
- GIF

**Documents:**
- PDF
- Plain text
- Microsoft Word documents

## Integration Examples

### From Auth Service (Profile Photos)
```typescript
// Replace direct upload with service call
const uploadResponse = await fetch('http://localhost:3003/api/v1/upload/profile-photo', {
  method: 'POST',
  body: formData // Contains photo file and userId
});

const result = await uploadResponse.json();
if (result.success) {
  const avatarUrl = result.data.url;
  // Update user profile with new avatar URL
}
```

### From Ecommerce Service (Product Images)
```typescript
// Upload product image
const uploadResponse = await fetch('http://localhost:3003/api/v1/upload/product-image', {
  method: 'POST',
  body: formData // Contains image file, productId, and vendorId
});

const result = await uploadResponse.json();
if (result.success) {
  const imageUrl = result.data.url;
  const thumbnails = result.data.thumbnails;
  // Update product with image URLs
}
```

## File Structure

```
services/upload/
├── src/
│   ├── controllers/
│   │   └── upload.controller.ts
│   ├── routes/
│   │   ├── upload.routes.ts
│   │   └── health.routes.ts
│   ├── services/
│   │   ├── upload.service.ts
│   │   ├── file-validator.service.ts
│   │   └── storage-manager.service.ts
│   ├── types/
│   │   └── upload.types.ts
│   └── server.ts
├── uploads/                    # Upload directory (created automatically)
│   ├── profiles/
│   ├── products/
│   ├── properties/
│   ├── vehicles/
│   ├── documents/
│   └── temp/
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## Development

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript type checking
```

### Adding New Upload Types

1. **Add Entity Type**: Update `EntityType` enum in `types/upload.types.ts`
2. **Add Processing Options**: Create specialized processing options
3. **Add Service Method**: Add method to `UploadService`
4. **Add Controller Method**: Add method to `UploadController`
5. **Add Route**: Add route to `upload.routes.ts`

## Security

### File Validation
- MIME type verification with magic number checking
- File size limits per upload type
- Filename sanitization to prevent path traversal
- Malware scanning (configurable)

### Access Control
- Service-to-service authentication (planned)
- File-level permissions
- Secure file URLs
- Rate limiting (planned)

### Data Protection
- File encryption at rest (planned)
- Secure file deletion
- Audit logging (planned)
- GDPR compliance features (planned)

## Performance

### Optimization Features
- Automatic image compression
- WebP format conversion
- Thumbnail pre-generation
- CDN integration ready
- Efficient file processing

### Monitoring
- Upload success/failure rates
- Processing times
- Storage usage
- Error tracking

## Deployment

### Production Considerations
- Configure proper storage backend (S3, GCS, etc.)
- Set up CDN for file delivery
- Configure virus scanning
- Set up monitoring and alerting
- Configure backup strategies

### Docker Support (Coming Soon)
```dockerfile
# Dockerfile will be added for containerized deployment
```

## Roadmap

### Phase 1 (Current)
- ✅ Basic file upload and processing
- ✅ Image optimization and thumbnails
- ✅ Multi-service support
- ✅ Local filesystem storage

### Phase 2 (Next)
- [ ] Database integration for metadata
- [ ] Cloud storage backends (S3, GCS)
- [ ] Authentication and authorization
- [ ] Virus scanning integration

### Phase 3 (Future)
- [ ] Advanced image processing
- [ ] Video processing support
- [ ] Real-time upload progress
- [ ] Advanced analytics and reporting

## Support

For issues and questions:
1. Check the API documentation
2. Review configuration options
3. Check logs for error details
4. Ensure proper file permissions

## License

Part of the multi-service platform project.