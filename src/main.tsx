import { Buffer } from 'buffer'
import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import TradableSDKProvider from '.'
import { ModalState, TradableConfig } from './types'
import Click from './components/Click'

// @ts-ignore
globalThis.Buffer = Buffer
const tradableConfig:TradableConfig = {
  app_name: "Tradable Demo",
  moduleId: "0x0000000000000000000000000c83b376d8ba8ef5baed8a5a890f37ebd591b9690000000000000000000000003b6b709e8720bd847b564a446205c7aa2e0d5451",
  initialModal: {
    modalState: ModalState.USER_INTERFACE,
    optionalData: {},
  },
  moduleFuncConfig: {
    "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000566756e6331000000000000000000000000000000000000000000000000000000":{
      interactType: "Protocol Deposit",
      interactDescription: "Deposit from your tradable balance to your protocol balance", 
    },
    "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000566756e6332000000000000000000000000000000000000000000000000000000":{
      interactType: "Protocol Withdraw",
      interactDescription: "Withdraw from your tradable balance to your protocol balance", 
    },
    "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000566756e6333000000000000000000000000000000000000000000000000000000":{
      interactType: "Protocol Transfer",
      interactDescription: "Transfer from your tradable balance to your protocol balance", 
    },
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TradableSDKProvider  {...tradableConfig}>
      <Click />
    </TradableSDKProvider>
  </React.StrictMode>,
)
