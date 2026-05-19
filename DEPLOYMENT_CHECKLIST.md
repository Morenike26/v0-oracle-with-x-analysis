# Oracle Application - Deployment Checklist

Complete checklist for deploying the ShadowLens Oracle to production.

## Pre-Deployment Setup

### ✅ Code Preparation
- [x] All files created and organized
- [x] Dependencies installed (ethers.js, axios)
- [x] TypeScript compilation successful
- [x] No build errors or warnings
- [x] All modules properly typed

### ✅ Configuration Files
- [x] `vercel.json` created with cron schedule (*/5 * * * *)
- [x] `package.json` updated with all dependencies
- [x] `tsconfig.json` configured for Next.js 16
- [x] Environment variable documentation complete

### ✅ API Routes
- [x] `/api/oracle` - Main oracle endpoint (GET + OPTIONS)
- [x] `/api/health` - Health check endpoint (GET + OPTIONS)
- [x] CORS headers enabled on both routes
- [x] 60-second timeout configured
- [x] Error handling implemented

### ✅ Library Modules
- [x] `lib/contract.ts` - Blockchain interaction
  - ✅ RPC provider setup
  - ✅ Event querying
  - ✅ Result submission
  - ✅ Status checking

- [x] `lib/xapi.ts` - X API integration
  - ✅ User profile fetching
  - ✅ Tweet fetching (up to 100)
  - ✅ Metrics extraction
  - ✅ Error handling

- [x] `lib/analysis.ts` - Scoring engine
  - ✅ Engagement score calculation
  - ✅ Posting consistency calculation
  - ✅ Content risk scoring
  - ✅ Age modifiers
  - ✅ Risk level determination

- [x] `lib/signing.ts` - Ethereum signing
  - ✅ Message hashing
  - ✅ Signature generation
  - ✅ Signer address recovery

### ✅ Documentation
- [x] `README.md` - Overview and features
- [x] `QUICKSTART.md` - 5-minute setup guide
- [x] `ENV_SETUP.md` - Environment variables guide
- [x] `DEPLOYMENT.md` - Step-by-step deployment
- [x] `ARCHITECTURE.md` - Technical reference

## GitHub Setup

### ✅ Repository Creation
1. [ ] Create new GitHub repository
   - Name: `shadowlens-oracle` (or your choice)
   - Description: "ShadowLens Oracle - Ritual Chain"
   - Visibility: Public (for Vercel deployment)

2. [ ] Clone repository locally
   ```bash
   git clone https://github.com/YOUR_USERNAME/shadowlens-oracle.git
   cd shadowlens-oracle
   ```

3. [ ] Copy all project files to repository

4. [ ] Create `.gitignore`
   ```
   node_modules/
   .next/
   .env.local
   .env.*.local
   dist/
   build/
   ```

5. [ ] Commit and push to GitHub
   ```bash
   git add .
   git commit -m "Initial oracle deployment"
   git push origin main
   ```

## Vercel Deployment

### ✅ Project Creation
1. [ ] Go to https://vercel.com/dashboard
2. [ ] Click "New Project"
3. [ ] Connect GitHub repository
4. [ ] Select your repository
5. [ ] Click "Import"

### ✅ Project Configuration
1. [ ] Framework: Next.js (auto-detected)
2. [ ] Root Directory: ./ (auto-detected)
3. [ ] Build Command: `pnpm build` (auto-detected)
4. [ ] Environment Variables: (DO NOT SET YET)
5. [ ] Click "Deploy"

