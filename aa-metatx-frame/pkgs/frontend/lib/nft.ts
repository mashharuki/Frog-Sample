import {NFT_CONTRACT_ADDRESS} from "@/utils/contstants";
import {createWalletClient, encodeFunctionData, http} from "viem";
import {privateKeyToAccount} from "viem/accounts";
import {baseSepolia} from "viem/chains";

const NFT_PRIVATE_KEY = process.env.NFT_PRIVATE_KEY as `0x${string}`;

const MINT_ABI = {
  inputs: [
    {
      internalType: "address",
      name: "to",
      type: "address",
    },
  ],
  name: "mint",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};

/**
 * mint nft method
 */
export const airdropTo = async (recipient: `0x${string}`) => {
  try {
    const client = createWalletClient({
      chain: baseSepolia,
      transport: http(),
    });
    const account = privateKeyToAccount(NFT_PRIVATE_KEY);
    // send tx
    const tx = await client.sendTransaction({
      account: account,
      to: NFT_CONTRACT_ADDRESS,
      data: encodeFunctionData({
        abi: [MINT_ABI],
        functionName: "mint",
        args: [recipient],
      }),
    });
    return tx;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
