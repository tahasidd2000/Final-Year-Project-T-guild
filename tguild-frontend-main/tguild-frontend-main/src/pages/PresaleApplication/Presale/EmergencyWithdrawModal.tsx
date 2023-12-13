import React from "react";
import { Button, Modal, Box as MBox } from "@mui/material";
import { Box, Flex } from "../../../components/Box";
import { StyledText } from "./Shared";

interface Props {
  open: boolean;
  onDismiss: () => void;
  withdrawHandler: () => void;
  fee: string;
}

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

const EmergencyWithdrawModal: React.FC<Props> = ({
  open,
  onDismiss,
  withdrawHandler,
  fee,
}) => {
  return (
    <Modal open={open} onClose={onDismiss}>
      <MBox sx={style}>
        <Box marginBottom="24px" maxWidth="500px">
          <StyledText fontWeight="bold">
            Are you sure you want to withdraw your contributions to this
            presale?
          </StyledText>
          <StyledText fontSize="12px" marginTop="8px" color="failure">
            NB : You will be charged {fee} for withdrawing your contribution!
          </StyledText>
        </Box>
        <Flex justifyContent="end">
          <Button
            onClick={withdrawHandler}
            size="small"
            color="error"
            variant="contained"
          >
            Withdraw Contribution
          </Button>
          <Box width="16px" />
          <Button size="small" onClick={onDismiss}>
            Cancel
          </Button>
        </Flex>
      </MBox>
    </Modal>
  );
};

export default EmergencyWithdrawModal;
