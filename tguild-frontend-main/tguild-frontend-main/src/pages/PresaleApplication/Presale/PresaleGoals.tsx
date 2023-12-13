import React, { useEffect, useState } from "react";
import { formatUnits } from "ethers/lib/utils";
import { LinearProgress } from "@mui/material";
import { Box, Flex } from "../../../components/Box";
import { usePresaleContract } from "../../../hooks/useContract";
import { useToken } from "../../../hooks/Tokens";
import { NULL_ADDRESS } from "../../../constants/index";
import { TOKEN_CHOICES } from "../../../constants/presale";
import { PresaleInfo, FeeInfo } from "../types";
import { StyledText, Divider } from "./Shared";
import ProgressWrapper from "../ProgressWrapper";

interface Props {
  presaleAddress: string;
  presaleInfo: PresaleInfo | undefined;
  presaleFeeInfo: FeeInfo | undefined;
}

const PresaleGoals = ({
  presaleAddress,
  presaleInfo,
  presaleFeeInfo,
}: Props) => {
  const [contributors, setContributors] = useState<string[]>([]);
  const [currency, setCurrency] = useState("BNB");

  const presaleContract = usePresaleContract(presaleAddress);
  const paymentToken = useToken(
    presaleFeeInfo?.paymentToken === NULL_ADDRESS
      ? undefined
      : presaleFeeInfo?.paymentToken
  );

  useEffect(() => {
    async function fetchContributors() {
      setContributors(await presaleContract?.getContributors());
    }
    if (presaleContract) fetchContributors();
  }, [presaleContract, presaleInfo]);

  useEffect(() => {
    const currentCurrency = Object.keys(TOKEN_CHOICES).find(
      (key) =>
        TOKEN_CHOICES[key as keyof typeof TOKEN_CHOICES] ===
        presaleFeeInfo?.paymentToken
    );
    if (presaleFeeInfo) setCurrency(currentCurrency as string);
  }, [presaleFeeInfo]);

  return (
    <>
      <StyledText color="black" fontWeight="bold" fontSize="20px">
        Presale Goals
      </StyledText>
      <Flex justifyContent="space-between" alignItems="center">
        <ProgressWrapper style={{ flexGrow: 1 }} isPresale marginRight="8px">
          <LinearProgress
            variant="determinate"
            value={presaleInfo?.totalBought
              .mul(100)
              .div(presaleInfo.hardcap)
              .toNumber()}
          />
        </ProgressWrapper>
        <StyledText
          style={{ display: "inline", width: "fit-content" }}
          fontSize="14px"
          color="black"
        >{`${formatUnits(
          presaleInfo?.hardcap || 0,
          paymentToken?.decimals || 18
        )} ${currency}`}</StyledText>
      </Flex>
      <StyledText color="black" fontSize="14px">
        <StyledText
          style={{ display: "inline-block" }}
          fontWeight="bold"
          color="linkColor"
          fontSize="14px"
        >
          {`${
            presaleInfo?.totalBought.mul(100).div(presaleInfo.hardcap) || 0
          }%`}
          &nbsp;
        </StyledText>
        {`reached (${formatUnits(
          presaleInfo?.totalBought || 0,
          paymentToken?.decimals || 18
        )} ${currency})`}
      </StyledText>
      <Flex marginTop="16px" marginBottom="4px" justifyContent="space-between">
        <StyledText fontWeight="bold" fontSize="14px" color="primary">
          Total Contributors
        </StyledText>
        <Box>
          <StyledText
            style={{ display: "inline-block" }}
            fontWeight="bold"
            fontSize="14px"
            color="primary"
            marginRight="2px"
          >
            {contributors.length}
          </StyledText>
        </Box>
      </Flex>
      <Divider />
    </>
  );
};

export default PresaleGoals;
