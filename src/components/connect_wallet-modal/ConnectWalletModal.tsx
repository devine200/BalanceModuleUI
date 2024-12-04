import "./connect-wallet.css";
import CloseBtn from "../../close-btn.tsx";
import { AppFeatures, ModalInfo } from "../../types.ts";
import { useState } from "react";
import metaMaskLogo from "../../images/meta_mask.png";
import walletConnectLogo from "../../images/Walletconnect-logo.png";

import { useConnect } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";

interface ConnectWalletModalProps extends AppFeatures {
    nextModal: ModalInfo
}

const ConnectWalletModal = ({ nextModal, closeModal, changeModal }: ConnectWalletModalProps) => {
  const { connect } = useConnect();

  const wallets = [
    {
      name: "MetaMask",
      logo: metaMaskLogo,
      handleConnect() {
        connect({ connector: injected()});
      },
    },
    {
      name: "Wallet Connect",
      logo: walletConnectLogo,
      handleConnect() {
        connect({ connector: walletConnect({ projectId: import.meta.env.VITE_WC_PROJECT_ID, relayUrl: 'ws://relay.walletconnect.org', })});
      },
    },
  ];

  return (
    <div className="app-modal connect-modal">
      <CloseBtn closeModal={closeModal!} />
      <div className="modal-heading">
        <span className="modal-topic">Connect Wallet</span>
      </div>
      <small>Tradable</small>

      <div className="connect-details">
        {wallets.map((wallet, index) => (
          <div
            key={index}
            className="connect-detail hoverable"
            onClick={()=>{
                wallet.handleConnect()
                changeModal!(nextModal)
            }}
          >
            <span>{wallet?.name}</span>
            <span>
              <img src={wallet?.logo} alt={wallet?.name} width={20} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectWalletModal;
