import { createContext } from "react";
import { AppConfig, ModalState, UserInterfaceConfig } from "./types";

const userInterfaceInitialConfig = {}
export const UserInterfaceContext = createContext<UserInterfaceConfig>(userInterfaceInitialConfig);

const appInitialConfig: AppConfig = {
	appState: {moduleId: "",
	modalInfo: {modalState: ModalState.CONNECT_WALLET},
	website: "",
	isModalOpen: false,}
}
export const AppConfigContext = createContext<AppConfig>(appInitialConfig);