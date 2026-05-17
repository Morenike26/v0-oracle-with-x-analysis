# DEPLOYMENT CHECKLIST - Ready to Deploy ✅

## Pre-Deployment

- [x] Code compiled successfully
- [x] TypeScript passed type checking
- [x] All routes configured
- [x] Dependencies installed (ethers.js, axios, etc.)
- [x] Production contract ABI imported
- [x] Environment variables configured
- [x] Signing logic implemented
- [x] Error handling added
- [x] Cron schedule configured

## Vercel Deployment

### Phase 1: GitHub Setup
```
[ ] Create/update GitHub repository
[ ] Add all files to Git
[ ] Commit: "ShadowLens Oracle - Production Ready"
[ ] Push to main branch: git push origin main
```

### Phase 2: Deploy to Vercel
```
[ ] Go to https://vercel.com/dashboard
[ ] Click "New Project"
[ ] Select "Import Git Repository"
[ ] Choose your GitHub repo
[ ] Click "Deploy"
[ ] Wait for build to complete (should show ✓)
[ ] Note your deployment URL: https://your-project.vercel.app
```

### Phase 3: Add Environment Variables
**In Vercel Dashboard → Settings → Environment Variables:**

```
[ ] Add CONTRACT_ADDRESS
    Name: CONTRACT_ADDRESS
    Value: 0xCe8f5297dFE00E5e201f46f4A662E4ffCB5Ac3D6
    Environment: Production

[ ] Add RITUAL_RPC
    Name: RITUAL_RPC
    Value: https://rpc.ritualfoundation.org
    Environment: Production

[ ] Add X_API_KEY
    Name: X_API_KEY
    Value: AAAAAAAAAAAAAAAAAAAAABAH9gEAAAAAKWK4OrCItaDY%2FrXFcoAkQX83670%3D3d8KB5XKHi7pu3rt4YiSxMDfWLMgfnI4DxlHdfMW2AZH6mz3oh
    Environment: Production

[ ] Add TEE_PRIVATE_KEY
    Name: TEE_PRIVATE_KEY
    Value: 0x7b796145ba7f02ad9422f181d1e306ca457f9e14cade801762e587170cfd4bda
    Environment: Production
```

### Phase 4: Redeploy with Variables
```
[ ] Go to Deployments tab
[ ] Find your latest deployment
[ ] Click three dots (...)
[ ] Select "Redeploy"
[ ] Wait for new build to complete
[ ] Should show ✓ Build successful
```

## Post-Deployment Verification

### Test 1: Health Check
```bash
[ ] curl https://your-project.vercel.app/api/health
    Expected: 200 OK with healthy status
```

### Test 2: Manual Oracle Run
```bash
[ ] curl https://your-project.vercel.app/api/oracle
    Expected: 200 OK with results (or empty if no pending requests)
```

### Test 3: Check Logs
```
[ ] Go to Vercel dashboard
[ ] Click Functions tab
[ ] Click oracle.js
[ ] Should see logs like:
    - 🔍 Oracle invoked
    - 📊 Found X pending requests (0 is OK)
    - 🏁 Oracle execution complete
```

### Test 4: Verify Cron
```
[ ] Wait 5 minutes
[ ] Check Vercel logs again
[ ] Should see oracle executed at ~5 minute mark
[ ] Repeats every 5 minutes
```

## Monitoring Setup

### Daily Monitoring
```
[ ] Check Vercel Functions logs daily
[ ] Look for patterns in errors
[ ] Verify oracle runs at 5-minute intervals
[ ] Monitor gas usage in contract
```

### Alert Setup (Optional)
```
[ ] Set up Vercel Function alerts in dashboard
[ ] Monitor for execution failures
[ ] Track error rates
[ ] Monitor response times
```

## Troubleshooting Checklist

### If Health Check Fails
```
[ ] Verify all 4 environment variables are set
[ ] Check variable names are exactly correct (case-sensitive)
[ ] Verify Redeploy completed successfully
[ ] Check Vercel build logs for errors
```

### If Oracle Returns Errors
```
[ ] Check contract address: 0xCe8f5297dFE00E5e201f46f4A662E4ffCB5Ac3D6
[ ] Verify RITUAL_RPC is accessible
[ ] Check TEE_PRIVATE_KEY format (should be 0x...)
[ ] Review logs for specific error message
```

### If X API Rate Limited
```
[ ] This is normal with free tier
[ ] Oracle will retry next 5-minute interval
[ ] Consider upgrading X API plan
[ ] No action needed - oracle handles gracefully
```

### If Cron Not Running
```
[ ] Verify vercel.json has cron configuration
[ ] Check Vercel project settings
[ ] Redeploy to trigger cron
[ ] Wait 5 minutes for first execution
[ ] Check logs at 5-minute mark
```

## Success Indicators

### ✅ Everything Working
```
[ ] Health check returns 200 OK
[ ] Oracle endpoint responds with results
[ ] Logs show oracle runs every 5 minutes
[ ] No persistent error messages
[ ] Contract receives results (check on-chain)
```

### ⚠️ Issues to Address
```
[ ] Health check returns error → Check environment variables
[ ] Oracle timeout errors → May be normal with free X API tier
[ ] Contract call failures → Verify contract address and ABI
[ ] Cron not running → Verify vercel.json and redeploy
```

## Operations Checklist

### Weekly
```
[ ] Review Function logs for errors
[ ] Check success rate of requests
[ ] Monitor gas costs if applicable
[ ] Verify oracle is maintaining schedule
```

### Monthly
```
[ ] Review overall performance metrics
[ ] Check for patterns in failures
[ ] Plan any upgrades if needed
[ ] Update documentation if changed
```

## Rollback Plan (if needed)

```
[ ] Go to Vercel Deployments
[ ] Find previous working deployment
[ ] Click three dots (...)
[ ] Select "Rollback to this Deployment"
[ ] Verify health check works
```

## Documentation Links

- **Quick Start:** QUICKSTART.md
- **Production Deploy:** PRODUCTION_DEPLOYMENT.md
- **Architecture:** ARCHITECTURE.md
- **Env Setup:** ENV_SETUP.md
- **Troubleshooting:** PRODUCTION_DEPLOYMENT.md (bottom section)

---

## DEPLOYMENT SUMMARY

**Contract:** 0xCe8f5297dFE00E5e201f46f4A662E4ffCB5Ac3D6  
**Network:** Ritual Chain  
**RPC:** https://rpc.ritualfoundation.org  
**Schedule:** Every 5 minutes  
**Framework:** Next.js 16 + Vercel Serverless  

**Status:** ✅ READY FOR PRODUCTION

---

## QUICK START DEPLOYMENT (15 minutes)

1. Push to GitHub: `git push origin main`
2. Deploy to Vercel: Import GitHub repo
3. Add 4 environment variables in Vercel dashboard
4. Redeploy to apply variables
5. Verify: `curl https://your-project.vercel.app/api/health`
6. Done! Oracle runs every 5 minutes automatically.

---

**Last Updated:** 2024-01-15  
**Version:** Production Ready  
**All Systems:** ✅ GO
