/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useState, useMemo } from "react";
import { Pagination } from "@mui/material";
import { formatUnits } from "ethers/lib/utils";
import { Button } from "@mui/joy";
import { Box, Flex } from "../../../components/Box";
import { usePresaleContract } from "../../../hooks/useContract";
import {
  ADDRESS_PER_PAGE,
  HEADERS_CONTRIBUTORS,
} from "../../../constants/presale";
import { PresaleInfo } from "../types";
import { StyledText, usePaginationStyles } from "./Shared";
import {
  AddressBox,
  WhitelistRadio,
  PlaceHolderParticipants,
} from "./WhitelistSection";
import ViewAddressesModal from "./ViewAddressesModal";
import { lightColors } from "../../../theme/colors";

interface Props {
  presaleAddress: string;
  currency: string;
  presaleInfo: PresaleInfo | undefined;
  paymentTokenDecimals: number | undefined;
}

const ContributorsSection = ({
  presaleAddress,
  currency,
  presaleInfo,
  paymentTokenDecimals,
}: Props) => {
  const [selectedAddresses, setSelectedAddresses] = useState<string[]>([]);
  const [contributorsPage, setContributorsPage] = useState(1);
  const [contributors, setContributors] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<
    {
      currency: string;
      wallet: string;
      amount: string;
      number: number;
    }[]
  >([]);

  const presaleContract = usePresaleContract(presaleAddress);

  useEffect(() => {
    async function fetchContributors() {
      setContributors(await presaleContract?.getContributors());
    }
    if (presaleContract) fetchContributors();
  }, [presaleInfo, presaleContract]);

  const paginationStyles = usePaginationStyles();

  const selectAddressHandler = (address: string) => {
    if (selectedAddresses.includes(address)) {
      setSelectedAddresses((prevAddresses) =>
        prevAddresses.filter((add) => add !== address)
      );
    } else {
      setSelectedAddresses((prevAddresses) => [...prevAddresses, address]);
    }
  };
  const contributorsData = useMemo(async () => {
    if (contributors && presaleContract) {
      return Promise.all(
        contributors.map(async (contributor) => {
          return {
            currency,
            wallet: contributor,
            amount: formatUnits(
              await presaleContract.bought(contributor),
              paymentTokenDecimals
            ),
          };
        })
      );
    }
    return [];
  }, [contributors, presaleContract, currency, paymentTokenDecimals]);

  const closeContributorsModalHandler = () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    closeContributorsModal();
  };

  useEffect(() => {
    async function filterData() {
      const allData = await contributorsData;
      setFilteredData(
        allData
          .filter((data) => selectedAddresses.includes(data.wallet))
          .map((data, index) => ({ ...data, number: index + 1 }))
      );
    }
    filterData();
  }, [contributorsData, selectedAddresses]);

  const [openViewModal, setOpenViewModal] = React.useState(false);
  const openContributorsModal = () => setOpenViewModal(true);
  const closeContributorsModal = () => setOpenViewModal(false);

  const startIndex = contributorsPage * ADDRESS_PER_PAGE - ADDRESS_PER_PAGE;
  const endIndex =
    startIndex + ADDRESS_PER_PAGE > contributors.length
      ? contributors.length
      : startIndex + ADDRESS_PER_PAGE;
  const slicedAddresses = contributors.slice(startIndex, endIndex);

  return (
    <Box>
      <ViewAddressesModal
        open={openViewModal}
        headers={HEADERS_CONTRIBUTORS}
        data={filteredData}
        onDismiss={closeContributorsModalHandler}
        isContributorsModal
      />
      <Flex marginTop="16px" justifyContent="space-between">
        <Flex>
          <PlaceHolderParticipants />
          <StyledText fontWeight={700} color={lightColors.primaryDark}>
            Contributors ({contributors.length})
          </StyledText>
        </Flex>
        {selectedAddresses.length ? (
          <StyledText
            marginLeft="6px"
            fontSize="14px"
            color={lightColors.failure}
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedAddresses([])}
          >
            Cancel Selection
          </StyledText>
        ) : (
          <StyledText
            color="primary"
            marginLeft="6px"
            fontSize="14px"
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedAddresses([...contributors])}
          >
            Select All
          </StyledText>
        )}
      </Flex>
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
            <Button onClick={openContributorsModal} variant="soft" size="sm">
              View Selected {`(${selectedAddresses.length})`}
            </Button>
          </Flex>
        )}
        <Box height="16px" />
        {contributors.length > 0 && (
          <Pagination
            variant="outlined"
            shape="rounded"
            sx={paginationStyles}
            count={Math.ceil(contributors.length / ADDRESS_PER_PAGE)}
            page={contributorsPage}
            onChange={(_, value: number) => setContributorsPage(value)}
          />
        )}
      </Box>
    </Box>
  );
};

export default ContributorsSection;
