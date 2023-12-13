import React from "react";
import { useWeb3React } from "@web3-react/core";
import { Button, ButtonProps } from "@mui/material";
import login from "../../utils/login";
import ConnectModal from "../../WalletModal/ConnectModal";

const ConnetWalletButton: React.FC<ButtonProps> = (props) => {
  const { activate } = useWeb3React();

  const handleLogin = (connectorId: string) => {
    login(connectorId, activate);
  };
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <ConnectModal open={open} login={handleLogin} onDismiss={handleClose} />
      <Button onClick={handleOpen} {...props}>
        Connect Wallet
      </Button>
    </>
  );
};

export default ConnetWalletButton;
