# ShadowLens Oracle - Production-Grade Vercel Deployment

A complete, production-ready Oracle application that analyzes X/Twitter handles for shadowban risk and submits results to the Ritual Chain blockchain.

## Overview

This oracle:
- **Listens** to the ShadowLens smart contract on Ritual Chain
- **Analyzes** X/Twitter handles using sophisticated metrics
- **Scores** accounts on engagement, posting consistency, and content risk
- **Submits** results back to the blockchain with cryptographic signatures
- **Runs** automatically every 5 minutes via Vercel Cron
- **Scales** serverlessly with zero infrastructure management

## Architecture

```
Vercel Cron (Every 5 min)
        ↓
    /api/oracle
        ↓
  ┌─────────────┐
  │   Query     │  → Ritual Chain RPC
  │  Pending    │
  │ Requests    │
  └─────────────┘
        ↓
  ┌─────────────────────────────────┐
  │  For Each Request:              │
  │  • Fetch X profile              │
  │  • Fetch recent tweets          │
  │  • Calculate 3 scoring metrics  │
  │  • Sign result with TEE key     │
  │  • Submit to contract           │
  └─────────────────────────────────┘
        ↓
  Results logged & stored on blockchain
```

## Quick Start

### 1. Deploy
```bash
git push origin main
# → Vercel auto-detects and deploys
```

### 2. Add Environment Variables
In Vercel dashboard:
```
CONTRACT_ADDRESS = 0x10cF97EA9385A38DA8B1bA9f9B1518AfC5bc604B
RPC_URL = https://rpc.ritualfoundation.org
X_API_KEY = <your_bearer_token>
TEE_PRIVATE_KEY = <your_0x_private_key>
```

### 3. Verify
```bash
curl https://your-app.vercel.app/api/health
# All environment variables should be true
```

**Full guide**: See QUICKSTART.md

## Scoring System

The oracle analyzes each account using three metrics:

### 1. Engagement Score (0-100)
- Based on followers and tweet count
- 0 followers = 10 (shadowban risk)
- 10K+ followers = 60-100 (established)
- Detects shadowban pattern: low followers + high tweets = 25

### 2. Posting Consistency (0-100)
- Measures tweet frequency over 30 days
- Ideal: 1-10 tweets/day = 85
- No recent activity = 10
- Penalizes spam (>20/day)

### 3. Content Risk Score (0-100)
- Scans tweets for spam keywords:
  - crypto, scam, free money, click here, buy now, verified account, follow back
- Counts excessive hashtags (>15) and mentions (>10)
- Detects engagement anomalies
- Higher = more risky

### Risk Levels
```
Combines all 3 metrics:
1 = Low Risk    (riskAverage ≤ 50)
2 = Medium Risk (50 < riskAverage ≤ 75)
3 = High Risk   (riskAverage > 75)
```

### Age Modifiers
Accounts <7 days old:
- Engagement score × 0.5
- Content risk +20 points
- Flagged as suspicious

**Full details**: See ARCHITECTURE.md

## API Reference

### `/api/oracle` (Main Endpoint)

Executes the oracle pipeline. Runs automatically every 5 minutes via cron, or manually via GET request.

**Response**:
```json
{
  "status": "success",
  "message": "Processed 5 pending requests",
  "requestsProcessed": 5,
  "results": [
    {
      "requestId": "1",
      "xHandle": "elonmusk",
      "status": "completed",
      "metrics": {
        "engagementScore": 95,
        "postingConsistency": 72,
        "contentRiskScore": 15,
        "riskLevel": 1,
        "details": { /* ... */ }
      },
      "txHash": "0x...",
      "latencyMs": 3500
    }
  ]
}
```

### `/api/health` (Health Check)

Simple endpoint to verify oracle is deployed and configured.

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 1234.56,
  "environment": {
    "hasContractAddress": true,
    "hasRpcUrl": true,
    "hasXApiKey": true,
    "hasTeePrivateKey": true
  }
}
```

## Modules

### `lib/contract.ts`
- Connects to Ritual Chain RPC
- Queries AnalysisRequested events
- Filters for Pending status
- Submits results to contract
- Manages gas and transaction confirmation

### `lib/xapi.ts`
- Fetches X user profiles
- Retrieves up to 100 recent tweets
- Extracts metrics: followers, tweets, engagement
- Handles API errors and rate limiting
- Parses account age and posting frequency

### `lib/analysis.ts`
- Calculates engagement score
- Calculates posting consistency
- Calculates content risk score
- Applies age-based modifiers
- Determines final risk level

### `lib/signing.ts`
- Creates Ethereum signed messages
- Uses TEE private key for signing
- Generates 65-byte signatures
- Recovers signer address for verification

### `app/api/oracle/route.ts`
- Main API endpoint handler
- Orchestrates entire pipeline
- Handles errors gracefully
- Returns detailed execution results
- Logs all operations with emojis

### `app/api/health/route.ts`
- Health check endpoint
- Verifies environment variables
- Returns uptime and status
- Quick deployment verification

## Features

✅ **Automatic Execution**: Runs every 5 minutes via Vercel Cron  
✅ **Manual Triggering**: Can be called manually via HTTP GET  
✅ **Fault Tolerance**: Graceful error handling for API failures  
✅ **Rate Limit Handling**: Skips requests on X API rate limits  
✅ **Signature Verification**: Cryptographic signing of results  
✅ **Gas Optimization**: Efficient contract interactions  
✅ **Detailed Logging**: Real-time logs in Vercel dashboard  
✅ **Health Monitoring**: Health check endpoint  
✅ **CORS Enabled**: Open for all origins  
✅ **TypeScript**: Full type safety  
✅ **Production Ready**: Error handling, timeouts, edge cases  

## Deployment

### Option 1: GitHub + Vercel (Recommended)

1. Push code to GitHub
2. Go to https://vercel.com/dashboard
3. Click "New Project"
4. Import GitHub repository
5. Add environment variables
6. Deploy!

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
# Follow prompts
```

