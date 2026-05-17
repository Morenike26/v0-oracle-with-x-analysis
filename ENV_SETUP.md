# Oracle Application - Environment Variables Guide

This document outlines all environment variables required for the Oracle application to function properly.

## Required Environment Variables

Add these to your Vercel project via the Settings > Environment Variables section:

### 1. Blockchain Configuration

**CONTRACT_ADDRESS**
- Value: `0x10cF97EA9385A38DA8B1bA9f9B1518AfC5bc604B`
- Description: ShadowLens smart contract address on Ritual Chain

**RPC_URL**
- Value: `https://rpc.ritualfoundation.org`
- Description: Ritual Chain RPC endpoint for blockchain interaction

**TEE_PRIVATE_KEY**
- Value: Your TEE signer private key (0x-prefixed hex string)
- Description: Private key for signing analysis results on behalf of the oracle
- ⚠️ **KEEP SECRET** - Never commit this to Git

### 2. X/Twitter API Configuration

**X_API_KEY**
- Value: Your X API v2 Bearer token
- Description: X API v2 authentication token for fetching user profiles and tweets
- How to get:
  1. Go to https://developer.twitter.com/en/portal/dashboard
  2. Create a project or use existing one
  3. Generate API key and bearer token
  4. Copy the bearer token (starts with "AAAA...")

## Setting Up Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard
1. Visit https://vercel.com
2. Select your project
3. Click "Settings" in the top navigation
4. Go to "Environment Variables"

### Step 2: Add Variables
For each variable:
1. Click "Add New"
2. Enter the variable name
3. Enter the value
4. Select production environment (or all if you prefer)
5. Click "Save"

### Step 3: Redeploy
After adding environment variables:
1. Go to "Deployments"
2. Click the three dots on your latest deployment
3. Click "Redeploy"

OR simply push a new commit to trigger a redeploy.

## Testing Environment Variables

### Health Check Endpoint
Once deployed, test the health endpoint:

```bash
curl https://your-project.vercel.app/api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 123.45,
  "environment": {
    "hasContractAddress": true,
    "hasRpcUrl": true,
    "hasXApiKey": true,
    "hasTeePrivateKey": true
  }
}
```

### Manual Oracle Execution
Test the oracle endpoint:

```bash
curl https://your-project.vercel.app/api/oracle
```

## Troubleshooting

### "Environment variables not set" error
- Verify all variables are added in Vercel dashboard
- Check the variable names match exactly (case-sensitive)
- Redeploy after adding variables

### "Contract call failed" error
- Verify CONTRACT_ADDRESS is correct
- Verify RPC_URL is accessible and working
- Check TEE_PRIVATE_KEY format (should be 0x-prefixed hex)

### "X API rate limited" error
- Your X API has rate limits
- The oracle will skip requests and retry next execution
- Upgrade X API tier for higher limits

### "Signature verification failed"
- Ensure TEE_PRIVATE_KEY corresponds to expected signer address
- Check that the contract expects the signer address as a valid oracle

## Best Practices

1. **Rotate Keys**: Periodically rotate your TEE_PRIVATE_KEY
2. **Monitor**: Check Vercel logs regularly for errors
3. **Backup**: Keep backup of your TEE_PRIVATE_KEY in secure location
4. **Never Share**: Never commit environment variables to Git
5. **Use .env.local for Development**: For local testing, use .env.local file (add to .gitignore)

## Development Setup

For local development, create a `.env.local` file:

```
CONTRACT_ADDRESS=0x10cF97EA9385A38DA8B1bA9f9B1518AfC5bc604B
RPC_URL=https://rpc.ritualfoundation.org
X_API_KEY=your_x_api_key
TEE_PRIVATE_KEY=0xyour_private_key
```

Add `.env.local` to your `.gitignore` to prevent accidental commits.

Run locally:
```bash
pnpm dev
```

Then test:
```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/oracle
```
