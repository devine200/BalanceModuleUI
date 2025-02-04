import { useState, useEffect, useContext } from "react";
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

import UserInterfaceDemo from "./components/user-interface-modal";
import WithdrawalModal from "./components/withdraw-modal/WithdrawalModal";
import InteractConfirmModal from "./components/Interact-modal/InteractConfirmModal";
import { AppConfigContext } from "./contexts";

function App() {
	const { isConnected } = useAccount();
	const { address } = useAccount();

	const { website, moduleId, appState, dispatchAppState } =
		useContext(AppConfigContext);
		
	const { isModalOpen, modalInfo } = appState;

	const [currentModal, setCurrentModal] = useState<React.ReactElement>();

	const closeModal = () => {
		dispatchAppState({ isModalOpen: false });
	};

	const changeModal = (modalInfo: ModalInfo) => {
		dispatchAppState({ isModalOpen: true, modalInfo });
	};

	const appFeatures: AppFeatures = {
		closeModal,
		changeModal,
		moduleId,
		userAddr: address,
		website,
	};

	useEffect(() => {
		if (isConnected || !isModalOpen) return;

		dispatchAppState({
			modalInfo: {
				modalState: ModalState.CONNECT_WALLET,
				optionalData: {
					nextModal: ModalState.USER_INTERFACE,
				},
			},
		});
	}, [isConnected]);

	useEffect(() => {
		const modalProps = {
			...(modalInfo.optionalData ? modalInfo.optionalData : {}),
			...appFeatures,
		};

		if (!isModalOpen) {
			setCurrentModal(<UserInterfaceDemo {...modalProps} />);
			return;
		}

		if (modalInfo.modalState === ModalState.INTERACT) {
			setCurrentModal(<InteractModal {...modalProps} />);
		} else if (modalInfo.modalState === ModalState.INTERACT_CONFIRM) {
			setCurrentModal(<InteractConfirmModal {...modalProps} />);
		} else if (modalInfo.modalState === ModalState.RESPONSE) {
			setCurrentModal(<ResponseModal {...modalProps} />);
		} else if (modalInfo.modalState === ModalState.HISTORY) {
			setCurrentModal(<InteractHistoryModal {...modalProps} />);
		} else if (modalInfo.modalState === ModalState.TRANS_LOADING) {
			setCurrentModal(<TransactionLoadingModal {...modalProps} />);
		} else if (
			modalInfo.modalState === ModalState.DEPOSIT_ASSET_SELECTION
		) {
			setCurrentModal(<AssetSelectionModal {...modalProps} />);
		} else if (modalInfo.modalState === ModalState.DEPOSIT) {
			setCurrentModal(<DepositModal {...modalProps} />);
		} else if (modalInfo.modalState === ModalState.CONNECT_WALLET) {
			setCurrentModal(<ConnectWallet {...modalProps} />);
		} else if (modalInfo.modalState === ModalState.WITHDRAWAL) {
			setCurrentModal(<WithdrawalModal {...modalProps} />);
		} else if (modalInfo.modalState === ModalState.USER_INTERFACE) {
			setCurrentModal(<UserInterfaceDemo {...modalProps} />);
		} else {
			setCurrentModal(<></>);
		}
	}, [modalInfo, isModalOpen]);

	return isModalOpen ? <ModalLayout>{currentModal}</ModalLayout> : <></>;
}

export default App;
