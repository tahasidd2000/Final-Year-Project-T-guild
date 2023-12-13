import React from "react";
import styled from "styled-components";
import { Box as MBox, Modal, Typography } from "@mui/material";
import { Box, Flex } from "../../../components/Box";
import { StyledText, Divider } from "./Shared";

const AddressWrapper = styled(Box)<{ isContributorsModal?: boolean }>`
  overflow: hidden;
  width: ${({ isContributorsModal }) =>
    isContributorsModal ? "250px" : "370px"};
  margin-right: 8px;
  word-break: break-all;
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

const ViewAddressesModal = ({
  open,
  headers,
  data,
  title,
  onDismiss,
  isContributorsModal = false,
}: any) => {
  return (
    <Modal open={open} onClose={onDismiss}>
      <MBox sx={style} marginBottom="20px" maxWidth="500px">
        <Typography
          fontWeight="bold"
          variant="h5"
          component="h2"
          marginBottom="4px"
        >
          Presale Whitelist
        </Typography>
        <Flex marginBottom="8px">
          <StyledText color="textDisabled" style={{ minWidth: "40px" }}>
            No.
          </StyledText>
          <AddressWrapper isContributorsModal>
            <StyledText color="textDisabled">Address</StyledText>
          </AddressWrapper>
          {isContributorsModal && (
            <StyledText
              style={{ minWidth: "fit-content" }}
              color="textDisabled"
            >
              Amount
            </StyledText>
          )}
        </Flex>
        <Divider />
        <Box
          marginTop="8px"
          marginBottom="24px"
          height="290px"
          maxHeight="290px"
          overflowY="auto"
        >
          {data.map((da: any, index: number) => (
            <Flex marginBottom="8px" key={da.wallet}>
              <StyledText
                fontSize="14px"
                style={{ width: "40px", flexShrink: 0 }}
              >
                {index < 9 ? `0${index + 1}` : index + 1}
              </StyledText>
              {isContributorsModal ? (
                <>
                  <AddressWrapper isContributorsModal>
                    <Flex alignItems="center">
                      <StyledText fontSize="14px" marginRight="8px">
                        {`${da.wallet.substring(0, 9)}...${da.wallet.substring(
                          da.wallet.length - 4
                        )}`}
                      </StyledText>
                      <Box
                        marginRight="16px"
                        style={{ position: "relative" }}
                      ></Box>
                    </Flex>
                  </AddressWrapper>
                  <StyledText
                    style={{ minWidth: "fit-content" }}
                    fontSize="14px"
                  >{`${da.amount} ${da.currency}`}</StyledText>
                </>
              ) : (
                <>
                  <AddressWrapper>
                    <StyledText fontSize="14px">{da.wallet}</StyledText>
                  </AddressWrapper>
                </>
              )}
            </Flex>
          ))}
        </Box>
        <Divider />
        <StyledText marginY="8px" color="textDisabled">
          Total of{" "}
          <StyledText
            fontWeight={700}
            style={{ display: "inline" }}
            color="success"
          >
            {data.length}{" "}
          </StyledText>
          {isContributorsModal ? "contributors" : "whitelist addresses"}
        </StyledText>
        <Divider />
      </MBox>
    </Modal>
  );
};

export default ViewAddressesModal;
