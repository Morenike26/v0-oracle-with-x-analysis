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
// lib/analysis.ts  (or wherever this file is)
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

const clamp = (n: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, Math.round(Number.isFinite(n) ? n : 0)));

/**
 * Safe getters
 */
function safeProfileMetrics(profile: XUserProfile | null | undefined) {
  const pm = profile?.public_metrics ?? {};
  return {
    followers: Math.max(0, Number(pm.followers_count ?? 0) || 0),
    tweets: Math.max(0, Number(pm.tweet_count ?? 0) || 0),
    following: Math.max(0, Number(pm.following_count ?? 0) || 0),
  };
}

/**
 * Calculate Engagement Score (0-100)
 */
function calculateEngagementScore(profile: XUserProfile | null | undefined): number {
  const { followers, tweets } = safeProfileMetrics(profile);

  if (followers === 0) return tweets === 0 ? 10 : 15;
  if (tweets === 0) return 15;

  // Shadowban red flag
  if (followers < 100 && tweets > 1000) return 25;

  if (followers >= 10000) {
    return clamp(60 + followers / 1000);
  }

  return clamp(50 + followers / 1000);
}

/**
 * Calculate Posting Consistency Score (0-100)
 */
function calculatePostingConsistency(tweets: XTweet[] | null | undefined): number {
  const safeTweets = Array.isArray(tweets) ? tweets.filter(Boolean) : [];

  if (safeTweets.length === 0) return 0;

  const tweetsPerDay = calculateTweetsPerDay(safeTweets);

  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const hasRecentTweets = safeTweets.some((tweet) => {
    const date = tweet?.created_at ? new Date(tweet.created_at).getTime() : 0;
    return date >= thirtyDaysAgo;
  });

  if (!hasRecentTweets) return 10;

  if (tweetsPerDay >= 1 && tweetsPerDay <= 10) return 85;
  if (tweetsPerDay > 20) return clamp(85 - (tweetsPerDay - 10) * 2);
  if (tweetsPerDay > 0 && tweetsPerDay < 1) return 60;

  return 50;
}

/**
 * Calculate Content Risk Score (0-100)
 */
function calculateContentRiskScore(tweets: XTweet[] | null | undefined, profile: XUserProfile | null | undefined): number {
  const safeTweets = Array.isArray(tweets) ? tweets.filter(Boolean) : [];
  const { followers } = safeProfileMetrics(profile);

  let violations = 0;
  violations += scanForSpamKeywords(safeTweets);
  violations += countExcessiveHashtags(safeTweets);
  violations += countExcessiveMentions(safeTweets);

  if (hasEngagementAnomalies(safeTweets, followers)) {
    violations += 2;
  }

  let score = 50 + violations * 5;
  return clamp(score);
}

/**
 * Main Analysis Function
 */
export async function analyzeXHandle(
  profile: XUserProfile | null | undefined,
  tweets: XTweet[] | null | undefined
): Promise<AnalysisMetrics> {
  if (!profile) {
    console.warn('⚠️ No profile provided to analyzeXHandle');
    return createErrorMetrics();
  }

  console.log(`📊 Analyzing @${profile.username || 'unknown'}`);

  const accountAgeDays = getAccountAgeDays(profile.created_at);
  const { followers, tweets: totalTweets } = safeProfileMetrics(profile);

  const safeTweets = Array.isArray(tweets) ? tweets.filter(Boolean) : [];

  const tweetsPerDay = calculateTweetsPerDay(safeTweets);

  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const hasRecentTweets = safeTweets.some((tweet) =>
    tweet?.created_at ? new Date(tweet.created_at).getTime() >= thirtyDaysAgo : false
  );

  let engagementScore = calculateEngagementScore(profile);
  const postingConsistency = calculatePostingConsistency(safeTweets);
  let contentRiskScore = calculateContentRiskScore(safeTweets, profile);

  let metrics: AnalysisMetrics = {
    engagementScore: Math.round(engagementScore),
    postingConsistency: Math.round(postingConsistency),
    contentRiskScore: Math.round(contentRiskScore),
    riskLevel: 1,
    details: {
      accountAgeDays,
      followers,
      tweets: totalTweets,
      tweetsPerDay: Math.round(tweetsPerDay * 100) / 100,
      hasRecentTweets,
      spamViolations: scanForSpamKeywords(safeTweets),
      excessiveHashtags: countExcessiveHashtags(safeTweets),
      excessiveMentions: countExcessiveMentions(safeTweets),
      engagementAnomalies: hasEngagementAnomalies(safeTweets, followers),
    },
  };

  // Apply age modifiers
  if (accountAgeDays < 7) {
    metrics.engagementScore = Math.round(metrics.engagementScore * 0.5);
    metrics.contentRiskScore = clamp(metrics.contentRiskScore + 20);
  }

  // Final risk level
  const riskAverage = (
    (100 - metrics.engagementScore) +
    (100 - metrics.postingConsistency) +
    metrics.contentRiskScore
  ) / 3;

  metrics.riskLevel = riskAverage > 75 ? 3 : riskAverage > 50 ? 2 : 1;

  return metrics;
}

export function createErrorMetrics(): AnalysisMetrics {
  return {
    engagementScore: 0,
    postingConsistency: 0,
    contentRiskScore: 100,
    riskLevel: 3,
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
