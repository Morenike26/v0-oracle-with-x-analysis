# Oracle Application - Complete File Index

## Core Application Files

### API Routes (app/api/)

#### `/api/oracle/route.ts` (217 lines)
**Main oracle endpoint**
- Runs automatically every 5 minutes via Vercel Cron
- Can be triggered manually via GET request
- Processes pending requests from contract
- Returns JSON with analysis results

Features:
- Query pending requests from Ritual Chain
- Fetch X user profiles and tweets
- Calculate scoring metrics
- Sign results with TEE key
- Submit to contract
- Handle errors gracefully
- 60-second timeout
- CORS support

#### `/api/health/route.ts` (46 lines)
**Health check endpoint**
- Verifies oracle is deployed
- Checks all environment variables
- Returns uptime and status
- Simple diagnostic tool

Features:
- Environment variable verification
- Uptime reporting
- Status code 200 if healthy

### Library Modules (lib/)

#### `lib/contract.ts` (190 lines)
**Blockchain interaction with Ritual Chain**

Functions:
- `getProvider()` - Create JsonRpcProvider for Ritual Chain
- `getContract()` - Get contract instance
- `getPendingRequests(blockRange)` - Query AnalysisRequested events
- `submitResult(result, signature)` - Submit result to contract
- `getRecentRequestCount()` - Count recent requests

Features:
- RPC connection management
- Event querying (last 50 blocks)
- Status filtering (Pending)
- Transaction submission with gas limit
- Confirmation waiting

#### `lib/xapi.ts` (234 lines)
**X/Twitter API v2 integration**

Functions:
- `getXUserProfile(handle)` - Fetch user profile
- `getXUserTweets(userId, maxResults)` - Get recent tweets
- `getAccountAgeDays(createdAt)` - Calculate account age
- `calculateTweetsPerDay(tweets)` - Get posting frequency
- `getAverageEngagement(tweets)` - Calculate avg engagement
- `scanForSpamKeywords(tweets)` - Count spam occurrences
- `countExcessiveHashtags(tweets)` - Count #hashtags
- `countExcessiveMentions(tweets)` - Count @mentions
- `hasEngagementAnomalies(tweets, followers)` - Detect anomalies

Features:
- User profile fetching
- Tweet retrieval (up to 100)
- Metrics extraction
- Spam detection
- Rate limit handling (429)
- Error handling

#### `lib/analysis.ts` (262 lines)
**Intelligence scoring engine**

Functions:
- `analyzeXHandle(profile, tweets)` - Full analysis pipeline
- `createErrorMetrics()` - Error case metrics
- `calculateEngagementScore()` - Score 0-100
- `calculatePostingConsistency()` - Score 0-100
- `calculateContentRiskScore()` - Score 0-100
- `calculateRiskLevel()` - Determine 1-3 risk level
- `applyAgeModifiers()` - Apply account age modifiers

Scoring System:
- Engagement: Measures followers/tweets (shadowban detection)
- Consistency: Tracks posting frequency over 30 days
- Content Risk: Scans for spam, hashtags, mentions
- Age Modifiers: Flags accounts <7 days old
- Risk Level: Combines all 3 metrics

#### `lib/signing.ts` (105 lines)
**Ethereum cryptographic signing**

Functions:
- `signAnalysisResult(...)` - Sign result with TEE key
- `verifySignature(...)` - Verify signature (testing)
- `getSignerAddress()` - Get signer address from key

Features:
- Ethereum message hashing
- TEE private key usage
- 65-byte signature generation
- Address recovery
- Verification support

### Frontend (app/)

#### `app/page.tsx` (285 lines)
**Oracle dashboard homepage**

Features:
- Overview of oracle system
- API endpoint documentation
- Scoring metrics explanation
- Risk levels display
- Documentation links
- Environment variables guide
- Getting started guide
- Feature list
- Beautiful design with Tailwind

#### `app/layout.tsx` (auto-generated)
**Root layout for Next.js**