**Full guide**: See DEPLOYMENT.md

## Monitoring

### Real-Time Logs
1. Vercel dashboard → Select project
2. Click "Functions" tab
3. Click "oracle.js"
4. See live execution logs

### Cron Execution
1. Vercel dashboard → Select project
2. Functions tab shows:
   - Invocation count
   - Last execution time
   - Average duration
   - Error rate

### Manual Trigger
```bash
curl https://your-app.vercel.app/api/oracle
```

## Environment Variables

Required (set in Vercel dashboard):

| Variable | Value | Description |
|----------|-------|-------------|
| `CONTRACT_ADDRESS` | `0x10cF97EA9385A38DA8B1bA9f9B1518AfC5bc604B` | ShadowLens contract on Ritual Chain |
| `RPC_URL` | `https://rpc.ritualfoundation.org` | Ritual Chain RPC endpoint |
| `X_API_KEY` | Your bearer token | X API v2 authentication |
| `TEE_PRIVATE_KEY` | Your 0x private key | Ethereum signer for oracle results |

**Setup guide**: See ENV_SETUP.md

## Error Handling

| Error | Behavior |
|-------|----------|
| X API Rate Limit (429) | Skip request, continue to next, retry in 5 min |
| Profile Not Found | Return high-risk scores, submit to contract |
| Network Timeout | Skip request, log error, continue |
| Contract Submission Fails | Mark failed, log error, continue to next |
| Gas Insufficient | Log error, skip submission |
| Function Timeout (>60s) | Vercel terminates, retry in 5 minutes |

## Security

🔒 **Private Keys**: Never commit to Git, stored in Vercel encrypted environment  
🔒 **Signatures**: All results cryptographically signed  
🔒 **Rate Limits**: X API key protected with bearer token  
🔒 **RPC Calls**: Read-only to Ritual Chain (no fund transfers)  
🔒 **Stateless**: No persistent data, crash-safe design  

## Performance

- **Per Request**: 2-5 seconds (X API + analysis + signing + submission)
- **Batch Size**: 10-15 requests per 5-minute execution
- **Gas Usage**: ~200K per submission
- **RPC Latency**: <1 second
- **X API Latency**: <2 seconds

## Documentation

- **QUICKSTART.md** - 5-minute setup guide
- **ENV_SETUP.md** - Environment variables detailed guide
- **DEPLOYMENT.md** - Step-by-step deployment instructions
- **ARCHITECTURE.md** - Technical reference, scoring logic, API docs

## Technology Stack

- **Framework**: Next.js 16 (React 19)
- **Runtime**: Node.js 20+
- **Blockchain**: ethers.js v6
- **API**: axios for HTTP requests
- **Deployment**: Vercel Serverless Functions
- **Scheduling**: Vercel Cron
- **Language**: TypeScript

## Contract ABI

The oracle expects contract with:

```solidity
event AnalysisRequested(
  uint256 indexed requestId,
  string xHandle,
  address indexed requester,
  uint256 timestamp
);

function fulfill(
  uint256 requestId,
  uint8 riskLevel,
  uint8 engagementScore,
  uint8 postingConsistency,
  uint8 contentRiskScore,
  bytes signature
) external;

function getRequestStatus(uint256 requestId)
  external view returns (string, address, uint8, uint256);
```

## Troubleshooting

**Health check shows false for environment variables?**
- Add variables in Vercel dashboard
- Redeploy after adding
- Check variable names match exactly (case-sensitive)

**Contract call failing?**
- Verify CONTRACT_ADDRESS
- Check RPC_URL is accessible
- Ensure TEE_PRIVATE_KEY is valid Ethereum key

**X API errors?**
- Get bearer token from https://developer.twitter.com
- Upgrade X API tier if rate limited
- Wait 5 minutes for next cron execution

**Cron not running?**
- Check vercel.json exists in root
- Verify Vercel project is in production
- Check Vercel logs for errors

**See DEPLOYMENT.md for more troubleshooting**

## License

Production-grade oracle for Ritual Chain. Built with Next.js and Vercel.

## Support

- 📚 Read the documentation (QUICKSTART.md, DEPLOYMENT.md, ARCHITECTURE.md)
- 🔍 Check Vercel logs in Functions tab
- 💬 Review error messages in responses
- 🆘 Open issue on GitHub if needed

---

**Ready to deploy?** Start with QUICKSTART.md for 5-minute setup!
