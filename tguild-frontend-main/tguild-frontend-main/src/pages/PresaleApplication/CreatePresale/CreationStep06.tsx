import React, { useEffect, useState } from "react";
import { Token } from "@koda-finance/summitswap-sdk";
import { Typography } from "@mui/material";
import Button from "@mui/joy/Button";
import { Box, Flex } from "../../../components/Box";
import { formatUnits } from "ethers/lib/utils";
import { FormikProps } from "formik";
import styled from "styled-components";
import { useTokenContract } from "../../../hooks/useContract";
import { RADIO_VALUES, TOKEN_CHOICES } from "../../../constants/presale";
import { getUtcDate } from "../../../utils/presale";
import ButtonsWrapper from "./ButtonsWrapper";
import { GridContainer as Grid, GridItem1, GridItem2 } from "./GridComponents";
import { PresaleDetails, ProjectDetails } from "../types";
import { lightColors } from "../../../theme/colors";

interface Props {
  currency: string;
  isLoading: boolean;
  selectedToken: Token | undefined;
  formikPresale: FormikProps<PresaleDetails>;
  formikProject: FormikProps<ProjectDetails>;
  changeStepNumber: (num: number) => void;
}

export const GridContainer = styled(Grid)`
  grid-template-columns: 160px auto;
  @media (max-width: 600px) {
    grid-template-columns: 130px auto;
    grid-template-areas: "icon title" "input input";
    grid-column-gap: 12px;
  }
`;

export const ContainerToken = styled(GridContainer)`
  @media (max-width: 600px) {
    grid-template-columns: 60px auto;
    grid-column-gap: 12px;
  }
`;

export const ContainerInformation = styled(GridContainer)`
  grid-template-columns: 230px auto;
  @media (max-width: 600px) {
    grid-template-columns: 150px auto;
  }
  @media (max-width: 370px) {
    grid-template-columns: 110px auto;
  }
`;

export const StyledGridItem1 = styled(GridItem1)`
  align-self: end;
  @media (max-width: 600px) {
    align-self: start;
  }
`;

export const StyledImage = styled.img`
  height: 150px;
  width: 150px;
  border-radius: 8px;
  grid-area: icon;
  align-self: center;
  @media (max-width: 600px) {
    max-height: 60px;
    max-width: 60px;
  }
`;

export const Divider = styled.div`
  border-bottom: 2px solid ${lightColors.backgroundDisabled};
  width: 100%;
  max-width: 950px;
  height: 0px;
  margin-bottom: 25px;
`;
export const StyledText = styled(Typography)`
  word-wrap: break-word;
  word-break: break-word;
  text-align: left;
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

export const SectionHeading = styled(Typography)`
  font-weight: 700;
  font-size: 24px;
  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

export const TextAddressHeading = styled(StyledText)`
  min-width: 160px;
  margin-right: 24px;
  @media (max-width: 600px) {
    width: 130px;
  }
`;

