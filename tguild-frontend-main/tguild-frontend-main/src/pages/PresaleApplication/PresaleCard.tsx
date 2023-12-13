import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { differenceInDays, formatDuration, intervalToDuration } from "date-fns";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";
import { Button, LinearProgress, Typography } from "@mui/material";
import { Box, Flex } from "../../components/Box";
import { usePresaleContract } from "../../hooks/useContract";
import { useToken } from "../../hooks/Tokens";
import { RowBetween } from "../../components/Row";
import {
  fetchPresaleInfo,
  fetchFeeInfo,
  fetchProjectDetails,
  checkSalePhase,
} from "../../utils/presale";
import { FEE_DECIMALS, TOKEN_CHOICES } from "../../constants/presale";
import { NULL_ADDRESS } from "../../constants/index";
import { PresaleInfo, ProjectDetails, FeeInfo, PresalePhases } from "./types";
import ProgressWrapper from "./ProgressWrapper";
import PresaleTags from "./PresaleTags";
import { lightColors, darkColors } from "../../theme/colors";

interface Props {
  presaleAddress: string;
  viewPresaleHandler: (address: string) => void;
}

const StyledCard = styled(Box)`
  background: linear-gradient(
    180deg,
    ${lightColors.background} 51.44%,
    ${darkColors.card} 100%
  );
  border: 1px solid ${darkColors.textDisabled};
  box-sizing: border-box;
  border-radius: 8px;
  min-width: 306px;
  padding: 16px;
  margin-bottom: 16px;

  @media (max-width: 330px) {
    width: 100%;
    min-width: 250px;
  }
`;

const StyledImage = styled.img`
  height: 48px;
  width: 48px;
  border-radius: 50%;
  @media (max-width: 480px) {
    height: 36px;
    width: 36px;
  }
`;

const StyledText = styled(Typography)`
  font-size: ${({ fontSize }) => fontSize?.toString() || "16px"};
  @media (max-width: 480px) {
    font-size: ${({ fontSize }) => `calc(${fontSize} - 2px)` || "14px"};
  }
`;

