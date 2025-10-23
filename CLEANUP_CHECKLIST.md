# Codebase Cleanup Checklist

Track your progress through the cleanup process.

---

## Pre-Cleanup

- [ ] Read `CLEANUP_SUMMARY.md`
- [ ] Read `docs/ARCHITECTURE_CLEANUP_PLAN.md`
- [ ] Read `docs/MIGRATION_TO_SUPABASE.md`
- [ ] Create backup branch: `git checkout -b backup-before-cleanup`
- [ ] Commit current state: `git add . && git commit -m "Backup before cleanup"`

---

## Phase 1: Remove Obsolete Services

### Delete Old Services
- [ ] Delete `services/auth/` (replaced by Supabase Auth)
- [ ] Delete `services/notification/` (replaced by Supabase Notifications)
- [ ] Delete `services/upload/` (replaced by Supabase Storage)
- [ ] Commit: `git add . && git commit -m "Remove obsolete services"`

### Verify Deletion
- [ ] Confirm no references to deleted services in code
- [ ] Update `.gitignore` if needed
- [ ] Run `pnpm install` to clean up dependencies

---

## Phase 2: Archive Obsolete Specs

- [x] Move `auth-service/` to `_archived/`
- [x] Move `notification-service/` to `_archived/`
- [x] Move `upload-service/` to `_archived/`
- [x] Create `_archived/README.md`
- [ ] Commit: `git add . && git commit -m "Archive obsolete specs"`

---

## Phase 3: Update Ecommerce Service (Pilot)

### Install Dependencies
- [ ] `cd services/ecommerce`
- [ ] `pnpm add @giga/auth-sdk @giga/file-storage-sdk @giga/notifications-sdk`

### Update Environment Variables
- [ ] Add `SUPABASE_URL` to `.env`
- [ ] Add `SUPABASE_ANON_KEY` to `.env`
- [ ] Add `SUPABASE_SERVICE_ROLE_KEY` to `.env`
- [ ] Remove old service URLs from `.env`

### Implement Auth Middleware
- [ ] Create `src/middleware/auth.ts` with auth middleware
- [ ] Add `authenticate` function
- [ ] Add `requireRole` function
- [ ] Add `requireActiveRole` function

### Update Routes
- [ ] Update product routes with auth middleware
- [ ] Update order routes with auth middleware
- [ ] Update cart routes with auth middleware
- [ ] Add role-based access control

### Add File Upload Support
- [ ] Install `multer`: `pnpm add multer @types/multer`
- [ ] Create file upload endpoint for product images
- [ ] Integrate `@giga/file-storage-sdk`
- [ ] Test image uploads

### Add Notification Support
- [ ] Integrate `@giga/notifications-sdk`
- [ ] Send order confirmation notifications
- [ ] Send order shipped notifications
- [ ] Test notifications

### Update Tests
- [ ] Mock auth SDK in tests
- [ ] Mock file storage SDK in tests
- [ ] Mock notification SDK in tests
- [ ] Run tests: `pnpm test`
- [ ] Fix any failing tests

### Verify
- [ ] Build succeeds: `pnpm run build`
- [ ] Linting passes: `pnpm run lint`
- [ ] Tests pass: `pnpm test`
- [ ] Manual testing complete
- [ ] Commit: `git add . && git commit -m "Update ecommerce service to use Supabase SDKs"`

---

## Phase 4: Update Hotel Service

### Install Dependencies
- [ ] `cd services/hotel`
- [ ] `pnpm add @giga/auth-sdk @giga/file-storage-sdk @giga/notifications-sdk`

### Update Environment Variables
- [ ] Add Supabase variables to `.env`
- [ ] Remove old service URLs

### Implement Auth Middleware
- [ ] Create `src/middleware/auth.ts`
- [ ] Add auth functions

### Update Routes
- [ ] Update property routes with auth
- [ ] Update booking routes with auth
- [ ] Add role-based access control (HOST, CUSTOMER)

### Add File Upload Support
- [ ] Create property image upload endpoint
- [ ] Integrate file storage SDK
- [ ] Test uploads

### Add Notification Support
- [ ] Send booking confirmation notifications
- [ ] Send booking reminder notifications
- [ ] Test notifications

### Update Tests
- [ ] Mock SDKs
- [ ] Run tests: `pnpm test`
- [ ] Fix failing tests

