import { http, createConfig, CreateConnectorFn } from 'wagmi'
import { bscTestnet, avalancheFuji } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [bscTestnet, avalancheFuji],
  connectors: [
    injected() as CreateConnectorFn,
    walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID }) as CreateConnectorFn,
  ],
  transports: {
    [avalancheFuji.id]: http(import.meta.env.AVALANCHE_TESTNET_URL),
    [bscTestnet.id]: http(import.meta.env.BSC_TESTNET_URL),
  },
  ssr: true
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
