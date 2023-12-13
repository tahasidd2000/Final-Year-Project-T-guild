import { UnsupportedChainIdError } from '@web3-react/core'
import { InjectedConnector,NoEthereumProviderError } from '@web3-react/injected-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'
import {  BASE_BSC_SCAN_URLS, nodes } from '../constants'

const injected = new InjectedConnector({
  supportedChainIds: [97],
})



export const setupNetwork = async () => {
  const provider = window.ethereum
  if (provider) {
    const chainId = parseInt('97' as string, 10)
    try {
      await (provider as any).request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: 'Testnet',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'bnb',
              decimals: 18,
            },
            rpcUrls: nodes,
            blockExplorerUrls: [`${BASE_BSC_SCAN_URLS[97]}/`],
          },
        ],
      })
      return true
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error)
      return false
    }
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
    return false
  }
}


export default async function login(
  connectorId: string,
  activate: (connector: AbstractConnector, onError?: (error: Error) => void, throwErrors?: boolean) => Promise<void>
) {
  if (connectorId === 'walletconnect') {
    // await activate(walletconnect())
  } else if (connectorId === 'bsc') {
    // await activate(bsc)
  } else {
    await activate(injected, async (error: Error) => {
      if (error instanceof UnsupportedChainIdError) {
        const hasSetup = await setupNetwork()
        if (hasSetup) {
          activate(injected)
        }
      } else {
        window.localStorage.removeItem("connectorId")
        if (error instanceof NoEthereumProviderError ) {
          window.alert('Provider Error, No provider was found')
        } else {
          window.alert(`${error.name}, ${error.message}`)
        }
      }
    })
  }
}
