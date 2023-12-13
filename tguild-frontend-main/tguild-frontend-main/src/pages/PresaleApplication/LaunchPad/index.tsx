/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  useFactoryPresaleContract,
  usePresaleContracts,
} from "../../../hooks/useContract";
import {
  ALL_PRESALE_OPTION,
  WHITELIST_ONLY,
  PUBLIC_ONLY_OPTION,
} from "../../../constants/presale";
import {
  Breadcrumbs,
  Typography,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Input,
} from "@mui/material";
import { Box, Flex } from "../../../components/Box";
import { NavTab } from "../../../components/NavTab";
import { RowFixed } from "../../../components/Row";
import { fetchPresaleInfo, checkSalePhase } from "../../../utils/presale";
import { isAddress } from "../../../utils";
import { PresalePhases } from "../types";
import PresaleCards from "../PresaleCards";
import Presale from "../Presale";
import { lightColors } from "../../../theme/colors";

const Heading = styled(Typography)`
  font-weight: 700;
  font-size: 40px;
  line-height: 44px;
  margin-bottom: 16px;
  @media (max-width: 852px) {
    font-size: 32px;
    line-height: 35px;
    margin-bottom: 8px;
  }
`;

const ContentWrapper = styled(Box)`
  max-width: 950px;
  width: 100%;
  margin: 0 auto;
  margin-top: 24px;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  @media (max-width: 1250px) {
    max-width: 95%;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 0px;
  border-bottom: 1px solid ${lightColors.inputColor};
  flex: none;
  order: 1;
  align-self: stretch;
  flex-grow: 0;
`;

const StyledText = styled(Typography)`
  align-self: center;
  font-size: 16px;
  @media (max-width: 852px) {
    font-size: 14px;
  }
`;

const SelectWrapper = styled(Box)`
  width: 100%;
  max-width: 226px;
  margin-left: 16px;
  @media (max-width: 600px) {
    max-width: 150px;
    margin-left: 8px;
  }
  @media (max-width: 400px) {
    max-width: 35%;
    > div {
      > select {
        font-size: 10px;
        padding: 0 35px;
      }
      & :first-child {
        width: 10px;
      }
      > svg {
        width: 15px;
      }
    }
  }
`;

