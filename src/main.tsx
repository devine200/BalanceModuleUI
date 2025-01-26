import { Buffer } from 'buffer'
import React from 'react'
import ReactDOM from 'react-dom/client'


import './index.css'
import TradableProvider from './TradableProvider.tsx'

// @ts-ignore
globalThis.Buffer = Buffer

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TradableProvider />
  </React.StrictMode>,
)
