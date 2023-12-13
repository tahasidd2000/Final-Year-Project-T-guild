/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { BigNumber } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { Input } from "@mui/material";
import { Button } from "@mui/joy";
import { Box, Flex } from "../../../components/Box";
import {
  usePresaleContract,
  useTokenContract,
} from "../../../hooks/useContract";
import useEthBalance from "../../../hooks/wallet";
import { useToken } from "../../../hooks/Tokens";
import { fetchFeeInfo } from "../../../utils/presale";
import { NULL_ADDRESS, MAX_UINT256 } from "../../../constants/index";
import { TOKEN_CHOICES, FEE_DECIMALS } from "../../../constants/presale";
import { darkColors } from "../../../theme/colors";
import {
  PresaleInfo,
  FeeInfo,
  FieldProps,
  LoadingForButton,
  LoadingButtonTypes,
} from "../types";
import { StyledText } from "./Shared";
import { lightColors } from "../../../theme/colors";
import ConnetWalletButton from "../../../components/ConnectWalletButton/ConnectWalletButton";
import ContributionBox from "./ContributionBox";
import EmergencyWithdrawModal from "./EmergencyWithdrawModal";
import PresaleGoals from "./PresaleGoals";

interface Props {
  presaleAddress: string;
  isAccountWhitelisted: boolean;
  isMainLoading: boolean;
  setIsMainLoading: React.Dispatch<React.SetStateAction<boolean>>;
  presaleInfo: PresaleInfo | undefined;
  setPresaleInfo: React.Dispatch<React.SetStateAction<PresaleInfo | undefined>>;
}

const Card = styled(Box)`
  background: ${lightColors.binance};
  border-radius: 8px;
  padding: 20px 24px;
  margin-bottom: 16px;
  border: 1px solid ${darkColors.borderColor};
  border-radius: 8px;
`;

