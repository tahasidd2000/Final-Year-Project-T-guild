import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import WalletCard from "./WalletCard";
import Typography from "@mui/material/Typography";
import config from "./config";
import { Login } from "./types";

interface Props {
  login: Login;
  open: boolean;
  onDismiss: () => void;
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

const ConnectModal: React.FC<Props> = ({ login, open, onDismiss }) => {
  const walletsToShow = config;
  return (
    <Modal
      open={open}
      onClose={onDismiss}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          fontWeight="bold"
          variant="h5"
          component="h2"
          marginBottom="4px"
        >
          Connect to a wallet
        </Typography>
        {walletsToShow.map((entry, index) => (
          <WalletCard
            key={entry.title}
            login={login}
            walletConfig={entry}
            onDismiss={onDismiss}
            mb={index < config.length - 1 ? "8px" : "0"}
          />
        ))}
      </Box>
    </Modal>
  );
};

export default ConnectModal;
