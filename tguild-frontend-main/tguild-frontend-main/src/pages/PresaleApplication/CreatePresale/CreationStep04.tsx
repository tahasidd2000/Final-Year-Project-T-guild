/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import { HourglassTop, LockClock } from "@mui/icons-material";
import { Flex } from "../../../components/Box";
import { FormikProps } from "formik";
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
  formik: FormikProps<PresaleDetails>;
  changeStepNumber: (num: number) => void;
}

const CreationStep04 = ({ formik, changeStepNumber }: Props) => {
  const [isStepValid, setIsStepValid] = useState(false);

  useEffect(() => {
    if (
      !formik.errors.startPresaleDate &&
      !formik.errors.startPresaleTime &&
      !formik.errors.endPresaleDate &&
      !formik.errors.endPresaleTime &&
      !formik.errors.liquidyLockTimeInMins
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
          <IconBox width="56px">
            <HourglassTop fontSize="large" />
          </IconBox>
        </ItemIconCard>
        <GridItem1>
          <Heading color="primary">Start & End Time</Heading>
          <Typography fontSize="14px" marginTop="4px">
            Define start and end time for your presale
          </Typography>
        </GridItem1>
        <GridItem2>
          <Flex flexWrap="wrap">
            <StyledInputWrapper forDate marginRight="16px">
              <Typography fontSize="14px" marginTop="8px">
                Start Date
              </Typography>
              <StyledInput
                forDate
                type="date"
                value={formik.values.startPresaleDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.startPresaleDate}
              />
              <Caption
                color={
                  formik.touched.startPresaleDate &&
                  !!formik.errors.startPresaleDate
                    ? lightColors.failure
                    : "primary"
                }
              >
                {formik.touched.startPresaleDate &&
                formik.errors.startPresaleDate
                  ? formik.errors.startPresaleDate
                  : ""}
              </Caption>
            </StyledInputWrapper>
            <StyledInputWrapper forDate>
              <Typography fontSize="14px" marginTop="8px">
                Start Time
              </Typography>
              <StyledInput
                forTime
                type="time"
                defaultValue="00:00"
                value={formik.values.startPresaleTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.startPresaleTime}
              />
              <Caption color="danger">
                {formik.errors.startPresaleTime
                  ? formik.errors.startPresaleTime
                  : ""}
              </Caption>
            </StyledInputWrapper>
          </Flex>
          <Flex flexWrap="wrap">
            <StyledInputWrapper forDate marginRight="16px">
              <Typography fontSize="14px" marginTop="8px">
                End Date
              </Typography>
              <StyledInput
                forDate
                type="date"
                value={formik.values.endPresaleDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.endPresaleDate}
              />
              <Caption
                color={
                  formik.touched.endPresaleDate &&
                  !!formik.errors.endPresaleDate
                    ? lightColors.failure
                    : "primary"
                }
              >
                {formik.touched.endPresaleDate && formik.errors.endPresaleDate
                  ? formik.errors.endPresaleDate
                  : ""}
              </Caption>
            </StyledInputWrapper>
            <StyledInputWrapper forDate>
              <Typography fontSize="14px" marginTop="8px">
                End Time
              </Typography>
              <StyledInput
                forTime
                type="time"
                defaultValue="00:00"
                value={formik.values.endPresaleTime}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name={FieldNames.endPresaleTime}
              />
              <Caption color={lightColors.failure}>
                {formik.errors.endPresaleTime
                  ? formik.errors.endPresaleTime
                  : ""}
              </Caption>
            </StyledInputWrapper>
          </Flex>
        </GridItem2>
      </GridContainer>
      <GridContainer marginTop="50px">
        <ItemIconCard>
          <IconBox width="56px">
            <LockClock fontSize="large" />
          </IconBox>
        </ItemIconCard>
        <GridItem1>
          <Heading color="primary">Liquidity Lockup Time</Heading>
          <Typography fontSize="14px" marginTop="4px">
            Minimum Liquidity Lockup time should be 5 minutes
          </Typography>
        </GridItem1>
        <GridItem2>
          <Typography fontSize="14px" marginTop="8px">
            Enter Liquidity Lockup
          </Typography>
          <Flex flexDirection="column">
            <StyledInput
              placeholder="Ex: 100"
              type="number"
              value={formik.values.liquidyLockTimeInMins}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name={FieldNames.liquidyLockTimeInMins}
              id={FieldNames.liquidyLockTimeInMins}
            />
            <Caption color={lightColors.failure}>
              {formik.touched.liquidyLockTimeInMins &&
              formik.errors.liquidyLockTimeInMins
                ? formik.errors.liquidyLockTimeInMins
                : ""}
            </Caption>
          </Flex>
        </GridItem2>
      </GridContainer>

      <ButtonsWrapper>
        <Button onClick={() => changeStepNumber(2)}>Previous Step</Button>
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
          onClick={() => changeStepNumber(4)}
        >
          Continue
        </Button>
      </ButtonsWrapper>
    </>
  );
};

export default CreationStep04;