export const ResponsiveFlex = styled(Flex)`
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const CreationStep06 = ({
  isLoading,
  selectedToken,
  formikPresale,
  formikProject,
  currency,
  changeStepNumber,
}: Props) => {
  const [tokenTotalSupply, setTokenTotalSupply] = useState<string>();

  const tokenContract = useTokenContract(selectedToken?.address, true);

  useEffect(() => {
    async function fetchTotalSupply() {
      setTokenTotalSupply(
        Number(
          formatUnits(
            await tokenContract?.totalSupply(),
            selectedToken?.decimals
          )
        ).toLocaleString()
      );
    }
    if (selectedToken && tokenContract) {
      fetchTotalSupply();
    }
  }, [tokenContract, selectedToken]);

  const selectRouterText = () => {
    if (
      `${formikPresale.values.listingChoice}` ===
      `${RADIO_VALUES.LISTING_SS_100}`
    ) {
      return "UniSwap";
    }
    if (
      `${formikPresale.values.listingChoice}` ===
      `${RADIO_VALUES.LISTING_PS_100}`
    ) {
      return "PancakeSwap";
    }
    return "Both";
  };

  const selectPairSymbol = () => {
    return Object.keys(TOKEN_CHOICES).find(
      (key) =>
        TOKEN_CHOICES[key as keyof typeof TOKEN_CHOICES] ===
        formikPresale.values.listingToken
    );
  };

  const handleFormSubmit = () => {
    formikPresale.handleSubmit();
    formikProject.handleSubmit();
  };

  return (
    <>
      <SectionHeading color="primary">Token Information</SectionHeading>
      <ContainerToken marginTop="16px" marginBottom="45px">
        <StyledImage src={formikProject.values.logoUrl} alt="presale-icon" />
        <StyledGridItem1>
          <ResponsiveFlex marginTop="20px">
            <TextAddressHeading>Token Address</TextAddressHeading>
            <StyledText color="sidebarActiveColor">
              {selectedToken?.address}
            </StyledText>
          </ResponsiveFlex>
        </StyledGridItem1>

        <GridItem2>
          <GridContainer>
            <StyledText>Token Name</StyledText>
            <StyledText>{selectedToken?.name}</StyledText>
          </GridContainer>
          <GridContainer>
            <StyledText>Symbols</StyledText>
            <StyledText>{selectedToken?.symbol}</StyledText>
          </GridContainer>
          <GridContainer>
            <StyledText>Decimals</StyledText>
            <StyledText>{selectedToken?.decimals}</StyledText>
          </GridContainer>
          <GridContainer>
            <StyledText>Token Supply</StyledText>
            <StyledText>{tokenTotalSupply}</StyledText>
          </GridContainer>
          <GridContainer>
            <StyledText fontWeight="bold">Presale Currency</StyledText>
            <StyledText fontWeight="bold">{currency}</StyledText>
          </GridContainer>
        </GridItem2>
      </ContainerToken>
      <Divider style={{ width: "100%" }} />
      <SectionHeading marginTop="24px" color="primary">
        Presale System
      </SectionHeading>
      <Flex justifyContent="space-between" flexWrap="wrap">
        <Box marginTop="16px" marginRight="20px">
          <Box>
            <StyledText fontWeight="bold" color={lightColors.primaryDark}>
              Presale Rate & Whitelist
            </StyledText>
            <GridContainer marginTop="4px">
              <StyledText>Presale rate</StyledText>
              <StyledText>{`${formikPresale.values.presaleRate} ${selectedToken?.symbol} / 1 ${currency}`}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Whitelist system</StyledText>
              <StyledText>
                {`${formikPresale.values.isWhitelistEnabled}` ===
                `${RADIO_VALUES.WHITELIST_ENABLED}`
                  ? "Enabled"
                  : "Disabled"}
              </StyledText>
            </GridContainer>
          </Box>
          <Box marginTop="16px">
            <StyledText fontWeight="bold" color={lightColors.primaryDark}>
              Presale Goal
            </StyledText>
            <GridContainer marginTop="4px">
              <StyledText>Softcap</StyledText>
              <StyledText>{`${formikPresale.values.softcap} ${currency}`}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Hardcap</StyledText>
              <StyledText>{`${formikPresale.values.hardcap} ${currency}`}</StyledText>
            </GridContainer>
          </Box>
          <Box marginTop="16px">
            <StyledText fontWeight="bold" color={lightColors.primaryDark}>
              Presale Purchasing & Refund
            </StyledText>
            <GridContainer marginTop="4px">
              <StyledText>Minimum Buy</StyledText>
              <StyledText>{`${formikPresale.values.minBuy} ${currency}`}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Maximum Buy</StyledText>
              <StyledText>{`${formikPresale.values.maxBuy} ${currency}`}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Refund System </StyledText>
              <StyledText>
                {`${formikPresale.values.refundType}` ===
                `${RADIO_VALUES.REFUND_TYPE_REFUND}`
                  ? "Refund"
                  : "Burn"}
              </StyledText>
            </GridContainer>
          </Box>
        </Box>

        <Box marginTop="16px" marginRight="10px">
          <Box>
            <StyledText fontWeight="bold" color={lightColors.primaryDark}>
              Liquidity & Listing
            </StyledText>
            <GridContainer marginTop="4px">
              <StyledText>Router</StyledText>
              <StyledText>{selectRouterText()}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Token Pairing</StyledText>
              <StyledText>{`${
                selectedToken?.symbol
              }-${selectPairSymbol()}`}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Router Liquidity</StyledText>
              <StyledText>{`${formikPresale.values.liquidity}%`}</StyledText>
            </GridContainer>
            <GridContainer marginTop="4px">
              <StyledText>Router Listing Rate</StyledText>
              <StyledText>{`${formikPresale.values.listingRate} ${selectedToken?.symbol} / 1 ${currency}`}</StyledText>
            </GridContainer>
          </Box>
        </Box>
      </Flex>
      <Box marginTop="16px" marginBottom="25px">
        <StyledText fontWeight="bold" color={lightColors.primaryDark}>
          Presale Start & End
        </StyledText>
        <GridContainer marginTop="4px">
          <StyledText>Start Time</StyledText>
          <StyledText>
            {getUtcDate(
              formikPresale.values.startPresaleDate || "",
              formikPresale.values.startPresaleTime || ""
            ).toUTCString()}
            {formikPresale.errors.startPresaleTime && (
              <StyledText color="failure" style={{ display: "inline" }}>
                &nbsp;({formikPresale.errors.startPresaleTime})
              </StyledText>
            )}
          </StyledText>
        </GridContainer>
        <GridContainer marginTop="4px">
          <StyledText>End Time</StyledText>
          <StyledText>
            {getUtcDate(
              formikPresale.values.endPresaleDate || "",
              formikPresale.values.endPresaleTime || ""
            ).toUTCString()}
          </StyledText>
        </GridContainer>
        <GridContainer marginTop="4px">
          <StyledText>Liquidity Lockup</StyledText>
          <StyledText>{`${formikPresale.values.liquidyLockTimeInMins} minutes`}</StyledText>
        </GridContainer>
      </Box>
      <Divider style={{ width: "100%" }} />
      <SectionHeading marginTop="24px" color="primary">
        Additional Information
      </SectionHeading>
      <Box>
        <Box marginTop="16px">
          <StyledText fontWeight="bold" color={lightColors.primaryDark}>
            Project Presale Details
          </StyledText>
          <ContainerInformation marginTop="4px">
            <StyledText>Project Name</StyledText>
            <StyledText>{formikProject.values.projectName}</StyledText>
          </ContainerInformation>
          <ContainerInformation marginTop="4px">
            <StyledText>Website URL</StyledText>
            <StyledText color="linkColor">
              {formikProject.values.websiteUrl || ""}
            </StyledText>
          </ContainerInformation>
          <ContainerInformation marginTop="4px">
            <StyledText>Telegram ID</StyledText>
            <StyledText>{formikProject.values.telegramId || "-"}</StyledText>
          </ContainerInformation>
          <ContainerInformation marginTop="4px">
            <StyledText>Discord ID</StyledText>
            <StyledText>{formikProject.values.discordId || "-"}</StyledText>
          </ContainerInformation>
          <ContainerInformation marginTop="4px">
            <StyledText>Twitter ID</StyledText>
            <StyledText>{formikProject.values.twitterId || "-"}</StyledText>
          </ContainerInformation>
          <ContainerInformation marginTop="4px">
            <StyledText>E-mail</StyledText>
            <StyledText>{formikProject.values.email || "-"}</StyledText>
          </ContainerInformation>
        </Box>
      </Box>
      <ButtonsWrapper>
        <Button onClick={() => changeStepNumber(4)}>Previous Step</Button>
        {formikPresale.errors.tokenAmount ? (
          <Typography fontWeight="bold" marginY="20px" color="failure">
            {formikPresale.errors.tokenAmount}
          </Typography>
        ) : (
          <Typography fontWeight="bold" marginY="20px" color="success">
            {formikPresale.values.tokenAmount
              ? `${formikPresale.values.tokenAmount.toFixed(2)} Presale Tokens`
              : ""}
          </Typography>
        )}
        <Button
          disabled={
            !selectedToken ||
            isLoading ||
            !formikPresale.isValid ||
            !formikPresale.isValid ||
            !formikProject.touched.projectName
          }
          loading={isLoading}
          type="button"
          onClick={handleFormSubmit}
        >
          Create
        </Button>
      </ButtonsWrapper>
    </>
  );
};

export default CreationStep06;
