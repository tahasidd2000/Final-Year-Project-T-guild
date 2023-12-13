// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.6;

pragma experimental ABIEncoderV2;

import "./interfaces/ITGuildCustomPresale.sol";
import "./interfaces/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "../structs/PresaleInfo.sol";
import "../structs/PresaleFeeInfo.sol";

contract TGuildFactoryPresale is Ownable {
  mapping(address => address[]) public accountPresales;
  mapping(address => address[]) public tokenPresales; // token => presale

  address[] public presales;
  address public serviceFeeReceiver;
  address public libraryAddress;
  uint256 public preSaleFee = 0.001 ether;

  constructor(uint256 _preSaleFee, address _feeReceiver) {
    preSaleFee = _preSaleFee;
    serviceFeeReceiver = _feeReceiver;
  }

  function createPresale(
    string[8] memory projectDetails,
    PresaleInfo memory presale,
    PresaleFeeInfo memory feeInfo,
    uint256 tokenAmount
  ) external payable {
    require(libraryAddress != address(0), "Set library address first");
    require(msg.value >= preSaleFee, "Not Enough Fee");
    require(presale.startPresaleTime > block.timestamp, "Presale startTime > block.timestamp");
    require(presale.endPresaleTime > presale.startPresaleTime, "Presale End time > presale start time");
    require(presale.liquidityLockTime >= 300, "liquidityLockTime >= 300 seconds");
    require(presale.minBuy < presale.maxBuy, "MinBuy should be less than maxBuy");
    require(
      presale.softCap >= (presale.hardCap * 50) / 100 && presale.softCap <= presale.hardCap,
      "Softcap should be greater than or equal to 50% of hardcap"
    );
    require(
      presale.liquidityPercentage >= 250000000 && presale.liquidityPercentage <= 1000000000,
      "Liquidity Percentage should be between 25% & 100%"
    );
    require(presale.refundType <= 1, "refundType should be between 0 or 1");
    require(presale.listingChoice <= 3, "listingChoice should be between 0 & 3");

    if (tokenPresales[presale.presaleToken].length > 0) {
      ITGuildCustomPresale _presale = ITGuildCustomPresale(
        tokenPresales[presale.presaleToken][tokenPresales[presale.presaleToken].length - 1]
      );
      require(_presale.isPresaleCancelled(), "Presale Already Exists");
    }

    address presaleClone = Clones.clone(libraryAddress);

    ITGuildCustomPresale(presaleClone).initialize(projectDetails, presale, feeInfo, serviceFeeReceiver, msg.sender);

    tokenPresales[presale.presaleToken].push(address(presaleClone));
    accountPresales[msg.sender].push(address(presaleClone));
    presales.push(address(presaleClone));
    if (serviceFeeReceiver != address(this)) {
      address payable feeReceiver = payable(serviceFeeReceiver);
      feeReceiver.transfer(preSaleFee);
    }

    IERC20(presale.presaleToken).transferFrom(msg.sender, address(presaleClone), tokenAmount);
  }

  function getPresaleAddresses() external view returns (address[] memory) {
    return presales;
  }

  function getTokenPresales(address _address) external view returns (address[] memory) {
    return tokenPresales[_address];
  }

  function getAccountPresales(address _address) external view returns (address[] memory) {
    return accountPresales[_address];
  }

  function setLibraryAddress(address _libraryAddress) external onlyOwner {
    libraryAddress = _libraryAddress;
  }

  function setServiceFeeReceiver(address _feeReceiver) external onlyOwner {
    serviceFeeReceiver = _feeReceiver;
  }

  function withdraw(address _feeReceiver) public onlyOwner {
    address payable to = payable(_feeReceiver);
    to.transfer(address(this).balance);
  }

  function setFee(uint256 _fee) external onlyOwner {
    preSaleFee = _fee;
  }
}
