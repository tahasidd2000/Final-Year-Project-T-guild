import { Option } from 'react-dropdown'
import { ROUTER_ADDRESS, PANCAKESWAP_ROUTER_V2_ADDRESS } from "."


export enum TokenType {
  Standard = 'Standard',
  Liquidity = 'Liquidity',
}

export const TOKEN_CREATOR_ADDRESS = {
  [TokenType.Standard]: '0x867938fF6042C3da6B4C6186174B663dfa4a3Cfc',
  [TokenType.Liquidity]: '0x7302CaD6e38DC4C67B28cF6cFa509ae5A8621F15',
}

export const STANDARD_TOKEN_OPTION : Option= {
  value: TokenType.Standard,
  label: `${TokenType.Standard} Token`
}

export const LIQUIDITY_TOKEN_OPTION: Option = {
  value: TokenType.Liquidity,
  label: `${TokenType.Liquidity} Token`
}

export const UNISWAP_ROUTER_OPTION: Option = { value: ROUTER_ADDRESS, label: 'Uniswap Router' }
export const PANCAKESWAP_ROUTER_OPTION: Option = { value: PANCAKESWAP_ROUTER_V2_ADDRESS, label: 'Pancakeswap Router' }

export const BSC_SCAN = "https://testnet.bscscan.com/"

export const MAX_TOKEN_SUPPLY = "500000000000000000000"

export const MIN_TAX_VALUE = 0.01
export const MAX_TOTAL_TAX_VALUE = 25

