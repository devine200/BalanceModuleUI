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
    <div>Hello</div>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App moduleId="0x000000000000000000000000f31467c0ca100abef512002183de7dcbeb9d2fc0000000000000000000000000abd9ca667bc2c737996929c2c9c5fc94af947fd2" />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
