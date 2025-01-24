import { Buffer } from 'buffer'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'

import App from './App.tsx'
import { config } from './wagmi.ts'

import './index.css'

// @ts-ignore
globalThis.Buffer = Buffer

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App moduleId="0x00000000000000000000000044edbc1b4d7f235fc62e4a73f6324740327fff3b0000000000000000000000006d296458a3df350390a57c4a5b536736415707d8" />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
