import React from "react";
import { Modal, Typography } from "@mui/material";
import { Button } from "@mui/joy";
import { Close } from "@mui/icons-material";
import { TextareaAutosize, Box as MaterialBox } from "@mui/material";
import { isAddress } from "ethers/lib/utils";
import { FieldProps, LoadingForButton } from "../types";
import { StyledText } from "./Shared";
import { darkColors, lightColors } from "../../../theme/colors";
import { RowBetween } from "../../../components/Row";

interface Props {
  open: boolean;
  isMainLoading: boolean;
  newWhitelist: FieldProps;
  isLoadingButton: LoadingForButton;
  setNewWhitelist: React.Dispatch<React.SetStateAction<FieldProps>>;
  closeModalHandler: (_: any, reason: any) => void;
  addWhitelistHandler: (addresses: string) => void;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "400px",
  boxShadow: "24",
  textAlign: "center",
  backgroundColor: "#fff",
  padding: "20px",
};

const AddWhitelistModal = ({
  open,
  isLoadingButton,
  newWhitelist,
  setNewWhitelist,
  isMainLoading,
  closeModalHandler,
  addWhitelistHandler,
}: Props) => {
  const newWhitelistChangeHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    let error = "";
    if (e.target.value) {
      if (
        !e.target.value.split(",").every((val) => {
          return isAddress(val.trim());
        })
      ) {
        error = "Not valid addresses";
      }
    }
    setNewWhitelist({
      value: e.target.value,
      error,
    });
  };

  return (
    <Modal open={open} onClose={closeModalHandler}>
      <MaterialBox sx={style}>
        <RowBetween>
          <Typography
            id="modal-modal-title"
            fontWeight="bold"
            variant="h6"
            component="h4"
            marginBottom="4px"
          >
            Add Whitelist
          </Typography>
          <Close onClick={() => closeModalHandler("", "")} />
        </RowBetween>
        <TextareaAutosize
          value={newWhitelist.value}
          style={{
            borderRadius: "5px",
            padding: "15px",
            background: darkColors.background,
            color: lightColors.text,
            width: "90%",
          }}
          minRows={3}
          maxRows={15}
          onChange={newWhitelistChangeHandler}
          placeholder="Follow this format to add addresses e.g 0x23233..,0x32323..."
        />
        <StyledText
          style={{ height: "10px", marginBottom: "8px" }}
          fontSize="12px"
          color={newWhitelist.error ? lightColors.failure : "primary"}
        >
          {newWhitelist.error
            ? newWhitelist.error
            : isMainLoading && "Adding Addresses."}
        </StyledText>
        <Button
          fullWidth
          onClick={() => addWhitelistHandler(newWhitelist.value)}
          disabled={
            newWhitelist.error !== "" ||
            isMainLoading ||
            newWhitelist.value === "" ||
            isLoadingButton.isClicked
          }
        >
          Add New Whitelist
        </Button>
      </MaterialBox>
    </Modal>
  );
};

export default AddWhitelistModal;
