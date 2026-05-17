import {
  getAccountAgeDays,
  calculateTweetsPerDay,
  getAverageEngagement,
  scanForSpamKeywords,
  countExcessiveHashtags,
  countExcessiveMentions,
  hasEngagementAnomalies,
  XUserProfile,
  XTweet,
} from './xapi';

export interface AnalysisMetrics {
  engagementScore: number;
  postingConsistency: number;
  contentRiskScore: number;
  riskLevel: number;
  details: {
    accountAgeDays: number;
    followers: number;
    tweets: number;
    tweetsPerDay: number;
    hasRecentTweets: boolean;
    spamViolations: number;
    excessiveHashtags: number;
    excessiveMentions: number;
    engagementAnomalies: boolean;
  };
}

/**
 * Calculate Engagement Score (0-100)
 * Higher is healthier
 */
function calculateEngagementScore(profile: XUserProfile): number {
  const followers = profile.public_metrics.followers_count;
  const tweets = profile.public_metrics.tweet_count;

  // Edge cases
  if (followers === 0) {
    return tweets === 0 ? 10 : 15;
  }

  if (tweets === 0) {
    return 15;
  }

  // Shadowban indicator: low followers + high tweets
  if (followers < 100 && tweets > 1000) {
    return 25;
  }

  // Established accounts
  if (followers >= 10000) {
    return Math.min(100, 60 + followers / 1000);
  }

  // Default formula
  return Math.min(100, 50 + followers / 1000);
}

/**
 * Calculate Posting Consistency Score (0-100)
 * Higher means more consistent
 */
function calculatePostingConsistency(tweets: XTweet[]): number {
  if (tweets.length === 0) {
    return 0;
  }

  const tweetsPerDay = calculateTweetsPerDay(tweets);

  // Check for recent activity (last 30 days)
  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const hasRecentTweets = tweets.some(
    (tweet) => new Date(tweet.created_at).getTime() >= thirtyDaysAgo
  );

  if (!hasRecentTweets) {
    return 10; // No recent tweets
  }

  // Ideal range: 1-10 tweets per day
  if (tweetsPerDay >= 1 && tweetsPerDay <= 10) {
    return 85;
  }

  // Very high frequency (spam pattern)
  if (tweetsPerDay > 20) {
    return Math.max(0, 85 - (tweetsPerDay - 10) * 2);
  }

  // Low activity but consistent
  if (tweetsPerDay > 0 && tweetsPerDay < 1) {
    return 60;
  }

  return 50;
}

/**
 * Calculate Content Risk Score (0-100)
 * Higher means more risky
 */
function calculateContentRiskScore(tweets: XTweet[], profile: XUserProfile): number {
  let violations = 0;

  // Scan for spam keywords
  violations += scanForSpamKeywords(tweets);

  // Count excessive hashtags
  violations += countExcessiveHashtags(tweets);

  // Count excessive mentions
  violations += countExcessiveMentions(tweets);

  // Check engagement anomalies
  if (hasEngagementAnomalies(tweets, profile.public_metrics.followers_count)) {
    violations += 2;
  }

  // Base score + violations
  let score = 50 + violations * 5;

  // Cap at 100
  return Math.min(100, score);
}

/**
 * Apply modifiers based on account age
 */
function applyAgeModifiers(
  metrics: AnalysisMetrics,
  accountAgeDays: number
): AnalysisMetrics {
  if (accountAgeDays < 7) {
    // New account modifier
    metrics.engagementScore *= 0.5;
    metrics.contentRiskScore += 20;
    metrics.contentRiskScore = Math.min(100, metrics.contentRiskScore);
  }

  return metrics;
}

/**
 * Calculate risk level from averaged metrics
 */
function calculateRiskLevel(
  engagementScore: number,
  postingConsistency: number,
  contentRiskScore: number
): number {
  // Average all metrics
  const riskAverage = (
    (100 - engagementScore) +
    (100 - postingConsistency) +
    contentRiskScore
  ) / 3;

  if (riskAverage > 75) {
    return 3; // High risk
  } else if (riskAverage > 50) {
    return 2; // Medium risk
  } else {
    return 1; // Low risk
  }
}

/**
 * Analyze an X handle for shadowban risk
 */
export async function analyzeXHandle(
  profile: XUserProfile,
  tweets: XTweet[]
): Promise<AnalysisMetrics> {
  console.log(`📊 Analyzing @${profile.username}`);

  const accountAgeDays = getAccountAgeDays(profile.created_at);
  const tweetsPerDay = calculateTweetsPerDay(tweets);

  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const hasRecentTweets = tweets.some(
    (tweet) => new Date(tweet.created_at).getTime() >= thirtyDaysAgo
  );

  // Calculate base metrics
  let engagementScore = calculateEngagementScore(profile);
  const postingConsistency = calculatePostingConsistency(tweets);
  let contentRiskScore = calculateContentRiskScore(tweets, profile);

  // Create metrics object
  let metrics: AnalysisMetrics = {
    engagementScore: Math.round(engagementScore),
    postingConsistency: Math.round(postingConsistency),
    contentRiskScore: Math.round(contentRiskScore),
    riskLevel: 3, // Will be calculated after modifiers
    details: {
      accountAgeDays,
      followers: profile.public_metrics.followers_count,
      tweets: profile.public_metrics.tweet_count,
      tweetsPerDay: Math.round(tweetsPerDay * 100) / 100,
      hasRecentTweets,
      spamViolations: scanForSpamKeywords(tweets),
      excessiveHashtags: countExcessiveHashtags(tweets),
      excessiveMentions: countExcessiveMentions(tweets),
      engagementAnomalies: hasEngagementAnomalies(
        tweets,
        profile.public_metrics.followers_count
      ),
    },
  };

  // Apply age modifiers
  metrics = applyAgeModifiers(metrics, accountAgeDays);

  // Ensure scores stay in bounds
  metrics.engagementScore = Math.max(0, Math.min(100, Math.round(metrics.engagementScore)));
  metrics.postingConsistency = Math.max(0, Math.min(100, Math.round(metrics.postingConsistency)));
  metrics.contentRiskScore = Math.max(0, Math.min(100, Math.round(metrics.contentRiskScore)));

  // Calculate final risk level
  metrics.riskLevel = calculateRiskLevel(
    metrics.engagementScore,
    metrics.postingConsistency,
    metrics.contentRiskScore
  );

  console.log(
    `✅ Analysis complete: Risk Level ${metrics.riskLevel}, Engagement: ${metrics.engagementScore}, Consistency: ${metrics.postingConsistency}, Content Risk: ${metrics.contentRiskScore}`
  );

  return metrics;
}

/**
 * Analyze X handle when profile is not found (error case)
 */
export function createErrorMetrics(): AnalysisMetrics {
  console.log('❌ Creating error metrics for missing profile');

  return {
    engagementScore: 0,
    postingConsistency: 0,
    contentRiskScore: 100,
    riskLevel: 3, // High risk for unknown/missing profiles
    details: {
      accountAgeDays: 0,
      followers: 0,
      tweets: 0,
      tweetsPerDay: 0,
      hasRecentTweets: false,
      spamViolations: 0,
      excessiveHashtags: 0,
      excessiveMentions: 0,
      engagementAnomalies: false,
    },
  };
}
