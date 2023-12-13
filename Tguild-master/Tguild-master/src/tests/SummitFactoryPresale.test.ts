/* eslint-disable node/no-unsupported-features/es-syntax */
import CustomPresaleArtifact from "@built-contracts/TGuildCustomPresale.sol/TGuildCustomPresale.json";
import PresaleFactoryArtifact from "@built-contracts/TGuildFactoryPresale.sol/TGuildFactoryPresale.json";
import TGuildFactoryArtifact from "@built-contracts/TGuildswapFactory.sol/TGuildswapFactory.json";
import TGuildRouterArtifact from "@built-contracts/TGuildswapRouter02.sol/TGuildswapRouter02.json";
import TokenArtifact from "@built-contracts/utils/DummyToken.sol/DummyToken.json";
import WbnbArtifact from "@built-contracts/utils/WBNB.sol/WBNB.json";
import { PresaleFeeInfoStruct, PresaleInfoStruct } from "build/typechain/TGuildCustomPresale";
import {
  DummyToken,
  TGuildFactoryPresale,
  TGuildCustomPresale,
  TGuildswapFactory,
  TGuildswapRouter02,
  WBNB,
} from "build/typechain";
import { assert, expect } from "chai";
import dayjs from "dayjs";
import { BigNumber, Wallet } from "ethers";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { ethers, waffle } from "hardhat";
import { MAX_VALUE, ZERO_ADDRESS } from "src/environment";

const { deployContract, provider } = waffle;