### ✅ Initial Deployment
- [ ] Wait for build to complete
- [ ] Verify deployment succeeds
- [ ] Note project URL (e.g., https://shadowlens-oracle.vercel.app)
- [ ] Verify `/` page loads successfully

## Environment Variables Setup

### ✅ Add to Vercel Dashboard

1. [ ] Go to Project Settings
2. [ ] Click "Environment Variables"
3. [ ] Add each variable:

**Variable 1: CONTRACT_ADDRESS**
- Name: `CONTRACT_ADDRESS`
- Value: `0xCe8f5297dFE00E5e201f46f4A662E4ffCB5Ac3D6`
- Environment: Production
- [ ] Save

**Variable 2: RPC_URL**
- Name: `RPC_URL`
- Value: `https://rpc.ritualfoundation.org`
- Environment: Production
- [ ] Save

**Variable 3: X_API_KEY**
- Name: `AAAAAAAAAAAAAAAAAAAAABAH9gEAAAAAKWK4OrCItaDY%2FrXFcoAkQX83670%3D3d8KB5XKHi7pu3rt4YiSxMDfWLMgfnI4DxlHdfMW2AZH6mz3oh
`
- Value: Your X API v2 bearer token (starts with "AAAA...")
  - [ ] Get from https://developer.twitter.com/en/portal/dashboard
  - [ ] Create project if needed
  - [ ] Generate API key and get bearer token
- Environment: Production
- [ ] Save

**Variable 4: TEE_PRIVATE_KEY**
- Name: `0x7b796145ba7f02ad9422f181d1e306ca457f9e14cade801762e587170cfd4bda`
- Value: Your Ethereum private key (0x-prefixed hex)
  - [ ] Generate new Ethereum private key
  - [ ] Keep secure backup in password manager
  - [ ] Format: 0x + 64 hex characters
- Environment: Production
- [ ] Save (⚠️ KEEP SECURE)

### ✅ Verify Variables Saved
- [ ] All 4 variables appear in list
- [ ] No typos in variable names
- [ ] All environment set to "Production"

## Redeployment with Variables

### ✅ Trigger New Deployment
1. [ ] Go to "Deployments" tab
2. [ ] Click three dots on latest deployment
3. [ ] Click "Redeploy"
4. [ ] Wait for build to complete

## Post-Deployment Verification

### ✅ Health Check
1. [ ] Call health endpoint
   ```bash
   curl https://YOUR_PROJECT_URL/api/health
   ```

2. [ ] Verify response:
   ```json
   {
     "status": "healthy",
     "environment": {
       "hasContractAddress": true,
       "hasRpcUrl": true,
       "hasXApiKey": true,
       "hasTeePrivateKey": true
     }
   }
   ```

3. [ ] All environment variables should be `true`
   - If any are `false`, check Vercel environment variables and redeploy

### ✅ Oracle Endpoint
1. [ ] Call oracle endpoint manually
   ```bash
   curl https://YOUR_PROJECT_URL/api/oracle
   ```

2. [ ] Should return JSON with:
   - `status`: "success" or "error"
   - `requestsProcessed`: number
   - `results`: array

### ✅ Vercel Functions
1. [ ] Go to Vercel dashboard
2. [ ] Select project
3. [ ] Click "Functions" tab
4. [ ] Verify you see:
   - `/api/oracle` function
   - `/api/health` function

### ✅ Cron Status
1. [ ] In Functions tab, check oracle.js
2. [ ] Should show cron configuration: `*/5 * * * *`
3. [ ] Wait 5 minutes for first automatic execution

## Monitoring Setup

### ✅ View Real-Time Logs
1. [ ] In Vercel dashboard, click "Functions" tab
2. [ ] Click "oracle.js"
3. [ ] Watch for 🔍 emoji indicating execution
4. [ ] Monitor for any error messages (❌)

### ✅ Enable Error Notifications (Optional)
1. [ ] Go to Project Settings
2. [ ] Enable failed deployment notifications
3. [ ] Configure email or Slack alerts

## Testing

### ✅ Manual Tests
1. [ ] Manually call `/api/oracle` endpoint
   ```bash
   curl https://YOUR_PROJECT_URL/api/oracle
   ```
   Should complete without errors

2. [ ] Check health endpoint several times
   ```bash
   curl https://YOUR_PROJECT_URL/api/health
   ```
   Should return "healthy" consistently

3. [ ] Monitor logs for 5-10 minutes
   - Look for 🔍 logs appearing
   - Verify no errors (❌)

### ✅ Scheduled Execution
1. [ ] Set timer for 5 minutes
2. [ ] Check Vercel Functions tab for automatic execution
3. [ ] Verify oracle function invoked
4. [ ] Check logs for execution results

## Production Readiness

### ✅ Security Checklist
- [ ] TEE_PRIVATE_KEY is not in any Git commits
- [ ] `.env.local` file created and in `.gitignore`
- [ ] No hardcoded secrets in code
- [ ] All sensitive data in Vercel environment variables
- [ ] Backup of TEE_PRIVATE_KEY stored securely

### ✅ Monitoring Readiness
- [ ] Vercel error alerts configured
- [ ] Can access Functions logs easily
- [ ] Know how to redeploy if needed
- [ ] Have rollback plan (revert to previous deployment)

### ✅ Documentation Readiness
- [ ] README.md is complete and accurate
- [ ] QUICKSTART.md tested for accuracy
- [ ] DEPLOYMENT.md matches actual steps taken
- [ ] ARCHITECTURE.md explains scoring system
- [ ] All links in docs are correct

## Production Operations

### ✅ First 24 Hours
1. [ ] Monitor logs constantly
2. [ ] Watch for patterns in errors
3. [ ] Check Functions metrics
4. [ ] Verify cron executions are consistent (every 5 minutes)

### ✅ Ongoing Monitoring
- [ ] Check logs daily for errors
- [ ] Monitor gas usage if available
- [ ] Track request processing rate
- [ ] Monitor API response times
- [ ] Alert if cron stops executing

### ✅ Maintenance Tasks
- [ ] Rotate TEE_PRIVATE_KEY periodically (quarterly)
- [ ] Review and update X API key as needed
- [ ] Monitor X API rate limits and upgrade if needed
- [ ] Keep dependencies up to date
- [ ] Review error logs weekly

## Troubleshooting Quick Reference

### Issue: Health check shows false for environment variables

**Solution:**
1. [ ] Go to Vercel project Settings
2. [ ] Click "Environment Variables"
3. [ ] Verify all 4 variables are present
4. [ ] Check for typos in variable names (case-sensitive)
5. [ ] Redeploy project
6. [ ] Wait 1-2 minutes for cache to clear
7. [ ] Test health endpoint again

### Issue: Cron not executing

**Solution:**
1. [ ] Verify `vercel.json` exists in project root
2. [ ] Check cron schedule: `*/5 * * * *` = every 5 minutes
3. [ ] Verify project is in production (not preview)
4. [ ] Check Vercel Functions logs for errors
5. [ ] Redeploy to trigger cron registration

### Issue: Contract submission failing

**Solution:**
1. [ ] Verify CONTRACT_ADDRESS: `0x10cF97EA9385A38DA8B1bA9f9B1518AfC5bc604B`
2. [ ] Check RPC_URL is accessible: `curl https://rpc.ritualfoundation.org`
3. [ ] Verify TEE_PRIVATE_KEY is valid (0x + 64 hex)
4. [ ] Check Vercel logs for detailed error
5. [ ] Verify contract exists on Ritual Chain

### Issue: X API returns 429 (rate limited)

**Solution:**
1. [ ] Check X API rate limits at https://developer.twitter.com
2. [ ] Upgrade X API tier if in free tier
3. [ ] Oracle will retry in 5 minutes
4. [ ] Monitor rate limit reset time
5. [ ] Consider caching results if needed

## Rollback Plan

### Emergency Rollback

If deployment has critical issues:

1. [ ] Go to Vercel Deployments tab
2. [ ] Find previous working deployment
3. [ ] Click three dots → "Promote to Production"
4. [ ] Verify health endpoint works
5. [ ] Investigate and fix issue before redeploying

## Final Checklist

Before declaring production-ready:

- [ ] Build succeeds with no errors
- [ ] Health endpoint returns all true
- [ ] Oracle endpoint processes requests successfully
- [ ] Logs appear in Vercel dashboard
- [ ] Cron executes every 5 minutes
- [ ] No errors in first 24 hours
- [ ] All documentation is accurate
- [ ] Backup of TEE_PRIVATE_KEY is secure
- [ ] Can redeploy if needed
- [ ] Monitoring alerts are configured

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Ethers.js Docs**: https://docs.ethers.org/v6/
- **X API Docs**: https://developer.twitter.com/en/docs/twitter-api
- **Ritual Chain RPC**: https://rpc.ritualfoundation.org

## Deployment Complete! 🎉

Once all checkboxes are complete:

✅ Your Oracle is production-ready  
✅ Running automatically every 5 minutes  
✅ Processing requests from Ritual Chain  
✅ Submitting cryptographically-signed results  
✅ Fully monitored and logged  

**Next step**: Monitor Vercel logs and watch your oracle in action!
