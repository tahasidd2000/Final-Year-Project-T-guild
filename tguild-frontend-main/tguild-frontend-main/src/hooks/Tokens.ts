import {  Token } from '@koda-finance/summitswap-sdk'
import { useEffect, useMemo, useState } from 'react'
// eslint-disable-next-line import/no-cycle
import { isAddress } from '../utils'
import {  useTokenContract } from './useContract'
import { useActiveWeb3React } from '../hooks'

export function useToken(tokenAddress?: string): Token | undefined | null {
  const { chainId } = useActiveWeb3React()
  
  const [tokenName, setTokenName] = useState<string>()
  const [symbol, setSymbol] = useState<string>()
  const [decimals, setDecimals] = useState({loading: true, result: undefined})

  const address = isAddress(tokenAddress)

  const tokenContract = useTokenContract(address || undefined, false)
  const token: Token | undefined = undefined

  useEffect(() => {
    async function fetchData() {
      setTokenName(await tokenContract?.name());
      setSymbol(await tokenContract?.symbol());
      setDecimals({result: await tokenContract?.decimals(), loading: false});
    }
    if(tokenContract && address ) fetchData()
  },[tokenContract, address])


  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    if (decimals.loading) return null
    if (decimals.result) {
      return new Token(
        chainId,
        address,
        decimals.result,
        symbol,
        tokenName
      )
    }
    return undefined
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol,
    token,
    tokenName,
  ])
}