import { useState,useMemo, useEffect, useRef,useCallback } from 'react'
import { ethers } from 'ethers'

export default function useEthBalance(address: string) {
    const [balance, setBalance] = useState(0);
    // Using React ref here to prevent component re-rendering when changing
    // previous balance value
    const prevBalanceRef = useRef(0);
    const provider = useMemo(() => new ethers.providers.Web3Provider(window.ethereum),[]) 
    const fetchBalance = useCallback(async () => {
      const rawBalance = await provider.getBalance(address);
      // Format ETH balance and parse it to JS number
      const value = parseFloat(ethers.utils.formatEther(rawBalance));
  
      // Optimization: check that user balance has actually changed before
      // updating state and triggering the consuming component re-render
      if (value !== prevBalanceRef.current) {
        prevBalanceRef.current = value;
        setBalance(value);
      }
    }, []);
  
    useEffect(() => {
      fetchBalance();
    }, [fetchBalance]);
  
    useEffect(() => {
      // Fetch user balance on each block
      provider.on('block', fetchBalance);
  
      // Cleanup function is used to unsubscribe from 'block' event and prevent
      // a possible memory leak in your application.
      return () => {
        provider.off('block', fetchBalance);
      };
    }, [fetchBalance, provider]);
  
    return balance;
  }
