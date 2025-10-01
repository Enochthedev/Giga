# Production Deployment Guide - Upload Service

## Overview
This guide covers deploying the Upload Service for production environments capable of handling 1000+ concurrent uploads with high availability and performance.

## Architecture Overview

### High-Level Architecture
```
Internet → Load Balancer → API Gateway → Upload Service Cluster
                                      ↓
                              Redis Cluster ← → PostgreSQL Cluster
                                      ↓
                              S3/MinIO Storage ← → CDN
```

### Key Components
- **API Gateway**: Rate limiting, authentication, request routing
- **Upload Service Cluster**: Multiple instances for high availability
- **Redis Cluster**: Session management, caching, queue management
- **PostgreSQL Cluster**: Metadata and configuration storage
- **S3/MinIO**: File storage with replication
- **CDN**: Global content delivery

## Production Environment Configuration

### Environment Variables (.env.production)
The service uses the `.env.production` file with optimized settings for high-load scenarios:

#### Key Performance Settings
```bash
# Concurrency and Memory
MAX_CONCURRENT_UPLOADS=25
MEMORY_LIMIT_MB=2048
MEMORY_WARNING_THRESHOLD=0.8
BUFFER_POOL_SIZE=100

# Database Connections
DB_POOL_MIN=10
DB_POOL_MAX=50
REDIS_POOL_MIN=5
REDIS_POOL_MAX=25

# File Processing
MAX_FILE_SIZE=104857600  # 100MB
CHUNK_SIZE=1048576       # 1MB chunks
STREAM_BUFFER_SIZE=65536 # 64KB buffer
```

### Infrastructure Requirements

#### Minimum Server Specifications
- **CPU**: 8 cores (16 vCPUs recommended)
- **RAM**: 16GB (32GB recommended)
- **Storage**: 100GB SSD for OS and temp files
- **Network**: 10Gbps connection
- **Load Balancer**: HAProxy or AWS ALB

#### Database Cluster
- **PostgreSQL**: 3-node cluster with read replicas
- **Connection Pool**: PgBouncer for connection management
- **Backup**: Automated daily backups with point-in-time recovery

#### Redis Cluster
- **Nodes**: 3-node Redis cluster with sentinel
- **Memory**: 8GB per node minimum
- **Persistence**: RDB + AOF for durability

#### Storage
- **Primary**: S3 or MinIO with replication
- **CDN**: CloudFlare or AWS CloudFront
- **Backup**: Cross-region replication

## Deployment Steps

### 1. Infrastructure Setup

#### Docker Compose Production
```yaml
version: '3.8'
services:
  upload-service:
    image: upload-service:production
    deploy:
      replicas: 3
      resources:
        limits:
          memory: 2G
          cpus: '2'
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
    depends_on:
      - postgres-cluster
      - redis-cluster
    networks:
      - upload-network

  postgres-cluster:
    image: postgres:15-alpine
    deploy:
      replicas: 3
    environment:
      POSTGRES_DB: upload_db
      POSTGRES_USER: upload_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - upload-network

  redis-cluster:
    image: redis:7-alpine
    deploy:
      replicas: 3
    command: redis-server --cluster-enabled yes
    networks:
      - upload-network

networks:
  upload-network:
    driver: overlay

volumes:
  postgres_data:
```

### 2. Load Balancer Configuration

#### HAProxy Configuration
```
global
    maxconn 4096
    log stdout local0

defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

frontend upload_frontend
    bind *:80
    bind *:443 ssl crt /etc/ssl/certs/upload.pem
    redirect scheme https if !{ ssl_fc }
    default_backend upload_backend

backend upload_backend
    balance roundrobin
    option httpchk GET /health
    server upload1 upload-service-1:3005 check
    server upload2 upload-service-2:3005 check
    server upload3 upload-service-3:3005 check
```

### 3. API Gateway Configuration

#### Rate Limiting Rules
```yaml
# Gateway handles rate limiting, not the service
rate_limits:
  - path: "/api/v1/uploads/*"
    method: "POST"
    limit: 100
    window: 60s
    per: ip
  
  - path: "/api/v1/uploads/multiple"
    method: "POST"
    limit: 10
    window: 60s
    per: user
```

### 4. Monitoring and Alerting

#### Prometheus Metrics
```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'upload-service'
    static_configs:
      - targets: ['upload-service:3005']
    metrics_path: '/metrics'
    scrape_interval: 15s
```

#### Grafana Dashboards
- Upload throughput and latency
- Memory and CPU utilization
- Database connection pool status
- Redis cluster health
- Error rates and response times

#### Alert Rules
```yaml
groups:
  - name: upload-service
    rules:
      - alert: HighMemoryUsage
        expr: memory_usage_percent > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage detected"

      - alert: UploadFailureRate
        expr: upload_failure_rate > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Upload failure rate above 5%"
```

## Performance Optimizations

