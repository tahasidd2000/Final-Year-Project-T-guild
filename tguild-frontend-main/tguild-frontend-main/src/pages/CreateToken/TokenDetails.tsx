import React from "react";
import { Button, Typography } from "@mui/material";
import styled from "styled-components";
import { BSC_SCAN } from "../../constants/createToken";
import { CreatedTokenDetails } from "./types";
import { AutoRow, RowFlatCenter } from "../../components/Row";

export const TokenCard = styled.div`
  margin-top: 30px;
  background: #24243e;
  border-radius: 20px;
  padding: 25px 28px;
  width: 90%;
  max-width: 1200px;
`;

const TextTokenHeading = styled(Typography)`
  font-weight: 700;
  font-size: 23px;
  font-weight: 700;
  line-height: 45px;
  width: 230px;
  min-width: 230px;
  @media (max-width: 550px) {
    font-size: 16px;
    width: 160px;
    min-width: 160px;
  }
  @media (max-width: 380px) {
    font-size: 11px;
    width: 100px;
    min-width: 100px;
  }
`;
const TextTokenValue = styled(Typography)`
  font-style: normal;
  font-weight: 700;
  font-size: 21px;
  line-height: 36px;
  overflow: hidden;
  text-overflow: ellipsis;
  @media (max-width: 550px) {
    font-size: 15px;
  }
  @media (max-width: 380px) {
    font-size: 10px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
`;

interface Props {
  tokenDetails: CreatedTokenDetails;
  setCreatedTokenDetails: React.Dispatch<
    React.SetStateAction<CreatedTokenDetails | undefined>
  >;
  setShowTokenDropdown: React.Dispatch<React.SetStateAction<boolean>>;
}

const TokenDetails = ({
  tokenDetails,
  setCreatedTokenDetails,
  setShowTokenDropdown,
}: Props) => {
  return (
    <>
      <RowFlatCenter>
        <Typography
          textAlign="center"
          mt={20}
          marginX={2}
          fontSize="35px"
          fontWeight={700}
        >
          Your token has been created!
        </Typography>
      </RowFlatCenter>
      <TokenCard>
        <AutoRow justifyContent="space-between"></AutoRow>
        <Row>
          <TextTokenHeading>Name:</TextTokenHeading>
          <TextTokenValue color="primary">{tokenDetails.name}</TextTokenValue>
        </Row>
        <Row>
          <TextTokenHeading>Symbol:</TextTokenHeading>
          <TextTokenValue color="primary">{tokenDetails.symbol}</TextTokenValue>
        </Row>
        <Row>
          <TextTokenHeading>Total Supply:</TextTokenHeading>
          <TextTokenValue color="primary">{tokenDetails.supply}</TextTokenValue>
        </Row>
        <Row>
          <TextTokenHeading>Token Address:</TextTokenHeading>
          <TextTokenValue color="primary">
            {tokenDetails.address}
          </TextTokenValue>
        </Row>
        <a
          href={`${BSC_SCAN}/tx/${tokenDetails.transactionAddress}`}
          rel="noreferrer"
          target="_blank"
        >
          <Button
            size="small"
            variant="outlined"
            color="success"
            sx={{ minWidth: "200px" }}
          >
            View Transaction
          </Button>
        </a>
      </TokenCard>
      <RowFlatCenter>
        <Button
          size="small"
          sx={{ minWidth: "200px", marginTop: "20px" }}
          onClick={() => {
            setShowTokenDropdown(true);
            setCreatedTokenDetails(undefined);
          }}
          variant="contained"
        >
          Home
        </Button>
      </RowFlatCenter>
    </>
  );
};

export default TokenDetails;
