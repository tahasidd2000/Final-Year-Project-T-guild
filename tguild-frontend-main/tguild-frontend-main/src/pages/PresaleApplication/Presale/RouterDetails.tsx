import React from "react";
import { Box, Flex } from "../../../components/Box";
import { RADIO_VALUES, FEE_DECIMALS } from "../../../constants/presale";
import { PresaleInfo } from "../types";
import { darkColors } from "../../../theme/colors";
import { DetailText, StyledText, Divider, DetailTextValue } from "./Shared";

interface Props {
  presaleInfo: PresaleInfo | undefined;
}
const RouterDetails = ({ presaleInfo }: Props) => {
  const selectRouterText = () => {
    if (presaleInfo?.listingChoice === RADIO_VALUES.LISTING_SS_100) {
      return "UniSwap";
    }
    if (presaleInfo?.listingChoice === RADIO_VALUES.LISTING_PS_100) {
      return "PancakeSwap";
    }
    return "50% UniSwap & 50% PancakeSwap";
  };

  return (
    <Box>
      <StyledText
        marginBottom="2px"
        fontWeight="bold"
        color={darkColors.primaryDark}
      >
        Liquidity & Listing Details
      </StyledText>
      <Divider />
      <Flex marginTop="4px" justifyContent="space-between">
        <DetailText>Listing on</DetailText>
        <DetailTextValue>{selectRouterText()}</DetailTextValue>
      </Flex>
      <Flex marginTop="4px" justifyContent="space-between">
        <DetailText>Liquidity Percent (%)</DetailText>
        <DetailTextValue>{`${presaleInfo?.liquidity
          .mul(100)
          .div(10 ** FEE_DECIMALS)}%`}</DetailTextValue>
      </Flex>
      <Flex marginTop="4px" justifyContent="space-between">
        <DetailText>Liquidity Lockup Time</DetailText>
        <DetailTextValue>{`${presaleInfo?.liquidyLockTimeInMins.div(
          60
        )} mins after presale ends`}</DetailTextValue>
      </Flex>
    </Box>
  );
};

export default RouterDetails;
