import { useMemo } from "react";
import styled from "styled-components";
import { Typography } from "@mui/material";
import { Box } from "../../../components/Box";
import { darkColors, lightColors } from "../../../theme/colors";

export const Divider = styled(Box)<{ infoDivider?: boolean }>`
  width: 100%;
  max-width: 950px;
  height: 0px;
  border-bottom: ${({ infoDivider }) => (infoDivider ? "8px" : "1px")} solid
    ${lightColors.inputColor};
`;

export const StyledText = styled(Typography)`
  word-wrap: break-word;
  word-break: break-word;
  font-size: ${({ fontSize }) => fontSize?.toString() || "16px"};
  @media (max-width: 480px) {
    font-size: ${({ fontSize }) => `calc(${fontSize} - 2px)` || "14px"};
  }
`;

export const DetailText = styled(Typography)`
  min-width: fit-content;
  margin-right: 15px;
  font-size: 16px;
  @media (max-width: 480px) {
    font-size: 12px;
    font-size: ${({ fontSize }) => `calc(${fontSize} - 4px)` || "14px"};
  }
`;
export const DetailTextValue = styled(Typography)`
  word-wrap: break-word;
  word-break: break-word;
  text-align: right;
  font-size: 16px;
  @media (max-width: 480px) {
    font-size: 12px;
    font-size: ${({ fontSize }) => `calc(${fontSize} - 4px)` || "14px"};
  }
`;

export const usePaginationStyles = () => {
  const paginationStyle = useMemo(
    () => ({
      "& .MuiPaginationItem-ellipsis": {
        background: "none",
      },
      "& .Mui-selected": {
        color: lightColors.sidebarColor,
        background: `#1976d2 !important`,
        fontWeight: "700",
      },
      "& .Mui-disabled": {
        background: darkColors.textDisabled,
        color: lightColors.textSubtle,
        opacity: "1 !important",
      },
    }),
    []
  );
  return paginationStyle;
};
