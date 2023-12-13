import { Contract } from '@ethersproject/contracts'
import IUniswapV2PairABI  from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { useMemo } from 'react'
import { getContract } from '../utils'
import { useActiveWeb3React } from './index'
import { TokenType, TOKEN_CREATOR_ADDRESS } from '../constants/createToken'
import { PRESALE_FACTORY_ADDRESS } from '../constants/presale'
import CREATE_STANDARD_TOKEN_ABI from '../constants/abis/createStandardToken.json';
import CREATE_LIQUIDITY_TOKEN_ABI from '../constants/abis/createLiquidityToken.json';
import ERC20_ABI from '../constants/abis/erc20.json'
import PRESALE_FACOTRY_ABI from '../constants/abis/tguild-factory-presale.json'
import PRESALE_ABI from '../constants/abis/tguild-custom-presale.json'
import FACTORY_ABI from '../constants/abis/factory.json'
import { FACTORY_ADDRESS, PANCAKESWAP_FACTORY_ADDRESS } from '../constants/index'

export function useFactoryContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract(FACTORY_ADDRESS, FACTORY_ABI, withSignerIfPossible)
}

export function usePancakeswapFactoryContract(withSignerIfPossible?: boolean): Contract | null {
  return useContract(PANCAKESWAP_FACTORY_ADDRESS, FACTORY_ABI, withSignerIfPossible)
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2PairABI, withSignerIfPossible)
}

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, withSignerIfPossible, account])
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useTokenCreatorContract(tokenType: TokenType): Contract | null {
  let createTokenAbi
  switch(tokenType) {
    case TokenType.Standard:
      createTokenAbi = CREATE_STANDARD_TOKEN_ABI
      break
    case TokenType.Liquidity:
      createTokenAbi = CREATE_LIQUIDITY_TOKEN_ABI
      break
  }
  return useContract(TOKEN_CREATOR_ADDRESS[tokenType], createTokenAbi)
}

function useContracts(addresses: string[] | undefined, ABI: any, withSignerIfPossible = true): (Contract | null)[] {
  const { library, account } = useActiveWeb3React()
  return useMemo(() => {
    if (!addresses) {
      return [null]
    }
    return addresses?.map((address) => {
      if (!address || !ABI || !library) return null
      try {
        return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)
      } catch (error) {
        console.error('Failed to get contract', error)
        return null
      }
    })
  }, [addresses, ABI, library, withSignerIfPossible, account])
}

export function useFactoryPresaleContract(): Contract | null {
  return useContract(PRESALE_FACTORY_ADDRESS, PRESALE_FACOTRY_ABI)
}

export function usePresaleContract(presaleAddress: string): Contract | null {
  return useContract(presaleAddress, PRESALE_ABI)
}

export function usePresaleContracts(presaleAddresses: string[]): (Contract | null)[] {
  return useContracts(presaleAddresses, PRESALE_ABI)
}