## Configuration Files

### `vercel.json` (9 lines)
**Vercel deployment configuration**

Configures:
- Cron schedule: `*/5 * * * *` (every 5 minutes)
- Endpoint: `/api/oracle`
- Automatic execution trigger

### `package.json`
**Node.js dependencies**

Key packages:
- `ethers@^6.16.0` - Ethereum interactions
- `axios@^1.16.1` - HTTP client for X API
- `next@^16.2.0` - React framework
- `react@^19.2.0` - UI library
- `typescript@^5` - Type safety

### `tsconfig.json`
**TypeScript configuration**

Configured for:
- Next.js 16
- Module resolution
- Type checking
- Path aliases

## Documentation Files

### `README.md` (372 lines)
**Main documentation - START HERE**

Sections:
- Overview and architecture
- Quick start (5 min)
- Scoring system explanation
- API reference
- Module descriptions
- Features list
- Deployment guide
- Monitoring guide
- Technology stack
- Contract ABI
- Troubleshooting
- License

### `QUICKSTART.md` (155 lines)
**5-minute deployment guide**

Covers:
- Clone/create project
- Install dependencies
- Deploy to Vercel
- Add environment variables
- Verify deployment
- Test endpoints
- File structure
- Common issues
- Local testing

### `ENV_SETUP.md` (142 lines)
**Environment variables detailed setup**

Includes:
- Variable descriptions
- How to obtain each value
- X API v2 setup
- TEE private key generation
- Vercel dashboard steps
- Testing environment setup
- Development `.env.local`
- Troubleshooting

### `DEPLOYMENT.md` (320 lines)
**Step-by-step deployment instructions**

Sections:
- Prerequisites
- GitHub repository setup
- Vercel CLI deployment
- Vercel dashboard deployment
- Environment variables setup
- Deployment verification
- Monitoring setup
- Troubleshooting guide
- Updating code
- Rollback procedures

### `ARCHITECTURE.md` (434 lines)
**Technical reference and scoring system**

Sections:
- Architecture overview with diagram
- Scoring system detailed
  - Engagement score logic
  - Posting consistency logic
  - Content risk scoring
  - Age modifiers
  - Risk level calculation
- API reference
  - `/api/oracle` endpoint
  - `/api/health` endpoint
- Error handling scenarios
- Logging and monitoring
- Performance targets
- Security considerations
- Gas optimization
- Database/state management

### `DEPLOYMENT_CHECKLIST.md` (380 lines)
**Complete deployment checklist**

Sections:
- Pre-deployment setup
- GitHub setup steps
- Vercel deployment steps
- Environment variables setup
- Post-deployment verification
- Monitoring setup
- Testing procedures
- Production readiness
- Operations guide
- Troubleshooting quick reference
- Rollback plan
- Final checklist
- Support resources

### `BUILD_SUMMARY.md` (486 lines)
**Build summary and overview**

Includes:
- What was built
- Key stats
- Architecture overview
- Module descriptions
- API endpoints
- Configuration files
- Environment variables
- Documentation overview
- Features implemented
- Performance metrics
- Security features
- Deployment steps
- What's included
- Next steps
- Verification checklist

## Total Project Statistics

### Code Files
- `app/api/oracle/route.ts` - 217 lines
- `app/api/health/route.ts` - 46 lines
- `app/page.tsx` - 285 lines
- `lib/contract.ts` - 190 lines
- `lib/xapi.ts` - 234 lines
- `lib/analysis.ts` - 262 lines
- `lib/signing.ts` - 105 lines
- **Total Code: 1,339 lines**

### Documentation Files
- `README.md` - 372 lines
- `QUICKSTART.md` - 155 lines
- `ENV_SETUP.md` - 142 lines
- `DEPLOYMENT.md` - 320 lines
- `ARCHITECTURE.md` - 434 lines
- `DEPLOYMENT_CHECKLIST.md` - 380 lines
- `BUILD_SUMMARY.md` - 486 lines
- **Total Documentation: 2,289 lines**

