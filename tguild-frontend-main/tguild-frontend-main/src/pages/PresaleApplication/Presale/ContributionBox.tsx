import React, { useState, useEffect } from "react";
import { BigNumber } from "ethers";
import styled from "styled-components";
import { formatUnits } from "ethers/lib/utils";
import { Button } from "@mui/joy";
import { Box, Flex } from "../../../components/Box";
import { checkSalePhase } from "../../../utils/presale";
import { StyledText } from "./Shared";
import {
  PresalePhases,
  PresaleInfo,
  LoadingForButton,
  LoadingButtonTypes,
} from "../types";
import { lightColors } from "../../../theme/colors";

interface Props {
  presaleInfo: PresaleInfo | undefined;
  paymentDecimals: number;
  currency: string;
  boughtAmount: BigNumber;
  tokenSymbol: string | undefined;
  isMainLoading: boolean;
  isLoadingButton: LoadingForButton;
  openWithdrawModal?: () => void;
}

const ContributionCard = styled(Box)`
  background: ${lightColors.primaryDark};
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
`;

const ContributionBox = ({
  boughtAmount,
  currency,
  tokenSymbol,
  presaleInfo,
  isMainLoading,
  paymentDecimals,
  isLoadingButton,
  openWithdrawModal,
}: Props) => {
  const [presalePhase, setPresalePhase] = useState<string>(
    PresalePhases.PresalePhase
  );
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (presaleInfo) {
      const presalePhase_ = checkSalePhase(presaleInfo);
      const timer = setTimeout(() => {
        if (presalePhase === PresalePhases.PresalePhase) {
          setCurrentTime(new Date());
          if (presalePhase_ !== presalePhase) setPresalePhase(presalePhase_);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [presaleInfo, presalePhase, currentTime]);

  return boughtAmount.gt(0) ? (
    <ContributionCard>
      <StyledText fontSize="14px" marginBottom="2px" fontWeight="bold">
        You have contributed to this presale
      </StyledText>
      <Flex justifyContent="space-between">
        <StyledText fontSize="12px">Total Contribution</StyledText>
        <StyledText fontSize="12px">{`${formatUnits(
          boughtAmount,
          paymentDecimals
        )} ${currency}`}</StyledText>
      </Flex>
      <Flex justifyContent="space-between" marginBottom="8px">
        <StyledText fontSize="12px">Token Conversion</StyledText>
        <StyledText fontSize="12px">
          {`${formatUnits(
            boughtAmount.mul(presaleInfo?.presaleRate || 0),
            18 + paymentDecimals
          )} ${tokenSymbol}`}
        </StyledText>
      </Flex>
      {presalePhase === PresalePhases.PresalePhase &&
        !presaleInfo?.hardcap.eq(presaleInfo.totalBought) && (
          <>
            <Button
              onClick={openWithdrawModal}
              disabled={isMainLoading || isLoadingButton.isClicked}
              loading={
                isLoadingButton.isClicked &&
                isLoadingButton.type === LoadingButtonTypes.EmergencyWithdraw
              }
              size="sm"
              variant="soft"
            >
              Withdraw My Contribution
            </Button>
            <StyledText fontSize="10px" marginTop="2px" color="error">
              {isLoadingButton.error}
            </StyledText>
          </>
        )}
    </ContributionCard>
  ) : (
    <></>
  );
};

export default ContributionBox;
