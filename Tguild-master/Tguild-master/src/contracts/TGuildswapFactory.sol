pragma solidity =0.5.16;

import "./interfaces/ITGuildswapFactory.sol";
import "./TGuildswapPair.sol";

contract TGuildswapFactory is ITGuildswapFactory {
  bytes32 public constant INIT_CODE_PAIR_HASH = keccak256(abi.encodePacked(type(TGuildswapPair).creationCode));

  address public feeTo;
  address public feeToSetter;

  address operator;

  mapping(address => mapping(address => address)) public getPair;
  address[] public allPairs;

  event PairCreated(address indexed token0, address indexed token1, address pair, uint256);

  constructor(address _feeToSetter) public {
    feeToSetter = _feeToSetter;
    operator = msg.sender;
  }

  function allPairsLength() external view returns (uint256) {
    return allPairs.length;
  }

  function createPair(address tokenA, address tokenB) external returns (address pair) {
    require(tokenA != tokenB, "TGuildswap: IDENTICAL_ADDRESSES");
    (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
    require(token0 != address(0), "TGuildswap: ZERO_ADDRESS");
    require(getPair[token0][token1] == address(0), "TGuildswap: PAIR_EXISTS"); // single check is sufficient
    bytes memory bytecode = type(TGuildswapPair).creationCode;
    bytes32 salt = keccak256(abi.encodePacked(token0, token1));
    assembly {
      pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
    }
    ITGuildswapPair(pair).initialize(token0, token1, operator);
    getPair[token0][token1] = pair;
    getPair[token1][token0] = pair; // populate mapping in the reverse direction
    allPairs.push(pair);
    emit PairCreated(token0, token1, pair, allPairs.length);
  }

  function setFeeTo(address _feeTo) external {
    require(msg.sender == feeToSetter, "TGuildswap: FORBIDDEN");
    feeTo = _feeTo;
  }

  function setFeeToSetter(address _feeToSetter) external {
    require(msg.sender == feeToSetter, "TGuildswap: FORBIDDEN");
    feeToSetter = _feeToSetter;
  }
}
