# GitHub Secrets Setup Checklist

Use this checklist to ensure all required secrets are configured for CI/CD pipelines.

## ✅ Setup Progress

- [ ] **Step 1**: Create Supabase projects (staging & production)
- [ ] **Step 2**: Set up managed databases (PostgreSQL)
- [ ] **Step 3**: Choose deployment target
- [ ] **Step 4**: Configure all GitHub secrets
- [ ] **Step 5**: Configure GitHub variables
- [ ] **Step 6**: Test CI pipeline
- [ ] **Step 7**: Test deployment to staging

---

## 🔐 Required Secrets

### General (Auto-provided)
- [x] `GITHUB_TOKEN` - Automatically provided by GitHub Actions

---

### Supabase - Common
- [ ] `SUPABASE_ACCESS_TOKEN` - Get from: Supabase Dashboard → Account → Access Tokens

#### Staging Environment
- [ ] `SUPABASE_STAGING_PROJECT_ID` - Example: `abc123def456`
- [ ] `SUPABASE_ANON_KEY_STAGING` - Get from: Project Settings → API
- [ ] `STRIPE_SECRET_KEY_STAGING` - Stripe test key: `sk_test_...`
- [ ] `TWILIO_ACCOUNT_SID_STAGING` - Twilio test SID
- [ ] `TWILIO_AUTH_TOKEN_STAGING` - Twilio test token
- [ ] `ALGOLIA_API_KEY_STAGING` - Algolia search key (staging)

#### Production Environment
- [ ] `SUPABASE_PROD_PROJECT_ID` - Production project ref
- [ ] `SUPABASE_ANON_KEY_PROD` - Production anon key
- [ ] `STRIPE_SECRET_KEY_PROD` - Stripe live key: `sk_live_...`
- [ ] `TWILIO_ACCOUNT_SID_PROD` - Twilio production SID
- [ ] `TWILIO_AUTH_TOKEN_PROD` - Twilio production token
- [ ] `ALGOLIA_API_KEY_PROD` - Algolia search key (production)

#### Optional (if using these providers)
- [ ] `SENDGRID_API_KEY` - For email notifications
- [ ] `AWS_SES_ACCESS_KEY_ID` - Alternative email provider
- [ ] `AWS_SES_SECRET_ACCESS_KEY` - Alternative email provider

---

### Database URLs - Staging

Format: `postgresql://user:password@host:5432/database_name`

- [ ] `AUTH_DATABASE_URL_STAGING`
- [ ] `HOTEL_DATABASE_URL_STAGING`
- [ ] `TAXI_DATABASE_URL_STAGING`
- [ ] `PAYMENT_DATABASE_URL_STAGING`
- [ ] `NOTIFICATION_DATABASE_URL_STAGING`
- [ ] `UPLOAD_DATABASE_URL_STAGING`

**Example:**
```
postgresql://giga_user:SecurePass123@staging-db.example.com:5432/auth_db
```

### Database URLs - Production

- [ ] `AUTH_DATABASE_URL_PROD`
- [ ] `HOTEL_DATABASE_URL_PROD`
- [ ] `TAXI_DATABASE_URL_PROD`
- [ ] `PAYMENT_DATABASE_URL_PROD`
- [ ] `NOTIFICATION_DATABASE_URL_PROD`
- [ ] `UPLOAD_DATABASE_URL_PROD`

---

### Deployment Target Secrets

#### Option A: Kubernetes (check if using)
- [ ] `KUBE_CONFIG` - Base64-encoded kubeconfig file
- [ ] `K8S_CLUSTER_STAGING` - Staging cluster name
- [ ] `K8S_CLUSTER_PROD` - Production cluster name

**Get kubeconfig:**
```bash
kubectl config view --raw | base64 -w 0
```

---

#### Option B: AWS ECS (check if using)
- [ ] `AWS_ACCESS_KEY_ID` - AWS access key
- [ ] `AWS_SECRET_ACCESS_KEY` - AWS secret key
- [ ] `AWS_REGION` - Example: `us-east-1`

**Create IAM user with these policies:**
- `AmazonECS_FullAccess`
- `AmazonEC2ContainerRegistryFullAccess`

---

#### Option C: Google Cloud Run (check if using)
- [ ] `GCP_CREDENTIALS` - Service account JSON
- [ ] `GCP_REGION` - Example: `us-central1`

**Create service account:**
```bash
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions Deployer"

gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@your-project.iam.gserviceaccount.com
```

---

#### Option D: VPS with Docker (check if using)
- [ ] `VPS_HOST` - IP address or hostname
- [ ] `VPS_USERNAME` - SSH username (e.g., `deployer`)
- [ ] `VPS_SSH_KEY` - Private SSH key

**Generate SSH key:**
```bash
ssh-keygen -t ed25519 -C "github-actions@giga" -f github_deploy_key
# Add public key to VPS: ~/.ssh/authorized_keys
# Use private key as VPS_SSH_KEY secret
```

