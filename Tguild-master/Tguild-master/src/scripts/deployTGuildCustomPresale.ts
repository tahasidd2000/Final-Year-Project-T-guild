import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import { ethers } from "hardhat";
import { deployTGuildFactoryPresale } from "./deployTGuildFactoryPresale";
import { tryVerify } from "./utils/verify";

export async function deployTGuildCustomPresale(createPresaleFee: BigNumber, serviceFeeReciever: string) {
  const TGuildFactoryPresale = await deployTGuildFactoryPresale(createPresaleFee, serviceFeeReciever);

  console.log("Starting to deploy TGuildCustomPresaleLibrary");

  const TGuildCustomPresaleLibrary = await ethers.getContractFactory("TGuildCustomPresale");
  const tGuildCustomPresaleLibrary = await TGuildCustomPresaleLibrary.deploy();
  await tGuildCustomPresaleLibrary.deployed();

  console.log("TGuildCustomPresaleLibrary deployed to:", tGuildCustomPresaleLibrary.address);

  await tryVerify(tGuildCustomPresaleLibrary.address);

  console.log("Setting library Address for factory Presale");

  await TGuildFactoryPresale.setLibraryAddress(tGuildCustomPresaleLibrary.address);

  console.log("Library Address for factory Presale set to: ", tGuildCustomPresaleLibrary.address);

  return tGuildCustomPresaleLibrary;
}

async function main() {
  const createPresaleFee = parseEther("0.0001");
  const serviceFeeReciever = "0x7411184d3b0308Af7c5A14550A9239Aa9db2f45B";
  await deployTGuildCustomPresale(createPresaleFee, serviceFeeReciever);
}

if (require.main === module) {
  main();
}
