import styled from "styled-components";

const Tag = styled.span`
  font-family: "Roboto";
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 16px;
  border-radius: 500px;
  color: #ffffff;
  padding: 4px 12px;
  margin-right: 8px;
  @media (max-width: 480px) {
    font-size: 7px;
  }
`;

export default Tag;
