import { ethers } from 'ethers';
import CONTRACT_ABI from './contract-abi.json';

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || '0xCe8f5297dFE00E5e201f46f4A662E4ffCB5Ac3D6';
const RPC_URL = process.env.RITUAL_RPC || 'https://rpc.ritualfoundation.org';

interface AnalysisResult {
  requestId: string;
  handle: string;
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

    // Filter for AnalysisRequested events (requestId indexed, handle not indexed)
    const filter = contract.filters.AnalysisRequested();
    const events = await contract.queryFilter(filter, fromBlock, currentBlock);

    console.log(`📊 Found ${events.length} AnalysisRequested events`);

    const requests = [];
    for (const event of events) {
      try {
        const args = event.args;
        if (!args) continue;

        // AnalysisRequested(bytes32 requestId, address requester, string handle, ExecutionPath path)
        const requestId = args[0]?.toString() || '';
        const requester = args[1]?.toString() || '';
        const handle = args[2]?.toString() || '';
        const path = args[3]?.toString() || '0';

        // Check request status using getRequest
        const request = await contract.getRequest(requestId);
        
        // Status: 0 = Pending, 1 = Completed, 2 = Failed
        if (request.status === 0) { // Pending status
          requests.push({
            requestId,
            handle,
            requester,
            path: parseInt(path),
            status: 'Pending',
            createdAt: request.createdAt?.toString() || '',
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
    console.log(`📡 Submitting result for ${result.handle} (request ${result.requestId})`);
    
    const provider = getProvider();
    const signer = new ethers.Wallet(process.env.TEE_PRIVATE_KEY!, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    // Call fulfill with: id, riskLevel, engagementScore, postingConsistency, contentRiskScore, signature
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
