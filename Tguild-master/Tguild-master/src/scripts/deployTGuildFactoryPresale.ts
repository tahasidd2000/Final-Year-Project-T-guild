import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { tryVerify } from "./utils/verify";

export async function deployTGuildFactoryPresale(serviceFee: BigNumber, serviceFeeAddress: string) {
  console.log("Starting to deploy TGuildFactoryPresale");

  const TGuildFactoryPresale = await ethers.getContractFactory("TGuildFactoryPresale");
  const tGuildFactoryPresale = await TGuildFactoryPresale.deploy(serviceFee, serviceFeeAddress);
  await tGuildFactoryPresale.deployed();

  console.log("TGuildFactoryPresale deployed to:", tGuildFactoryPresale.address);

  await tryVerify(tGuildFactoryPresale.address, [serviceFee, serviceFeeAddress]);

  return tGuildFactoryPresale;
}

async function main() {
  const serviceFee = parseEther("0.0001");
  const serviceFeeReciever = "0x7411184d3b0308Af7c5A14550A9239Aa9db2f45B";

  await deployTGuildFactoryPresale(serviceFee, serviceFeeReciever);
}

if (require.main === module) {
  main();
}
