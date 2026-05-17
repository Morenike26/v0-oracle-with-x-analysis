# Oracle Application - Architecture & Reference

Complete technical reference for the Oracle application architecture, scoring system, and API.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    VERCEL SERVERLESS                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Vercel Cron (Every 5 minutes)                       │    │
│  │  ↓                                                   │    │
│  │  GET /api/oracle                                    │    │
│  └──────────────────────────────────────────────────────┘    │
│                         ↓                                     │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  lib/contract.ts                                     │    │
│  │  • Connect to Ritual Chain RPC                       │    │
│  │  • Query AnalysisRequested events                    │    │
│  │  • Filter for Pending status                         │    │
│  └──────────────────────────────────────────────────────┘    │
│                         ↓                                     │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Loop: For each pending request                      │    │
│  │                                                      │    │
│  │  1. lib/xapi.ts                                     │    │
│  │     • Fetch X profile                              │    │
│  │     • Fetch 100 recent tweets                       │    │
│  │                                                      │    │
│  │  2. lib/analysis.ts                                 │    │
│  │     • Calculate 3 scoring metrics                   │    │
│  │     • Apply age modifiers                           │    │
│  │     • Determine risk level                          │    │
│  │                                                      │    │
│  │  3. lib/signing.ts                                  │    │
│  │     • Sign result with TEE private key              │    │
│  │                                                      │    │
│  │  4. lib/contract.ts                                 │    │
│  │     • Submit result to smart contract               │    │
│  │     • Wait for confirmation                         │    │
│  └──────────────────────────────────────────────────────┘    │
│                         ↓                                     │
│  ┌──────────────────────────────────────────────────────┐    │
│  │  Return JSON with results                            │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
         ↓                              ↓
    Ritual Chain              X/Twitter API v2
    RPC Endpoint            (Profile + Tweets)
```

## Scoring System

### 1. Engagement Score (0-100)

**Purpose**: Measures account reach and activity level

**Logic**:
```
if followers == 0:
  score = 10 (if tweets == 0)
  score = 15 (if tweets > 0)

if tweets == 0:
  score = 15

if followers < 100 AND tweets > 1000:
  score = 25  // Shadowban indicator

if followers >= 10,000:
  score = min(100, 60 + followers / 1000)

default:
  score = min(100, 50 + followers / 1000)
```

**Interpretation**:
- 0-25: Very low engagement / shadowban risk
- 25-50: Low engagement
- 50-75: Medium engagement
- 75-100: High engagement (established account)

### 2. Posting Consistency (0-100)

**Purpose**: Measures regular posting activity

**Logic**:
```
if no tweets:
  score = 0

if no recent tweets (30 days):
  score = 10

if 1-10 tweets/day:
  score = 85  // Ideal range

if tweets/day > 20:
  score = max(0, 85 - (tweets_per_day - 10) * 2)  // Penalize spam

if 0 < tweets/day < 1:
  score = 60  // Low but consistent
```

**Interpretation**:
- 0-10: No or inactive account
- 10-60: Low/inconsistent activity
- 60-85: Moderate consistency
- 85-100: Ideal posting frequency

### 3. Content Risk Score (0-100)

**Purpose**: Detects spam indicators in tweet content

**Spam Keywords**:
- 'crypto'
- 'scam'
- 'free money'
- 'click here'
- 'buy now'
- 'verified account'
- 'follow back'

**Violations Counted**:
- Each spam keyword occurrence: +1
- Each tweet with >15 hashtags: +1
- Each tweet with >10 mentions: +1
- Engagement anomalies (5x expected): +2

**Formula**:
```
violations = spam_keywords + excessive_hashtags + excessive_mentions + anomalies
score = 50 + (violations * 5)
score = min(100, score)
```

**Interpretation**:
- 0-30: Low risk
- 30-70: Medium risk
- 70-100: High risk

### Age Modifiers

Accounts created <7 days ago are flagged:
```
if account_age < 7 days:
  engagement_score *= 0.5
  content_risk_score += 20
```

### Risk Level Calculation

Average all three metrics into risk level:

```
risk_average = (
  (100 - engagement_score) +
  (100 - posting_consistency) +
  content_risk_score
) / 3

if risk_average > 75:
  risk_level = 3  // HIGH RISK

if risk_average > 50:
  risk_level = 2  // MEDIUM RISK

if risk_average <= 50:
  risk_level = 1  // LOW RISK
```

## API Reference

### GET /api/oracle

Main oracle endpoint. Runs automatically every 5 minutes, or can be called manually.

**Request**:
```
GET https://your-app.vercel.app/api/oracle
```

**Response (Success)**:
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
        "details": {
          "accountAgeDays": 4000,
          "followers": 185000000,
          "tweets": 45000,
          "tweetsPerDay": 12.5,
          "hasRecentTweets": true,
          "spamViolations": 0,
          "excessiveHashtags": 0,
          "excessiveMentions": 0,
          "engagementAnomalies": false
        }
      },
      "txHash": "0x...",
      "latencyMs": 3500
    }
  ],
  "errors": []
}
```

