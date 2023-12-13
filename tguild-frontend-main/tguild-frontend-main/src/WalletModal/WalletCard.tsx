import React from "react";
import Typography from '@mui/material/Typography';
import Flex from "../components/Box/Flex";
import { connectorLocalStorageKey, walletLocalStorageKey } from "./config";
import { Login, Config } from "./types";

interface Props {
  walletConfig: Config;
  login: Login;
  onDismiss: () => void;
  mb: string;
}

const WalletCard: React.FC<Props> = ({ login, walletConfig, onDismiss, mb }) => {
  const { title, icon: Icon } = walletConfig;
  return (
    <Flex
      width="100%"
      height='40px'
      borderBottom='1px solid #0d1b24'
      onClick={() => {
        if (!window.ethereum && walletConfig.redirectUrl) {
          window.open(walletConfig.redirectUrl, "_blank", "noopener noreferrer");
        } else {
          login(walletConfig.connectorId);
          localStorage?.setItem(walletLocalStorageKey, walletConfig.title);
          localStorage?.setItem(connectorLocalStorageKey, walletConfig.connectorId);
          onDismiss();
        }
      }}
      justifyContent="space-between"
      alignItems='center'
      mb={mb}
      style={{ cursor: 'pointer' }}
      id={`wallet-connect-${title.toLocaleLowerCase()}`}
    >
      <Typography fontSize='16px' fontWeight='600' color="sidebarColor" mr="16px">
        {title}
      </Typography>
      <Icon width="32px" />
    </Flex>
  );
};

export default WalletCard;
