// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.6;

pragma experimental ABIEncoderV2;

import "../../structs/PresaleFeeInfo.sol";
import "../../structs/PresaleInfo.sol";

interface ITGuildCustomPresale {
  function isPresaleCancelled() external view returns (bool);

  function initialize(
    string[8] memory,
    PresaleInfo memory,
    PresaleFeeInfo memory,
    address,
    address
  ) external;

  function getPresaleInfo() external view returns (PresaleInfo memory);

  function updatePresale(PresaleInfo memory _presale, PresaleFeeInfo memory _feeInfo, string[8] memory) external;
}
