/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from "react";
import { Button, Typography, Radio } from "@mui/material";
import {
  CurrencyBitcoin,
  Checklist,
  People,
  PriceCheck,
} from "@mui/icons-material";
import { Box, Flex } from "../../../components/Box";
import { Token } from "@koda-finance/summitswap-sdk";
import { FormikProps } from "formik";
import { RowFixed } from "../../../components/Row";
import { RADIO_VALUES } from "../../../constants/presale";
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
  selectedToken: Token | undefined;
  formik: FormikProps<PresaleDetails>;
  changeStepNumber: (num: number) => void;
  currency: string;
}

const CreationStep02 = ({
  formik,
  changeStepNumber,
  currency,
  selectedToken,
}: Props) => {
  const [isStepValid, setIsStepValid] = useState(false);

  useEffect(() => {
    if (
      !formik.errors.presaleRate &&
      !formik.errors.softcap &&
      !formik.errors.hardcap &&
      !formik.errors.minBuy &&
      !formik.errors.maxBuy &&
      formik.touched.presaleRate
    ) {
      setIsStepValid(true);
    } else {
      setIsStepValid(false);
    }
  }, [formik]);

  return (
    <>
      <GridContainer>
        <ItemIconCard>
          <IconBox>
            <CurrencyBitcoin fontSize="large" />
          </IconBox>
        </ItemIconCard>
        <GridItem1>
          <Heading color="primary">Presale Rate</Heading>
          <Typography fontSize="14px" marginTop="4px">
            Set your token price in {currency}
          </Typography>
        </GridItem1>
        <GridItem2>
          <Typography fontSize="14px" marginTop="8px">
            Presale Rate
          </Typography>
          <Flex flexDirection="column">
            <StyledInput
              placeholder="Ex: 100"
              value={formik.values.presaleRate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name={FieldNames.presaleRate}
              id={FieldNames.presaleRate}
              type="number"
            />
            <Caption
              color={
                formik.touched.presaleRate && !!formik.errors.presaleRate
                  ? lightColors.failure
                  : "primary"
              }
            >
              {formik.touched.presaleRate && formik.errors.presaleRate
                ? formik.errors.presaleRate
                : `If I spend 1 ${currency}, how many ${selectedToken?.symbol} tokens will I receive?`}
            </Caption>
          </Flex>
        </GridItem2>
      </GridContainer>
      <GridContainer marginTop="40px">
        <ItemIconCard>
          <IconBox>
            <People fontSize="large" />
          </IconBox>
        </ItemIconCard>
        <Box marginTop="8px" style={{ gridArea: "title" }}>
          <Heading color="primary">Whitelist System</Heading>
          <Typography fontSize="14px" marginTop="4px">
            Whitelist system is where you only permit certain users to
            participate in your presale
          </Typography>
          <Box marginTop="12px" onChange={formik.handleChange}>
            <RowFixed>
              <Radio
                id="whitelist-enable"
                name={FieldNames.isWhitelistEnabled}
                value={`${RADIO_VALUES.WHITELIST_ENABLED}`}
                checked={
                  `${formik.values.isWhitelistEnabled}` ===
                  `${RADIO_VALUES.WHITELIST_ENABLED}`
                }
              />
              <label htmlFor="whitelist-enable">
                <Typography
                  color={
                    `${formik.values.isWhitelistEnabled}` ===
                    `${RADIO_VALUES.WHITELIST_ENABLED}`
                      ? "primary"
                      : ""
                  }
                >
                  Enable
                </Typography>
              </label>
            </RowFixed>
            <RowFixed>
              <Radio
                id="whitelist-disable"
                name={FieldNames.isWhitelistEnabled}
                value={`${RADIO_VALUES.WHITELIST_DISABLED}`}
                checked={
                  `${formik.values.isWhitelistEnabled}` ===
                  `${RADIO_VALUES.WHITELIST_DISABLED}`
                }
              />
              <label htmlFor="whitelist-disable">
                <Typography
                  color={
                    `${formik.values.isWhitelistEnabled}` ===
                    `${RADIO_VALUES.WHITELIST_DISABLED}`
                      ? "primary"
                      : ""
                  }
                >
                  Disable
                </Typography>
              </label>
            </RowFixed>
          </Box>
        </Box>
      </GridContainer>
      <GridContainer marginTop="40px">
        <ItemIconCard>
          <IconBox>
            <Checklist fontSize="large" />
          </IconBox>
        </ItemIconCard>
        <GridItem1>
          <Heading color="primary">Goal System</Heading>
          <Typography fontSize="14px" marginTop="4px">
            Set your softcap and hardcap for this presale
          </Typography>
        </GridItem1>
        <GridItem2>
          <Flex flexWrap="wrap">
            <StyledInputWrapper marginRight="16px">
              <Typography fontSize="14px" marginTop="8px">
                Softcap ({currency})
              </Typography>
              <StyledInput
                placeholder="Ex: 7.5"
                value={formik.values.softcap}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.softcap}
                id={FieldNames.softcap}
                type="number"
              />
              <Caption
                color={
                  formik.touched.softcap && !!formik.errors.softcap
                    ? lightColors.failure
                    : "primary"
                }
              >
                {formik.touched.softcap && formik.errors.softcap
                  ? formik.errors.softcap
                  : "Softcap must be less or equal to 50% of Hardcap!"}
              </Caption>
            </StyledInputWrapper>
            <StyledInputWrapper>
              <Typography fontSize="14px" marginTop="8px">
                Hardcap ({currency})
              </Typography>
              <StyledInput
                placeholder="Ex: 10"
                value={formik.values.hardcap}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.hardcap}
                id={FieldNames.hardcap}
                type="number"
              />
              <Caption color={lightColors.failure}>
                {formik.touched.hardcap && formik.errors.hardcap
                  ? formik.errors.hardcap
                  : ""}
              </Caption>
            </StyledInputWrapper>
          </Flex>
        </GridItem2>
      </GridContainer>
      <GridContainer marginTop="40px">
        <ItemIconCard>
          <IconBox>
            <PriceCheck fontSize="large" />
          </IconBox>
        </ItemIconCard>
        <GridItem1>
          <Heading color="primary">Purchasing System</Heading>
          <Typography fontSize="14px" marginTop="4px">
            Each user will only be able to buy the coin with minimum and maximum
            price as specified
          </Typography>
        </GridItem1>
        <GridItem2>
          <Flex flexWrap="wrap">
            <StyledInputWrapper marginRight="16px">
              <Typography fontSize="14px" marginTop="8px">
                Minimum Buy ({currency})
              </Typography>
              <StyledInput
                placeholder="Ex: 0.5"
                value={formik.values.minBuy}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.minBuy}
                id={FieldNames.minBuy}
                type="number"
              />
              <Caption
                color={
                  formik.touched.minBuy && !!formik.errors.minBuy
                    ? lightColors.failure
                    : "primary"
                }
              >
                {formik.touched.minBuy && formik.errors.minBuy
                  ? formik.errors.minBuy
                  : "Maximum Buy must be less or equal to Hardcap!"}
              </Caption>
            </StyledInputWrapper>
            <StyledInputWrapper>
              <Typography fontSize="14px" marginTop="8px">
                Maximum Buy ({currency})
              </Typography>
              <StyledInput
                placeholder="Ex: 6"
                value={formik.values.maxBuy}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.maxBuy}
                id={FieldNames.maxBuy}
                type="number"
              />
              <Caption color={lightColors.failure}>
                {formik.touched.maxBuy && formik.errors.maxBuy
                  ? formik.errors.maxBuy
                  : ""}
              </Caption>
            </StyledInputWrapper>
          </Flex>
        </GridItem2>
      </GridContainer>
      <ButtonsWrapper>
        <Button onClick={() => changeStepNumber(0)}>Previous Step</Button>
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
          onClick={() => changeStepNumber(2)}
        >
          Continue
        </Button>
      </ButtonsWrapper>
    </>
  );
};

export default CreationStep02;
