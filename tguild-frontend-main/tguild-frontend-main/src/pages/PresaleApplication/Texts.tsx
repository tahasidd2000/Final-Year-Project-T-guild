import styled from "styled-components";
import { Typography } from "@mui/material";

export const Heading = styled(Typography)`
  font-size: 20px;
  font-weight: 700;
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

export const Caption = styled(Typography)`
  font-size: 12px;
  line-height: 18px;
  display: inline-block;
  max-width: 400px;
`;
export const XSmallText = styled(Typography)`
  font-size: 10px;
  line-height: 16px;
`;