---

### Service URLs

- [ ] `STAGING_BASE_URL` - Example: `https://staging-api.example.com`
- [ ] `PROD_BASE_URL` - Example: `https://api.example.com`

---

## ⚙️ GitHub Variables

Set these in: **Settings → Secrets and variables → Actions → Variables**

- [ ] `DEPLOY_TARGET` - Choose one:
  - `kubernetes`
  - `aws-ecs`
  - `gcp-run`
  - `vps-docker`

---

## 🧪 Testing Your Setup

### 1. Test CI Pipeline

```bash
# Create test branch
git checkout -b test-ci-setup

# Make small change
echo "# CI Test" >> README.md

# Push and verify
git add .
git commit -m "test: verify CI pipeline"
git push -u origin test-ci-setup
```

**Expected Result:**
- ✅ Lint job passes
- ✅ Type check passes
- ✅ Tests run successfully
- ✅ Build completes

### 2. Test Docker Build

```bash
# Trigger Docker workflow manually
# Go to: Actions → Build and Push Docker Images → Run workflow
# Select: services = "gateway"
```

**Expected Result:**
- ✅ Image builds successfully
- ✅ Image pushed to ghcr.io
- ✅ Security scan completes

### 3. Test Supabase Deployment

```bash
# Create a test Edge Function
echo 'export default () => new Response("OK")' > supabase/functions/test-function/index.ts

git add .
git commit -m "test: edge function deployment"
git push origin develop
```

**Expected Result:**
- ✅ Function deployed to staging
- ✅ Smoke test passes

### 4. Test Database Migration

```bash
# Make a small schema change in any service
cd services/auth
# Edit prisma/schema.prisma (add a comment)

pnpm prisma migrate dev --name test_migration

git add .
git commit -m "test: database migration"
git push origin develop
```

**Expected Result:**
- ✅ Migration validated
- ✅ Deployed to staging database

### 5. Test Service Deployment

```bash
# Go to: Actions → Deploy Services → Run workflow
# Select:
#   - Environment: staging
#   - Services: gateway
```

**Expected Result:**
- ✅ Service deployed
- ✅ Health check passes

---

## 🚨 Common Issues

### Secret Not Found Error

**Error:** `Secret SUPABASE_STAGING_PROJECT_ID not found`

**Fix:**
1. Go to **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Add the missing secret
4. Re-run workflow

### Database Connection Timeout

**Error:** `Connection to database failed`

**Check:**
- [ ] Database URL format is correct
- [ ] Database is accessible from GitHub Actions (not behind firewall)
- [ ] Username/password are correct
- [ ] Database name exists

### Docker Build Permission Denied

**Error:** `denied: permission_denied`

**Fix:**
1. Go to **Settings → Actions → General**
2. Scroll to **Workflow permissions**
3. Select **Read and write permissions**
4. Click **Save**

### Kubernetes Deployment Fails

**Error:** `Failed to authenticate to cluster`

**Fix:**
```bash
# Verify kubeconfig is valid
kubectl cluster-info

# Re-encode and update secret
kubectl config view --raw | base64 -w 0
# Update KUBE_CONFIG secret with new value
```

---

## 📝 Quick Command Reference

### Add a Secret (GitHub CLI)

```bash
gh secret set SECRET_NAME -b "secret-value"

# From file
gh secret set SSH_KEY < ~/.ssh/id_rsa

# From stdin
echo "my-secret-value" | gh secret set MY_SECRET
```

### List All Secrets

```bash
gh secret list
```

### Update a Secret

```bash
gh secret set SECRET_NAME -b "new-value"
```

### Delete a Secret

```bash
gh secret delete SECRET_NAME
```

---

## ✅ Verification Checklist

Before going to production:

- [ ] All secrets are set (no missing secrets)
- [ ] CI pipeline runs successfully on test branch
- [ ] Docker images build and push successfully
- [ ] Supabase functions deploy to staging
- [ ] Database migrations work in staging
- [ ] Service deployment succeeds in staging
- [ ] Health checks pass after deployment
- [ ] Rollback tested in staging
- [ ] Monitoring and alerts configured
- [ ] Database backups configured
- [ ] Team has access to CI/CD logs
- [ ] Documentation reviewed and updated

---

## 🎯 Ready for Production?

Once all items are checked:

1. **Merge to main branch** - Auto-deploys to production
2. **Monitor first deployment** - Watch logs closely
3. **Run smoke tests** - Verify all services healthy
4. **Update DNS** - Point to production (if needed)
5. **Celebrate!** 🎉

---

## 📚 Need Help?

- **GitHub Actions docs**: https://docs.github.com/en/actions
- **Internal docs**: See `docs/CI_CD_SETUP.md`
- **Issues**: Open a ticket with DevOps team

---

**Last Updated:** 2025-01-15
