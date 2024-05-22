import { createPublicClient, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import contractAbi from "./contract.json";
const contractAddress = process.env.CONTRACT_ADDRESS as `0x`;

const account = privateKeyToAccount((process.env.PRIVATE_KEY as `0x`) || "");

/**
 * createPublicClient メソッド
 */
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.ALCHEMY_URL),
});

/**
 * createWalletClient メソッド
 */
const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(process.env.ALCHEMY_URL),
});

/**
 * mintNFTメソッド
 * @param toAddress 
 * @returns 
 */
export async function mintNft(toAddress: string) {
  try {
    const { request }: any = await publicClient.simulateContract({
      account,
      address: contractAddress,
      abi: contractAbi,
      functionName: "mint",
      args: [toAddress, 0, 1, `0x`],
    });
    const transaction = await walletClient.writeContract(request);
    return transaction;
  } catch (error) {
    console.log(error);
    return error;
  }
}

/**
 * get balance of nft
 * @param address 
 * @returns 
 */
export async function balanceOf(address: string) {
  try {
    const balanceData = await publicClient.readContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "balanceOf",
      args: [address as `0x`, 0]
    });
    const balance: number = Number(balanceData)
    return balance
  } catch (error) {
    console.log(error);
    return error;
  }
}