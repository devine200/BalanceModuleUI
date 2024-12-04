import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import AssetSelectionModal from "./components/deposit-modal/AssetSelectionModal";
import DepositModal from "./components/deposit-modal/DepositModal";
import InteractHistoryModal from "./components/Interact-modal/InteractHistoryModal";
import InteractModal from "./components/Interact-modal/InteractModal";
import TransactionLoadingModal from "./components/response-modal/TransactionLoadingModal";
import ResponseModal from "./components/response-modal/ResponseModal";
import ConnectWallet from "./components/connect_wallet-modal/ConnectWalletModal";
import ModalLayout from "./ModalLayout";
import { ModalState, ModalInfo, AppFeatures } from "./types";

import useGetUserTransactions from "./hooks/useGetUserTransaction";
import UserInterfaceDemo from "./components/user-interface-modal";

interface AppProp {
  moduleId: string;
}

function App({ moduleId }: AppProp) {
  const { isConnected } = useAccount();
  const [modalInfo, setModalInfo] = useState<ModalInfo>({
    modalState: ModalState.DEPOSIT_ASSET_SELECTION,
    optionalData: {},
  });

  const [currentModal, setCurrentModal] = useState<React.ReactElement>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const changeModal = (modalInfo: ModalInfo) => {
    setModalInfo(modalInfo);
  };

  const appFeatures: AppFeatures = {
    closeModal,
    changeModal,
    moduleId,
    userAddr: "0xb1459DCF16905F7c84F4C22398c9CcAAD7345669",
  };

  useEffect(()=> {
    if (isConnected || !isModalOpen) return;

    setIsModalOpen(true);
    setModalInfo({
      modalState: ModalState.CONNECT_WALLET,
      optionalData: {}
    })
  }, [isConnected])

  useEffect(() => {
    const modalProps = {
      ...(modalInfo.optionalData ? modalInfo.optionalData : {}),
      ...appFeatures,
    };
    if (modalInfo.modalState === ModalState.INTERACT) {
      setCurrentModal(<InteractModal {...modalProps} />);
    } else if (modalInfo.modalState === ModalState.RESPONSE) {
      setCurrentModal(<ResponseModal {...modalProps} />);
    } else if (modalInfo.modalState === ModalState.TRANS_LOADING) {
      setCurrentModal(<TransactionLoadingModal {...modalProps} />);
    } else if (modalInfo.modalState === ModalState.HISTORY) {
      setCurrentModal(<InteractHistoryModal {...modalProps} />);
    } else if (modalInfo.modalState === ModalState.DEPOSIT_LOADING) {
      setCurrentModal(<TransactionLoadingModal {...modalProps} />);
    } else if (modalInfo.modalState === ModalState.DEPOSIT_ASSET_SELECTION) {
      setCurrentModal(<AssetSelectionModal {...modalProps} />);
    } else if (modalInfo.modalState === ModalState.DEPOSIT) {
      setCurrentModal(<DepositModal {...modalProps} />);
    } else if (modalInfo.modalState === ModalState.CONNECT_WALLET) {
      setCurrentModal(<ConnectWallet {...modalProps} />);
    } else {
      setCurrentModal(<></>);
    }
  }, [modalInfo]);

  return (
    <ModalLayout>
      {isModalOpen ? currentModal : <UserInterfaceDemo />}
    </ModalLayout>
  );
}

export default App;
