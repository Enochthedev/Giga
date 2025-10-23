export type EntityType = 
  | 'USER_PROFILE'
  | 'PRODUCT'
  | 'PROPERTY'
  | 'VEHICLE'
  | 'DOCUMENT'
  | 'ADVERTISEMENT'

export type FileStatus = 
  | 'uploading'
  | 'processing'
  | 'ready'
  | 'failed'
  | 'deleted'

export type AccessLevel = 
  | 'public'
  | 'private'
  | 'restricted'

export interface FileMetadata {
  id: string
  original_name: string
  storage_path: string
  mime_type: string
  size_bytes: number
  uploaded_by: string
  entity_type: EntityType
  entity_id: string
  status: FileStatus
  access_level: AccessLevel
  processing_results?: ProcessingResults
  metadata?: Record<string, any>
  tags?: string[]
  created_at: string
  updated_at: string
  expires_at?: string
}

export interface ProcessingResults {
  thumbnail?: {
    url: string
    path: string
  }
  resized?: Array<{
    size: string
    url: string
    path: string
  }>
  compressed?: {
    url: string
    path: string
    quality: number
  }
}

export interface UploadOptions {
  entityType: EntityType
  entityId: string
  accessLevel?: AccessLevel
  metadata?: Record<string, any>
  tags?: string[]
}

export interface ProcessingOperation {
  type: 'resize' | 'thumbnail' | 'compress'
  width?: number
  height?: number
  quality?: number
}

export interface UploadResponse {
  success: boolean
  data: {
    id: string
    url: string
    path: string
    metadata: FileMetadata
  }
}

export interface ProcessImageResponse {
  success: boolean
  data: {
    fileId: string
    results: ProcessingResults
  }
}

export interface ListFilesOptions {
  entityType?: EntityType
  entityId?: string
  status?: FileStatus
  limit?: number
  offset?: number
}

export interface DeleteFileResponse {
  success: boolean
  message: string
}

export class FileStorageError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'FileStorageError'
  }
}