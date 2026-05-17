import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <span className="text-white text-xl font-bold">🔮</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">ShadowLens Oracle</h1>
          </div>
          <p className="text-lg text-slate-300 mb-4">
            Production-grade Oracle for Ritual Chain analyzing X/Twitter handles for shadowban risk
          </p>
          <p className="text-sm text-slate-400">
            Deployed on Vercel • Running every 5 minutes • Blockchain-verified results
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="text-2xl font-bold text-cyan-400 mb-2">✅</div>
            <h3 className="text-white font-semibold mb-1">Fully Deployed</h3>
            <p className="text-slate-400 text-sm">
              Running on Vercel with automatic cron triggers
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="text-2xl font-bold text-green-400 mb-2">📊</div>
            <h3 className="text-white font-semibold mb-1">Smart Analysis</h3>
            <p className="text-slate-400 text-sm">
              3 metrics: engagement, consistency, content risk
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <div className="text-2xl font-bold text-purple-400 mb-2">⛓️</div>
            <h3 className="text-white font-semibold mb-1">Blockchain-Verified</h3>
            <p className="text-slate-400 text-sm">
              Cryptographically signed results on Ritual Chain
            </p>
          </div>
        </div>

        {/* API Endpoints */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">API Endpoints</h2>
          
          <div className="space-y-6">
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <h3 className="text-cyan-400 font-mono text-sm font-bold mb-2">GET /api/health</h3>
              <p className="text-slate-300 mb-4">Health check - verify oracle is deployed and configured</p>
              <div className="bg-slate-950 rounded p-3 text-slate-300 text-sm font-mono overflow-x-auto">
                <span className="text-green-400">status:</span> healthy | error
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
              <h3 className="text-cyan-400 font-mono text-sm font-bold mb-2">GET /api/oracle</h3>
              <p className="text-slate-300 mb-4">Main oracle endpoint - processes pending requests</p>
              <p className="text-slate-400 text-xs mb-3">
                ⏱️ Runs automatically every 5 minutes via Vercel Cron<br/>
                🔄 Or trigger manually by calling this endpoint
              </p>
              <div className="bg-slate-950 rounded p-3 text-slate-300 text-sm font-mono overflow-x-auto">
                <span className="text-green-400">status:</span> success | error<br/>
                <span className="text-green-400">requestsProcessed:</span> number<br/>
                <span className="text-green-400">results:</span> [ /* analysis results */ ]
              </div>
            </div>
          </div>
        </div>

        {/* Scoring System */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Scoring Metrics</h2>
          
          <div className="space-y-4">
            <div className="bg-slate-900/50 rounded-lg p-4 border-l-4 border-cyan-500">
              <h3 className="text-cyan-400 font-bold mb-2">Engagement Score (0-100)</h3>
              <p className="text-slate-300 text-sm">
                Measures followers and tweet activity. 0 followers = 10/100, 10K+ followers = 60-100/100. Detects shadowban patterns.
              </p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4 border-l-4 border-green-500">
              <h3 className="text-green-400 font-bold mb-2">Posting Consistency (0-100)</h3>
              <p className="text-slate-300 text-sm">
                Tracks tweet frequency over 30 days. Ideal: 1-10 tweets/day = 85/100. No recent activity = 10/100.
              </p>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-4 border-l-4 border-purple-500">
              <h3 className="text-purple-400 font-bold mb-2">Content Risk Score (0-100)</h3>
              <p className="text-slate-300 text-sm">
                Scans for spam keywords, excessive hashtags/mentions, and engagement anomalies. Higher = more risky.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-700">
            <h3 className="text-white font-bold mb-3">Risk Levels</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-green-900/20 border border-green-700 rounded p-3">
                <span className="text-green-400 font-bold">Level 1: Low Risk</span>
                <p className="text-slate-400 text-sm mt-1">Average &lt; 50</p>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-700 rounded p-3">
                <span className="text-yellow-400 font-bold">Level 2: Medium Risk</span>
                <p className="text-slate-400 text-sm mt-1">Average 50-75</p>
              </div>
              <div className="bg-red-900/20 border border-red-700 rounded p-3">
                <span className="text-red-400 font-bold">Level 3: High Risk</span>
                <p className="text-slate-400 text-sm mt-1">Average &gt; 75</p>
              </div>
            </div>
          </div>
        </div>

        {/* Documentation Links */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Documentation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="https://github.com" 
              className="bg-slate-900 border border-slate-600 rounded-lg p-4 hover:border-cyan-500 hover:bg-slate-800/80 transition-all"
            >
              <h3 className="text-cyan-400 font-bold mb-2">📖 README</h3>
              <p className="text-slate-400 text-sm">Complete overview of the oracle system</p>
            </a>
            <a 
              href="https://github.com" 
              className="bg-slate-900 border border-slate-600 rounded-lg p-4 hover:border-cyan-500 hover:bg-slate-800/80 transition-all"
            >
              <h3 className="text-cyan-400 font-bold mb-2">🚀 QUICKSTART</h3>
              <p className="text-slate-400 text-sm">5-minute deployment guide</p>
            </a>
            <a 
              href="https://github.com" 
              className="bg-slate-900 border border-slate-600 rounded-lg p-4 hover:border-cyan-500 hover:bg-slate-800/80 transition-all"
            >
              <h3 className="text-cyan-400 font-bold mb-2">⚙️ DEPLOYMENT</h3>
              <p className="text-slate-400 text-sm">Step-by-step Vercel deployment</p>
            </a>
            <a 
              href="https://github.com" 
              className="bg-slate-900 border border-slate-600 rounded-lg p-4 hover:border-cyan-500 hover:bg-slate-800/80 transition-all"
            >
              <h3 className="text-cyan-400 font-bold mb-2">📐 ARCHITECTURE</h3>
              <p className="text-slate-400 text-sm">Technical reference & scoring system</p>
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Features</h2>
          
          <ul className="space-y-3">
            {[
              'Automatic execution every 5 minutes via Vercel Cron',
              'Manual triggering via HTTP GET request',
              'X API v2 integration for user profiles and tweets',
              'Three-metric scoring system with modifiers',
              'Ethereum signed results with TEE private key',
              'Ritual Chain blockchain integration',
              'Graceful error handling and rate limiting',
              'Real-time logging in Vercel dashboard',
              'Health check endpoint for monitoring',
              'CORS enabled for all origins',
              'TypeScript for full type safety',
              'Production-ready with 60-second timeout',
            ].map((feature, idx) => (
              <li key={idx} className="flex gap-3 text-slate-300">
                <span className="text-cyan-400 flex-shrink-0">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Environment Variables */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Environment Variables Required</h2>
          
          <div className="space-y-4">
            {[
              {
                name: 'CONTRACT_ADDRESS',
                value: '0x10cF97EA9385A38DA8B1bA9f9B1518AfC5bc604B',
                desc: 'ShadowLens contract on Ritual Chain'
              },
              {
                name: 'RPC_URL',
                value: 'https://rpc.ritualfoundation.org',
                desc: 'Ritual Chain RPC endpoint'
              },
              {
                name: 'X_API_KEY',
                value: 'Your X API v2 bearer token',
                desc: 'X/Twitter API authentication'
              },
              {
                name: 'TEE_PRIVATE_KEY',
                value: '0x...',
                desc: 'Ethereum private key for signing'
              },
            ].map((env, idx) => (
              <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400 font-mono font-bold">{env.name}</span>
                  <span className="text-slate-500 text-xs">required</span>
                </div>
                <div className="text-slate-400 text-sm mb-2">
                  <span className="text-slate-500">Value: </span>
                  <span className="font-mono">{env.value}</span>
                </div>
                <p className="text-slate-500 text-xs">{env.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-slate-400 text-sm mt-4">
            ⚠️ Set these in Vercel dashboard: Project Settings → Environment Variables → Add each variable → Redeploy
          </p>
        </div>

        {/* Getting Started */}
        <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Getting Started</h2>
          
          <ol className="space-y-4 text-slate-300">
            <li className="flex gap-4">
              <span className="text-cyan-400 font-bold flex-shrink-0">1</span>
              <span>
                Push code to GitHub
              </span>
            </li>
            <li className="flex gap-4">
              <span className="text-cyan-400 font-bold flex-shrink-0">2</span>
              <span>
                Deploy to Vercel (auto-imports from GitHub)
              </span>
            </li>
            <li className="flex gap-4">
              <span className="text-cyan-400 font-bold flex-shrink-0">3</span>
              <span>
                Add 4 environment variables in Vercel dashboard
              </span>
            </li>
            <li className="flex gap-4">
              <span className="text-cyan-400 font-bold flex-shrink-0">4</span>
              <span>
                Redeploy to apply variables
              </span>
            </li>
            <li className="flex gap-4">
              <span className="text-cyan-400 font-bold flex-shrink-0">5</span>
              <span>
                Test with: <span className="font-mono bg-slate-900 px-2 py-1 rounded text-cyan-400">curl /api/health</span>
              </span>
            </li>
            <li className="flex gap-4">
              <span className="text-cyan-400 font-bold flex-shrink-0">6</span>
              <span>
                Done! Oracle runs automatically every 5 minutes
              </span>
            </li>
          </ol>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-700">
          <p className="text-slate-400 text-sm">
            ShadowLens Oracle • Production-grade deployment on Vercel<br/>
            <span className="text-slate-500">Built with Next.js 16, ethers.js, and Vercel Cron</span>
          </p>
        </div>
      </div>
    </main>
  );
}