describe("TGuildFactoryPresale", () => {
  const [owner, serviceFeeReceiver, otherWallet1, TGuildFactoryFeeToSetter] = provider.getWallets();

  let presaleToken: DummyToken;
  let wbnb: WBNB;
  let TGuildFactory: TGuildswapFactory;
  let TGuildRouter: TGuildswapRouter02;
  let customPresale: TGuildCustomPresale;
  let presaleFactory: TGuildFactoryPresale;

  const serviceFee = parseEther("0.00010");
  const updatedServiceFee = parseEther("0.00012");

  const FEE_DENOMINATOR = 10 ** 9;
  const FEE_PAYMENT_TOKEN = 300000000; // 3%
  const FEE_PRESALE_TOKEN = 300000000; // 3%
  const FEE_EMERGENCY_WITHDRAW = 1000000000; // 10%

  const presalePrice = "100";
  const listingPrice = "100";
  const liquidityLockTime = 12 * 60;
  const minBuy = "0.1";
  const maxBuy = "0.2";
  const softCap = "0.1";
  const hardCap = "0.2";
  const liquidityPercentage = 70;
  const startPresaleTime = dayjs().add(1, "day").unix();
  const endPresaleTime = dayjs().add(2, "day").unix();
  const listingChoice = 0;
  const refundType = 0;
  const isWhiteListPhase = false;

  const projectDetails = ["icon_Url", "Name", "Contact", "Position", "Telegram Id", "Discord Id", "Email", "Twitter"];

  beforeEach(async () => {
    presaleFactory = (await deployContract(owner, PresaleFactoryArtifact, [
      serviceFee,
      serviceFeeReceiver.address,
    ])) as TGuildFactoryPresale;
    presaleToken = (await deployContract(owner, TokenArtifact, [])) as DummyToken;
    wbnb = (await deployContract(owner, WbnbArtifact, [])) as WBNB;
    TGuildFactory = (await deployContract(owner, TGuildFactoryArtifact, [
      TGuildFactoryFeeToSetter.address,
    ])) as TGuildswapFactory;
    TGuildRouter = (await deployContract(owner, TGuildRouterArtifact, [
      TGuildFactory.address,
      wbnb.address,
    ])) as TGuildswapRouter02;
    customPresale = (await deployContract(owner, CustomPresaleArtifact)) as TGuildCustomPresale;
    await presaleFactory.connect(owner).setLibraryAddress(customPresale.address);
  });

  const calculateTokenAmount = (
    presalePrice: number,
    hardCap: number,
    liquidityPrecentage: number,
    listingPrice: number
  ) => {
    const presaleTokenAmount = Number(presalePrice) * Number(hardCap);
    const tokensForLiquidity = Number(liquidityPrecentage / 100) * Number(hardCap) * Number(listingPrice);
    const tokenAmount = presaleTokenAmount + tokensForLiquidity;
    return tokenAmount;
  };

  const createPresale = async ({
    _caller,
    _paymentTokenAddress,
    _pancakeRouterAddress,
    _listingToken,
    _presalePrice,
    _listingPrice,
    _liquidityPercentage,
    _minBuy,
    _maxBuy,
    _softCap,
    _hardCap,
    _startPresaleTime,
    _endPresaleTime,
    _liquidityLockTime,
    _refundType,
    _listingChoice,
    _isWhiteListPhase,
    _serviceFee,
  }: {
    _caller?: Wallet;
    _paymentTokenAddress?: string;
    _pancakeRouterAddress?: string;
    _listingToken?: string;
    _presalePrice?: string;
    _listingPrice?: string;
    _liquidityPercentage?: number;
    _minBuy?: string;
    _maxBuy?: string;
    _softCap?: string;
    _hardCap?: string;
    _startPresaleTime?: number;
    _endPresaleTime?: number;
    _liquidityLockTime?: number;
    _refundType?: number;
    _listingChoice?: number;
    _isWhiteListPhase?: boolean;
    _serviceFee?: string;
  }) => {
    const _tokenAmount = calculateTokenAmount(
      Number(_presalePrice || presalePrice),
      Number(_hardCap || hardCap),
      Number(_liquidityPercentage || liquidityPercentage),
      Number(_listingPrice || listingPrice)
    );
    return presaleFactory.connect(_caller || owner).createPresale(
      projectDetails,
      {
        presaleToken: presaleToken.address,
        router0: TGuildRouter.address,
        router1: _pancakeRouterAddress || TGuildRouter.address,
        listingToken: _listingToken || ZERO_ADDRESS,
        presalePrice: parseEther(_presalePrice || presalePrice),
        listingPrice: parseEther(_listingPrice || listingPrice),
        liquidityLockTime: _liquidityLockTime || liquidityLockTime,
        minBuy: parseEther(_minBuy || minBuy),
        maxBuy: parseEther(_maxBuy || maxBuy),
        softCap: parseEther(_softCap || softCap),
        hardCap: parseEther(_hardCap || hardCap),
        liquidityPercentage: ((_liquidityPercentage || liquidityPercentage) * FEE_DENOMINATOR) / 100,
        startPresaleTime: _startPresaleTime || startPresaleTime,
        endPresaleTime: _endPresaleTime || endPresaleTime,
        totalBought: "0",
        refundType: _refundType || refundType,
        listingChoice: _listingChoice || listingChoice,
        isWhiteListPhase: _isWhiteListPhase || isWhiteListPhase,
        isClaimPhase: false,
        isPresaleCancelled: false,
        isWithdrawCancelledTokens: false,
      } as PresaleInfoStruct,
      {
        paymentToken: _paymentTokenAddress || ZERO_ADDRESS,
        feePaymentToken: FEE_PAYMENT_TOKEN,
        feePresaleToken: FEE_PRESALE_TOKEN,
        feeEmergencyWithdraw: FEE_EMERGENCY_WITHDRAW,
      } as PresaleFeeInfoStruct,
      parseUnits(_tokenAmount.toString(), await presaleToken.decimals()),
      {
        value: _serviceFee || serviceFee,
      }
    );
  };

  describe("owner", () => {
    it("should be owner", async () => {
      const ownerAddress = await presaleFactory.owner();
      assert.equal(ownerAddress, owner.address);
    });
  });

  describe("serviceFeeReceiver", () => {
    it("should be serviceFeeReceiver", async () => {
      const feeReceiverAddress = await presaleFactory.serviceFeeReceiver();
      assert.equal(feeReceiverAddress, serviceFeeReceiver.address);
    });
  });

  describe("setServiceFeeReceiver()", () => {
    it("should be reverted, if set with other than owner", async () => {
      await expect(presaleFactory.connect(otherWallet1).setServiceFeeReceiver(otherWallet1.address)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("should be set to otherWallet1", async () => {
      await presaleFactory.connect(owner).setServiceFeeReceiver(otherWallet1.address);

      const feeReceiverAddress = await presaleFactory.serviceFeeReceiver();
      assert.equal(feeReceiverAddress, otherWallet1.address);
    });
  });

  describe("preSaleFee", () => {
    it("should be serviceFee", async () => {
      const presaleFee = await presaleFactory.preSaleFee();
      assert.equal(presaleFee.toString(), serviceFee.toString());
    });
  });

  describe("setFee()", () => {
    it("should be reverted, if set with other than owner", async () => {
      await expect(presaleFactory.connect(otherWallet1).setFee(updatedServiceFee)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("should be able to set new service fee", async () => {
      await presaleFactory.connect(owner).setFee(updatedServiceFee);
      const presaleFee = await presaleFactory.preSaleFee();
      assert.equal(presaleFee.toString(), updatedServiceFee.toString());
    });
  });

  describe("transferOwnership()", () => {
    it("should be reverted, if set with otherWallet", async () => {
      await expect(presaleFactory.connect(otherWallet1).transferOwnership(otherWallet1.address)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
    it("should set owner to otherWallet", async () => {
      await presaleFactory.connect(owner).transferOwnership(otherWallet1.address);
      const newOwner = await presaleFactory.owner();
      assert.equal(newOwner, otherWallet1.address);
    });
  });

  describe("getAccountPresales()", () => {
    it("should be accountPresales.length == 1", async () => {
      await presaleToken.connect(owner).approve(presaleFactory.address, MAX_VALUE);
      await createPresale({});

      const accountPresales = await presaleFactory.getAccountPresales(owner.address);
      assert.equal(accountPresales.length, 1);
    });
  });

  describe("withdraw()", () => {
    it("should be reverted if non-owner try to withdraw", async () => {
      await expect(presaleFactory.connect(otherWallet1).withdraw(serviceFeeReceiver.address)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("should be able to withdraw fee by owner", async () => {
      await presaleFactory.connect(owner).setServiceFeeReceiver(presaleFactory.address);
      await presaleToken.connect(owner).approve(presaleFactory.address, MAX_VALUE);
      await createPresale({});

      const initialBalance = await provider.getBalance(serviceFeeReceiver.address);
      await presaleFactory.connect(owner).withdraw(serviceFeeReceiver.address);
      const finalBalance = await provider.getBalance(serviceFeeReceiver.address);
      assert.equal(finalBalance.sub(initialBalance).toString(), serviceFee.toString());
    });
  });

  describe("createPresale()", () => {
    beforeEach(async () => {
      await presaleToken.connect(owner).approve(presaleFactory.address, MAX_VALUE);
    });
    it("should be reverted, if not enough fee", async () => {
      await expect(
        createPresale({
          _serviceFee: BigNumber.from(serviceFee).sub("1").toString(),
        })
      ).to.be.revertedWith("Not Enough Fee");
    });

    it("should be reverted, if presale already exists", async () => {
      await createPresale({});

      await expect(createPresale({})).to.be.revertedWith("Presale Already Exists");
    });

    it("should be reverted, if presale start time less than current time", async () => {
      await expect(
        createPresale({
          _startPresaleTime: dayjs(startPresaleTime).subtract(2, "day").unix(),
        })
      ).to.be.revertedWith("Presale startTime > block.timestamp");
    });

    it("should be reverted, if presale end time less than start time", async () => {
      await expect(
        createPresale({
          _endPresaleTime: dayjs(endPresaleTime).subtract(2, "day").unix(),
        })
      ).to.be.revertedWith("Presale End time > presale start time");
    });

    it("should be reverted, if minBuy greater than maxBuy", async () => {
      await expect(
        createPresale({
          _minBuy: parseEther((Number(minBuy) + Number(maxBuy)).toString()).toString(),
        })
      ).to.be.revertedWith("MinBuy should be less than maxBuy");
    });

    it("should be reverted, if softCap less than 50% of hardCap", async () => {
      await expect(
        createPresale({
          _softCap: parseEther((Number(hardCap) * 0.4).toString()).toString(),
        })
      ).to.be.revertedWith("Softcap should be greater than or equal to 50% of hardcap");
    });

    it("should be reverted, if liquidity% less than 25%", async () => {
      await expect(
        createPresale({
          _liquidityPercentage: 24,
        })
      ).to.be.revertedWith("Liquidity Percentage should be between 25% & 100%");
    });

    it("should be able to send service fee to serviceFeeReceiver address", async () => {
      const initialBalance = await provider.getBalance(serviceFeeReceiver.address);
      await createPresale({});

      const finalBalance = await provider.getBalance(serviceFeeReceiver.address);
      const feeToServiceFeeAddress = finalBalance.sub(initialBalance).toString();
      assert.equal(feeToServiceFeeAddress, serviceFee.toString());
    });

    it("should be able to send token amount to presale contract from factory", async () => {
      const initialTokenAmount = await presaleToken.balanceOf(owner.address);

      await createPresale({});

      const finalTokenAmount = await presaleToken.balanceOf(owner.address);
      const changeTokenAmountOwner = initialTokenAmount.sub(finalTokenAmount).toString();
      const presaleAddress = (await presaleFactory.getTokenPresales(presaleToken.address))[0];
      const presaleTokenAmount = (await presaleToken.balanceOf(presaleAddress)).toString();

      assert.equal(changeTokenAmountOwner, presaleTokenAmount);
    });

    it("should be able to create presale again if last token presale cancelled", async () => {
      await createPresale({});

      const presaleAddress = (await presaleFactory.getTokenPresales(presaleToken.address))[0];
      const TGuildCustomPresale = await ethers.getContractFactory("TGuildCustomPresale");
      const tGuildCustomPresale = TGuildCustomPresale.attach(presaleAddress);
      await tGuildCustomPresale.connect(owner).cancelPresale();
      await createPresale({});

      assert.equal((await presaleFactory.getTokenPresales(presaleToken.address)).length, 2);
    });

    it("should be able to create presale with paymentToken as feeToken", async () => {
      const feeToken = (await deployContract(owner, TokenArtifact, [])) as DummyToken;
      await createPresale({
        _paymentTokenAddress: feeToken.address,
      });

      assert.equal((await presaleFactory.getTokenPresales(presaleToken.address)).length, 1);
    });
  });

  describe("getTokenPresales()", () => {
    it("should be tokenPresales.length == 1", async () => {
      await presaleToken.connect(owner).approve(presaleFactory.address, MAX_VALUE);
      await createPresale({});

      const tokenPresales = await presaleFactory.getTokenPresales(presaleToken.address);
      assert.equal(tokenPresales.length, 1);
    });
  });
});
