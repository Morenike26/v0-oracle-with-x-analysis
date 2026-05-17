import { NextRequest, NextResponse } from 'next/server';

/**
 * Health check endpoint
 * Returns 200 OK if the function is deployed and working
 */
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: {
        hasContractAddress: !!process.env.CONTRACT_ADDRESS,
        hasRpcUrl: !!process.env.RPC_URL,
        hasXApiKey: !!process.env.X_API_KEY,
        hasTeePrivateKey: !!process.env.TEE_PRIVATE_KEY,
      },
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: errorMsg,
        timestamp: new Date().toISOString(),
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
