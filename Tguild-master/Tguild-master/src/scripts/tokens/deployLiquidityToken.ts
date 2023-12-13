import { BigNumber } from "ethers";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { environment, ZERO_ADDRESS } from "src/environment";
import { deployLiquidityTokenFactory } from "../tokenCreators/deployLiquidityTokenFactory";
import { tryVerify } from "../utils/verify";

export async function deployStandardToken(
  serviceFee: BigNumber,
  serviceFeeAddress: string,
  tokenName: string,
  tokenSymbol: string,
  tokenSupply: BigNumber,
  tGuildswapRouter: string,
  taxFeeBps: string,
  liquidityFeeBps: string,
  charityAddress: string,
  charityFeeBps: string
) {
  const deployedLiquidityTokenFactory = await deployLiquidityTokenFactory(serviceFee, serviceFeeAddress);
  console.log("Starting to deploy LiquidityToken");

  const tx = await deployedLiquidityTokenFactory.createLiquidityToken(
    tokenName,
    tokenSymbol,
    tokenSupply,
    tGuildswapRouter,
    charityAddress,
    taxFeeBps,
    liquidityFeeBps,
    charityFeeBps,
    {
      value: serviceFee,
    }
  );

  await tx.wait();
  const tokenAddress = await deployedLiquidityTokenFactory.customLiquidityTokens(0);
  console.log("LiquidityToken deployed to:", tokenAddress);

  const owner = "0x7411184d3b0308Af7c5A14550A9239Aa9db2f45B";
  await tryVerify(tokenAddress, [
    tokenName,
    tokenSymbol,
    tokenSupply,
    tGuildswapRouter,
    charityAddress,
    taxFeeBps,
    liquidityFeeBps,
    charityFeeBps,
    owner,
  ]);

  return deployedLiquidityTokenFactory;
}

async function main() {
  const serviceFee = parseEther("0.0001");
  const serviceFeeReciever = "0x7411184d3b0308Af7c5A14550A9239Aa9db2f45B";
  const tokenName = "Sample1";
  const tokenSymbol = "SAM1";
  const tokenSupply = parseUnits("100000", 9);
  const tGuildswapRouter = environment.TGuildSWAP_ROUTER ?? "0xD7803eB47da0B1Cf569F5AFf169DA5373Ef3e41B";
  const taxFeeBps = "400"; // 4%
  const liquidityFeeBps = "300"; // 3%
  const charityAddress = ZERO_ADDRESS;
  const charityFeeBps = "0";
  await deployStandardToken(
    serviceFee,
    serviceFeeReciever,
    tokenName,
    tokenSymbol,
    tokenSupply,
    tGuildswapRouter,
    taxFeeBps,
    liquidityFeeBps,
    charityAddress,
    charityFeeBps
  );
}

if (require.main === module) {
  main();
}
