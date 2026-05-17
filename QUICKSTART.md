# Oracle Application - Quick Start

Get your oracle deployed in minutes!

## 5-Minute Setup

### 1. Clone or Create Project

```bash
# If starting fresh
mkdir shadowlens-oracle
cd shadowlens-oracle
git init

# Copy all files from this repository
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 4. Add Environment Variables

In Vercel dashboard for your project:

```
CONTRACT_ADDRESS = 0x10cF97EA9385A38DA8B1bA9f9B1518AfC5bc604B
RPC_URL = https://rpc.ritualfoundation.org
X_API_KEY = <your_x_api_bearer_token>
TEE_PRIVATE_KEY = <your_0x_prefixed_private_key>
```

### 5. Redeploy

Click "Redeploy" in Vercel dashboard after adding variables.

### 6. Verify

```bash
# Check health
curl https://your-app.vercel.app/api/health

# Should show all environment variables as true
```

## Done! 🎉

Your oracle is now:
- ✅ Deployed on Vercel
- ✅ Running every 5 minutes automatically
- ✅ Ready to process requests from Ritual Chain

## What's Next?

1. **Get X API Key**
   - Visit https://developer.twitter.com/en/portal/dashboard
   - Create project, generate API key
   - Use bearer token as X_API_KEY

2. **Get TEE Private Key**
   - Generate Ethereum private key (0x-prefixed hex)
   - This is the signer for all oracle results
   - Keep secure!

3. **Submit Test Request**
   - Call contract's submitAnalysisRequest() with a real X handle
   - Oracle will analyze it in next 5-minute window
   - Check result via contract or Vercel logs

4. **Monitor Logs**
   - Vercel dashboard → Functions → oracle.js
   - See real-time execution and debug issues

## File Structure

```
project/
├── app/
│   └── api/
│       ├── oracle/route.ts      # Main oracle endpoint
│       └── health/route.ts      # Health check
├── lib/
│   ├── contract.ts              # Blockchain interaction
│   ├── xapi.ts                  # X/Twitter API
│   ├── analysis.ts              # Scoring engine
│   └── signing.ts               # Ethereum signing
├── vercel.json                  # Cron configuration
├── package.json
├── ENV_SETUP.md                 # Environment variables guide
├── DEPLOYMENT.md                # Full deployment guide
└── ARCHITECTURE.md              # Technical reference
```

## Common Issues

### "Environment variables not set"
- Go to Vercel project Settings → Environment Variables
- Add all 4 variables
- Redeploy

### "Contract call failed"
- Verify CONTRACT_ADDRESS is correct
- Check RPC_URL is accessible: `curl https://rpc.ritualfoundation.org`
- Verify TEE_PRIVATE_KEY is valid

### "X API rate limited"
- Your X API has rate limits
- Upgrade X API tier for higher limits
- Oracle will retry in 5 minutes

### Build fails
- Check dependencies installed: `pnpm install`
- Verify TypeScript compiles: `pnpm build`
- Check Vercel build logs

## Testing Locally

```bash
# Install dependencies
pnpm install

# Run dev server
pnpm dev

# Test health endpoint
curl http://localhost:3000/api/health

# Test oracle endpoint (manually trigger)
curl http://localhost:3000/api/oracle
```

## Documentation

- **ENV_SETUP.md** - Environment variables guide
- **DEPLOYMENT.md** - Step-by-step deployment
- **ARCHITECTURE.md** - Technical reference & API docs

## Support

- Check Vercel logs: dashboard → Functions → oracle.js
- Read ARCHITECTURE.md for scoring logic explanation
- See DEPLOYMENT.md for troubleshooting
