# Oracle Application - Deployment Guide

Complete step-by-step guide to deploy the Oracle application to Vercel.

## Prerequisites

- GitHub account
- Vercel account
- Git installed locally
- Node.js 20+ and pnpm installed

## Step 1: Create GitHub Repository

### Option A: Create New Repository

```bash
# Navigate to your project directory
cd /path/to/your/project

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial oracle application"

# Create repository at https://github.com/new
# Then add remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Option B: Clone Existing Repository

If you cloned from a template:

```bash
# Already initialized and committed
git push -u origin main
```

## Step 2: Verify Project Structure

Ensure your project has these key files:

```
project-root/
├── app/
│   ├── api/
│   │   ├── oracle/
│   │   │   └── route.ts
│   │   └── health/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── contract.ts
│   ├── xapi.ts
│   ├── analysis.ts
│   └── signing.ts
├── vercel.json
├── package.json
├── ENV_SETUP.md
├── DEPLOYMENT.md (this file)
└── tsconfig.json
```

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Authenticate with Vercel
vercel login

# Deploy from project directory
cd /path/to/your/project
vercel

# Select "Yes" when asked to link to an existing project or create a new one
# Select your GitHub repository
# Vercel will build and deploy automatically
```

### Option B: Deploy from Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "New Project"

2. **Connect GitHub Repository**
   - Click "Import Git Repository"
   - Search for your repository
   - Click "Import"

3. **Configure Project**
   - Framework: Next.js (auto-detected)
   - Root Directory: ./ (or leave empty)
   - Build Command: `pnpm build` (auto-detected)
   - Output Directory: .next (auto-detected)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - You'll get a project URL (e.g., https://my-oracle.vercel.app)

## Step 4: Add Environment Variables

Once deployed, add environment variables:

1. **Open Project Settings**
   - Go to your project on Vercel dashboard
   - Click "Settings" tab
   - Click "Environment Variables" in left sidebar

2. **Add Each Variable**

```
CONTRACT_ADDRESS = 0x10cF97EA9385A38DA8B1bA9f9B1518AfC5bc604B
RPC_URL = https://rpc.ritualfoundation.org
X_API_KEY = your_x_api_bearer_token
TEE_PRIVATE_KEY = 0xyour_private_key
```

For detailed instructions on getting these values, see ENV_SETUP.md

3. **Save Variables**
   - Each variable should be added individually
   - Select "Production" environment
   - Click "Save"

4. **Redeploy**
   - Go to "Deployments" tab
   - Click the three dots on latest deployment
   - Click "Redeploy"
   - Wait for build to complete

## Step 5: Verify Deployment

### Check Health Endpoint

```bash
# Replace YOUR_PROJECT_URL with your Vercel URL
curl https://YOUR_PROJECT_URL/api/health

# Expected response:
# {
#   "status": "healthy",
#   "timestamp": "2024-01-15T10:30:00.000Z",
#   "uptime": 123.45,
#   "environment": {
#     "hasContractAddress": true,
#     "hasRpcUrl": true,
#     "hasXApiKey": true,
#     "hasTeePrivateKey": true
#   }
# }
```

If you get 500 error or environment variables show false, environment variables aren't set yet.

### Check Oracle Endpoint

```bash
curl https://YOUR_PROJECT_URL/api/oracle

# Expected response (depends on pending requests):
# {
#   "status": "success",
#   "message": "Processed 0 pending requests",
#   "requestsProcessed": 0,
#   "results": [],
#   "errors": []
# }
```

### View Logs

To see real-time logs:

1. Go to Vercel dashboard
2. Select your project
3. Click "Functions" tab
4. Click "oracle.js" function
5. See real-time logs and execution details

## Step 6: Monitor Cron Execution

The oracle runs automatically every 5 minutes via Vercel Cron.

### Check Cron Logs

1. Go to project on Vercel dashboard
2. Click "Functions" tab
3. You should see:
   - `/api/oracle` function
   - Invocation count
   - Last execution time
   - Average duration

### Manual Testing

To manually trigger the oracle (for testing):

```bash
curl https://YOUR_PROJECT_URL/api/oracle
```

This will execute the oracle pipeline immediately, regardless of cron schedule.

## Step 7: Production Monitoring

### Set Up Error Alerts (Optional)

1. Go to Vercel dashboard
2. Select your project
3. Click "Settings"
4. Enable "Failed Deployments" notifications
5. Configure email or Slack notifications

### Monitor Function Metrics

1. Click "Functions" tab
2. Monitor:
   - Execution count per period
   - Average duration
   - Error rate
   - Memory usage

### Check Application Logs

```bash
# Using Vercel CLI
vercel logs /api/oracle --follow

# This shows real-time logs from your oracle function
```

## Troubleshooting Deployment

### Build Fails

- Check that all dependencies are in package.json
- Verify TypeScript has no compile errors locally: `pnpm build`
- Check build output in Vercel: click deployment → "Build logs"

### Environment Variables Not Set

- Verify variables are in Vercel dashboard
- Check exact variable names (case-sensitive)
- Redeploy after adding variables
- Verify by calling `/api/health` endpoint

### Cron Not Running

- Check that vercel.json exists in root directory
- Verify cron schedule: `*/5 * * * *` = every 5 minutes
- Check Vercel dashboard "Functions" tab for invocation history

### Oracle Errors at Runtime

- Check Vercel Function logs in dashboard
- Look for environment variable errors
- Check contract address and RPC URL are correct
- Verify TEE_PRIVATE_KEY is valid Ethereum private key

## Updating Code

To push updates to Vercel:

```bash
# Make code changes locally
git add .
git commit -m "Update oracle logic"
git push origin main

# Vercel automatically detects push and redeploys
# Monitor deployment in Vercel dashboard
```

## Rollback to Previous Version

If deployment has issues:

1. Go to Vercel dashboard
2. Click "Deployments" tab
3. Find previous working deployment
4. Click three dots → "Promote to Production"

## Next Steps

1. ✅ Verify `/api/health` returns all true for environment variables
2. ✅ Monitor first 24 hours of cron executions in Vercel logs
3. ✅ Set up error alerts/notifications
4. ✅ Test with known X handles to verify analysis works
5. ✅ Monitor gas usage for contract submissions
6. ✅ Keep backup of TEE_PRIVATE_KEY in secure location

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Oracle Logs: In Vercel dashboard → Functions tab
- GitHub Actions: For automated testing/CI

## Additional Resources

- Next.js Deployment: https://nextjs.org/docs/deployment
- Vercel Environment Variables: https://vercel.com/docs/deployments/environment-variables
- Ethers.js Documentation: https://docs.ethers.org/v6/
- Ritual Chain RPC: https://rpc.ritualfoundation.org
