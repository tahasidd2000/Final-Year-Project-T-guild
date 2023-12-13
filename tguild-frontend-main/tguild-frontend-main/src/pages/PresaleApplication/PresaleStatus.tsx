import React from "react";
import styled from "styled-components";
import { Box, Flex } from "../../components/Box";
import { Typography } from "@mui/material";
import { PresaleInfo } from "./types";
import { lightColors } from "../../theme/colors";

const ResonsiveFlex = styled(Flex)`
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const StatusBox = styled(Box)`
  background: ${lightColors.menuItemBackground};
  border: 1px solid ${lightColors.backgroundDisabled};
  padding: 12px 16px;
  border-radius: 5px;
`;

const TextStatusBox = styled(Typography)`
  text-align: left;
  word-wrap: break-word;
  @media (max-width: 600px) {
    font-size: 12px;
  }
  @media (max-width: 350px) {
    font-size: 9px;
    max-width: 100%;
  }
  @media (max-width: 280px) {
    max-width: 120px;
  }
`;

const CopyButtonWrapper = styled(Box)`
  @media (max-width: 380px) {
    display: none;
  }
`;
interface Props {
  presaleInfo: PresaleInfo | undefined;
  presaleAddress: string;
}

const PresaleStatus = ({ presaleInfo, presaleAddress }: Props) => {
  return (
    <StatusBox>
      <ResonsiveFlex flexWrap="wrap">
        <TextStatusBox color="textSubtle" style={{ width: "160px" }}>
          Presale Status
        </TextStatusBox>
        <TextStatusBox color={"primary"}>
          <TextStatusBox
            fontWeight="bold"
            color={"primary"}
            style={{ display: "inline" }}
          >
            {/* {(
              <CheckmarkIcon color="primary" width="15px" />
            ) : (
              "O"
            )} */}
          </TextStatusBox>
        </TextStatusBox>
      </ResonsiveFlex>
      <ResonsiveFlex flexWrap="wrap">
        <TextStatusBox color="textSubtle" style={{ width: "160px" }}>
          Presale Address
        </TextStatusBox>
        <Flex flex="wrap" alignItems="center">
          <TextStatusBox>{presaleAddress}&nbsp;</TextStatusBox>
          <CopyButtonWrapper style={{ position: "relative" }}>
            {/* <CopyButton
              color="linkColor"
              text={presaleAddress}
              tooltipMessage="Copied"
              tooltipTop={20}
              tooltipRight={-30}
              width="15px"
            /> */}
          </CopyButtonWrapper>
        </Flex>
      </ResonsiveFlex>
    </StatusBox>
  );
};

export default PresaleStatus;
