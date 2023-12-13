/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { Pagination } from "@mui/material";
import { Radio } from "@mui/material";
import { Button } from "@mui/joy";
import { Box, Flex } from "../../../components/Box";
import { usePresaleContract } from "../../../hooks/useContract";
import { RowFixed } from "../../../components/Row";
import {
  RADIO_VALUES,
  ADDRESS_PER_PAGE,
  HEADERS_WHITELIST,
} from "../../../constants/presale";
import {
  PresaleInfo,
  FieldNames,
  FieldProps,
  LoadingForButton,
  LoadingButtonTypes,
} from "../types";
import { lightColors } from "../../../theme/colors";
import { StyledText, usePaginationStyles } from "./Shared";
import RemoveWhitelistModal from "./RemoveWhitelistModal";
import AddWhitelistModal from "./AddWhitelistModal";
import ViewAddressesModal from "./ViewAddressesModal";

interface Props {
  presaleAddress: string;
  isMainLoading: boolean;
  presaleInfo: PresaleInfo | undefined;
  whitelistAddresses: string[];
  setIsMainLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setPresaleInfo: React.Dispatch<React.SetStateAction<PresaleInfo | undefined>>;
  setWhitelistAddresses: React.Dispatch<React.SetStateAction<string[]>>;
}

export const PlaceHolderParticipants = styled.div`
  width: 4px;
  height: 24px;
  background: ${lightColors.primaryDark};
  margin-right: 8px;
`;

export const AddressBox = styled(Flex)`
  align-items: center;
  padding: 8px 8px 8px 12px;
  height: 45px;
  background: ${lightColors.inputColor};
  margin-bottom: 8px;
`;

export const WhitelistRadio = styled(Radio)`
  flex-shrink: 0;
  height: 18px;
  width: 18px;
  &:after {
    flex-shrink: 0;
    left: 4.5px;
    top: 4.5px;
    height: 9px;
    width: 9px;
  }
`;

