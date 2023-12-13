import { BUSD, USDC, USDT, NULL_ADDRESS } from '.'

export const PRESALE_FACTORY_ADDRESS = "0xc34e2601c66FabF1A6Fd087aecc479F3B204952f"

export const FEE_PAYMENT_TOKEN = 2 // 2%
export const FEE_PRESALE_TOKEN = 2 // 2%
export const FEE_EMERGENCY_WITHDRAW = 10 // 2%

export const FEE_DECIMALS = 9

export const PRESALE_CARDS_PER_PAGE = 9
export const ADDRESS_PER_PAGE = 5
export const PRESALES_PER_PAGE_ADMIN_PANEL = 10

export const CONTACT_INFO_DELIMITER = '.|*|.'

export const RADIO_VALUES = {
  WHITELIST_ENABLED: true,
  WHITELIST_DISABLED: false,
  VESTING_ENABLED: true,
  VESTING_DISABLED: false,
  REFUND_TYPE_REFUND: 0,
  REFUND_TYPE_BURN: 1,
  LISTING_SS_100: 0, // 100% liquididty added to uniswap
  LISTING_PS_100: 1, // 25% liquididty added to pancakeswap
  LISTING_SS75_PK25: 2, // 50% liquididty added to uniswap + 50% added to pancakeswap
}

export const TOKEN_CHOICES = {
  BNB: NULL_ADDRESS,
  BUSD: BUSD.address,
  USDC: USDC.address,
  USDT: USDT.address,
}

export const ROUTER_OPTIONS = [
  {
    label: 'Uniswap',
    value: `${RADIO_VALUES.LISTING_SS_100}`,
  },
  {
    label: 'Pancakeswap',
    value: `${RADIO_VALUES.LISTING_PS_100}`,
  },
  {
    label: 'Both',
    value: `${RADIO_VALUES.LISTING_SS75_PK25}`,
  },
]

export const CONTACT_METHOD_OPTIONS = [
  {
    label: 'Telegram',
    value: 'Telegram',
  },
  {
    label: 'Discord',
    value: 'Discord',
  },
  {
    label: 'Email',
    value: 'Email',
  },
]

export const HEADERS_WHITELIST = [
  { label: 'Number', key: 'number' },
  { label: 'Wallet', key: 'wallet' },
]

export const HEADERS_CONTRIBUTORS = [
  { label: 'Number', key: 'number' },
  { label: 'Wallet', key: 'wallet' },
  { label: 'Currency', key: 'currency' },
  { label: 'Amount', key: 'amount' },
]

export const ALL_PRESALE_OPTION = {
  value: 'All Presales',
  label: 'Default (All)',
}

export const PUBLIC_ONLY_OPTION = {
  value: 'Public',
  label: 'Public Only',
}

export const WHITELIST_ONLY = {
  value: 'Whitelist',
  label: 'Whitelist Only',
}
