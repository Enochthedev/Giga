# Authentication Service Deployment Guide

This guide covers deploying the Authentication Service in various environments.

## 🐳 Docker Deployment

### Build Docker Image

```bash
# Build the image
docker build -t auth-service:latest .

# Tag for registry
docker tag auth-service:latest your-registry/auth-service:v1.0.0
```

### Run with Docker

```bash
docker run -d \
  --name auth-service \
  -p 3001:3001 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/auth_db" \
  -e JWT_SECRET="your-secure-jwt-secret" \
  -e REDIS_HOST="redis-host" \
  -e REDIS_PORT="6379" \
  auth-service:latest
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  auth-service:
    build: .
    ports:
      - '3001:3001'
    environment:
      - DATABASE_URL=postgresql://platform_user:platform_pass@postgres:5432/auth_db
      - JWT_SECRET=your-secure-jwt-secret-change-in-production
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3001/health']
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=auth_db
      - POSTGRES_USER=platform_user
      - POSTGRES_PASSWORD=platform_pass
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - '5433:5432'
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - '6380:6379'
    volumes:
      - redis_data:/data
    restart: unless-stopped
    command: redis-server --appendonly yes

volumes:
  postgres_data:
  redis_data:
```

Run with:

```bash
docker-compose up -d
```

## ☸️ Kubernetes Deployment

### Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: auth-service
```

### ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: auth-config
  namespace: auth-service
data:
  NODE_ENV: 'production'
  AUTH_PORT: '3001'
  JWT_EXPIRES_IN: '15m'
  JWT_REFRESH_EXPIRES_IN: '7d'
  REDIS_HOST: 'redis-service'
  REDIS_PORT: '6379'
  LOG_LEVEL: 'info'
  ENABLE_SWAGGER: 'false'
```

### Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: auth-secrets
  namespace: auth-service
type: Opaque
data:
  database-url: <base64-encoded-database-url>
  jwt-secret: <base64-encoded-jwt-secret>
  smtp-password: <base64-encoded-smtp-password>
  sms-auth-token: <base64-encoded-sms-token>
```

### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  namespace: auth-service
  labels:
    app: auth-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
        - name: auth-service
          image: your-registry/auth-service:v1.0.0
          ports:
            - containerPort: 3001
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: auth-secrets
                  key: database-url
            - name: JWT_SECRET
              valueFrom:
                secretKeyRef:
                  name: auth-secrets
                  key: jwt-secret
          envFrom:
            - configMapRef:
                name: auth-config
          resources:
            requests:
              memory: '256Mi'
              cpu: '250m'
            limits:
              memory: '512Mi'
              cpu: '500m'
          livenessProbe:
            httpGet:
              path: /health/live
              port: 3001
            initialDelaySeconds: 30
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 3001
            initialDelaySeconds: 5
            periodSeconds: 5
            timeoutSeconds: 3
            failureThreshold: 3
          startupProbe:
            httpGet:
              path: /health
              port: 3001
            initialDelaySeconds: 10
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 30
      imagePullSecrets:
        - name: registry-secret
```

### Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: auth-service
  namespace: auth-service
  labels:
    app: auth-service
spec:
  selector:
    app: auth-service
  ports:
    - name: http
      port: 80
      targetPort: 3001
      protocol: TCP
  type: ClusterIP
```

### Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: auth-ingress
  namespace: auth-service
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: '100'
    nginx.ingress.kubernetes.io/rate-limit-window: '1m'
spec:
  tls:
    - hosts:
        - auth.yourplatform.com
      secretName: auth-tls
  rules:
    - host: auth.yourplatform.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: auth-service
                port:
                  number: 80
```

### HorizontalPodAutoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: auth-hpa
  namespace: auth-service
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: auth-service
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

### Deploy to Kubernetes

```bash
# Apply all configurations
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n auth-service

# Check logs
kubectl logs -f deployment/auth-service -n auth-service

# Port forward for testing
kubectl port-forward service/auth-service 3001:80 -n auth-service
```

## 🌩️ AWS Deployment

### ECS with Fargate

#### Task Definition

```json
{
  "family": "auth-service",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "auth-service",
      "image": "your-account.dkr.ecr.region.amazonaws.com/auth-service:latest",
      "portMappings": [
        {
          "containerPort": 3001,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "AUTH_PORT",
          "value": "3001"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:auth/database-url"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:auth/jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/auth-service",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3001/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

#### Service Definition

```json
{
  "serviceName": "auth-service",
  "cluster": "production-cluster",
  "taskDefinition": "auth-service:1",
  "desiredCount": 3,
  "launchType": "FARGATE",
  "networkConfiguration": {
    "awsvpcConfiguration": {
      "subnets": ["subnet-12345678", "subnet-87654321"],
      "securityGroups": ["sg-auth-service"],
      "assignPublicIp": "DISABLED"
    }
  },
  "loadBalancers": [
    {
      "targetGroupArn": "arn:aws:elasticloadbalancing:region:account:targetgroup/auth-service/1234567890123456",
      "containerName": "auth-service",
      "containerPort": 3001
    }
  ],
  "healthCheckGracePeriodSeconds": 60
}
```

### Application Load Balancer

```yaml
# ALB Target Group
Type: AWS::ElasticLoadBalancingV2::TargetGroup
Properties:
  Name: auth-service-tg
  Port: 3001
  Protocol: HTTP
  VpcId: !Ref VPC
  TargetType: ip
  HealthCheckPath: /health
  HealthCheckIntervalSeconds: 30
  HealthCheckTimeoutSeconds: 5
  HealthyThresholdCount: 2
  UnhealthyThresholdCount: 3
