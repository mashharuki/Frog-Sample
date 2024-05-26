import {ethers, network, run} from "hardhat";
import {writeContractAddress} from "../helper/contractsJsonHelper";

/**
 * NFTコントラクトデプロイスクリプト
 */
async function main() {
  console.log(` ======================= start ========================= `);
  const NAEM = "SampleNFT";
  const SYMBOL = "SNFT";
  const BASETOKENURI = "https://openfort.xyz/docs";
  const TRUSTEDFORWARDER = "0xc82BbE41f2cF04e3a8efA18F7032BDD7f6d98a81";

  const sampleNft = await ethers.deployContract("SampleNFT", [
    NAEM,
    SYMBOL,
    BASETOKENURI,
    TRUSTEDFORWARDER,
  ]);

  await sampleNft.deployed();

  console.log(` SampleNFT deployed to ${sampleNft.address}`);

  // write Contract Address
  writeContractAddress({
    group: "contracts",
    name: "SampleNFT",
    value: sampleNft.address,
    network: network.name,
  });

  if (network.name == "baseSepolia") {
    await run(`verify:verify`, {
      contract: "contracts/SampleNFT.sol:SampleNFT",
      address: sampleNft.address,
      constructorArguments: [NAEM, SYMBOL, BASETOKENURI, TRUSTEDFORWARDER],
    });
  }

  console.log(` ======================== end  ======================== `);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
