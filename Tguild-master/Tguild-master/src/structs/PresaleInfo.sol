pragma solidity 0.8.6;

struct PresaleInfo {
  address presaleToken;
  address router0; // router TGuildSwap
  address router1; // router pancakeSwap
  address listingToken; // address(0) is native Token
  uint256 presalePrice; // in wei
  uint256 listingPrice; // in wei
  uint256 liquidityLockTime; // in seconds
  uint256 minBuy; // in wei
  uint256 maxBuy; // in wei
  uint256 softCap; // in wei
  uint256 hardCap; // in wei
  uint256 liquidityPercentage;
  uint256 startPresaleTime;
  uint256 endPresaleTime;
  uint256 totalBought; // in wei
  uint8 refundType; // 0 refund, 1 burn
  uint8 listingChoice; // 0 100% TS, 1 100% PS, 2 (75% TS & 25% PS), 3 (75% PK & 25% SS)
  bool isWhiteListPhase;
  bool isClaimPhase;
  bool isPresaleCancelled;
  bool isWithdrawCancelledTokens;
}
