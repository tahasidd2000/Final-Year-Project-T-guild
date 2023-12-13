import React from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import { Flex } from "../../../components/Box";
import { StyledText } from "./Shared";

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

const PresaleCancelModal = ({ open, onDismiss, presaleCancelHandler }: any) => {
  return (
    <Modal open={open} onClose={onDismiss}>
      <Box sx={style} marginBottom="20px" maxWidth="500px">
        <Typography
          fontWeight="bold"
          variant="h5"
          component="h2"
          marginBottom="4px"
        >
          Cancel Presale
        </Typography>
        <StyledText>Are you sure you want to cancel your presale?</StyledText>
        <Flex marginBottom="20px" justifyContent="end">
          <Button onClick={presaleCancelHandler}>Cancel Presale</Button>
          <Button onClick={onDismiss}>Cancel</Button>
        </Flex>
      </Box>
    </Modal>
  );
};

export default PresaleCancelModal;
