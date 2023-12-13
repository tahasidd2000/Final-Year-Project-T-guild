import React, { useMemo } from "react";
import styled from "styled-components";
import { formatUnits } from "ethers/lib/utils";
import { FEE_DECIMALS } from "../../../constants/presale";
import { Box as MBox, Button, Modal, Typography } from "@mui/material";
import { Flex } from "../../../components/Box";
import { StyledText, Divider as SDivider } from "./Shared";
import { lightColors } from "../../../theme/colors";

const Divider = styled.div`
  height: 7px;
  width: 96px;
  background: ${lightColors.primaryDark};
  margin: 16px 0;
`;

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const FinalizePresaleModal = ({
  open,
  onDismiss,
  presaleInfo,
  currency,
  projectName,
  presaleToken,
  presaleAddress,
  presaleFeeInfo,
  presaleFinalizeHandler,
}: any) => {
  const feePresaleToken: string = useMemo(() => {
    if (presaleInfo && presaleFeeInfo) {
      return presaleInfo.totalBought
        .mul(presaleFeeInfo.feePresaleToken)
        .div(10 ** FEE_DECIMALS)
        .mul(presaleInfo.presaleRate);
    }
    return "";
  }, [presaleInfo, presaleFeeInfo]);

  const feeBnbToken: string = useMemo(() => {
    if (presaleInfo && presaleFeeInfo) {
      return presaleInfo.totalBought
        .mul(presaleFeeInfo.feePaymentToken)
        .div(10 ** FEE_DECIMALS);
    }
    return "";
  }, [presaleInfo, presaleFeeInfo]);
  console.log("presaleINfo", presaleInfo);
  return (
    <Modal open={open} onClose={onDismiss}>
      <MBox sx={style} marginBottom="20px" maxWidth="500px">
        <Typography
          fontWeight="bold"
          variant="h5"
          component="h2"
          marginBottom="4px"
        >
          Finalize Presale
        </Typography>
        <StyledText>
          You are about to finalize
          <StyledText fontWeight={700} style={{ display: "inline" }}>
            &nbsp;{projectName}&nbsp;
          </StyledText>
          presale. You will be charged some fees to finalize this presale
        </StyledText>
        <Divider />
        <StyledText fontWeight={700}>{projectName}</StyledText>
        <Flex marginTop="8px">
          <StyledText fontSize="14px" style={{ width: "170px" }}>
            Presale Address
          </StyledText>
          <StyledText fontSize="14px">
            {`${presaleAddress.substr(0, 10)}...${presaleAddress.substr(
              presaleAddress.length - 9,
              presaleAddress.length
            )}`}
          </StyledText>
        </Flex>
        <Flex marginTop="4px">
          <StyledText fontSize="14px" style={{ width: "170px" }}>
            Presale Token
          </StyledText>
          <StyledText fontSize="14px">{`${presaleToken?.name} (${presaleToken?.symbol})`}</StyledText>
        </Flex>
        <Flex marginTop="4px">
          <StyledText fontSize="14px" style={{ width: "170px" }}>
            Funds Collected
          </StyledText>
          <StyledText fontSize="14px">
            {presaleInfo
              ? `${formatUnits(
                  presaleInfo?.totalBought,
                  presaleToken?.decimals
                )}  ${currency} / ${formatUnits(
                  presaleInfo?.hardcap,
                  presaleToken?.decimals
                )}  ${currency}`
              : ""}
          </StyledText>
        </Flex>
        <Flex marginTop="4px">
          <StyledText
            fontSize="14px"
            color="failure"
            style={{ width: "170px" }}
          >
            Payment Token Fee
          </StyledText>
          <StyledText color="failure" fontSize="14px">
            {`${formatUnits(feeBnbToken, presaleToken?.decimals)}  ${currency}`}
          </StyledText>
        </Flex>
        <Flex marginTop="4px" marginBottom="8px">
          <StyledText
            fontSize="14px"
            color="failure"
            style={{ width: "170px" }}
          >
            Presale Token Fee
          </StyledText>
          <StyledText color="failure" fontSize="14px">
            {`${formatUnits(
              feePresaleToken,
              (presaleToken?.decimals || 18) + 18
            )}  ${presaleToken?.symbol}`}
          </StyledText>
        </Flex>
        <SDivider />
        <Flex marginTop="4px" marginBottom="16px">
          <StyledText
            color="primary"
            fontWeight={700}
            style={{ width: "170px" }}
          >
            Total Funds Raised
          </StyledText>
          <StyledText color="primary" fontWeight={700}>
            {presaleInfo
              ? `${formatUnits(
                  presaleInfo?.totalBought.sub(feeBnbToken),
                  presaleToken?.decimals
                )}  ${currency}`
              : ""}
          </StyledText>
        </Flex>
        <Button onClick={presaleFinalizeHandler} fullWidth>
          Finalize Presale
        </Button>
        <Flex justifyContent="center">
          <StyledText fontSize="12px" color="warning" marginTop="8px">
            To Finalize presale, you have to exclude token transfer fee for
            presale contract.
          </StyledText>
        </Flex>
      </MBox>
    </Modal>
  );
};

export default FinalizePresaleModal;
