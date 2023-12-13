import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { Box } from "../../components/Box";
import Tag from "../../components/Tag/Tag";
import styled from "styled-components";
import { RowFixed } from "../../components/Row";
import { checkSalePhase } from "../../utils/presale";
import { PresaleInfo, PresalePhases } from "./types";
import { lightColors } from "../../theme/colors";

const StyledText = styled(Typography)`
  font-size: ${({ fontSize }) => fontSize?.toString() || "16px"};
  @media (max-width: 480px) {
    font-size: ${({ fontSize }) => `calc(${fontSize} - 2px)` || "14px"};
  }
`;

interface Props {
  isAccountWhitelisted?: boolean;
  presaleInfo?: PresaleInfo;
}

const PresaleTags = ({ presaleInfo, isAccountWhitelisted }: Props) => {
  const [presalePhase, setPresalePhase] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (presaleInfo) {
      const presalePhase_ = checkSalePhase(presaleInfo);
      const timer = setTimeout(() => {
        if (presalePhase_ !== presalePhase) setPresalePhase(presalePhase_);
        if (
          presalePhase === PresalePhases.PresalePhase ||
          presalePhase === PresalePhases.PresaleNotStarted
        ) {
          setCurrentTime(new Date());
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [presaleInfo, currentTime, presalePhase]);

  useEffect(() => {
    if (presaleInfo) {
      setPresalePhase(checkSalePhase(presaleInfo));
    }
  }, [presaleInfo]);

  const SaleTypeTage = () => (
    <>
      {presaleInfo?.isWhitelistEnabled &&
        (isAccountWhitelisted ? (
          <Tag style={{ backgroundColor: lightColors.successDark }}>
            <StyledText fontWeight="bold" fontSize="12px">
              WHITELIST ONLY (Unlocked)
            </StyledText>
          </Tag>
        ) : (
          <Tag style={{ backgroundColor: lightColors.failure }}>
            <StyledText fontWeight="bold" fontSize="12px">
              WHITELIST ONLY (Locked)
            </StyledText>
          </Tag>
        ))}
    </>
  );

  if (!presaleInfo) return <Box height="26px" />;

  if (presalePhase === PresalePhases.PresaleNotStarted) {
    return (
      <RowFixed>
        <Tag style={{ backgroundColor: lightColors.binance }}>
          <StyledText fontWeight="bold" fontSize="12px">
            UPCOMING
          </StyledText>
        </Tag>
        {SaleTypeTage()}
      </RowFixed>
    );
  }
  if (presalePhase === PresalePhases.PresalePhase) {
    return (
      <RowFixed>
        <Tag style={{ backgroundColor: lightColors.success }}>
          <StyledText fontWeight="bold" fontSize="12px">
            LIVE
          </StyledText>
        </Tag>
        {SaleTypeTage()}
      </RowFixed>
    );
  }
  if (
    presalePhase === PresalePhases.PresaleEnded ||
    presalePhase === PresalePhases.ClaimPhase
  ) {
    return (
      <RowFixed>
        <Tag
          style={{ backgroundColor: lightColors.inputColor }}
        >
          <StyledText fontWeight="bold" fontSize="12px">
            ENDED
          </StyledText>
        </Tag>
        {SaleTypeTage()}
      </RowFixed>
    );
  }
  if (presalePhase === PresalePhases.PresaleCancelled) {
    return (
      <RowFixed>
        <Tag style={{ backgroundColor: lightColors.inputColor }}>
          <StyledText fontWeight="bold" fontSize="12px">
            CANCELLED
          </StyledText>
        </Tag>
        {SaleTypeTage()}
      </RowFixed>
    );
  }
  return <></>;
};

export default PresaleTags;