const LaunchPad = () => {
  const { account } = useWeb3React();

  const [tabIndex, setTabIndex] = useState(1);
  const [selectedPresale, setSelectedPresale] = useState("");
  const [presaleAddresses, setPresaleAddresses] = useState<string[]>([]);
  const [showAddresses, setShowAddresses] = useState<string[]>([]);
  const [filteredAddresses, setFilteredAddresses] = useState<string[]>([]);
  const [filter, setFilter] = useState(ALL_PRESALE_OPTION.value);
  const [browsePage, setBrowsePage] = useState(1);
  const [contributionPage, setContributionPage] = useState(1);

  const factoryContract = useFactoryPresaleContract();
  const presaleContracts = usePresaleContracts(presaleAddresses);

  const location = useLocation();

  useEffect(() => {
    const presaleAddressUrl = new URLSearchParams(location.search).get(
      "address"
    );
    if (
      isAddress(presaleAddressUrl || "") &&
      presaleAddresses.includes(presaleAddressUrl || "")
    ) {
      setSelectedPresale(presaleAddressUrl || "");
    } else {
      setSelectedPresale("");
    }
  }, [location, presaleAddresses]);

  useEffect(() => {
    async function fetchPresales() {
      setPresaleAddresses(await factoryContract?.getPresaleAddresses());
    }
    if (factoryContract) fetchPresales();
  }, [factoryContract]);

  useEffect(() => {
    if (!account && tabIndex === 0) {
      setTabIndex(1);
    }
  }, [account, tabIndex]);

  const tabIndexHandler = (newIndex: number) => setTabIndex(newIndex);
  const viewPresaleHandler = (address: string) => setSelectedPresale(address);

  const sortLivePresales = useMemo(async () => {
    if (presaleContracts.length) {
      const comparableArray = await Promise.all(
        presaleContracts.map(async (contract) => {
          return {
            presaleInfo: await fetchPresaleInfo(contract),
            contributors: await contract?.getContributors(),
            presaleAddress: contract?.address,
          };
        })
      );

      return comparableArray
        .filter((info) => {
          if (
            !(checkSalePhase(info.presaleInfo) === PresalePhases.PresalePhase)
          ) {
            return false;
          }
          if (
            tabIndex === 0 &&
            !(
              info.presaleInfo.owner === account ||
              info.contributors.includes(account)
            )
          ) {
            return false;
          }
          if (filter === ALL_PRESALE_OPTION.value) return true;
          if (
            filter === WHITELIST_ONLY.value &&
            info.presaleInfo.isWhitelistEnabled
          )
            return true;
          if (
            filter === PUBLIC_ONLY_OPTION.value &&
            !info.presaleInfo.isWhitelistEnabled
          )
            return true;
          return false;
        })
        .sort(
          (a, b) =>
            a.presaleInfo.endPresaleTime.toNumber() -
            b.presaleInfo.endPresaleTime.toNumber()
        )
        .map((obj) => obj.presaleAddress);
    }
    return [];
  }, [presaleContracts, filter, tabIndex, account]);

  const sortUpComingPresales = useMemo(async () => {
    if (presaleContracts.length) {
      const comparableArray = await Promise.all(
        presaleContracts.map(async (contract) => {
          return {
            presaleInfo: await fetchPresaleInfo(contract),
            contributors: await contract?.getContributors(),
            presaleAddress: contract?.address,
          };
        })
      );

      return comparableArray
        .filter((info) => {
          if (
            !(
              checkSalePhase(info.presaleInfo) ===
              PresalePhases.PresaleNotStarted
            )
          ) {
            return false;
          }
          if (
            tabIndex === 0 &&
            !(
              info.presaleInfo.owner === account ||
              info.contributors.includes(account)
            )
          ) {
            return false;
          }
          if (filter === ALL_PRESALE_OPTION.value) return true;
          if (
            filter === WHITELIST_ONLY.value &&
            info.presaleInfo.isWhitelistEnabled
          )
            return true;
          if (
            filter === PUBLIC_ONLY_OPTION.value &&
            !info.presaleInfo.isWhitelistEnabled
          )
            return true;
          return false;
        })
        .sort(
          (a, b) =>
            a.presaleInfo.startPresaleTime.toNumber() -
            b.presaleInfo.startPresaleTime.toNumber()
        )
        .map((obj) => obj.presaleAddress);
    }
    return [];
  }, [presaleContracts, filter, tabIndex, account]);

  const sortFinishedPresales = useMemo(async () => {
    if (presaleContracts.length) {
      const comparableArray = await Promise.all(
        presaleContracts.map(async (contract) => {
          return {
            presaleInfo: await fetchPresaleInfo(contract),
            contributors: await contract?.getContributors(),
            finaliseTime: (await contract?.startDateClaim()).toNumber(),
            presaleAddress: contract?.address,
          };
        })
      );

      return comparableArray
        .filter((info) => {
          if (
            checkSalePhase(info.presaleInfo) ===
              PresalePhases.PresaleNotStarted ||
            checkSalePhase(info.presaleInfo) === PresalePhases.PresalePhase
          ) {
            return false;
          }
          if (
            tabIndex === 0 &&
            !(
              info.presaleInfo.owner === account ||
              info.contributors.includes(account)
            )
          ) {
            return false;
          }
          if (filter === ALL_PRESALE_OPTION.value) return true;
          if (
            filter === WHITELIST_ONLY.value &&
            info.presaleInfo.isWhitelistEnabled
          )
            return true;
          if (
            filter === PUBLIC_ONLY_OPTION.value &&
            !info.presaleInfo.isWhitelistEnabled
          )
            return true;
          return false;
        })
        .sort((a, b) => {
          if (a.finaliseTime !== 0) {
            if (b.finaliseTime !== 0) {
              return a.finaliseTime - b.finaliseTime;
            }
            return a.finaliseTime - b.presaleInfo.endPresaleTime.toNumber();
          }
          return (
            a.presaleInfo.endPresaleTime.toNumber() -
            b.presaleInfo.endPresaleTime.toNumber()
          );
        })
        .map((obj) => obj.presaleAddress);
    }
    return [];
  }, [presaleContracts, filter, tabIndex, account]);

  useEffect(() => {
    async function sortAddresses() {
      const live = await sortLivePresales;
      const upComing = await sortUpComingPresales;
      const finished = await sortFinishedPresales;
      if (tabIndex === 0 || tabIndex === 1) {
        setShowAddresses(live.concat(upComing, finished) as string[]);
      } else if (tabIndex === 2) {
        setShowAddresses(live as string[]);
      } else if (tabIndex === 3) {
        setShowAddresses(upComing as string[]);
      } else if (tabIndex === 4) {
        setShowAddresses(finished as string[]);
      }
    }
    sortAddresses();
  }, [sortLivePresales, sortUpComingPresales, sortFinishedPresales, tabIndex]);

  const presaleSearchChangeHandler = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const search = e.target.value;
    if (!factoryContract) return;

    const searchingAddress = isAddress(search.trim());

    if (searchingAddress) {
      const filterPresaleAddresses = showAddresses.filter(
        (address) => address === searchingAddress
      );
      if (filterPresaleAddresses.length) {
        setFilteredAddresses(filterPresaleAddresses);
      } else {
        const isValidAddresses = await factoryContract.getTokenPresales(
          searchingAddress
        );
        setFilteredAddresses(
          isValidAddresses.filter((address: string) =>
            showAddresses.includes(address)
          )
        );
      }
    } else {
      setFilteredAddresses([]);
    }
  };

  return (
    <>
      <ContentWrapper>
        <Box width="100%" maxWidth="950px">
          {selectedPresale ? (
            <>
              <Breadcrumbs>
                <StyledText
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedPresale("")}
                  color={lightColors.textSubtle}
                >
                  Launchpad
                </StyledText>
                <StyledText
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedPresale("")}
                  color={lightColors.textSubtle}
                >
                  Browse Presales
                </StyledText>
                <StyledText fontWeight="bold" color={lightColors.textSubtle}>
                  Presale Details
                </StyledText>
              </Breadcrumbs>
              <Box marginBottom="8px" />
              <Divider />
              <RowFixed marginY="24px">
                <ArrowBackIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedPresale("")}
                />
                <Typography
                  marginLeft="8px"
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                  onClick={() => setSelectedPresale("")}
                >
                  back to Launchpad
                </Typography>
              </RowFixed>
              <Presale presaleAddress={selectedPresale} />
            </>
          ) : (
            <>
              <Heading>Browse Presales</Heading>
              <NavTab activeIndex={tabIndex} onItemClick={tabIndexHandler}>
                <StyledText>{account ? "My Contributions" : ""}</StyledText>
                <StyledText>All Presales</StyledText>
                <StyledText>Live Now</StyledText>
                <StyledText>Coming Soon</StyledText>
                <StyledText>Finished</StyledText>
              </NavTab>
              <Divider />

              <Flex justifyContent="space-between" marginTop="16px">
                <Box maxWidth="700px" width="75%">
                  <label htmlFor="search-presale">
                    <Flex
                      borderRadius="16px"
                      paddingLeft="10px"
                      alignContent="center"
                      justifyContent="flex-start"
                    >
                      <Input
                        fullWidth
                        sx={{ color: lightColors.textSubtle }}
                        onChange={presaleSearchChangeHandler}
                        id="search-presale"
                        placeholder="Search by presale address or token address"
                      />
                    </Flex>
                  </label>
                </Box>
                <SelectWrapper>
                  <FormControl fullWidth sx={{ color: lightColors.textSubtle }}>
                    <InputLabel
                      sx={{ color: lightColors.textSubtle }}
                      id="presale-option-label"
                    >
                      Filters
                    </InputLabel>
                    <Select
                      labelId="presale-option-label"
                      id="presale-option"
                      value={filter}
                      sx={{ color: lightColors.textSubtle }}
                      label="Filters"
                      onChange={(e: any) => setFilter(e.target.value)}
                      size="small"
                    >
                      <MenuItem value={ALL_PRESALE_OPTION.value}>
                        {ALL_PRESALE_OPTION.label}
                      </MenuItem>
                      <MenuItem value={PUBLIC_ONLY_OPTION.value}>
                        {PUBLIC_ONLY_OPTION.label}
                      </MenuItem>
                      <MenuItem value={WHITELIST_ONLY.value}>
                        {WHITELIST_ONLY.label}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </SelectWrapper>
              </Flex>

              {tabIndex === 0 ? (
                <PresaleCards
                  page={contributionPage}
                  setPage={setContributionPage}
                  viewPresaleHandler={viewPresaleHandler}
                  presaleAddresses={showAddresses}
                  filteredAddresses={filteredAddresses}
                />
              ) : (
                <PresaleCards
                  page={browsePage}
                  setPage={setBrowsePage}
                  viewPresaleHandler={viewPresaleHandler}
                  presaleAddresses={showAddresses}
                  filteredAddresses={filteredAddresses}
                />
              )}
            </>
          )}
        </Box>
      </ContentWrapper>
    </>
  );
};

export default LaunchPad;
