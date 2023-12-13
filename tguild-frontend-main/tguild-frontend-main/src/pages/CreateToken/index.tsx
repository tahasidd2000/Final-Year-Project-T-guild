import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Flex, Box } from "../../components/Box";
import {
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import {
  TokenType,
  STANDARD_TOKEN_OPTION,
  LIQUIDITY_TOKEN_OPTION
} from "../../constants/createToken";
import { lightColors } from "../../theme/colors";
import { RowFlatCenter } from "../../components/Row";
import { CreatedTokenDetails } from "./types";
import TokenDetails from "./TokenDetails";
import StandardTokenForm from "./StandardTokenForm";
import LiquidityTokenForm from "./LiquidityTokenForm";
import ConnetWalletButton from "../../components/ConnectWalletButton/ConnectWalletButton";

const CreateToken = () => {
  const { account } = useWeb3React();
  const [showTokenDropdown, setShowTokenDropdown] = useState(true);
  const [createdTokenDetails, setCreatedTokenDetails] =
    useState<CreatedTokenDetails>();

  const [tokenType, setTokenType] = useState<string>(
    STANDARD_TOKEN_OPTION.value
  );
 
  return createdTokenDetails ? (
    <TokenDetails
      tokenDetails={createdTokenDetails}
      setCreatedTokenDetails={setCreatedTokenDetails}
      setShowTokenDropdown={setShowTokenDropdown}
    />
  ) : (
    <>
      {!account && (
        <>
          <Flex mb={3} mt={40} justifyContent="center">
            <ConnetWalletButton />
          </Flex>
        </>
      )}
      {account && (
        <Box mb={3} mt={50}>
          <RowFlatCenter>
            <Typography
              textAlign="center"
              mb={6}
              marginX={2}
              fontSize="35px"
              fontWeight={700}
            >
              Create Your Token
            </Typography>
          </RowFlatCenter>
          {showTokenDropdown && (
            <FormControl fullWidth>
              <InputLabel
                sx={{ color: lightColors.textSubtle }}
                id="token-type-option-label"
              >
                Token Type
              </InputLabel>
              <Select
                sx={{ color: lightColors.textSubtle }}
                labelId="token-type-option-label"
                id="token-type-option"
                value={tokenType}
                label="Token Type"
                onChange={(e: any) => setTokenType(e.target.value as string)}
                size="medium"
                fullWidth
              >
                <MenuItem value={STANDARD_TOKEN_OPTION.value}>
                  {STANDARD_TOKEN_OPTION.label}
                </MenuItem>
                <MenuItem value={LIQUIDITY_TOKEN_OPTION.value}>
                  {LIQUIDITY_TOKEN_OPTION.label}
                </MenuItem>
              </Select>
            </FormControl>
          )}
          {tokenType === TokenType.Standard && (
            <StandardTokenForm
              setCreatedTokenDetails={setCreatedTokenDetails}
              setShowTokenDropdown={setShowTokenDropdown}
            />
          )}
          {tokenType === TokenType.Liquidity && (
            <LiquidityTokenForm
              setCreatedTokenDetails={setCreatedTokenDetails}
              setShowTokenDropdown={setShowTokenDropdown}
            />
          )}
        </Box>
      )}
    </>
  );
};
export default CreateToken;