### Configuration Files
- `vercel.json` - 9 lines
- `package.json` - updated
- `tsconfig.json` - configured
- **Total Config: < 50 lines**

### Total Project Size
- **TypeScript Code: 1,339 lines** (fully typed)
- **Documentation: 2,289 lines** (comprehensive)
- **Configuration: < 50 lines**
- **Grand Total: ~3,678 lines**

## File Organization

```
project-root/
│
├── 📂 app/                          # Next.js app directory
│   ├── 📂 api/
│   │   ├── 📂 oracle/
│   │   │   └── route.ts            # Main oracle endpoint
│   │   └── 📂 health/
│   │       └── route.ts            # Health check
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Dashboard homepage
│
├── 📂 lib/                         # Library modules
│   ├── contract.ts                # Blockchain interaction
│   ├── xapi.ts                    # X API integration
│   ├── analysis.ts                # Scoring engine
│   ├── signing.ts                 # Ethereum signing
│   └── utils.ts                   # Utilities
│
├── 📂 components/                 # shadcn/ui components
│   └── 📂 ui/                    # Pre-installed UI components
│
├── 📂 hooks/                      # React hooks
│
├── 📄 vercel.json                 # Vercel configuration
├── 📄 package.json                # Dependencies
├── 📄 tsconfig.json               # TypeScript config
├── 📄 next.config.mjs             # Next.js config
├── 📄 tailwind.config.ts          # Tailwind configuration
│
├── 📘 README.md                    # Main documentation
├── 📘 QUICKSTART.md               # 5-min deployment
├── 📘 ENV_SETUP.md                # Environment variables
├── 📘 DEPLOYMENT.md               # Detailed deployment
├── 📘 ARCHITECTURE.md             # Technical reference
├── 📘 DEPLOYMENT_CHECKLIST.md     # Deployment checklist
└── 📘 BUILD_SUMMARY.md            # Build summary (this index)
```

## Quick Reference

### Starting Points
1. **First time?** → Read `README.md`
2. **Quick deployment?** → Follow `QUICKSTART.md`
3. **Detailed deployment?** → Use `DEPLOYMENT.md`
4. **Environment variables?** → Check `ENV_SETUP.md`
5. **Technical details?** → Review `ARCHITECTURE.md`
6. **Deployment verification?** → Follow `DEPLOYMENT_CHECKLIST.md`

### Key Files by Purpose

**Understanding the System**
- `README.md` - Overview
- `ARCHITECTURE.md` - Technical details
- `BUILD_SUMMARY.md` - What was built

**Deployment**
- `QUICKSTART.md` - Fast deployment
- `DEPLOYMENT.md` - Step-by-step
- `DEPLOYMENT_CHECKLIST.md` - Verification

**Configuration**
- `ENV_SETUP.md` - Environment variables
- `vercel.json` - Cron scheduling
- `package.json` - Dependencies

**Implementation**
- `lib/contract.ts` - Blockchain logic
- `lib/xapi.ts` - X API integration
- `lib/analysis.ts` - Scoring system
- `lib/signing.ts` - Cryptography
- `app/api/oracle/route.ts` - Main endpoint

**Presentation**
- `app/page.tsx` - Dashboard UI

## What You Can Do Now

✅ **View the code** in any editor  
✅ **Run locally**: `pnpm dev`  
✅ **Build for production**: `pnpm build`  
✅ **Deploy to Vercel** in minutes  
✅ **Test health endpoint**  
✅ **Monitor execution** in Vercel logs  
✅ **Process requests** automatically  
✅ **Submit results** to blockchain  

## Support

- 📚 Read documentation files
- 🔍 Check Vercel logs
- 💻 Review code with TypeScript types
- ⚙️ Follow deployment checklist
- 🆘 Troubleshoot using DEPLOYMENT.md

---

**Ready to deploy?** Start with `QUICKSTART.md`!

Built with ❤️ for production use on Vercel.
