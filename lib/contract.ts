import { ethers } from 'ethers';

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0x10cF97EA9385A38DA8B1bA9f9B1518AfC5bc604B';
const RPC_URL = process.env.RPC_URL || 'https://rpc.ritualfoundation.org';

// Contract ABI - AnalysisRequested and fulfill functions
const CONTRACT_ABI = [
  {
    type: 'event',
    name: 'AnalysisRequested',
    inputs: [
      { name: 'requestId', type: 'uint256', indexed: true },
      { name: 'xHandle', type: 'string', indexed: false },
      { name: 'requester', type: 'address', indexed: true },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'function',
    name: 'fulfill',
    inputs: [
      { name: 'requestId', type: 'uint256' },
      { name: 'riskLevel', type: 'uint8' },
      { name: 'engagementScore', type: 'uint8' },
      { name: 'postingConsistency', type: 'uint8' },
      { name: 'contentRiskScore', type: 'uint8' },
      { name: 'signature', type: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getRequestStatus',
    inputs: [{ name: 'requestId', type: 'uint256' }],
    outputs: [
      { name: 'xHandle', type: 'string' },
      { name: 'requester', type: 'address' },
      { name: 'status', type: 'uint8' },
      { name: 'timestamp', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
];

interface AnalysisResult {
  requestId: string;
  xHandle: string;
  riskLevel: number;
  engagementScore: number;
  postingConsistency: number;
  contentRiskScore: number;
  txHash?: string;
  error?: string;
}

/**
 * Get provider for Ritual Chain
 */
export function getProvider() {
  return new ethers.JsonRpcProvider(RPC_URL);
}

/**
 * Get contract instance
 */
export function getContract(provider: ethers.Provider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

/**
 * Query for AnalysisRequested events from the last N blocks
 */
export async function getPendingRequests(blockRange: number = 50) {
  try {
    console.log('🔍 Querying for AnalysisRequested events from last', blockRange, 'blocks');
    const provider = getProvider();
    const contract = getContract(provider);

    const currentBlock = await provider.getBlockNumber();
    const fromBlock = Math.max(0, currentBlock - blockRange);

    const filter = contract.filters.AnalysisRequested();
    const events = await contract.queryFilter(filter, fromBlock, currentBlock);

    console.log(`📊 Found ${events.length} AnalysisRequested events`);

    const requests = [];
    for (const event of events) {
      try {
        const args = event.args;
        if (!args) continue;

        const requestId = args[0]?.toString() || '';
        const xHandle = args[1]?.toString() || '';
        const requester = args[2]?.toString() || '';
        const timestamp = args[3]?.toString() || '';

        // Check request status
        const status = await contract.getRequestStatus(requestId);
        
        // Status: 0 = Pending, 1 = Completed, 2 = Failed
        if (status[2] === 0) { // Pending status
          requests.push({
            requestId,
            xHandle,
            requester,
            timestamp,
            status: 'Pending',
          });
        } else {
          console.log(`⏭️  Skipping already processed request ${requestId}`);
        }
      } catch (err) {
        console.error('❌ Error processing event:', err);
      }
    }

    return requests;
  } catch (error) {
    console.error('❌ Error querying pending requests:', error);
    throw error;
  }
}

/**
 * Submit analysis result to contract
 */
export async function submitResult(
  result: AnalysisResult,
  signature: string
): Promise<string> {
  try {
    console.log(`📡 Submitting result for ${result.xHandle} (request ${result.requestId})`);
    
    const provider = getProvider();
    const contract = getContract(provider);

    // Create transaction
    const tx = await contract.fulfill(
      result.requestId,
      result.riskLevel,
      result.engagementScore,
      result.postingConsistency,
      result.contentRiskScore,
      signature,
      {
        gasLimit: 200000,
      }
    );

    console.log(`✅ Transaction sent: ${tx.hash}`);

    // Wait for confirmation
    const receipt = await tx.wait(1);
    console.log(`✅ Transaction confirmed in block ${receipt?.blockNumber}`);

    result.txHash = tx.hash;
    return tx.hash;
  } catch (error) {
    console.error('❌ Error submitting result:', error);
    throw error;
  }
}

/**
 * Get recent request count for rate limiting
 */
export async function getRecentRequestCount(windowSeconds: number = 300): Promise<number> {
  try {
    const provider = getProvider();
    const contract = getContract(provider);

    const currentBlock = await provider.getBlockNumber();
    const currentTime = (await provider.getBlock(currentBlock))?.timestamp || 0;
    const windowStart = currentTime - windowSeconds;

    const filter = contract.filters.AnalysisRequested();
    const events = await contract.queryFilter(filter, Math.max(0, currentBlock - 100), currentBlock);

    return events.filter(event => {
      const timestamp = event.args?.[3]?.toNumber?.() || 0;
      return timestamp >= windowStart;
    }).length;
  } catch (error) {
    console.error('❌ Error getting recent request count:', error);
    return 0;
  }
}
