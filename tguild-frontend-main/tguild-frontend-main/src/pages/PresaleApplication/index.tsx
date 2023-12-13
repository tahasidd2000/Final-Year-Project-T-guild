/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { Box, Typography } from "@mui/material";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import ConnetWalletButton from "../../components/ConnectWalletButton/ConnectWalletButton";
import CreatePresale from "./CreatePresale";
import LaunchPad from "./LaunchPad";
import CreateToken from "../CreateToken";

export default function PresaleApplication() {
  const { account } = useWeb3React();
  const [buttonIndex, setButtonIndex] = useState(0);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/create-token") setButtonIndex(0);
    if (location.pathname === "/create-presale") setButtonIndex(1);
    if (location.pathname === "/dashboard") setButtonIndex(2);
    console.log("params", location.pathname);
  }, [location]);

  return account ? (
    <>
      <Box marginY="24px">
        <Tabs
          defaultValue={0}
          value={buttonIndex}
          onChange={(_, value) => setButtonIndex(value as number)}
          sx={{ borderRadius: "lg" }}
        >
          <TabList sx={{ backgroundColor: "#09090d" }}>
            <Tab value={0}>Create Token</Tab>

            <Tab value={1}>Create Presale</Tab>
            <Tab value={2}>My Presales</Tab>
          </TabList>
        </Tabs>
      </Box>

      {buttonIndex === 0 && <CreateToken />}
      {buttonIndex === 1 && (
        <CreatePresale setHomeButtonIndex={setButtonIndex} />
      )}
      {buttonIndex === 2 && <LaunchPad />}
    </>
  ) : (
    <>
      <Typography marginTop="100px" fontSize="20px" color="primaryDark">
        Please connect your wallet
      </Typography>
      <ConnetWalletButton />
    </>
  );
}
