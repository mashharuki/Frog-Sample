
import { getConnectedAddressForUser } from "@/utils/fc";
import { balanceOf, mintNft } from "@/utils/mint";
import { NextRequest, NextResponse } from "next/server";

import { PinataFDK } from "pinata-fdk";

// FDK用のインスタンスを生成
const fdk = new PinataFDK({
  pinata_jwt: process.env.PINATA_JWT as string,
  pinata_gateway: process.env.GATEWAY_URL as string,
});

/**
 * /frame APIメソッドの定義
 * @param req 
 * @param res 
 * @returns 
 */
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // metadataを生成する。
    const frameMetadata = await fdk.getFrameMetadata({
      post_url: `${process.env.BASE_URL}/frame`,
      buttons: [{ label: "Mint NFT", action: "post" }],
      aspect_ratio: "1:1",
      cid: "QmSYN7KT847Nado3fxFafYZgG6NXTMZwbaMvU9jhu5nPmJ",
    });
    return new NextResponse(frameMetadata);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error });
  }
}

/**
 * /frame APIメソッドの定義
 * @param req 
 * @param res 
 * @returns 
 */
export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const fid = body.untrustedData.fid;
  const address = await getConnectedAddressForUser(fid);
  const balance = await balanceOf(address);
  console.log("balance:", balance);
  if (typeof balance === "number" && balance !== null && balance < 1) {
    try {
      // mint NFT
      const mint = await mintNft(address);
      console.log("mint nft tx:", mint);
      // メタデータ取得
      const frameMetadata = await fdk.getFrameMetadata({
        post_url: `${process.env.BASE_URL}/redirect`,
        buttons: [{ label: "Learn How to Make This", action: "post_redirect" }],
        aspect_ratio: "1:1",
        cid: "QmUx3kQH4vR2t7mTmW3jHJgJgJGxjoBsMxt6z1fkZEHyHJ",
      });
      return new NextResponse(frameMetadata);
    } catch (error) {
      console.log(error);
      return NextResponse.json({ error: error });
    }
  } else {
    const frameMetadata = await fdk.getFrameMetadata({
      post_url: `${process.env.BASE_URL}/redirect`,
      buttons: [{ label: "Learn How to Make This", action: "post_redirect" }],
      aspect_ratio: "1:1",
      cid: "QmaaEbtsetwamJwfFPAQAFC6FAE1xeYsvF7EBKA8NYMjP2",
    });
    return new NextResponse(frameMetadata);
  }
}