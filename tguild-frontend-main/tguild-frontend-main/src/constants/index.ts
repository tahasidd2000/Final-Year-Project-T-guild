import { ChainId, Token } from '@koda-finance/summitswap-sdk'


export const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID ?? '56')
export const nodes = ["https://data-seed-prebsc-1-s2.binance.org:8545/"]

export const BASE_BSC_SCAN_URLS = {
    [ChainId.MAINNET]: 'https://bscscan.com',
    [ChainId.BSCTESTNET]: 'https://testnet.bscscan.com',
}
  
// TODO fix addresses
export const ROUTER_ADDRESS = '0xD7803eB47da0B1Cf569F5AFf169DA5373Ef3e41B'
export const PANCAKESWAP_ROUTER_V2_ADDRESS = "0xD7803eB47da0B1Cf569F5AFf169DA5373Ef3e41B"

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
export const DEAD_ADDRESS = '0x000000000000000000000000000000000000dEaD'
export const MAX_UINT256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935'


export const BUSD = {
    [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'Binance USD'),
    [ChainId.BSCTESTNET]: new Token(ChainId.BSCTESTNET, '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7', 18, 'BUSD', 'Binance USD'),
  }[CHAIN_ID] as Token;
  
export const USDC = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 18, 'USDC', 'USD Coin'),
  [ChainId.BSCTESTNET]: new Token(ChainId.BSCTESTNET, '0x64544969ed7EBf5f083679233325356EbE738930', 18, 'USDC', 'USD Coin'),
}[CHAIN_ID] as Token;

export const USDT = {
  [ChainId.MAINNET]:  new Token(ChainId.MAINNET, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD'),
  [ChainId.BSCTESTNET]: new Token(ChainId.BSCTESTNET, '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd', 18, 'USDT', 'Tether USD'),
}[CHAIN_ID] as Token;

export const FACTORY_ADDRESS = '0xb7926c0430afb07aa7defde6da862ae0bde767bc'
export const PANCAKESWAP_FACTORY_ADDRESS = '0xb7926c0430afb07aa7defde6da862ae0bde767bc'
