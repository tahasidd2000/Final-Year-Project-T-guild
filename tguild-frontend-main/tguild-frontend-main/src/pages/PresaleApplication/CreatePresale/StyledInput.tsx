import styled from "styled-components";
import { Input, Box } from "@mui/material";
import { lightColors } from "../../../theme/colors";

export const StyledInputWrapper = styled(Box)<{ forDate?: boolean }>`
  display: flex;
  flex-direction: column;
  width: "max-content";
  @media (max-width: 550px) {
    width: ${({ forDate }) => (forDate ? "100%" : "")};
    margin-right: ${({ forDate }) => (forDate ? "0" : "")};
  }
  @media (max-width: 480px) {
    width: 100%;
    margin-right: 0;
  }
`;

const StyledInput = styled(Input)<{ forTime?: boolean; forDate?: boolean }>`
  width: ${({ forTime }) => (forTime ? "150px" : "400px")};
  width: ${({ forDate }) => (forDate ? "355px" : "")};
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  color: ${lightColors.textSubtle};
  @media (max-width: 620px) {
    width: ${({ forTime }) => (forTime ? "150px" : "300px")};
  }
  @media (max-width: 750px) {
    width: ${({ forDate }) => (forDate ? "180px" : "")};
  }
  @media (max-width: 550px) {
    width: ${({ forTime, forDate }) => (forTime || forDate ? "100%" : "")};
  }
  @media (max-width: 480px) {
    width: 100%;
  }
`;
export default StyledInput;
