# 🚨 URGENT SECURITY ACTION REQUIRED

## Status: CREDENTIALS EXPOSED IN GIT HISTORY

The `.env.supabase` file with real credentials **WAS PUSHED** to the remote repository and is in git
history.

### Exposed Credentials:

- ✅ Supabase URL: `https://nkrqcigvcakqicutkpfd.supabase.co`
- ⚠️ Supabase Anon Key (exposed)
- ⚠️ Supabase Service Role Key (exposed - CRITICAL)
- ⚠️ Stripe keys (if real)

---

## IMMEDIATE ACTIONS (Do Now!)

### 1. Rotate Supabase Keys (HIGHEST PRIORITY)

**Go to Supabase Dashboard NOW:**

1. Visit: https://supabase.com/dashboard/project/nkrqcigvcakqicutkpfd/settings/api
2. Click "Generate new anon key" → Copy new key
3. Click "Generate new service_role key" → Copy new key
4. Update your local `.env.supabase` with new keys
5. Update all deployed environments

**Why this is critical:**

- Service Role Key has FULL DATABASE ACCESS
- Can bypass Row Level Security (RLS)
- Can read/write/delete ANY data
- Can create/drop tables

### 2. Rotate Stripe Keys (If Real)

If those Stripe keys are real:

1. Go to Stripe Dashboard → Developers → API Keys
2. Roll the secret key
3. Roll the webhook secret
4. Update your local environment

### 3. Remove from Git History

**Option A: Using git filter-repo (Recommended)**

```bash
# Install git-filter-repo
pip install git-filter-repo

# Backup first!
git clone . ../Giga-backup

# Remove file from all history
git filter-repo --path .env.supabase --invert-paths

# Force push (⚠️ This rewrites history!)
git push origin --force --all
git push origin --force --tags
```

**Option B: Using BFG Repo-Cleaner**

```bash
# Install BFG
brew install bfg  # macOS
# or download from: https://rtyley.github.io/bfg-repo-cleaner/

# Backup first!
git clone . ../Giga-backup

# Remove file
bfg --delete-files .env.supabase

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin --force --all
```

**Option C: Manual (If you just pushed)**

```bash
# If you JUST pushed and no one else has pulled:
git reset --hard HEAD~3  # Go back 3 commits (before the file was added)
git push origin --force cleanup-hybrid-architecture
```

---

## AFTER Rotating Keys

### Update All Environments:

1. **Local Development:**

   ```bash
   # Copy template
   cp .env.supabase.example .env.supabase

   # Edit with NEW keys
   nano .env.supabase
   ```

2. **CI/CD Secrets:**
   - GitHub Actions: Update repository secrets
   - GitLab CI: Update CI/CD variables
   - Other CI: Update environment variables

3. **Deployed Services:**
   - Update environment variables in hosting platform
   - Restart all services

4. **Team Members:**
   - Notify team to pull latest changes
   - Share new keys securely (NOT via git)
   - Use secret management tool

---

## Prevention Checklist

After fixing:

- [x] `.env.supabase` removed from git
- [x] Added to `.gitignore`
- [ ] Keys rotated in Supabase
- [ ] Keys rotated in Stripe (if needed)
- [ ] File removed from git history
- [ ] All environments updated with new keys
- [ ] Team notified
- [ ] Pre-commit hook added (optional)

---

## Add Pre-commit Hook (Optional)

Prevent future accidents:

```bash
# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
if git diff --cached --name-only | grep -E '\.env$|\.env\..*$' | grep -v '\.example$'; then
    echo "❌ ERROR: Attempting to commit .env file!"
    echo "Files:"
    git diff --cached --name-only | grep -E '\.env$|\.env\..*$' | grep -v '\.example$'
    echo ""
    echo "Please remove these files from your commit."
    exit 1
fi
EOF

chmod +x .git/hooks/pre-commit
```

---

## Timeline

**Immediate (Next 15 minutes):**

- [ ] Rotate Supabase keys
- [ ] Rotate Stripe keys (if real)

**Within 1 hour:**

- [ ] Remove from git history
- [ ] Force push cleaned history

**Within 24 hours:**

- [ ] Update all environments
- [ ] Verify all services working with new keys
- [ ] Notify team

---

## Questions?

**Q: Can someone still use the old keys?** A: Yes, until you rotate them in Supabase dashboard. Do
this FIRST.

**Q: What if someone already cloned the repo?** A: They'll have the old keys in their history. After
you rotate, old keys won't work.

**Q: Will force push break things?** A: It rewrites history. Coordinate with team. They'll need to:

```bash
git fetch origin
git reset --hard origin/cleanup-hybrid-architecture
```

**Q: What's the worst case?** A: With service_role key, someone could:

- Read all user data
- Modify/delete data
- Create admin accounts
- Drop tables

**Priority: ROTATE KEYS NOW! 🚨**