**Response (Partial Error)**:
```json
{
  "status": "success",
  "message": "Processed 3 pending requests",
  "requestsProcessed": 3,
  "results": [
    {
      "requestId": "1",
      "xHandle": "notauser123456",
      "status": "completed",
      "metrics": {
        "engagementScore": 0,
        "postingConsistency": 0,
        "contentRiskScore": 100,
        "riskLevel": 3,
        "details": {
          "accountAgeDays": 0,
          "followers": 0,
          "tweets": 0,
          "tweetsPerDay": 0,
          "hasRecentTweets": false,
          "spamViolations": 0,
          "excessiveHashtags": 0,
          "excessiveMentions": 0,
          "engagementAnomalies": false
        }
      },
      "latencyMs": 2100
    },
    {
      "requestId": "2",
      "xHandle": "testuser",
      "status": "failed",
      "error": "Network timeout",
      "latencyMs": 5000
    }
  ],
  "errors": []
}
```

**Response (Fatal Error)**:
```json
{
  "status": "error",
  "message": "Failed to query pending requests",
  "errors": [
    {
      "step": "query_requests",
      "error": "RPC connection failed"
    }
  ],
  "results": []
}
```

### GET /api/health

Health check endpoint to verify oracle is deployed and configured.

**Request**:
```
GET https://your-app.vercel.app/api/health
```

**Response (Healthy)**:
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

**Response (Missing Variables)**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 1234.56,
  "environment": {
    "hasContractAddress": true,
    "hasRpcUrl": true,
    "hasXApiKey": false,
    "hasTeePrivateKey": true
  }
}
```

## Error Handling

### X API Rate Limit (429)

When X API returns 429 (rate limited):
- Current request is skipped
- Remaining requests are not processed
- Function exits gracefully
- Returns partial results from already-processed requests
- Next cron execution (5 minutes) will retry

### Missing X Profile

When user handle not found:
- Returns metrics: `{engagement: 0, consistency: 0, contentRisk: 100, riskLevel: 3}`
- Still submits result to contract (as unknown/high risk)
- Continues to next request

### Network/Contract Error

When contract submission fails:
- Request marked as failed
- Error logged with details
- Continues to next request
- Admin must investigate and retry if needed

### Timeout (>60 seconds)

If function exceeds 60-second Vercel limit:
- Vercel terminates function
- Partial results lost
- Next cron execution retries failed requests
- Monitor average execution time in Vercel dashboard

## Logging

All events are logged with emojis for quick parsing:

```
🔍 Oracle invoked
📊 Found X pending requests
⏭️  Skipping already processed request X
📡 Analyzing @handle
⚠️  Profile not found
✅ Analysis complete
✅ Result submitted: 0x...
✅ Transaction confirmed
❌ Error processing @handle: message
❌ Handler error: message
🔐 Signing result
🏁 Oracle execution complete
```

View logs in Vercel dashboard:
1. Select project
2. Click "Functions" tab
3. Click "oracle.js"
4. See real-time logs

## Performance Targets

- **Per request latency**: 2-5 seconds (X API fetch + analysis + signing + submission)
- **Batch processing**: 10-15 requests per 5-minute execution
- **Gas usage**: ~200,000 gas per submission (~20 submissions per execution with typical gas prices)
- **RPC latency**: <1 second per query
- **X API latency**: <2 seconds per user (profile + tweets)

## Security Considerations

1. **TEE Private Key**
   - Never commit to Git
   - Keep secure backup
   - Rotate periodically
   - Only used for signing, not fund transfers

2. **X API Key**
   - Rate limited per tier
   - Upgrade if needed for higher volume
   - Keep secret in environment variables

3. **Contract Signature Verification**
   - Contract must verify signature matches TEE signer address
   - Prevents unauthorized result submission
   - Check contract ABI for verification logic

4. **RPC Endpoint**
   - Ritual Chain official endpoint used
   - No authentication required for read operations
   - Write operations don't expose private key (tx encoding handled by ethers.js)

## Gas Optimization

Each contract submission uses ~200,000 gas:

```typescript
// Current gas limit in api/oracle/route.ts
{ gasLimit: 200000 }
```

Monitor actual usage:
- Adjust if contract uses less
- Increase if transactions fail with "out of gas"
- Check Vercel logs for gas estimation errors

## Database/State Management

Oracle is **stateless**:
- No persistent storage
- Queries contract for request status
- All state stored on blockchain
- Crash-safe: can be restarted anytime

To resume failed requests:
- They remain in Pending status on contract
- Next cron execution will process them
- No recovery logic needed
