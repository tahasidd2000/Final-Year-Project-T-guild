import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { tryVerify } from "../utils/verify";

export async function deployLiquidityTokenFactory(serviceFee: BigNumber, serviceFeeAddress: string) {
  console.log("Starting to deploy LiquidityTokenFactory");

  const TokenFactoryContract = await ethers.getContractFactory("LiquidityTokenFactory");
  const tokenFactoryDeploy = await TokenFactoryContract.deploy(serviceFee, serviceFeeAddress);
  await tokenFactoryDeploy.deployed();

  console.log("LiquidityTokenFactory deployed to:", tokenFactoryDeploy.address);

  await tryVerify(tokenFactoryDeploy.address, [serviceFee, serviceFeeAddress]);

  return tokenFactoryDeploy;
}

async function main() {
  const serviceFee = parseEther("0.0001");
  const serviceFeeReciever = "0x7411184d3b0308Af7c5A14550A9239Aa9db2f45B";
  await deployLiquidityTokenFactory(serviceFee, serviceFeeReciever);
}

if (require.main === module) {
  main();
}
