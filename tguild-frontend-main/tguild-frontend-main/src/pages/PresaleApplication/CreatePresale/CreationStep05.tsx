/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FormikProps } from "formik";
import { Button, Typography } from "@mui/material";
import { Image, Details, ContactSupport } from "@mui/icons-material";
import { Flex } from "../../../components/Box";
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
import { FieldNames, PresaleDetails, ProjectDetails } from "../types";
import { lightColors, darkColors } from "../../../theme/colors";

interface Props {
  formikPresale: FormikProps<PresaleDetails>;
  formikProject: FormikProps<ProjectDetails>;
  changeStepNumber: (num: number) => void;
}

const WebsiteURlInput = styled(StyledInput)`
  width: 100%;
  @media (max-width: 1296px) {
    width: 400px;
  }
  @media (max-width: 620px) {
    width: 300px;
  }
  @media (max-width: 480px) {
    width: 100%;
  }
`;

const CreationStep05 = ({
  formikPresale,
  formikProject,
  changeStepNumber,
}: Props) => {
  const [isStepValid, setIsStepValid] = useState(false);

  useEffect(() => {
    if (formikProject.isValid && formikProject.touched.projectName) {
      setIsStepValid(true);
    } else {
      setIsStepValid(false);
    }
  }, [formikProject]);

  return (
    <>
      <GridContainer>
        <ItemIconCard>
          <IconBox width="56px">
            <Image fontSize="large" />
          </IconBox>
        </ItemIconCard>
        <GridItem1>
          <Heading color="primary">Presale Logo</Heading>
          <Typography fontSize="14px" marginTop="4px">
            Add logo to be more intriguing
          </Typography>
        </GridItem1>
        <GridItem2>
          <Typography fontSize="14px" marginTop="8px">
            Enter Logo URL
          </Typography>
          <Flex flexDirection="column">
            <StyledInput
              placeholder="e.g. https://www.google.com/1234.jpg"
              value={formikProject.values.logoUrl}
              onChange={formikProject.handleChange}
              onBlur={formikProject.handleBlur}
              name={FieldNames.logoUrl}
              id={FieldNames.logoUrl}
            />
            <Caption
              color={
                formikProject.touched.logoUrl && !!formikProject.errors.logoUrl
                  ? lightColors.failure
                  : ""
              }
            >
              {formikProject.touched.logoUrl && formikProject.errors.logoUrl
                ? formikProject.errors.logoUrl
                : "The recommended logo size is 100x100"}
            </Caption>
          </Flex>
        </GridItem2>
      </GridContainer>

      <GridContainer marginTop="40px">
        <ItemIconCard>
          <IconBox width="56px">
            <Details fontSize="large" />
          </IconBox>
        </ItemIconCard>
        <GridItem1>
          <Heading color="primary">Project Presale Details</Heading>
          <Typography fontSize="14px" marginTop="4px">
            Add your contact information for easier communication
          </Typography>
        </GridItem1>
        <GridItem2>
          <Flex flexWrap="wrap">
            <StyledInputWrapper marginRight="16px">
              <Typography fontSize="14px" marginTop="8px">
                Project Name
              </Typography>
              <StyledInput
                placeholder="Enter your project presale name"
                value={formikProject.values.projectName}
                onChange={formikProject.handleChange}
                onBlur={formikProject.handleBlur}
                name={FieldNames.projectName}
                id={FieldNames.projectName}
              />
              <Caption color={lightColors.failure}>
                {formikProject.touched.projectName &&
                formikProject.errors.projectName
                  ? formikProject.errors.projectName
                  : ""}
              </Caption>
            </StyledInputWrapper>
          </Flex>
        </GridItem2>
      </GridContainer>

      <GridContainer marginTop="40px">
        <ItemIconCard>
          <IconBox width="56px">
            <ContactSupport fontSize="large" />
          </IconBox>
        </ItemIconCard>
        <GridItem1>
          <Heading color="primary">Contact Information</Heading>
          <Typography fontSize="14px" marginTop="4px">
            Add your contact information for easier communication
          </Typography>
        </GridItem1>
        <GridItem2>
          <StyledInputWrapper marginRight="16px">
            <Typography fontSize="14px" marginTop="8px">
              Website URL
            </Typography>
            <WebsiteURlInput
              placeholder="Ex: https://www.summitswap.com/"
              value={formikProject.values.websiteUrl}
              onChange={formikProject.handleChange}
              onBlur={formikProject.handleBlur}
              name={FieldNames.websiteUrl}
              id={FieldNames.websiteUrl}
            />
            <Caption color={lightColors.failure}>
              {formikProject.touched.websiteUrl &&
              formikProject.errors.websiteUrl
                ? formikProject.errors.websiteUrl
                : ""}
            </Caption>
          </StyledInputWrapper>
          <Flex flexWrap="wrap">
            <StyledInputWrapper marginRight="16px">
              <Typography fontSize="14px" marginTop="8px">
                Telegram ID (optional)
              </Typography>
              <StyledInput
                placeholder="Ex: https://telegram.me..."
                value={formikProject.values.telegramId}
                onChange={formikProject.handleChange}
                onBlur={formikProject.handleBlur}
                name={FieldNames.telegramId}
                id={FieldNames.telegramId}
              />
              <Caption color={lightColors.failure}>
                {formikProject.touched.telegramId &&
                formikProject.errors.telegramId
                  ? formikProject.errors.telegramId
                  : ""}
              </Caption>
            </StyledInputWrapper>
            <StyledInputWrapper>
              <Typography fontSize="14px" marginTop="8px">
                Discord ID (optional)
              </Typography>
              <StyledInput
                placeholder="Ex: https://discord.me..."
                value={formikProject.values.discordId}
                onChange={formikProject.handleChange}
                onBlur={formikProject.handleBlur}
                name={FieldNames.discordId}
                id={FieldNames.discordId}
              />
              <Caption color={lightColors.failure}>
                {formikProject.touched.discordId &&
                formikProject.errors.discordId
                  ? formikProject.errors.discordId
                  : ""}
              </Caption>
            </StyledInputWrapper>
          </Flex>
          <Flex flexWrap="wrap">
            <StyledInputWrapper marginRight="16px">
              <Typography fontSize="14px" marginTop="8px">
                E-mail address
              </Typography>
              <StyledInput
                placeholder="e.g. uniswap@domain.com"
                value={formikProject.values.email}
                onChange={formikProject.handleChange}
                onBlur={formikProject.handleBlur}
                name={FieldNames.email}
                id={FieldNames.email}
              />
              <Caption color={lightColors.failure}>
                {formikProject.touched.email && formikProject.errors.email
                  ? formikProject.errors.email
                  : ""}
              </Caption>
            </StyledInputWrapper>
            <StyledInputWrapper>
              <Typography fontSize="14px" marginTop="8px">
                Twitter Username
                <Typography
                  style={{ display: "inline" }}
                  fontSize="14px"
                  color={darkColors.borderColor}
                >
                  &nbsp;(optional)
                </Typography>
              </Typography>
              <StyledInput
                placeholder="Ex: https://twitter.me..."
                value={formikProject.values.twitterId}
                onChange={formikProject.handleChange}
                onBlur={formikProject.handleBlur}
                name={FieldNames.twitterId}
                id={FieldNames.twitterId}
              />
              <Caption color={lightColors.failure}>
                {formikProject.touched.twitterId &&
                formikProject.errors.twitterId
                  ? formikProject.errors.twitterId
                  : ""}
              </Caption>
            </StyledInputWrapper>
          </Flex>
        </GridItem2>
      </GridContainer>

      <ButtonsWrapper>
        <Button onClick={() => changeStepNumber(3)}>Previous Step</Button>
        {formikPresale.errors.tokenAmount ? (
          <Typography
            fontWeight="bold"
            marginY="20px"
            color={lightColors.failure}
          >
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
          variant="contained"
          disabled={!isStepValid}
          onClick={() => changeStepNumber(5)}
        >
          Continue
        </Button>
      </ButtonsWrapper>
    </>
  );
};

export default CreationStep05;
