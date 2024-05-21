import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../config';
import { getChartOptions } from '../lib/getChartOptions';
import { throwErr } from '../lib/throwErr';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let text: string | undefined = '';
  let pool: any | undefined = {};
  let chain: string = '';
  let data: [number, number, number, number, number, number][] = [];

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'YOUR_API_KEY' });

  if (!isValid) {
    return throwErr('error.jpg');
  }
  try {
    const trendingPoolsRes = await fetch(`https://pro-api.coingecko.com/api/v3/onchain/networks/trending_pools`, {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer YOUR_CG_API_KEY`
      }
    });
    if (!trendingPoolsRes.ok) {
      throw new Error(`HTTP error! status: ${trendingPoolsRes.status}`);
    }

    const trendingPoolsJson = await trendingPoolsRes.json();
    const trendingPoolsData = trendingPoolsJson.data.map((pool: any) => {
      return {
        id: pool.id,
        name: pool.attributes.name,
        baseTokenPriceUSD: pool.attributes.base_token_price_usd,
        quoteTokenPriceUSD: pool.attributes.quote_token_price_usd,
        volumeUSD: pool.attributes.volume_usd.m5,
        reserveInUSD: pool.attributes.reserve_in_usd,
        transactions: pool.attributes.transactions.m5,
      };
    });

    // Assuming that the first pool in the trendingPoolsData is the one you want to use
    pool = trendingPoolsData[0];
    chain = pool.relationships.network.data.id; // Extract the chain from the pool data
    data = pool.attributes.volume_usd; // Extract the data

    const chartOptions = getChartOptions(text, data, pool, chain);
    const chartRes = await fetch(`https://quickchart.io/apex-charts/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: chartOptions,
        height: 400,
        width: 800,
      }),
    });
    const chartBlob = await chartRes.blob();
    const chartBuffer = await chartBlob.arrayBuffer(); // Convert the Blob to an ArrayBuffer
    const chartBase64 = Buffer.from(chartBuffer).toString('base64'); // Convert the ArrayBuffer to a Base64 string

    if (message?.button === 2) {
      return NextResponse.redirect(
        `https://www.coingecko.com`,
        { status: 302 },
      );
    }

    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: `Load new chart`,
          },
          {
            action: 'link',
            label: 'View on GeckoTerminal',
            target: `https://www.geckoterminal.com/explore/trending-pools`,
          },
        ],
        image: {
          src: `data:image/png;base64,${chartBase64}`,
        },
        postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
      }),
    );
  } catch (e) {
    return throwErr('error.png');
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';