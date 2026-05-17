import { NextRequest, NextResponse } from 'next/server';
import { getPendingRequests, submitResult } from '@/lib/contract';
import { getXUserProfile, getXUserTweets } from '@/lib/xapi';
import { analyzeXHandle, createErrorMetrics } from '@/lib/analysis';
import { signAnalysisResult } from '@/lib/signing';

export const maxDuration = 60; // 60 second timeout for Vercel

/**
 * Main oracle endpoint
 * - Runs every 5 minutes via Vercel cron
 * - Can be called manually via GET request
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Oracle invoked');
    
    const results = [];
    const errors = [];

    // Step 1: Query for pending requests
    let pendingRequests;
    try {
      pendingRequests = await getPendingRequests(50);
      console.log(`📊 Found ${pendingRequests.length} pending requests`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Handler error querying requests:', errorMsg);
      errors.push({
        step: 'query_requests',
        error: errorMsg,
      });
      return NextResponse.json(
        {
          status: 'error',
          message: 'Failed to query pending requests',
          errors,
          results: [],
        },
        { status: 500 }
      );
    }

    // Step 2: Process each pending request
    for (const req of pendingRequests) {
      const startTime = Date.now();
      try {
        console.log(`📡 Analyzing @${req.handle} (request ${req.requestId})`);

        // Fetch X profile
        let profile;
        try {
          profile = await getXUserProfile(req.handle);
        } catch (error) {
          if ((error as Error).message === 'X_API_RATE_LIMITED') {
            console.log('⏸️  X API rate limited, skipping remaining requests');
            break;
          }
          throw error;
        }

        // If profile not found, create error metrics
        if (!profile) {
          console.log(`⚠️  Profile not found for @${req.handle}, creating error metrics`);
          const metrics = createErrorMetrics();
          const signature = signAnalysisResult(
            req.requestId,
            req.handle,
            metrics.riskLevel,
            metrics.engagementScore,
            metrics.postingConsistency,
            metrics.contentRiskScore
          );

          try {
            await submitResult(
              {
                requestId: req.requestId,
                handle: req.handle,
                riskLevel: metrics.riskLevel,
                engagementScore: metrics.engagementScore,
                postingConsistency: metrics.postingConsistency,
                contentRiskScore: metrics.contentRiskScore,
              },
              signature
            );

            results.push({
              requestId: req.requestId,
              handle: req.handle,
              status: 'completed',
              metrics,
              latencyMs: Date.now() - startTime,
            });
          } catch (submitError) {
            const errorMsg = submitError instanceof Error ? submitError.message : 'Unknown error';
            console.error(`❌ Error processing @${req.handle}:`, errorMsg);
            results.push({
              requestId: req.requestId,
              handle: req.handle,
              status: 'failed',
              error: errorMsg,
              latencyMs: Date.now() - startTime,
            });
          }
          continue;
        }

        // Fetch recent tweets
        let tweets;
        try {
          tweets = await getXUserTweets(profile.id, 100);
        } catch (error) {
          if ((error as Error).message === 'X_API_RATE_LIMITED') {
            console.log('⏸️  X API rate limited, skipping remaining requests');
            break;
          }
          tweets = [];
        }

        // Analyze X handle
        const metrics = await analyzeXHandle(profile, tweets);

        // Sign result
        const signature = signAnalysisResult(
          req.requestId,
          req.handle,
          metrics.riskLevel,
          metrics.engagementScore,
          metrics.postingConsistency,
          metrics.contentRiskScore
        );

        // Submit to contract
        try {
          await submitResult(
            {
              requestId: req.requestId,
              handle: req.handle,
              riskLevel: metrics.riskLevel,
              engagementScore: metrics.engagementScore,
              postingConsistency: metrics.postingConsistency,
              contentRiskScore: metrics.contentRiskScore,
            },
            signature
          );

          console.log(`✅ Result submitted: request ${req.requestId}`);
          results.push({
            requestId: req.requestId,
            handle: req.handle,
            status: 'completed',
            metrics,
            latencyMs: Date.now() - startTime,
          });
        } catch (submitError) {
          const errorMsg = submitError instanceof Error ? submitError.message : 'Unknown error';
          console.error(`❌ Error processing @${req.handle}:`, errorMsg);
          results.push({
            requestId: req.requestId,
            handle: req.handle,
            status: 'failed',
            error: errorMsg,
            metrics,
            latencyMs: Date.now() - startTime,
          });
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error(`❌ Error processing request:`, errorMsg);
        results.push({
          requestId: req.requestId,
          handle: req.handle,
          status: 'failed',
          error: errorMsg,
          latencyMs: Date.now() - startTime,
        });
      }
    }

    console.log(`🏁 Oracle execution complete. Processed: ${results.length} requests`);

    return NextResponse.json({
      status: 'success',
      message: `Processed ${results.length} pending requests`,
      requestsProcessed: results.length,
      results,
      errors,
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Handler error:', errorMsg);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Oracle execution failed',
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}

/**
 * Support OPTIONS for CORS
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