### 1. Memory Management
- **Streaming Uploads**: Files are processed in chunks to prevent memory overflow
- **Buffer Pooling**: Reuse buffers to reduce garbage collection
- **Memory Monitoring**: Automatic garbage collection when thresholds are reached

### 2. Concurrency Control
- **P-Limit**: Controls concurrent upload processing
- **Queue Management**: Redis-based job queues for async processing
- **Connection Pooling**: Optimized database and Redis connections

### 3. Caching Strategy
```javascript
// Multi-level caching
const cacheStrategy = {
  metadata: {
    ttl: 1800,      // 30 minutes
    storage: 'redis'
  },
  files: {
    ttl: 86400,     // 24 hours
    storage: 'cdn'
  },
  thumbnails: {
    ttl: 604800,    // 7 days
    storage: 'cdn'
  }
};
```

## Security Configuration

### 1. Network Security
- **VPC**: Isolated network with private subnets
- **Security Groups**: Restrictive firewall rules
- **SSL/TLS**: End-to-end encryption
- **WAF**: Web Application Firewall for DDoS protection

### 2. Application Security
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive request validation
- **File Scanning**: Malware and virus scanning
- **Access Control**: Role-based permissions

### 3. Data Protection
- **Encryption at Rest**: AES-256 encryption for stored files
- **Encryption in Transit**: TLS 1.3 for all communications
- **GDPR Compliance**: Data retention and deletion policies
- **Audit Logging**: Comprehensive security event logging

## Scaling Strategies

### 1. Horizontal Scaling
```bash
# Scale upload service instances
docker service scale upload-service=5

# Scale database read replicas
docker service scale postgres-read-replica=3
```

### 2. Auto-scaling Rules
```yaml
# Kubernetes HPA
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: upload-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: upload-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### 3. Database Scaling
- **Read Replicas**: Scale read operations
- **Sharding**: Partition data by entity type
- **Connection Pooling**: PgBouncer for connection management

## Disaster Recovery

### 1. Backup Strategy
- **Database**: Automated daily backups with 30-day retention
- **Files**: Cross-region replication to secondary storage
- **Configuration**: Version-controlled infrastructure as code

### 2. Recovery Procedures
```bash
# Database recovery
pg_restore --host=postgres-primary --dbname=upload_db backup.sql

# File recovery from backup region
aws s3 sync s3://upload-backup-region s3://upload-primary-region

# Service restart with health checks
docker service update --force upload-service
```

## Monitoring and Maintenance

### 1. Health Checks
- **Application**: `/health` endpoint with comprehensive checks
- **Database**: Connection and query performance
- **Redis**: Cluster status and memory usage
- **Storage**: Availability and response times

### 2. Log Management
```yaml
# Centralized logging with ELK stack
logging:
  driver: "json-file"
  options:
    max-size: "100m"
    max-file: "3"
    labels: "service,environment"
```

### 3. Performance Monitoring
- **APM**: Application Performance Monitoring with New Relic/DataDog
- **Metrics**: Custom business metrics and KPIs
- **Alerting**: Proactive alerts for performance degradation

## Troubleshooting Guide

### Common Issues

#### High Memory Usage
```bash
# Check memory usage
docker stats upload-service

# Trigger garbage collection
curl -X POST http://upload-service:3005/admin/gc

# Scale up if needed
docker service scale upload-service=5
```

#### Database Connection Issues
```bash
# Check connection pool status
curl http://upload-service:3005/admin/db-status

# Restart connection pool
docker exec upload-service npm run db:pool:restart
```

#### Redis Cluster Issues
```bash
# Check cluster status
redis-cli --cluster check redis-cluster:6379

# Fix cluster if needed
redis-cli --cluster fix redis-cluster:6379
```

## Performance Benchmarks

### Expected Performance (Production Hardware)
- **Concurrent Uploads**: 1000+ simultaneous uploads
- **Throughput**: 10GB/minute aggregate
- **Response Time**: <200ms for metadata operations
- **Availability**: 99.9% uptime SLA
- **Error Rate**: <0.1% under normal load

### Load Testing
```bash
# Artillery load test
artillery run load-test.yml

# K6 performance test
k6 run performance-test.js

# Custom load test
node scripts/load-test.js --concurrent=1000 --duration=300
```

## Cost Optimization

### 1. Resource Optimization
- **Right-sizing**: Monitor and adjust instance sizes
- **Reserved Instances**: Use reserved capacity for predictable workloads
- **Spot Instances**: Use spot instances for non-critical processing

### 2. Storage Optimization
- **Lifecycle Policies**: Automatic archival of old files
- **Compression**: Enable compression for stored files
- **Deduplication**: Remove duplicate files to save space

### 3. CDN Optimization
- **Cache Headers**: Optimize cache TTL for different file types
- **Compression**: Enable gzip/brotli compression
- **Geographic Distribution**: Use edge locations near users

This production deployment guide ensures the Upload Service can handle enterprise-scale workloads with high availability, performance, and security.