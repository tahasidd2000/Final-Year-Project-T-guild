/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { FormikProps } from "formik";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { useWeb3React } from "@web3-react/core";
import { Token } from "@koda-finance/summitswap-sdk";
import Button from "@mui/joy/Button";
import { useToken } from "../../../hooks/Tokens";
import { Typography, Radio, Input } from "@mui/material";
import { Box, Flex } from "../../../components/Box";
import { useTokenContract } from "../../../hooks/useContract";
import { RowFixed } from "../../../components/Row";
import { MAX_UINT256 } from "../../../constants/index";
import {
  TOKEN_CHOICES,
  PRESALE_FACTORY_ADDRESS,
} from "../../../constants/presale";
import { Caption } from "../Texts";
import { PresaleDetails, FieldNames } from "../types";
import { lightColors } from "../../../theme/colors";

const Wrapper = styled(Box)`
  width: 522px;
  min-width: 220px;
  padding: 15px;
  @media (max-width: 600px) {
    width: 90%;
  }
  @media (max-width: 400px) {
    width: 100%;
  }
`;
const SelectedTokenWrapper = styled(Box)`
  background: ${lightColors.menuItemBackground};
  border: 1px solid ${lightColors.inputColor};
  padding: 15px 24px;
  border-radius: 8px;
  font-size: 10px;
`;
const TextTokenDetails = styled(Typography)`
  font-size: 14px;
  @media (max-width: 350px) {
    font-size: 11px;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 0px;
  border: 1px solid ${lightColors.inputColor};
  margin: 16px 0;
  border-radius: 2px;
`;
interface Props {
  canMakeNewPresale: boolean;
  lastTokenPresales: string;
  selectedToken: Token | undefined;
  changeStepNumber: (num: number) => void;
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  setSelectedToken: React.Dispatch<React.SetStateAction<Token | undefined>>;
  formik: FormikProps<PresaleDetails>;
}
const CreationStep01 = ({
  lastTokenPresales,
  canMakeNewPresale,
  selectedToken,
  changeStepNumber,
  currency,
  setSelectedToken,
  setCurrency,
  formik,
}: Props) => {
  const { account, library } = useWeb3React();

  const [isFactoryApproved, setIsFactoryApproved] = useState<boolean>(false);
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [tokenTotalSupply, setTokenTotalSupply] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const tokenContract = useTokenContract(selectedToken?.address, true);

  const pToken = useToken(tokenAddress);
  console.log("isfactoryapproved", isFactoryApproved);
  useEffect(() => {
    if (!pToken) {
      setSelectedToken(undefined);
      setIsFactoryApproved(false);
      return;
    }
    setSelectedToken(pToken);
  }, [pToken, setSelectedToken]);

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

  useEffect(() => {
    async function checkTokenIsApproved() {
      const aprrovedAmount: BigNumber = await tokenContract?.allowance(
        account,
        PRESALE_FACTORY_ADDRESS
      );
      if (aprrovedAmount.eq(BigNumber.from(MAX_UINT256))) {
        setIsFactoryApproved(true);
      } else {
        setIsFactoryApproved(false);
      }
    }
    if (tokenContract && account && selectedToken) {
      checkTokenIsApproved();
    }
  }, [tokenContract, account, selectedToken]);

  const onApproveTokenHandler = useCallback(async () => {
    if (!tokenContract && !library && !account) {
      return;
    }
    try {
      setIsLoading(true);
      const receipt = await tokenContract?.approve(
        PRESALE_FACTORY_ADDRESS,
        MAX_UINT256
      );
      await library.waitForTransaction(receipt.hash);
      setIsLoading(false);
      setIsFactoryApproved(true);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setIsFactoryApproved(false);
    }
  }, [tokenContract, library, account]);

  const handleCurrencyChange = (e: any) => {
    setCurrency(e.target.id);
    formik.handleChange(e);
  };

  return (
    <Wrapper>
      <Typography marginBottom="8px" fontWeight={700}>
        Select Token Address
      </Typography>
      <Flex flexDirection="column">
        <Input
          sx={{ color: lightColors.textSubtle }}
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
        {tokenAddress && !selectedToken && (
          <Caption color={lightColors.failure}>
            Please enter a valid token address
          </Caption>
        )}
      </Flex>
      {selectedToken ? (
        <SelectedTokenWrapper marginLeft="2px" marginTop="16px">
          <RowFixed>
            <TextTokenDetails
              color={lightColors.textSubtle}
              style={{ width: "122px" }}
            >
              Token Name
            </TextTokenDetails>
            <TextTokenDetails>{selectedToken.name}</TextTokenDetails>
          </RowFixed>
          <RowFixed>
            <TextTokenDetails
              color={lightColors.textSubtle}
              style={{ width: "122px" }}
            >
              Symbol
            </TextTokenDetails>
            <TextTokenDetails>{selectedToken.symbol}</TextTokenDetails>
          </RowFixed>
          <RowFixed>
            <TextTokenDetails
              color={lightColors.textSubtle}
              style={{ width: "122px" }}
            >
              Decimals
            </TextTokenDetails>
            <TextTokenDetails>{selectedToken.decimals}</TextTokenDetails>
          </RowFixed>
          <RowFixed>
            <TextTokenDetails
              color={lightColors.textSubtle}
              style={{ width: "122px" }}
            >
              Total Supply
            </TextTokenDetails>
            <TextTokenDetails>{tokenTotalSupply}</TextTokenDetails>
          </RowFixed>
        </SelectedTokenWrapper>
      ) : (
        <Caption fontSize="14px" color={lightColors.textSubtle}>
          Don’t have your own token?&nbsp;
          <a href="/create-token" rel="noopener noreferrer" target="_blank">
            <Caption color="primary" style={{ textDecoration: "underline" }}>
              Create now here
            </Caption>
          </a>
        </Caption>
      )}
      <Divider />
      {canMakeNewPresale ? (
        <>
          <Box>
            <Typography marginBottom="8px" fontWeight={700}>
              Choose Currency
            </Typography>
            <Flex
              width="180px"
              flexWrap="wrap"
              justifyContent="space-between"
              onChange={handleCurrencyChange}
            >
              {Object.keys(TOKEN_CHOICES).map((key) => (
                <label key={key} htmlFor={key}>
                  <RowFixed marginBottom="5px">
                    <Radio
                      name={FieldNames.paymentToken}
                      value={TOKEN_CHOICES[key as keyof typeof TOKEN_CHOICES]}
                      id={key}
                      checked={currency === key}
                    />
                    <Typography>{key}</Typography>
                  </RowFixed>
                </label>
              ))}
            </Flex>
          </Box>
          <Caption fontSize="14px" color="textSubtle" marginBottom="20px">
            Participant will pay with&nbsp;
            <Caption fontSize="14px" color="primary" fontWeight={700}>
              {currency}&nbsp;
            </Caption>
            for your token
          </Caption>
          <Flex
            flexDirection="column"
            alignItems="start"
            justifyContent="center"
          >
            {isFactoryApproved ? (
              <>
                <Button color="primary" onClick={() => changeStepNumber(1)}>
                  Continue
                </Button>
                <RowFixed>
                  <Caption color="primary">&nbsp;Token Approved</Caption>
                </RowFixed>
              </>
            ) : (
              <Button
                disabled={!selectedToken || isLoading || isFactoryApproved}
                onClick={onApproveTokenHandler}
                loading={isLoading && !isFactoryApproved}
              >
                Approve Token
              </Button>
            )}
          </Flex>
        </>
      ) : (
        <>
          <Typography marginBottom="8px" fontWeight={700}>
            Presale Already Exist At
          </Typography>
          <Typography color="linkColor" fontSize="14px" marginBottom="8px">
            {lastTokenPresales}
          </Typography>
        </>
      )}
    </Wrapper>
  );
};

export default CreationStep01;
