/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from "react";
import { Button, Typography, Radio } from "@mui/material";
import {
  AssignmentReturned,
  CurrencyExchange,
  Token as TokenIcon,
  ShoppingCartCheckout,
} from "@mui/icons-material";
import { Box, Flex } from "../../../components/Box";
import { Token } from "@koda-finance/summitswap-sdk";
import { FormikProps } from "formik";
import { TOKEN_CHOICES, RADIO_VALUES } from "../../../constants/presale";
import { RowFixed } from "../../../components/Row";
import {
  ItemIconCard,
  IconBox,
  GridContainer,
  GridItem1,
  GridItem2,
} from "./GridComponents";
import StyledInput, { StyledInputWrapper } from "./StyledInput";
import ButtonsWrapper from "./ButtonsWrapper";
import { Caption, Heading } from "../Texts";
import { PresaleDetails, FieldNames } from "../types";
import { lightColors } from "../../../theme/colors";

interface Props {
  currency: string;
  selectedToken: Token | undefined;
  formik: FormikProps<PresaleDetails>;
  changeStepNumber: (num: number) => void;
}

const CreationStep03 = ({
  currency,
  selectedToken,
  formik,
  changeStepNumber,
}: Props) => {
  const [isStepValid, setIsStepValid] = useState(false);
  useEffect(() => {
    if (
      !formik.errors.liquidity &&
      !formik.errors.listingRate &&
      !formik.errors.tokenAmount
    ) {
      setIsStepValid(true);
    } else {
      setIsStepValid(false);
    }
  }, [formik]);

  return (
    <>
      <Flex flexWrap="wrap" justifyContent="space-between">
        <GridContainer marginBottom="40px">
          <ItemIconCard>
            <IconBox width="56px">
              <AssignmentReturned fontSize="large" />
            </IconBox>
          </ItemIconCard>
          <Box marginTop="8px">
            <Heading color="primary">Refund System</Heading>
            <Box marginTop="8px" onChange={formik.handleChange}>
              <RowFixed>
                <Box>
                  <Radio
                    id={`${FieldNames.refundType}-${RADIO_VALUES.REFUND_TYPE_REFUND}`}
                    name={FieldNames.refundType}
                    value={RADIO_VALUES.REFUND_TYPE_REFUND}
                    checked={
                      Number(formik.values.refundType) ===
                      RADIO_VALUES.REFUND_TYPE_REFUND
                    }
                  />
                </Box>
                <Box>
                  <label
                    htmlFor={`${FieldNames.refundType}-${RADIO_VALUES.REFUND_TYPE_REFUND}`}
                  >
                    <Typography
                      color={
                        Number(formik.values.refundType) ===
                        RADIO_VALUES.REFUND_TYPE_REFUND
                          ? "primary"
                          : ""
                      }
                    >
                      Refund
                    </Typography>
                  </label>
                  <Caption marginRight="8px" color="textDisabled">
                    Refund remaining presale Token after finalizing
                  </Caption>
                </Box>
              </RowFixed>
              <RowFixed>
                <Box>
                  <Radio
                    id={`${FieldNames.refundType}-${RADIO_VALUES.REFUND_TYPE_BURN}`}
                    name={FieldNames.refundType}
                    value={RADIO_VALUES.REFUND_TYPE_BURN}
                    checked={
                      Number(formik.values.refundType) ===
                      RADIO_VALUES.REFUND_TYPE_BURN
                    }
                  />
                </Box>
                <Box>
                  <label
                    htmlFor={`${FieldNames.refundType}-${RADIO_VALUES.REFUND_TYPE_BURN}`}
                  >
                    <Typography
                      color={
                        Number(formik.values.refundType) ===
                        RADIO_VALUES.REFUND_TYPE_BURN
                          ? "primary"
                          : ""
                      }
                    >
                      Burn
                    </Typography>
                  </label>
                  <Caption marginRight="8px" color="textDisabled">
                    Burn remaining presale Token after finalizing
                  </Caption>
                </Box>
              </RowFixed>
            </Box>
          </Box>
        </GridContainer>
        <GridContainer marginBottom="40px">
          <ItemIconCard>
            <IconBox width="56px">
              <CurrencyExchange width="100%" fontSize="large" />
            </IconBox>
          </ItemIconCard>
          <Box marginTop="8px">
            <Heading color="primary">Choose Router</Heading>
            <Typography fontSize="14px" marginTop="4px">
              To determine Liquidity & Listing Rate
            </Typography>
            <Box marginTop="8px" onChange={formik.handleChange}>
              <RowFixed>
                <Box>
                  <Radio
                    id={`${FieldNames.listingChoice}-${RADIO_VALUES.LISTING_SS_100}`}
                    name={FieldNames.listingChoice}
                    value={RADIO_VALUES.LISTING_SS_100}
                    checked={
                      Number(formik.values.listingChoice) ===
                      RADIO_VALUES.LISTING_SS_100
                    }
                  />
                </Box>
                <label
                  htmlFor={`${FieldNames.listingChoice}-${RADIO_VALUES.LISTING_SS_100}`}
                >
                  <Typography
                    color={
                      Number(formik.values.listingChoice) ===
                      RADIO_VALUES.LISTING_SS_100
                        ? "primary"
                        : ""
                    }
                  >
                    UniSwap (SS)
                  </Typography>
                </label>
              </RowFixed>
              <RowFixed>
                <Box>
                  <Radio
                    id={`${FieldNames.listingChoice}-${RADIO_VALUES.LISTING_PS_100}`}
                    name={FieldNames.listingChoice}
                    value={RADIO_VALUES.LISTING_PS_100}
                    checked={
                      Number(formik.values.listingChoice) ===
                      RADIO_VALUES.LISTING_PS_100
                    }
                  />
                </Box>
                <label
                  htmlFor={`${FieldNames.listingChoice}-${RADIO_VALUES.LISTING_PS_100}`}
                >
                  <Typography
                    color={
                      Number(formik.values.listingChoice) ===
                      RADIO_VALUES.LISTING_PS_100
                        ? "primary"
                        : ""
                    }
                  >
                    PancakeSwap (PS)
                  </Typography>
                </label>
              </RowFixed>
              <RowFixed>
                <Box>
                  <Radio
                    id={`${FieldNames.listingChoice}-${RADIO_VALUES.LISTING_SS75_PK25}`}
                    name={FieldNames.listingChoice}
                    value={RADIO_VALUES.LISTING_SS75_PK25}
                    checked={
                      Number(formik.values.listingChoice) ===
                      RADIO_VALUES.LISTING_SS75_PK25
                    }
                  />
                </Box>
                <Box>
                  <label
                    htmlFor={`${FieldNames.listingChoice}-${RADIO_VALUES.LISTING_SS75_PK25}`}
                  >
                    <Typography
                      color={
                        Number(formik.values.listingChoice) ===
                        RADIO_VALUES.LISTING_SS75_PK25
                          ? "primary"
                          : ""
                      }
                    >
                      Both
                    </Typography>
                  </label>
                  <Caption>This will be listed to 50% SS and 50% PS</Caption>
                </Box>
              </RowFixed>
            </Box>
          </Box>
        </GridContainer>
      </Flex>

      <GridContainer>
        <ItemIconCard>
          <IconBox>
            <ShoppingCartCheckout fontSize="large" />
          </IconBox>
        </ItemIconCard>
        <GridItem1>
          <Heading color="primary">Liquidity & Listing Rate</Heading>
          <Typography fontSize="14px" marginTop="4px">
            Percentage of raised funds that should be allocated to Liquidity on
            chosen router
          </Typography>
        </GridItem1>
        <GridItem2>
          <Flex flexWrap="wrap">
            <StyledInputWrapper marginRight="16px">
              <Typography fontSize="14px" marginTop="8px">
                Router Liquidity
              </Typography>
              <StyledInput
                placeholder="Ex: 50%"
                value={formik.values.liquidity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.liquidity}
                id={FieldNames.liquidity}
                type="number"
              />
              <Caption
                color={
                  formik.touched.liquidity && !!formik.errors.liquidity
                    ? lightColors.failure
                    : "primary"
                }
              >
                {formik.touched.liquidity && formik.errors.liquidity
                  ? formik.errors.liquidity
                  : "Enter the percentage with min. of 25% and max. of 100%"}
              </Caption>
            </StyledInputWrapper>
            <StyledInputWrapper>
              <Typography fontSize="14px" marginTop="8px">
                Router Listing Rate
              </Typography>
              <StyledInput
                placeholder="Ex: 1100"
                value={formik.values.listingRate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.listingRate}
                id={FieldNames.listingRate}
                type="number"
              />
              <Caption
                color={
                  formik.touched.listingRate && !!formik.errors.listingRate
                    ? lightColors.failure
                    : "primary"
                }
              >
                {formik.touched.listingRate && formik.errors.listingRate
                  ? formik.errors.listingRate
                  : `If I spend 1 ${currency} on Chosen Router, how many tokens will I receive? (1 ${currency} = ${
                      formik.values.listingRate || "0"
                    } ${selectedToken?.symbol})`}
              </Caption>
            </StyledInputWrapper>
          </Flex>
        </GridItem2>
      </GridContainer>

      <GridContainer marginTop="40px">
        <ItemIconCard>
          <TokenIcon fontSize="large" />
        </ItemIconCard>
        <Box>
          <Heading color="primary">Router Token Pairing</Heading>
          <Typography fontSize="14px" marginTop="4px">
            Choose Router Token Pairing
          </Typography>
          <Flex
            marginTop="8px"
            maxWidth="180px"
            flexWrap="wrap"
            justifyContent="space-between"
            onChange={formik.handleChange}
          >
            {Object.keys(TOKEN_CHOICES).map((key) => (
              <RowFixed marginRight="4px" key={key}>
                <Box>
                  <Radio
                    id={`${FieldNames.listingToken}-${key}`}
                    name={FieldNames.listingToken}
                    value={TOKEN_CHOICES[key as keyof typeof TOKEN_CHOICES]}
                    checked={
                      formik.values.listingToken ===
                      TOKEN_CHOICES[key as keyof typeof TOKEN_CHOICES]
                    }
                  />
                </Box>
                <label htmlFor={`${FieldNames.listingToken}-${key}`}>
                  <Typography
                    color={
                      formik.values.listingToken ===
                      TOKEN_CHOICES[key as keyof typeof TOKEN_CHOICES]
                        ? "primary"
                        : ""
                    }
                  >
                    {key}
                  </Typography>
                </label>
              </RowFixed>
            ))}
          </Flex>
          <Caption color="textDisabled">
            You will have the pair of&nbsp;
            <Caption fontWeight="bold" color="primary">
              {selectedToken?.symbol}-
              {Object.keys(TOKEN_CHOICES).find(
                (key) =>
                  TOKEN_CHOICES[key as keyof typeof TOKEN_CHOICES] ===
                  formik.values.listingToken
              )}
              &nbsp;
            </Caption>
            in
            <Caption fontWeight="bold" color="primary">
              &nbsp;UniSwap
            </Caption>
          </Caption>
        </Box>
      </GridContainer>

      <ButtonsWrapper>
        <Button onClick={() => changeStepNumber(1)}>Previous Step</Button>
        {formik.errors.tokenAmount ? (
          <Typography fontWeight="bold" marginY="20px" color="failure">
            {formik.errors.tokenAmount}
          </Typography>
        ) : (
          <Typography fontWeight="bold" marginY="20px" color="success">
            {formik.values.tokenAmount
              ? `${formik.values.tokenAmount.toFixed(2)} Presale Tokens`
              : ""}
          </Typography>
        )}
        <Button
          variant="contained"
          disabled={!isStepValid}
          onClick={() => changeStepNumber(3)}
        >
          Continue
        </Button>
      </ButtonsWrapper>
    </>
  );
};

export default CreationStep03;
