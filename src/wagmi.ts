import { getDefaultConfig } from '@rainbow-me/rainbowkit';

import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  haqqMainnet,
  haqqTestedge2
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    haqqMainnet,
    haqqTestedge2,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});