# Security Note: Supabase Credentials

## ⚠️ Important

If you had `.env.supabase` with real credentials that was committed to git:

### Actions Taken:

✅ Removed `.env.supabase` from git  
✅ Added to `.gitignore`  
✅ Created `.env.supabase.example` template

### What You Need to Do:

**If the file was pushed to remote repository:**

1. **Rotate your Supabase keys immediately:**
   - Go to Supabase Dashboard → Settings → API
   - Generate new `anon` key
   - Generate new `service_role` key
   - Update your local `.env.supabase` with new keys

2. **Update all deployed environments** with new keys

3. **Consider using git-filter-repo** to remove from history:

   ```bash
   # Install git-filter-repo
   pip install git-filter-repo

   # Remove file from all history
   git filter-repo --path .env.supabase --invert-paths

   # Force push (⚠️ coordinate with team first!)
   git push origin --force --all
   ```

**If the file was NOT pushed yet:** ✅ You're safe! The file was only in local commits.

---

## Best Practices Going Forward:

1. **Never commit `.env` files** with real credentials
2. **Always use `.env.example`** templates
3. **Use environment-specific files:**
   - `.env.local` - Your local development
   - `.env.development` - Dev environment
   - `.env.staging` - Staging environment
   - `.env.production` - Production (never commit!)

4. **Use secret management** for production:
   - GitHub Secrets
   - AWS Secrets Manager
   - HashiCorp Vault
   - Supabase Environment Variables

5. **Rotate keys regularly** as a security practice

---

## Current Status:

✅ `.env.supabase` removed from git  
✅ `.gitignore` updated to prevent future commits  
✅ Template file created (`.env.supabase.example`)  
✅ All service `.env.example` files updated

**Next:** Copy `.env.supabase.example` to `.env.supabase` and add your real keys.
