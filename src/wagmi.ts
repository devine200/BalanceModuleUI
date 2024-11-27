import { http, createConfig } from 'wagmi'
import { bscTestnet, avalancheFuji } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [bscTestnet, avalancheFuji],
  connectors: [
    injected(),
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }),
  ],
  transports: {
    [bscTestnet.id]: http(),
    [avalancheFuji.id]: http(),
  },
  ssr: true
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