const PresalePhaseTitle = ({
  presaleInfo,
}: {
  presaleInfo: PresaleInfo | undefined;
}) => {
  const [days, setDays] = useState<number>();
  const [hours, setHours] = useState<number>();
  const [seconds, setSeconds] = useState<number>();
  const [minutes, setMinutes] = useState<number>();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const presalePhase = checkSalePhase(presaleInfo);
    if (presaleInfo) {
      const timer = setTimeout(() => {
        const startDate = new Date();
        const endDate =
          presalePhase === PresalePhases.PresaleNotStarted
            ? new Date(presaleInfo.startPresaleTime.mul(1000).toNumber())
            : new Date(presaleInfo.endPresaleTime.mul(1000).toNumber());
        const interval = intervalToDuration({
          start: startDate,
          end: endDate,
        });
        setDays(Math.abs(differenceInDays(endDate, startDate)));
        setHours(interval.hours);
        setMinutes(interval.minutes);
        setSeconds(interval.seconds);
        setCurrentTime(startDate);
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [presaleInfo, currentTime]);

  const formatedDate = () => {
    return formatDuration(
      {
        days,
        hours,
        minutes,
        seconds,
      },
      { delimiter: ":" }
    ).replace(
      /\sday(s?)|\shour(s?)|\sminute(s?)|\ssecond(s?)/gi,
      (x: string) => {
        switch (x) {
          case " day":
          case " days":
            return "D";
          case " hour":
          case " hours":
            return "H";
          case " minute":
          case " minutes":
            return "M";
          case " second":
          case " seconds":
            return "S";
          default:
            return "";
        }
      }
    );
  };

  switch (checkSalePhase(presaleInfo)) {
    case PresalePhases.PresalePhase:
      return (
        <RowBetween>
          <StyledText fontSize="14px" color={lightColors.sidebarColor}>
            Presale Ends in
          </StyledText>
          <StyledText
            fontSize="14px"
            fontWeight="bold"
            color={lightColors.failure}
          >
            {formatedDate()}
          </StyledText>
        </RowBetween>
      );
    case PresalePhases.PresaleNotStarted:
      return (
        <RowBetween>
          <StyledText fontSize="14px" color={lightColors.textSubtle}>
            Presale Starts in
          </StyledText>
          <StyledText
            fontSize="14px"
            fontWeight="bold"
            color={lightColors.textSubtle}
          >
            {formatedDate()}
          </StyledText>
        </RowBetween>
      );
    case PresalePhases.PresaleEnded:
      return (
        <StyledText fontSize="14px" color={lightColors.textSubtle}>
          This presale has ended
        </StyledText>
      );
    case PresalePhases.PresaleCancelled:
      return (
        <StyledText fontSize="14px" color={lightColors.textSubtle}>
          This presale has been cancelled
        </StyledText>
      );
    case PresalePhases.ClaimPhase:
      return (
        <StyledText fontSize="14px" color={lightColors.success}>
          Presale has been finalized
        </StyledText>
      );
    default:
      return <></>;
  }
};

const PresaleCard = ({ presaleAddress, viewPresaleHandler }: Props) => {
  const { account } = useWeb3React();

  const [currency, setCurrency] = useState("BNB");
  const [isAccountWhitelisted, setIsAccountWhitelisted] = useState(false);
  const [presaleInfo, setPresaleInfo] = useState<PresaleInfo>();
  const [presaleFeeInfo, setPresaleFeeInfo] = useState<FeeInfo>();
  const [claimableTokens, setClaimableTokens] = useState<BigNumber>();
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>();

  const presaleContract = usePresaleContract(presaleAddress);
  const presaleToken = useToken(presaleInfo?.presaleToken);
  const paymentToken = useToken(
    presaleFeeInfo?.paymentToken !== NULL_ADDRESS
      ? presaleFeeInfo?.paymentToken
      : undefined
  );

  useEffect(() => {
    async function checkIfAccountWhitelisted() {
      setIsAccountWhitelisted(
        (await presaleContract?.getWhitelist()).includes(account)
      );
    }
    if (account && presaleContract) {
      checkIfAccountWhitelisted();
    } else {
      setIsAccountWhitelisted(false);
    }
  }, [account, presaleContract]);

  useEffect(() => {
    async function fetchClaimableTokens() {
      setClaimableTokens(
        await presaleContract?.getAvailableTokenToClaim(account)
      );
    }
    if (account && presaleContract) fetchClaimableTokens();
  }, [account, presaleContract]);

  useEffect(() => {
    async function fetchData() {
      const preInfo = await fetchPresaleInfo(presaleContract);
      const feeInfo = await fetchFeeInfo(presaleContract);
      const projDetails = await fetchProjectDetails(presaleContract);
      setPresaleInfo({ ...preInfo });
      setPresaleFeeInfo({ ...feeInfo });
      setProjectDetails({ ...projDetails });
    }
    if (presaleContract) {
      fetchData();
    }
  }, [presaleContract]);

  useEffect(() => {
    if (presaleFeeInfo) {
      const currentCurrency = Object.keys(TOKEN_CHOICES).find(
        (key) =>
          TOKEN_CHOICES[key as keyof typeof TOKEN_CHOICES] ===
          presaleFeeInfo?.paymentToken
      );
      setCurrency(currentCurrency as string);
    }
  }, [presaleFeeInfo]);

  return (
    <StyledCard marginX="4px">
      <PresaleTags
        isAccountWhitelisted={isAccountWhitelisted}
        presaleInfo={presaleInfo}
      />
      <StyledText marginTop="16px" fontWeight="bold" fontSize="18px">
        {projectDetails?.projectName}
      </StyledText>
      <Flex marginTop="8px">
        {projectDetails ? (
          <StyledImage src={projectDetails.logoUrl} />
        ) : (
          <Box height="48px" />
        )}
        <Flex
          marginLeft="8px"
          flexDirection="column"
          justifyContent="space-between"
        >
          <StyledText fontWeight="bold">{presaleToken?.symbol}</StyledText>
          <StyledText fontSize="14px">{`1 ${currency} = ${formatUnits(
            presaleInfo?.presaleRate || 0
          )} ${presaleToken?.symbol || ""}`}</StyledText>
        </Flex>
      </Flex>
      <Flex
        marginTop="12px"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <StyledText fontSize="12px">Soft / Hard</StyledText>
        <StyledText fontWeight="bold" fontSize="20px">
          {`${formatUnits(
            presaleInfo?.softcap || 0,
            paymentToken?.decimals
          )} ${currency} - ${formatUnits(
            presaleInfo?.hardcap || 0,
            paymentToken?.decimals
          )} ${currency}`}
        </StyledText>
      </Flex>
      <Box marginTop="8px">
        <RowBetween>
          <StyledText fontSize="12px">
            {`${formatUnits(
              presaleInfo?.softcap || 0,
              paymentToken?.decimals
            )} ${currency}`}
          </StyledText>
          <StyledText fontSize="12px">
            {`${formatUnits(
              presaleInfo?.hardcap || 0,
              paymentToken?.decimals
            )} ${currency}`}
          </StyledText>
        </RowBetween>
        <ProgressWrapper>
          <LinearProgress
            variant="determinate"
            value={presaleInfo?.totalBought
              .mul(100)
              .div(presaleInfo.hardcap)
              .toNumber()}
          />
        </ProgressWrapper>
        <StyledText fontSize="12px">
          {presaleInfo &&
          new Date() <
            new Date(presaleInfo.startPresaleTime.mul(1000).toNumber()) ? (
            <StyledText fontSize="12px">Presale hasn’t started yet</StyledText>
          ) : (
            <StyledText fontSize="12px">
              <StyledText
                style={{ display: "inline-block" }}
                fontSize="12px"
                fontWeight="bold"
                color={lightColors.linkColor}
              >
                {`${presaleInfo?.totalBought
                  .mul(100)
                  .div(presaleInfo.hardcap)
                  .toNumber()}%`}
              </StyledText>
              &nbsp;reached (
              {`${formatUnits(
                presaleInfo?.totalBought || 0,
                paymentToken?.decimals
              )} ${currency}`}
              )
            </StyledText>
          )}
        </StyledText>
      </Box>
      <Box marginTop="16px">
        <RowBetween>
          <StyledText fontSize="14px">Liquidity</StyledText>
          <StyledText fontSize="14px">{`${presaleInfo?.liquidity
            .mul(100)
            .div(10 ** FEE_DECIMALS)}%`}</StyledText>
        </RowBetween>
        <RowBetween>
          <StyledText fontSize="14px">Lockup Time</StyledText>
          <StyledText fontSize="14px">
            {presaleInfo?.liquidyLockTimeInMins.div(60).toString()}
          </StyledText>
        </RowBetween>
        <StyledText
          fontSize="10px"
          style={{ height: "16px" }}
          marginTop="2px"
          marginBottom="8px"
          color={lightColors.warning}
        >
          {presaleInfo?.isClaimPhase && account && claimableTokens?.gt(0)
            ? "You haven’t claimed your token yet"
            : ""}
        </StyledText>
      </Box>
      <Button
        color="success"
        onClick={() => viewPresaleHandler(presaleAddress)}
        fullWidth
      >
        View Presale
      </Button>
      <Box marginTop="8px">
        <PresalePhaseTitle presaleInfo={presaleInfo} />
      </Box>
    </StyledCard>
  );
};

export default PresaleCard;
