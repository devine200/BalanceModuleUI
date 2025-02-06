import { createContext } from "react";
import { AppConfig, ModalState, UserInterfaceConfig } from "./types";
import { AddressLike, BytesLike } from "ethers";

const userInterfaceInitialConfig = {
	handleConnectWallet: () => {},
	handleProtocolTransaction: (
		funcId: BytesLike,
		tokenAddr: AddressLike,
		amount: number,
		funcPayload: BytesLike,
	) => {
		console.log({funcId,
			tokenAddr,
			amount,
			funcPayload,})
	},
	handleDeposit: () => {},
	handleWithdrawal: () => {}
}
export const UserInterfaceContext = createContext<UserInterfaceConfig>(userInterfaceInitialConfig);

const appInitialConfig: AppConfig = {
	appState: {moduleId: "",
	modalInfo: {modalState: ModalState.CONNECT_WALLET},
	website: "",
	isModalOpen: false,}
}
export const AppConfigContext = createContext<AppConfig>(appInitialConfig);