### Verify
- [ ] Build succeeds
- [ ] Linting passes
- [ ] Tests pass
- [ ] Manual testing complete
- [ ] Commit: `git add . && git commit -m "Update hotel service to use Supabase SDKs"`

---

## Phase 5: Update Taxi Service

### Install Dependencies
- [ ] `cd services/taxi`
- [ ] `pnpm add @giga/auth-sdk @giga/file-storage-sdk @giga/notifications-sdk`

### Update Environment Variables
- [ ] Add Supabase variables to `.env`
- [ ] Remove old service URLs

### Implement Auth Middleware
- [ ] Create `src/middleware/auth.ts`
- [ ] Add auth functions

### Update Routes
- [ ] Update ride routes with auth
- [ ] Update driver routes with auth
- [ ] Add role-based access control (DRIVER, CUSTOMER)

### Add File Upload Support
- [ ] Create vehicle image upload endpoint
- [ ] Integrate file storage SDK
- [ ] Test uploads

### Add Notification Support
- [ ] Send ride accepted notifications
- [ ] Send ride completed notifications
- [ ] Test notifications

### Update Tests
- [ ] Mock SDKs
- [ ] Run tests: `pnpm test`
- [ ] Fix failing tests

### Verify
- [ ] Build succeeds
- [ ] Linting passes
- [ ] Tests pass
- [ ] Manual testing complete
- [ ] Commit: `git add . && git commit -m "Update taxi service to use Supabase SDKs"`

---

## Phase 6: Update Payment Service

### Install Dependencies
- [ ] `cd services/payment`
- [ ] `pnpm add @giga/auth-sdk @giga/notifications-sdk`

### Update Environment Variables
- [ ] Add Supabase variables to `.env`
- [ ] Remove old service URLs

### Implement Auth Middleware
- [ ] Create `src/middleware/auth.ts`
- [ ] Add auth functions

### Update Routes
- [ ] Update payment routes with auth
- [ ] Update transaction routes with auth
- [ ] Add role-based access control

### Add Notification Support
- [ ] Send payment confirmation notifications
- [ ] Send refund notifications
- [ ] Test notifications

### Update Tests
- [ ] Mock SDKs
- [ ] Run tests: `pnpm test`
- [ ] Fix failing tests

### Verify
- [ ] Build succeeds
- [ ] Linting passes
- [ ] Tests pass
- [ ] Manual testing complete
- [ ] Commit: `git add . && git commit -m "Update payment service to use Supabase SDKs"`

---

## Phase 7: Update Specs

### Ecommerce Spec
- [ ] Update `requirements.md` with SDK usage
- [ ] Update `design.md` with auth patterns
- [ ] Update `tasks.md` with current status

### Hotel Spec
- [ ] Update `requirements.md` with SDK usage
- [ ] Update `design.md` with auth patterns
- [ ] Update `tasks.md` with current status

### Taxi Spec
- [ ] Update `requirements.md` with SDK usage
- [ ] Update `design.md` with auth patterns
- [ ] Update `tasks.md` with current status

### Payment Spec
- [ ] Update `requirements.md` with SDK usage
- [ ] Update `design.md` with auth patterns
- [ ] Update `tasks.md` with current status

### Ads Spec
- [ ] Update with SDK integration examples
- [ ] Add file upload patterns
- [ ] Add notification patterns

### API Gateway Spec
- [ ] Update for Kong Gateway
- [ ] Add routing configuration
- [ ] Add Supabase endpoint routing

### Commit
- [ ] `git add . && git commit -m "Update specs to reflect Supabase architecture"`

---

## Phase 8: Update Documentation

### Architecture Documents
- [ ] Update `docs/ARCHITECTURE_GUIDE.md`
- [ ] Update `docs/API_DOCUMENTATION.md`
- [ ] Update `docs/DEVELOPMENT_GUIDE.md`
- [ ] Update `docs/SERVICE_ORCHESTRATION.md`
- [ ] Update `docs/SERVICE_ROADMAP.md`

### Root README
- [ ] Update `README.md` with new architecture
- [ ] Add Supabase setup instructions
- [ ] Update service list
- [ ] Update getting started guide

### Commit
- [ ] `git add . && git commit -m "Update documentation"`

---

## Phase 9: Update Scripts

### Service Scripts
- [ ] Update `run-services.sh` - remove old services
- [ ] Update `start-services.sh` - remove old services
- [ ] Update `test-services.sh` - remove old services

