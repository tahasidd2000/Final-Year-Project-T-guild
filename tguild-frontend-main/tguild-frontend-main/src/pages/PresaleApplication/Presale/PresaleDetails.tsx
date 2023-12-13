import React, { useEffect, useState } from "react";
import { formatUnits } from "ethers/lib/utils";
import { Box, Flex } from "../../../components/Box";
import { usePresaleContract } from "../../../hooks/useContract";
import { useToken } from "../../../hooks/Tokens";
import { fetchPresaleInfo, fetchFeeInfo } from "../../../utils/presale";
import {
  TOKEN_CHOICES,
  RADIO_VALUES,
} from "../../../constants/presale";
import { darkColors } from "../../../theme/colors";
import { PresaleInfo, FeeInfo } from "../types";
import { DetailText, StyledText, Divider, DetailTextValue } from "./Shared";

interface Props {
  presaleAddress: string;
}


const PresaleDetails = ({ presaleAddress }: Props) => {
  const [presaleInfo, setPresaleInfo] = useState<PresaleInfo>();
  const [presaleFeeInfo, setPresaleFeeInfo] = useState<FeeInfo>();
  const [currency, setCurrency] = useState("BNB");

  const presaleContract = usePresaleContract(presaleAddress);
  const presaleToken = useToken(presaleInfo?.presaleToken);

  useEffect(() => {
    async function fetchData() {
      const preInfo = await fetchPresaleInfo(presaleContract);
      const feeInfo = await fetchFeeInfo(presaleContract);
      setPresaleInfo({ ...preInfo });
      setPresaleFeeInfo({ ...feeInfo });
    }
    if (presaleContract) {
      fetchData();
    }
  }, [presaleContract]);

  useEffect(() => {
    const currentCurrency = Object.keys(TOKEN_CHOICES).find(
      (key) =>
        TOKEN_CHOICES[key as keyof typeof TOKEN_CHOICES] ===
        presaleFeeInfo?.paymentToken
    );
    setCurrency(currentCurrency as string);
  }, [presaleFeeInfo]);

  return (
    <Box>
      <StyledText
        marginBottom="2px"
        fontWeight="bold"
        color={darkColors.primaryDark}
      >
        Presale Details
      </StyledText>
      <Divider />
      <Flex marginTop="4px" justifyContent="space-between">
        <DetailText>Presale Rate</DetailText>
        <DetailTextValue>
          {`1 ${currency} = ${formatUnits(presaleInfo?.presaleRate || 0)} ${
            presaleToken?.symbol || ""
          }`}{" "}
        </DetailTextValue>
      </Flex>
      <Flex marginTop="2px" justifyContent="space-between">
        <DetailText>Listing Rate</DetailText>
        <DetailTextValue>
          {`1 ${currency} = ${formatUnits(presaleInfo?.listingRate || 0)} ${
            presaleToken?.symbol || ""
          }`}{" "}
        </DetailTextValue>
      </Flex>
      <Flex marginTop="2px" justifyContent="space-between">
        <DetailText>Unsold Tokens</DetailText>
        <DetailTextValue>
          {presaleInfo?.refundType === RADIO_VALUES.REFUND_TYPE_REFUND
            ? "Refund"
            : "BURN"}
        </DetailTextValue>
      </Flex>
    </Box>
  );
};

export default PresaleDetails;
