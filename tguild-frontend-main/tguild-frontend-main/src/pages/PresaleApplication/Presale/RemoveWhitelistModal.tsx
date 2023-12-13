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

const RemoveWhitelistModal = ({
  open,
  title,
  selectedNumber,
  onDismiss,
  removeWhitelistHandler,
}: any) => {
  const isAll = title.includes("All");

  return (
    <Modal open={open} onClose={onDismiss}>
      <Box sx={style} maxWidth="500px">
        <Typography
          marginBottom="20px"
          id="modal-modal-title"
          fontWeight="bold"
          variant="h5"
          component="h2"
        >
          {title}
        </Typography>
        <StyledText>
          {isAll
            ? "Are you sure you want to remove all of the whitelist added?"
            : "Are you sure you want to remove selected whitelist added?"}
        </StyledText>
        <Flex marginTop="24px" justifyContent="end">
          <Button variant="contained" onClick={removeWhitelistHandler}>
            Remove {isAll ? "All" : `(${selectedNumber})`}
          </Button>
          <Box width="16px" />
          <Button color="error" onClick={onDismiss}>
            Cancel
          </Button>
        </Flex>
      </Box>
    </Modal>
  );
};

export default RemoveWhitelistModal;
