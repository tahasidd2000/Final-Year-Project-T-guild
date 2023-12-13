/* eslint-disable react/no-array-index-key */
import React, { Children, isValidElement } from "react";
import styled from "styled-components";
import { space } from "styled-system";
import Box from "../Box/Box";
import { NavTabProps } from "./types";

const StyledNavTab = styled(Box)`
  align-items: center;
  display: flex;
  list-style-type: none;
  width: 100%;
  overflow: auto;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }

  ${space};
`;

const ChildTab = styled.li<{ isActive: boolean; index: number }>`
  min-width: max-content;
  cursor: pointer;
  margin-left: ${({ index }) => (index === 0 ? "0" : "12px")};
  margin-right: 12px;
  padding-bottom: 5px;
  border-bottom: 5px solid
    ${({ isActive }) => (isActive ? "#1976d2" : "transparent")};
  > div {
    color: ${({ isActive }) => isActive && "#1976d2"};
    font-weight: ${({ isActive }) => isActive && "700"};
  }
  @media screen and (min-width: 852px) {
    margin-left: ${({ index }) => (index === 0 ? "0" : "16px")};
    margin-right: 16px;
  }
`;

const NavTab: React.FC<NavTabProps> = ({
  activeIndex = 0,
  onItemClick,
  children,
}) => {
  const validItems = Children.toArray(children).filter((child) =>
    isValidElement(child)
  );

  return (
    <StyledNavTab>
      {validItems.map((item, index) => (
        <ChildTab
          onClick={onItemClick ? () => onItemClick(index) : undefined}
          isActive={activeIndex === index ? true : false}
          index={index}
          key={`child-${index}`}
        >
          {item}
        </ChildTab>
      ))}
    </StyledNavTab>
  );
};

export default NavTab;
