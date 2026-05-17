# Oracle Application - Environment Variables Guide

This document outlines all environment variables required for the Oracle application to function properly.

## Required Environment Variables

Add these to your Vercel project via the Settings > Environment Variables section:

### 1. Blockchain Configuration

**CONTRACT_ADDRESS**
- Value: `0xCe8f5297dFE00E5e201f46f4A662E4ffCB5Ac3D6`
- Description: ShadowLens smart contract address on Ritual Chain (production)

**RITUAL_RPC**
- Value: `https://rpc.ritualfoundation.org`
- Description: Ritual Chain RPC endpoint for blockchain interaction

**TEE_PRIVATE_KEY**
- Value: `0x7b796145ba7f02ad9422f181d1e306ca457f9e14cade801762e587170cfd4bda`
- Description: TEE signer private key for signing analysis results
- ⚠️ **KEEP SECRET** - Never commit this to Git

### 2. X/Twitter API Configuration

**X_API_KEY**
- Value: `AAAAAAAAAAAAAAAAAAAAABAH9gEAAAAAKWK4OrCItaDY%2FrXFcoAkQX83670%3D3d8KB5XKHi7pu3rt4YiSxMDfWLMgfnI4DxlHdfMW2AZH6mz3oh`
- Description: X API v2 Bearer token for fetching user profiles and tweets

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
CONTRACT_ADDRESS=0xCe8f5297dFE00E5e201f46f4A662E4ffCB5Ac3D6
RITUAL_RPC=https://rpc.ritualfoundation.org
X_API_KEY=AAAAAAAAAAAAAAAAAAAAABAH9gEAAAAAKWK4OrCItaDY%2FrXFcoAkQX83670%3D3d8KB5XKHi7pu3rt4YiSxMDfWLMgfnI4DxlHdfMW2AZH6mz3oh
TEE_PRIVATE_KEY=0x7b796145ba7f02ad9422f181d1e306ca457f9e14cade801762e587170cfd4bda
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
