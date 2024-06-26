import {errorFrame, parseFrameRequest, successFrame} from "@/lib/farcaster";
import {airdropTo} from "@/lib/nft";
import {FrameRequest} from "@coinbase/onchainkit";
import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest): Promise<Response> {
  let frameRequest: FrameRequest | undefined;
  // Parse and validate request from Frame for fid
  try {
    frameRequest = await req.json();
    if (!frameRequest)
      throw new Error("Could not deserialize request from frame");
  } catch (e) {
    return new NextResponse(errorFrame);
  }

  const {fid, isValid} = await parseFrameRequest(frameRequest);
  if (!fid || !isValid) return new NextResponse(errorFrame);

  const address = req.url.split("/").slice(-1)[0];
  if (typeof address !== "string") return new NextResponse(errorFrame);

  // call Airdrop NFT to the user's wallet function
  const tx = await airdropTo(address as `0x${string}`);
  if (!tx) return new NextResponse(errorFrame);

  return new NextResponse(successFrame);
}

export const dynamic = "force-dynamic";
