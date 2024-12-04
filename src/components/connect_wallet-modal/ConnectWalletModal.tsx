import "./connect-wallet.css";
import CloseBtn from "../../close-btn.tsx";
import { AppFeatures, ConnectWallet, ModalState } from "../../types.ts";
import { useEffect } from "react";
import metaMaskLogo from "../../images/meta_mask.png";
import walletConnectLogo from "../../images/Walletconnect-logo.png";

import { useAccount, useConnect } from "wagmi";

interface ConnectWalletModalProps extends ConnectWallet, AppFeatures {
  nextModal: ModalState;
}

const ConnectWalletModal = ({
  nextModal,
  closeModal,
  changeModal,
}: ConnectWalletModalProps) => {
  const { connect, connectors } = useConnect();
  const { isConnected } = useAccount();

  const wallets = [
    {
      name: "MetaMask",
      logo: metaMaskLogo,
      async handleConnect() {
        connect({ connector: connectors[0] });
      },
    },
    {
      name: "Wallet Connect",
      logo: walletConnectLogo,
      async handleConnect() {
        connect({
          connector: connectors[1]
        });
      },
    },
  ];

  useEffect(()=>{
    console.log(connectors[0].name);
    console.log(connectors[1].name);
  }, [])

  useEffect(() => {
    if (!isConnected) return;
    changeModal!({
      modalState: nextModal,
      optionalData: {},
    });
  }, [isConnected]);

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
            onClick={async () => {
              await wallet.handleConnect();
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