```

## 🔧 Environment-Specific Configurations

### Development

```bash
# .env.development
NODE_ENV=development
LOG_LEVEL=debug
ENABLE_SWAGGER=true
ENABLE_DEBUG_LOGGING=true
ENABLE_QUERY_LOGGING=true
JWT_EXPIRES_IN=1h
RATE_LIMIT_MAX_REQUESTS=1000
```

### Staging

```bash
# .env.staging
NODE_ENV=staging
LOG_LEVEL=info
ENABLE_SWAGGER=true
ENABLE_DEBUG_LOGGING=false
ENABLE_QUERY_LOGGING=false
JWT_EXPIRES_IN=15m
RATE_LIMIT_MAX_REQUESTS=200
```

### Production

```bash
# .env.production
NODE_ENV=production
LOG_LEVEL=warn
ENABLE_SWAGGER=false
ENABLE_DEBUG_LOGGING=false
ENABLE_QUERY_LOGGING=false
JWT_EXPIRES_IN=15m
RATE_LIMIT_MAX_REQUESTS=100
```

## 📊 Monitoring & Observability

### Prometheus Metrics

Add Prometheus endpoint:

```yaml
# ServiceMonitor for Prometheus
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: auth-service-metrics
  namespace: auth-service
spec:
  selector:
    matchLabels:
      app: auth-service
  endpoints:
    - port: http
      path: /health/metrics
      interval: 30s
```

### Grafana Dashboard

Import dashboard configuration:

```json
{
  "dashboard": {
    "title": "Auth Service Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total{service=\"auth-service\"}[5m])"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{service=\"auth-service\"}[5m]))"
          }
        ]
      }
    ]
  }
}
```

### Logging

#### ELK Stack Configuration

```yaml
# Filebeat configuration
filebeat.inputs:
  - type: container
    paths:
      - /var/log/containers/*auth-service*.log
    processors:
      - add_kubernetes_metadata:
          host: ${NODE_NAME}
          matchers:
            - logs_path:
                logs_path: '/var/log/containers/'

output.elasticsearch:
  hosts: ['elasticsearch:9200']
  index: 'auth-service-%{+yyyy.MM.dd}'
```

#### Fluentd Configuration

```yaml
<source> @type tail path /var/log/containers/*auth-service*.log pos_file
/var/log/fluentd-auth-service.log.pos tag kubernetes.auth-service format json </source>

<match kubernetes.auth-service> @type elasticsearch host elasticsearch port 9200 index_name
auth-service type_name _doc </match>
```

## 🔒 Security Considerations

### Network Security

```yaml
# Network Policy
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: auth-service-netpol
  namespace: auth-service
spec:
  podSelector:
    matchLabels:
      app: auth-service
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
      ports:
        - protocol: TCP
          port: 3001
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              name: database
      ports:
        - protocol: TCP
          port: 5432
    - to:
        - namespaceSelector:
            matchLabels:
              name: redis
      ports:
        - protocol: TCP
          port: 6379
```

### Pod Security Policy

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: auth-service-psp
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  fsGroup:
    rule: 'RunAsAny'
```

## 🚀 CI/CD Pipeline

### GitHub Actions

```yaml
name: Deploy Auth Service

on:
  push:
    branches: [main]
    paths: ['services/auth/**']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: auth-service
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster production-cluster \
            --service auth-service \
            --force-new-deployment
```

## 📋 Pre-deployment Checklist

### Security

- [ ] JWT secrets are properly configured
- [ ] Database credentials are secured
- [ ] HTTPS is enabled
- [ ] Rate limiting is configured
- [ ] CORS is properly configured
- [ ] Security headers are enabled

### Performance

- [ ] Database connection pooling is configured
- [ ] Redis caching is enabled
- [ ] Response compression is enabled
- [ ] Resource limits are set
- [ ] Auto-scaling is configured

### Monitoring

- [ ] Health checks are configured
- [ ] Logging is properly set up
- [ ] Metrics collection is enabled
- [ ] Alerts are configured
- [ ] Dashboard is set up

### Database

- [ ] Database migrations are applied
- [ ] Database backups are configured
- [ ] Connection limits are appropriate
- [ ] Indexes are optimized

### Testing

- [ ] All tests pass
- [ ] Load testing is completed
- [ ] Security testing is done
- [ ] Integration tests pass

---

For more information, see the main [README](./README.md) and [API Guide](./API_GUIDE.md).
