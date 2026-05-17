import { ethers } from 'ethers';

const TEE_PRIVATE_KEY = process.env.TEE_PRIVATE_KEY;

/**
 * Sign analysis result with TEE private key
 * Creates Ethereum signed message with keccak256 hash
 */
export function signAnalysisResult(
  requestId: string,
  xHandle: string,
  riskLevel: number,
  engagementScore: number,
  postingConsistency: number,
  contentRiskScore: number
): string {
  try {
    if (!TEE_PRIVATE_KEY) {
      throw new Error('TEE_PRIVATE_KEY not set');
    }

    console.log('🔐 Signing result for request', requestId);

    // Create message with all result data
    const message = ethers.solidityPacked(
      ['uint256', 'string', 'uint8', 'uint8', 'uint8', 'uint8'],
      [requestId, xHandle, riskLevel, engagementScore, postingConsistency, contentRiskScore]
    );

    // Hash the message
    const messageHash = ethers.keccak256(message);

    // Create Ethereum signed message hash (adds "\x19Ethereum Signed Message:\n32" prefix)
    const ethSignedMessageHash = ethers.hashMessage(ethers.getBytes(messageHash));

    // Sign with private key
    const signer = new ethers.Wallet(TEE_PRIVATE_KEY);
    const signature = signer.signingKey.sign(ethSignedMessageHash).serialized;

    console.log('✅ Signature created:', signature.substring(0, 20), '...');

    return signature;
  } catch (error) {
    console.error('❌ Error signing result:', error);
    throw error;
  }
}

/**
 * Verify a signature (for testing)
 */
export function verifySignature(
  requestId: string,
  xHandle: string,
  riskLevel: number,
  engagementScore: number,
  postingConsistency: number,
  contentRiskScore: number,
  signature: string
): string {
  try {
    if (!TEE_PRIVATE_KEY) {
      throw new Error('TEE_PRIVATE_KEY not set');
    }

    const message = ethers.solidityPacked(
      ['uint256', 'string', 'uint8', 'uint8', 'uint8', 'uint8'],
      [requestId, xHandle, riskLevel, engagementScore, postingConsistency, contentRiskScore]
    );

    const messageHash = ethers.keccak256(message);
    const ethSignedMessageHash = ethers.hashMessage(ethers.getBytes(messageHash));

    // Recover signer address
    const recoveredAddress = ethers.recoverAddress(ethSignedMessageHash, signature);

    const signer = new ethers.Wallet(TEE_PRIVATE_KEY);
    const signerAddress = signer.address;

    console.log(`🔐 Signature verification: ${recoveredAddress === signerAddress ? '✅ Valid' : '❌ Invalid'}`);

    return recoveredAddress;
  } catch (error) {
    console.error('❌ Error verifying signature:', error);
    throw error;
  }
}

/**
 * Get the signer address from TEE private key
 */
export function getSignerAddress(): string {
  try {
    if (!TEE_PRIVATE_KEY) {
      throw new Error('TEE_PRIVATE_KEY not set');
    }

    const wallet = new ethers.Wallet(TEE_PRIVATE_KEY);
    return wallet.address;
  } catch (error) {
    console.error('❌ Error getting signer address:', error);
    throw error;
  }
}
