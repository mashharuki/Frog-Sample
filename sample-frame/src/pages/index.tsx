import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import { NEXT_PUBLIC_URL } from './../config';

// frame 用のメタデータ
const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: 'Trending Crypto Pools',
    },
    {
      action: 'link',
      label: 'Visit Coingcko',
      target: 'https://www.coingecko.com',
    },
  ],
  image: {
    src: `${NEXT_PUBLIC_URL}/gecko_frame.JPG`,
    aspectRatio: '1:1',
  },
  postUrl: `${NEXT_PUBLIC_URL}/api/trendingPools`,
});

// メタデータ
export const metadata: Metadata = {
  metadataBase: new URL(NEXT_PUBLIC_URL),
  title: 'Crypto Farcaster Frames - Powered by CoinGecko',
  description: 'LFG',
  openGraph: {
    title: 'Crypto Farcaster Frames - Powered by CoinGecko',
    description: 'LFG',
    images: [`${NEXT_PUBLIC_URL}/gecko_frame.JPG`],
  },
  other: {
    ...frameMetadata,
  },
};

/**
 * Home component
 */
export default function Home() {
  return (
    <>
      <h1>Welcome to Crypto Farcaster Frames - Powered by CoinGecko</h1>
    </>
  );
}