import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api';
const INTERNAL_API_TOKEN = process.env.INTERNAL_API_TOKEN || 'your_internal_proxy_token_here_for_nextjs';

async function handleProxy(req: NextRequest) {
  const url = new URL(req.url);

  // Create target URL (strip out /api/ proxy path)
  // For example: /api/services -> /api/services on backend
  const targetPath = url.pathname.replace(/^\/api/, '');
  const searchParams = url.search;

  const backendUrl = `${BACKEND_URL}${targetPath}${searchParams}`;

  // Forward headers, but specifically add the internal token
  const headers = new Headers();
  req.headers.forEach((value, key) => {
    // Don't forward host header to avoid backend routing issues
    if (key.toLowerCase() !== 'host') {
      headers.set(key, value);
    }
  });

  headers.set('x-internal-token', INTERNAL_API_TOKEN);

  try {
    const backendReq: RequestInit = {
      method: req.method,
      headers: headers,
      // Only attach body for methods that allow it
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : await req.blob(),
      redirect: 'manual'
    };

    const response = await fetch(backendUrl, backendReq);

    // Forward response headers
    const resHeaders = new Headers();
    response.headers.forEach((value, key) => {
      resHeaders.set(key, value);
    });

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: resHeaders
    });

  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
export const OPTIONS = handleProxy;