const BuyTokens = ({
  presaleAddress,
  presaleInfo,
  setPresaleInfo,
  isAccountWhitelisted,
  isMainLoading,
  setIsMainLoading,
}: Props) => {
  const { account, library } = useWeb3React();

  const [isLoadingButton, setIsLoadingButton] = useState<LoadingForButton>({
    type: LoadingButtonTypes.NotSelected,
    error: "",
    isClicked: false,
  });
  const [buyAmount, setBuyAmount] = useState<FieldProps>({
    value: "",
    error: "",
  });
  const [isPresaleApproved, setIsApproved] = useState(false);
  const [boughtAmount, setBoughtAmount] = useState(BigNumber.from("0"));
  const [presaleFeeInfo, setPresaleFeeInfo] = useState<FeeInfo>();
  const [paymentTokenBalance, setPaymentTokenBalance] = useState(
    BigNumber.from(0)
  );
  const [currency, setCurrency] = useState("BNB");

  const ethBalance = useEthBalance(account ? account : "");

  const [openEmergencyWithdrawModal, setOpenEmergencyWithdrawModal] =
    React.useState(false);

  const openWithdrawModal = () => setOpenEmergencyWithdrawModal(true);
  const closeModal = () => setOpenEmergencyWithdrawModal(false);

  const presaleContract = usePresaleContract(presaleAddress);
  const presaleToken = useToken(presaleInfo?.presaleToken);
  const paymentToken = useToken(
    presaleFeeInfo?.paymentToken === NULL_ADDRESS
      ? undefined
      : presaleFeeInfo?.paymentToken
  );
  const paymentTokenContract = useTokenContract(paymentToken?.address, true);

  useEffect(() => {
    if (isLoadingButton?.error !== "") {
      setTimeout(() => {
        setIsLoadingButton((prevState) => ({ ...prevState, error: "" }));
      }, 3000);
    }
  }, [isLoadingButton]);

  useEffect(() => {
    async function fetchData() {
      const feeInfo = await fetchFeeInfo(presaleContract);
      setPresaleFeeInfo({ ...feeInfo });
    }
    if (presaleContract) {
      fetchData();
    }
  }, [presaleContract]);

  useEffect(() => {
    async function fetchBoughtAmount() {
      setBoughtAmount(await presaleContract?.bought(account));
    }
    if (presaleContract && account) fetchBoughtAmount();
  }, [presaleContract, account]);

  useEffect(() => {
    async function fetchPaymentTokenBalance() {
      setPaymentTokenBalance(await paymentTokenContract?.balanceOf(account));
    }
    if (paymentTokenContract && account) fetchPaymentTokenBalance();
  }, [paymentTokenContract, account, presaleInfo]);

  useEffect(() => {
    async function fetchApproveAmount() {
      const aprrovedAmount: BigNumber = await paymentTokenContract?.allowance(
        account,
        presaleAddress
      );
      setIsApproved(
        aprrovedAmount.gte(presaleInfo?.maxBuy.sub(boughtAmount) || MAX_UINT256)
      );
    }
    if (paymentTokenContract && account && presaleInfo) fetchApproveAmount();
  }, [
    account,
    paymentTokenContract,
    presaleAddress,
    presaleInfo,
    boughtAmount,
  ]);

  useEffect(() => {
    if (presaleFeeInfo) {
      const currentCurrency = Object.keys(TOKEN_CHOICES).find(
        (key) =>
          TOKEN_CHOICES[key as keyof typeof TOKEN_CHOICES] ===
          presaleFeeInfo?.paymentToken
      );
      setCurrency(currentCurrency as string);
    }
  }, [presaleFeeInfo]);

  const approveCurrencyHandler = useCallback(async () => {
    if (!paymentTokenContract && !library && !account) {
      return;
    }
    try {
      setIsLoadingButton({
        type: LoadingButtonTypes.ApproveCurrency,
        error: "",
        isClicked: true,
      });
      setIsMainLoading(true);
      const receipt = await paymentTokenContract?.approve(
        presaleAddress,
        MAX_UINT256
      );
      await library.waitForTransaction(receipt.hash);
      setIsLoadingButton({
        type: LoadingButtonTypes.NotSelected,
        error: "",
        isClicked: false,
      });
      setIsMainLoading(false);
      setIsApproved(true);
    } catch (err) {
      console.error(err);
      setIsLoadingButton({
        type: LoadingButtonTypes.NotSelected,
        error: "",
        isClicked: false,
      });
      setIsMainLoading(false);
      setIsApproved(false);
    }
  }, [
    paymentTokenContract,
    library,
    account,
    presaleAddress,
    setIsMainLoading,
  ]);

  const disableCurrencyHandler = useCallback(async () => {
    if (!paymentTokenContract && !library && !account) {
      return;
    }
    try {
      setIsLoadingButton({
        type: LoadingButtonTypes.ApproveCurrency,
        error: "",
        isClicked: true,
      });
      setIsMainLoading(true);
      const receipt = await paymentTokenContract?.approve(presaleAddress, "0");
      await library.waitForTransaction(receipt.hash);
      setIsLoadingButton({
        type: LoadingButtonTypes.NotSelected,
        error: "",
        isClicked: false,
      });
      setIsMainLoading(false);
      setIsApproved(false);
    } catch (err) {
      console.error(err);
      setIsLoadingButton({
        type: LoadingButtonTypes.NotSelected,
        error: "",
        isClicked: false,
      });
      setIsMainLoading(false);
    }
  }, [
    paymentTokenContract,
    library,
    account,
    presaleAddress,
    setIsMainLoading,
  ]);

  const buyAmountChangeHandler = (e: any) => {
    let error = "";
    const bigAmount = parseUnits(
      e.target.value || "0",
      paymentToken?.decimals || 18
    );
    if (!bigAmount.isZero()) {
      if (bigAmount.lt(0)) {
        error = "Buy Amount should be a positive number";
      } else if (
        presaleInfo &&
        bigAmount.add(presaleInfo.totalBought).gt(presaleInfo.hardcap)
      ) {
        error = "Buy Amount should be less than hardcap";
      } else if (
        boughtAmount &&
        presaleInfo &&
        bigAmount.add(boughtAmount).gt(presaleInfo.maxBuy)
      ) {
        error = "Buy amount should be less max amount";
      } else if (presaleInfo && bigAmount.lt(presaleInfo.minBuy)) {
        error = "Buy amount should be greater min amount";
      }
    }
    setBuyAmount({ value: e.target.value, error });
  };

  const onBuyTokenHandler = async () => {
    if (
      !presaleContract ||
      !account ||
      !(
        presaleInfo &&
        (!presaleInfo.isWhitelistEnabled || isAccountWhitelisted)
      )
    ) {
      return;
    }
    const bigAmount = parseUnits(buyAmount.value, paymentToken?.decimals || 18);
    try {
      setIsMainLoading(true);
      setIsLoadingButton({
        type: LoadingButtonTypes.BuyTokens,
        error: "",
        isClicked: true,
      });
      let result;
      if (paymentToken) {
        result = await presaleContract.buyCustomCurrency(bigAmount);
      } else {
        result = await presaleContract.buy({
          value: bigAmount,
        });
      }
      await result.wait();
      setPresaleInfo((prevState) =>
        prevState
          ? {
              ...prevState,
              totalBought: prevState.totalBought.add(bigAmount),
            }
          : prevState
      );
      setBoughtAmount((prev) => prev?.add(bigAmount));
      setBuyAmount({ error: "", value: "" });
      setIsMainLoading(false);
      setIsLoadingButton({
        type: LoadingButtonTypes.NotSelected,
        error: "",
        isClicked: false,
      });
    } catch (err) {
      setIsMainLoading(false);
      setIsLoadingButton({
        type: LoadingButtonTypes.NotSelected,
        error: "",
        isClicked: false,
      });
      setBuyAmount((prevState) => ({ ...prevState, error: "Buying Failed" }));
      console.error(err);
    }
  };

  const setMaxBuyAmount = () => {
    let balance: number;
    if (presaleFeeInfo?.paymentToken === NULL_ADDRESS) {
      balance = Number(ethBalance.toFixed(10));
    } else {
      balance = Number(
        formatUnits(paymentTokenBalance, paymentToken?.decimals)
      );
    }
    const canBuyAmount = Number(
      formatUnits(
        presaleInfo?.maxBuy.sub(boughtAmount) || 0,
        paymentToken?.decimals
      )
    );
    if (balance < canBuyAmount) {
      setBuyAmount({ value: balance.toString(), error: "" });
    } else {
      setBuyAmount({ value: canBuyAmount.toString(), error: "" });
    }
  };

  const withdrawPaymentHandler = async () => {
    if (
      !presaleContract ||
      !account ||
      boughtAmount?.eq(0) ||
      presaleInfo?.isClaimPhase
    ) {
      return;
    }
    try {
      setIsLoadingButton({
        type: LoadingButtonTypes.EmergencyWithdraw,
        error: "",
        isClicked: true,
      });
      setIsMainLoading(true);
      const result = await presaleContract?.emergencyWithdrawPaymentToken();
      closeModal();
      await result.wait();
      const prevBoughtAmount = boughtAmount;
      setBoughtAmount(BigNumber.from(0));
      setPresaleInfo((prevState) =>
        prevState && prevBoughtAmount
          ? {
              ...prevState,
              totalBought: prevState.totalBought.sub(prevBoughtAmount),
            }
          : prevState
      );
      setIsLoadingButton({
        type: LoadingButtonTypes.NotSelected,
        error: "",
        isClicked: false,
      });
      setIsMainLoading(false);
    } catch (err) {
      closeModal();
      setIsMainLoading(false);
      setIsLoadingButton({
        type: LoadingButtonTypes.EmergencyWithdraw,
        error: "Withdrawal Failed.",
        isClicked: false,
      });
      console.error(err);
    }
  };

  const closeModalHandler = () => {
    closeModal();
  };

  return (
    <Box>
      <EmergencyWithdrawModal
        open={openEmergencyWithdrawModal}
        onDismiss={closeModalHandler}
        withdrawHandler={withdrawPaymentHandler}
        fee={`${formatUnits(
          boughtAmount
            .mul(presaleFeeInfo?.emergencyWithdrawFee || 0)
            .div(10 ** FEE_DECIMALS),
          paymentToken?.decimals || 18
        )} ${currency}`}
      />
      <ContributionBox
        paymentDecimals={paymentToken?.decimals || 18}
        openWithdrawModal={openWithdrawModal}
        currency={currency}
        boughtAmount={boughtAmount}
        presaleInfo={presaleInfo}
        tokenSymbol={presaleToken?.symbol}
        isMainLoading={isMainLoading}
        isLoadingButton={isLoadingButton}
      />
      <Card>
        <PresaleGoals
          presaleAddress={presaleAddress}
          presaleInfo={presaleInfo}
          presaleFeeInfo={presaleFeeInfo}
        />
        <Flex marginTop="8px" marginBottom="8px" justifyContent="space-between">
          <StyledText color="black">Join Presale</StyledText>
          <StyledText
            color="black"
            style={{ cursor: "pointer" }}
            onClick={setMaxBuyAmount}
            fontWeight="bold"
          >
            Max
          </StyledText>
        </Flex>
        <Input
          onChange={buyAmountChangeHandler}
          value={buyAmount.value}
          disabled={!(!presaleInfo?.isWhitelistEnabled || isAccountWhitelisted)}
          type="number"
          placeholder="Enter your amount"
          fullWidth
        />
        {account ? (
          <>
            {!(!presaleInfo?.isWhitelistEnabled || isAccountWhitelisted) ? (
              <>
                <Button
                  fullWidth
                  style={{ cursor: "not-allowed", marginTop: "8px" }}
                  color="danger"
                  size="sm"
                >
                  You are not in whitelist
                </Button>
              </>
            ) : (
              <>
                <StyledText
                  style={{ height: "14px" }}
                  fontSize="12px"
                  fontWeight="bold"
                  marginBottom="8px"
                  color={buyAmount.error ? "error" : ""}
                >
                  {buyAmount.error
                    ? buyAmount.error
                    : buyAmount.value &&
                      `You will recieve: ${
                        Number(buyAmount.value) *
                        Number(formatUnits(presaleInfo?.presaleRate || 0))
                      } ${presaleToken?.symbol}`}
                </StyledText>
                {!presaleFeeInfo ||
                presaleFeeInfo?.paymentToken === NULL_ADDRESS ? (
                  <Button
                    loading={
                      isLoadingButton.type === LoadingButtonTypes.BuyTokens
                    }
                    disabled={
                      isMainLoading ||
                      isLoadingButton.isClicked ||
                      !Number(buyAmount.value) ||
                      !!buyAmount.error
                    }
                    fullWidth
                    size="sm"
                    onClick={onBuyTokenHandler}
                    variant="solid"
                  >
                    Buy with {currency}
                  </Button>
                ) : isPresaleApproved ? (
                  <>
                    <Button
                      fullWidth
                      loading={
                        isLoadingButton.type === LoadingButtonTypes.BuyTokens
                      }
                      onClick={onBuyTokenHandler}
                      disabled={
                        isMainLoading ||
                        isLoadingButton.isClicked ||
                        !Number(buyAmount.value) ||
                        !!buyAmount.error
                      }
                      size="sm"
                    >
                      Buy with {currency}
                    </Button>
                    <Box marginTop="8px" />
                    <Button
                      fullWidth
                      color="danger"
                      disabled={
                        isLoadingButton.isClicked ||
                        isMainLoading ||
                        !paymentTokenContract ||
                        !account
                      }
                      onClick={disableCurrencyHandler}
                      loading={
                        isLoadingButton.type ===
                        LoadingButtonTypes.ApproveCurrency
                      }
                      size="sm"
                    >
                      Disable {currency}
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={approveCurrencyHandler}
                    loading={
                      isLoadingButton.type ===
                      LoadingButtonTypes.ApproveCurrency
                    }
                    fullWidth
                    disabled={
                      isLoadingButton.isClicked ||
                      isMainLoading ||
                      !paymentTokenContract ||
                      !account
                    }
                    size="sm"
                  >
                    Enable {currency}
                  </Button>
                )}
              </>
            )}
          </>
        ) : (
          <ConnetWalletButton />
        )}
      </Card>
    </Box>
  );
};

export default BuyTokens;
