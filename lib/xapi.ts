import axios from 'axios';

const X_API_BASE_URL = 'https://api.twitter.com/2';
const X_API_KEY = process.env.X_API_KEY;

interface XUserProfile {
  id: string;
  name: string;
  username: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
  created_at: string;
  verified: boolean;
  verified_type?: string;
}

interface XTweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
    quote_count: number;
  };
}

const axiosInstance = axios.create({
  baseURL: X_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${X_API_KEY}`,
  },
  timeout: 30000,
});

/**
 * Fetch X user profile by handle
 */
export async function getXUserProfile(handle: string): Promise<XUserProfile | null> {
  try {
    console.log(`📡 Fetching X profile for @${handle}`);
    
    const response = await axiosInstance.get('/users/by/username/:username', {
      params: {
        'user.fields': 'created_at,public_metrics,verified,verified_type',
      },
      url: `/users/by/username/${handle}`,
    });

    // Fallback to direct URL if parameterized doesn't work
    const res = await axiosInstance.get(`/users/by/username/${handle}`, {
      params: {
        'user.fields': 'created_at,public_metrics,verified,verified_type',
      },
    });

    if (res.data?.data) {
      console.log(`✅ Profile found: @${handle} with ${res.data.data.public_metrics.followers_count} followers`);
      return res.data.data;
    }

    return null;
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.error('❌ X API rate limited (429)');
      throw new Error('X_API_RATE_LIMITED');
    }
    if (error.response?.status === 404) {
      console.error(`❌ User @${handle} not found`);
      return null;
    }
    console.error(`❌ Error fetching X profile: ${error.message}`);
    throw error;
  }
}

/**
 * Fetch recent tweets from a user (last 100)
 */
export async function getXUserTweets(
  userId: string,
  maxResults: number = 100
): Promise<XTweet[]> {
  try {
    console.log(`📡 Fetching tweets for user ${userId}`);
    
    const response = await axiosInstance.get(`/users/${userId}/tweets`, {
      params: {
        max_results: Math.min(maxResults, 100),
        'tweet.fields': 'created_at,public_metrics',
        expansions: 'author_id',
      },
    });

    if (response.data?.data) {
      console.log(`✅ Fetched ${response.data.data.length} tweets`);
      return response.data.data;
    }

    return [];
  } catch (error: any) {
    if (error.response?.status === 429) {
      console.error('❌ X API rate limited (429)');
      throw new Error('X_API_RATE_LIMITED');
    }
    console.error(`❌ Error fetching tweets: ${error.message}`);
    throw error;
  }
}

/**
 * Parse account age in days
 */
export function getAccountAgeDays(createdAt: string): number {
  const created = new Date(createdAt).getTime();
  const now = Date.now();
  return Math.floor((now - created) / (1000 * 60 * 60 * 24));
}

/**
 * Calculate tweets per day over last 30 days
 */
export function calculateTweetsPerDay(tweets: XTweet[]): number {
  if (tweets.length === 0) return 0;

  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  const recentTweets = tweets.filter(
    (tweet) => new Date(tweet.created_at).getTime() >= thirtyDaysAgo
  );

  return recentTweets.length / 30;
}

/**
 * Get average engagement per tweet
 */
export function getAverageEngagement(tweets: XTweet[]): number {
  if (tweets.length === 0) return 0;

  const totalEngagement = tweets.reduce((sum, tweet) => {
    return (
      sum +
      tweet.public_metrics.like_count +
      tweet.public_metrics.retweet_count +
      tweet.public_metrics.reply_count
    );
  }, 0);

  return totalEngagement / tweets.length;
}

/**
 * Check if tweets contain spam keywords
 */
export function scanForSpamKeywords(tweets: XTweet[]): number {
  const spamKeywords = [
    'crypto',
    'scam',
    'free money',
    'click here',
    'buy now',
    'verified account',
    'follow back',
  ];

  let violationCount = 0;

  tweets.forEach((tweet) => {
    const lowerText = tweet.text.toLowerCase();
    spamKeywords.forEach((keyword) => {
      if (lowerText.includes(keyword)) {
        violationCount++;
      }
    });
  });

  return violationCount;
}

/**
 * Count excessive hashtags
 */
export function countExcessiveHashtags(tweets: XTweet[]): number {
  let excessiveCount = 0;

  tweets.forEach((tweet) => {
    const hashtagCount = (tweet.text.match(/#/g) || []).length;
    if (hashtagCount > 15) {
      excessiveCount++;
    }
  });

  return excessiveCount;
}

/**
 * Count excessive mentions
 */
export function countExcessiveMentions(tweets: XTweet[]): number {
  let excessiveCount = 0;

  tweets.forEach((tweet) => {
    const mentionCount = (tweet.text.match(/@/g) || []).length;
    if (mentionCount > 10) {
      excessiveCount++;
    }
  });

  return excessiveCount;
}

/**
 * Check engagement to follower ratio anomalies
 */
export function hasEngagementAnomalies(
  tweets: XTweet[],
  followerCount: number
): boolean {
  if (tweets.length === 0 || followerCount === 0) return false;

  const avgEngagement = getAverageEngagement(tweets);
  const expectedEngagement = followerCount * 0.01; // 1% of followers is normal

  // If engagement is much higher than expected, it's an anomaly
  return avgEngagement > expectedEngagement * 5;
}
