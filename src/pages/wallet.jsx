import { useAccount, useBalance } from 'wagmi';
import {useIsMounted } from './useisMounted';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';

function Wallet() {
  const mounted = useIsMounted();
  const {address} = useAccount()
  const {data} = useBalance({
    address: address,
  })

  const customTheme = lightTheme({
    accentColor: '#40A578',
    accentColorForeground: 'white',
    borderRadius: 'small',
    fontStack: 'system',
    overlayBlur: 'small',
  })

  return(
    <RainbowKitProvider theme = {customTheme}>
      <div>
        <ConnectButton />
      </div>
    </RainbowKitProvider>
  )

}

export default Wallet;