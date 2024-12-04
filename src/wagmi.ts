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
    [avalancheFuji.id]: http(),
    [bscTestnet.id]: http(),
  },
  ssr: true
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