const WhitelistSection = ({
  setIsMainLoading,
  presaleAddress,
  setPresaleInfo,
  isMainLoading,
  presaleInfo,
  whitelistAddresses,
  setWhitelistAddresses,
}: Props) => {
  const { account } = useWeb3React();

  const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);
  const [isAccountOwner, setIsAccountOwner] = useState(false);
  const [whitelistPage, setWhitelistPage] = useState(1);
  const [isLoadingButton, setIsLoadingButton] = useState<LoadingForButton>({
    type: LoadingButtonTypes.NotSelected,
    error: "",
    isClicked: false,
  });
  const [isWhitelistModalOpen, setIsWhitelistModalOpen] = useState(false);
  const [newWhitelist, setNewWhitelist] = useState<FieldProps>({
    value: "",
    error: "",
  });
  const [isOpenRemoveWhitelistModal, setOpenRemoveWhitelistModal] =
    useState(false);
  const [openViewWhitelistModal, setOpenViewWhitelistModal] = useState(false);

  const presaleContract = usePresaleContract(presaleAddress);

  useEffect(() => {
    if (isLoadingButton?.error !== "") {
      setTimeout(() => {
        setIsLoadingButton((prevState) => ({ ...prevState, error: "" }));
      }, 3000);
    }
  }, [isLoadingButton]);

  useEffect(() => {
    if (presaleInfo?.owner === account) {
      setIsAccountOwner(true);
    } else {
      setIsAccountOwner(false);
    }
  }, [presaleInfo, account]);

  const selectAddressHandler = (address: string) => {
    if (selectedAddresses.includes(address)) {
      setSelectedAddresses((prevAddresses) =>
        prevAddresses.filter((add) => add !== address)
      );
    } else {
      setSelectedAddresses((prevAddresses) => [...prevAddresses, address]);
    }
  };

  const openRemoveWhitelistModal = () => setOpenRemoveWhitelistModal(true);
  const closeRemoveWhitelistModal = () => setOpenRemoveWhitelistModal(false);

  const closeRemoveWhitelistHandler = () => {
    closeRemoveWhitelistModal();
  };

  const removeWhitelistHandler = async () => {
    if (
      !presaleContract ||
      !selectedAddresses.length ||
      presaleInfo?.owner !== account
    ) {
      return;
    }
    try {
      setIsMainLoading(true);
      setIsLoadingButton({
        type: LoadingButtonTypes.RemoveWhitelist,
        error: "",
        isClicked: true,
      });
      const result = await presaleContract.removeWhiteList(selectedAddresses);
      closeRemoveWhitelistModal();
      await result.wait();
      setWhitelistAddresses(await presaleContract.getWhitelist());
      setNewWhitelist({ value: "", error: "" });
      setIsMainLoading(false);
      setIsLoadingButton({
        type: LoadingButtonTypes.NotSelected,
        error: "",
        isClicked: false,
      });
    } catch (err) {
      closeRemoveWhitelistModal();
      setIsMainLoading(false);
      setIsLoadingButton({
        type: LoadingButtonTypes.RemoveWhitelist,
        error: "Removing Whitelist Failed",
        isClicked: false,
      });
      console.error(err);
    }
  };

  const data = selectedAddresses.map((address, index) => ({
    number: index + 1,
    wallet: address,
  }));

  const closeWhitelistAddressesModalHandler = () => {
    closeWhitelistAddressesModal();
  };

  const openWhitelistAddressesModal = () => setOpenViewWhitelistModal(true);
  const closeWhitelistAddressesModal = () => setOpenViewWhitelistModal(false);

  const closAddwhitelistModalHandler = (_: string, reason: string) => {
    if (reason !== "backdropClick") {
      setIsWhitelistModalOpen(false);
      setNewWhitelist((prevState) =>
        isMainLoading ? { ...prevState } : { error: "", value: "" }
      );
    }
  };

  const addWhitelistHandler = async () => {
    const list = newWhitelist.value.split(",").map((address) => {
      return address.trim();
    });
    if (!presaleContract || !list.length || presaleInfo?.owner !== account) {
      return;
    }
    try {
      setIsMainLoading(true);
      setIsLoadingButton({
        type: LoadingButtonTypes.AddWhitelist,
        error: "",
        isClicked: true,
      });
      const result = await presaleContract.addWhiteList(list);
      await result.wait();
      setWhitelistAddresses(await presaleContract.getWhitelist());
      setNewWhitelist({ value: "", error: "" });
      setIsMainLoading(false);
      closAddwhitelistModalHandler("", "Close Modal");
      setIsLoadingButton({
        type: LoadingButtonTypes.NotSelected,
        error: "",
        isClicked: false,
      });
    } catch (err) {
      setIsMainLoading(false);
      setIsLoadingButton({
        type: LoadingButtonTypes.AddWhitelist,
        error: "Adding Whitelist Failed",
        isClicked: false,
      });
      setNewWhitelist((prev) => ({
        ...prev,
        error: "Adding Whitelist Failed",
      }));
      console.error(err);
    }
  };

  const onChangeSaleType = async (event: any) => {
    if (presaleInfo?.owner !== account || !presaleContract) {
      return;
    }
    const type = event.target.value;
    try {
      setIsMainLoading(true);
      setIsLoadingButton({
        type: LoadingButtonTypes.ChangeSaleType,
        isClicked: true,
        error: "",
      });
      const result = await presaleContract.toggleWhitelistPhase();
      await result.wait();
      setIsMainLoading(false);
      setPresaleInfo((prevState) =>
        prevState
          ? {
              ...prevState,
              isWhitelistEnabled: type === `${RADIO_VALUES.WHITELIST_ENABLED}`,
            }
          : prevState
      );
      setIsLoadingButton({
        type: LoadingButtonTypes.NotSelected,
        isClicked: false,
        error: "",
      });
    } catch (err) {
      setIsMainLoading(false);
      setIsLoadingButton({
        type: LoadingButtonTypes.ChangeSaleType,
        isClicked: false,
        error: "Changing Sale Type Failed.",
      });
      console.error(err);
    }
  };

  const paginationStyles = usePaginationStyles();

  const startIndex = whitelistPage * ADDRESS_PER_PAGE - ADDRESS_PER_PAGE;
  const endIndex =
    startIndex + ADDRESS_PER_PAGE > whitelistAddresses.length
      ? whitelistAddresses.length
      : startIndex + ADDRESS_PER_PAGE;
  const slicedAddresses = whitelistAddresses.slice(startIndex, endIndex);

  return (
    <Box>
      {isAccountOwner && (
        <>
          <ViewAddressesModal
            open={openViewWhitelistModal}
            title="Presale Whitelist"
            headers={HEADERS_WHITELIST}
            data={data}
            onDismiss={closeWhitelistAddressesModalHandler}
          />
          <RemoveWhitelistModal
            open={isOpenRemoveWhitelistModal}
            title={
              whitelistAddresses.length === selectedAddresses.length
                ? "Remove All Whitelist"
                : "Remove Selected Whitelist"
            }
            selectedNumber={selectedAddresses.length}
            onDismiss={closeRemoveWhitelistHandler}
            removeWhitelistHandler={removeWhitelistHandler}
          />
          <AddWhitelistModal
            open={isWhitelistModalOpen}
            isLoadingButton={isLoadingButton}
            isMainLoading={isMainLoading}
            newWhitelist={newWhitelist}
            setNewWhitelist={setNewWhitelist}
            addWhitelistHandler={addWhitelistHandler}
            closeModalHandler={closAddwhitelistModalHandler}
          />
          <Flex alignItems="center">
            <StyledText marginRight="16px" fontSize="20px">
              Sale Type
            </StyledText>
            {isLoadingButton.isClicked &&
              isLoadingButton.type === LoadingButtonTypes.ChangeSaleType && (
                <Button loading variant="plain">
                  Plain
                </Button>
              )}
          </Flex>
          <Box marginTop="4px" onChange={onChangeSaleType}>
            <RowFixed>
              <Radio
                id="whitelist-public"
                disabled={isMainLoading}
                name={FieldNames.isWhitelistEnabled}
                value={`${RADIO_VALUES.WHITELIST_DISABLED}`}
                checked={
                  `${presaleInfo?.isWhitelistEnabled}` ===
                  `${RADIO_VALUES.WHITELIST_DISABLED}`
                }
              />
              <label htmlFor="whitelist-public">
                <StyledText
                  color={
                    `${presaleInfo?.isWhitelistEnabled}` ===
                    `${RADIO_VALUES.WHITELIST_DISABLED}`
                      ? "primary"
                      : ""
                  }
                >
                  Public
                </StyledText>
              </label>
            </RowFixed>
            <RowFixed>
              <Radio
                id="whitelist-only"
                disabled={isMainLoading}
                name={FieldNames.isWhitelistEnabled}
                value={`${RADIO_VALUES.WHITELIST_ENABLED}`}
                checked={
                  `${presaleInfo?.isWhitelistEnabled}` ===
                  `${RADIO_VALUES.WHITELIST_ENABLED}`
                }
              />
              <label htmlFor="whitelist-only">
                <StyledText
                  color={
                    `${presaleInfo?.isWhitelistEnabled}` ===
                    `${RADIO_VALUES.WHITELIST_ENABLED}`
                      ? "primary"
                      : ""
                  }
                >
                  Whitelist Only
                </StyledText>
              </label>
            </RowFixed>
            {isLoadingButton.type === LoadingButtonTypes.ChangeSaleType &&
              isLoadingButton.error && (
                <StyledText
                  color={lightColors.failure}
                  marginTop="4px"
                  fontSize="10px"
                >
                  {isLoadingButton.error}
                </StyledText>
              )}
          </Box>
          <StyledText marginTop="24px" fontSize="20px" fontWeight={700}>
            Whitelist Customization
          </StyledText>
          <Flex flexWrap="wrap">
            <Box marginTop="4px">
              <Button
                onClick={() => setIsWhitelistModalOpen(true)}
                variant="soft"
                size="sm"
              >
                Add New Whitelist
              </Button>
              {isLoadingButton.type === LoadingButtonTypes.AddWhitelist &&
                isLoadingButton.error && (
                  <StyledText
                    color={lightColors.failure}
                    marginTop="4px"
                    fontSize="10px"
                  >
                    {isLoadingButton.error}
                  </StyledText>
                )}
            </Box>
          </Flex>
        </>
      )}
      <Flex marginTop="16px" justifyContent="space-between">
        <Flex>
          <PlaceHolderParticipants />
          <StyledText fontWeight={700} color={lightColors.primaryDark}>
            Whitelist Participants ({whitelistAddresses.length})
          </StyledText>
        </Flex>
        {whitelistAddresses.length > 0 &&
          (selectedAddresses.length ? (
            <StyledText
              marginLeft="6px"
              fontSize="14px"
              color={lightColors.failure}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedAddresses([])}
            >
              Cancel Selection
            </StyledText>
          ) : isAccountOwner ? (
            <RowFixed
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedAddresses([...whitelistAddresses])}
            >
              <StyledText
                marginLeft="6px"
                color={lightColors.failure}
                fontSize="14px"
              >
                Remove All
              </StyledText>
            </RowFixed>
          ) : (
            <StyledText
              marginLeft="6px"
              fontSize="14px"
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedAddresses([...whitelistAddresses])}
            >
              Select All
            </StyledText>
          ))}
      </Flex>
      {whitelistAddresses.length === 0 ? (
        <StyledText marginTop="8px" fontSize="14px" color="textDisabled">
          {isAccountOwner
            ? "You haven’t added any whitelist participants"
            : "Ask Owner to add whitelist participants"}
        </StyledText>
      ) : (
        <Box marginTop="8px">
          {slicedAddresses.map((address) => (
            <AddressBox key={address} justifyContent="space-between">
              <Flex alignContent="center" alignItems="center">
                <WhitelistRadio
                  checked={selectedAddresses.includes(address)}
                  onClick={() => selectAddressHandler(address)}
                />
                <StyledText
                  fontSize="14px"
                  marginLeft="16px"
                  color={lightColors.textSubtle}
                >
                  {address}
                </StyledText>
              </Flex>
            </AddressBox>
          ))}
          {selectedAddresses.length > 0 && (
            <Flex marginTop="8px" justifyContent="end">
              <Button
                onClick={openWhitelistAddressesModal}
                variant="soft"
                size="sm"
              >
                View Selected {`(${selectedAddresses.length})`}
              </Button>
              {isAccountOwner && (
                <Box marginLeft="8px">
                  <Button
                    onClick={openRemoveWhitelistModal}
                    loading={
                      isLoadingButton.isClicked &&
                      isLoadingButton.type ===
                        LoadingButtonTypes.RemoveWhitelist
                    }
                    style={{ backgroundColor: lightColors.failure }}
                    disabled={
                      isLoadingButton.isClicked ||
                      (isLoadingButton.isClicked &&
                        isLoadingButton.type ===
                          LoadingButtonTypes.RemoveWhitelist) ||
                      isMainLoading
                    }
                    size="sm"
                  >
                    Remove
                    {whitelistAddresses.length === selectedAddresses.length
                      ? " All"
                      : `(${selectedAddresses.length})`}
                  </Button>
                  {isLoadingButton.type ===
                    LoadingButtonTypes.RemoveWhitelist &&
                    isLoadingButton.error && (
                      <StyledText
                        color={lightColors.failure}
                        marginTop="4px"
                        fontSize="10px"
                      >
                        {isLoadingButton.error}
                      </StyledText>
                    )}
                </Box>
              )}
            </Flex>
          )}
          <Box height="24px" />
          {whitelistAddresses.length > 0 && (
            <Pagination
              variant="outlined"
              shape="rounded"
              sx={paginationStyles}
              count={Math.ceil(whitelistAddresses.length / ADDRESS_PER_PAGE)}
              page={whitelistPage}
              onChange={(_, value: number) => setWhitelistPage(value)}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default WhitelistSection;