### New Scripts
- [ ] Create `setup-supabase.sh` - initialize Supabase locally
- [ ] Create `deploy-edge-functions.sh` - deploy Edge Functions
- [ ] Make scripts executable: `chmod +x *.sh`

### Commit
- [ ] `git add . && git commit -m "Update scripts"`

---

## Phase 10: Clean Dependencies

### Root Package.json
- [ ] Remove references to deleted services
- [ ] Update workspace configuration
- [ ] Run `pnpm install`

### Service Package.json Files
- [ ] Verify all services have correct SDK dependencies
- [ ] Remove unused dependencies
- [ ] Run `pnpm install` in each service

### Commit
- [ ] `git add . && git commit -m "Clean up dependencies"`

---

## Phase 11: Update Environment Files

### Root .env.example
- [ ] Remove old service URLs
- [ ] Add Supabase configuration
- [ ] Add service URLs (microservices only)
- [ ] Document all variables

### Service .env.example Files
- [ ] Update each service's `.env.example`
- [ ] Add Supabase variables
- [ ] Remove old variables

### Commit
- [ ] `git add . && git commit -m "Update environment configuration"`

---

## Phase 12: Final Verification

### Build All Services
- [ ] `cd services/ecommerce && pnpm run build`
- [ ] `cd services/hotel && pnpm run build`
- [ ] `cd services/taxi && pnpm run build`
- [ ] `cd services/payment && pnpm run build`

### Run All Tests
- [ ] `cd services/ecommerce && pnpm test`
- [ ] `cd services/hotel && pnpm test`
- [ ] `cd services/taxi && pnpm test`
- [ ] `cd services/payment && pnpm test`

### Lint All Services
- [ ] `pnpm run lint` (root)
- [ ] Fix any linting errors

### Manual Testing
- [ ] Test authentication flow
- [ ] Test file uploads
- [ ] Test notifications
- [ ] Test each service's main features

### Documentation Review
- [ ] All docs are up to date
- [ ] No references to deleted services
- [ ] SDK usage is documented
- [ ] Examples are correct

---

## Phase 13: Deployment Preparation

### Staging Environment
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Monitor for errors
- [ ] Fix any issues

### Production Checklist
- [ ] Update environment variables
- [ ] Update load balancer/gateway config
- [ ] Plan zero-downtime migration
- [ ] Prepare rollback plan

---

## Post-Cleanup

### Final Commit
- [ ] `git add .`
- [ ] `git commit -m "Complete codebase cleanup - hybrid Supabase architecture"`
- [ ] `git push origin cleanup-branch`

### Create Pull Request
- [ ] Create PR with detailed description
- [ ] Link to cleanup documentation
- [ ] Request code review
- [ ] Address review comments

### Merge and Deploy
- [ ] Merge to main branch
- [ ] Deploy to production
- [ ] Monitor for issues
- [ ] Celebrate! 🎉

### Cleanup
- [ ] Delete backup branch (after confirming everything works)
- [ ] Archive old deployment configs
- [ ] Update team documentation

---

## Success Metrics

After cleanup, verify:
- [ ] All services build successfully
- [ ] All tests pass (100% pass rate)
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Documentation is complete and accurate
- [ ] No references to deleted services
- [ ] All services use Supabase SDKs correctly
- [ ] Auth works across all services
- [ ] File uploads work
- [ ] Notifications work
- [ ] Staging environment is stable
- [ ] Production deployment successful

---

## Notes

Use this space to track issues, learnings, or important decisions:

```
Date: ___________
Issue: 
Solution:

Date: ___________
Issue:
Solution:

Date: ___________
Learning:
```

---

## Time Tracking

Track time spent on each phase:

- Phase 1 (Delete services): _____ hours
- Phase 2 (Archive specs): _____ hours
- Phase 3 (Ecommerce): _____ hours
- Phase 4 (Hotel): _____ hours
- Phase 5 (Taxi): _____ hours
- Phase 6 (Payment): _____ hours
- Phase 7 (Update specs): _____ hours
- Phase 8 (Update docs): _____ hours
- Phase 9 (Update scripts): _____ hours
- Phase 10 (Clean deps): _____ hours
- Phase 11 (Update env): _____ hours
- Phase 12 (Verification): _____ hours
- Phase 13 (Deployment): _____ hours

**Total: _____ hours**

---

## Status

**Current Phase:** _____________  
**Started:** _____________  
**Target Completion:** _____________  
**Actual Completion:** _____________  

**Overall Progress:** _____ / 100%
