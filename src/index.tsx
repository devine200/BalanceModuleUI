import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { config } from "./wagmi.ts";
import { ModalState, TradableConfig } from "./types.ts";
import Click from "./components/Click.tsx";
import { AppConfigContext, UserInterfaceContext } from "./contexts.tsx";
import { useReducer } from "react";
import useGetUserTransactions from "./hooks/useGetUserTransaction.tsx";

const queryClient = new QueryClient();

const TradableSDKProvider = ({
	moduleId,
	initialModal,
	app_name,
}: TradableConfig) => {
	const { pending } = useGetUserTransactions({
		moduleId: moduleId as string,
		userAddr: "userAddr as string",
	});


	const reducer = (state: any, action: any) => {
		return { ...state, ...action };
	};

	// TODO: create a type for the app state
	// TODO: Create a type for the user state
	const [appState, dispatchAppState] = useReducer(reducer, {
		isModalOpen: false,
		modalInfo: initialModal, //TODO:should be deprecated after testing phase
	});

	const handleConnectWallet = () => {
		dispatchAppState({
			isModalOpen: true,
			modalInfo: {
				modalState: ModalState.CONNECT_WALLET,
				optionalData: {
					nextModal: ModalState.USER_INTERFACE,
				},
			},
		});
	};

	const handleProtocolTransaction = () => {
		dispatchAppState({
			isModalOpen: true,
			modalInfo: {
				modalState: ModalState.INTERACT,
				optionalData: pending[1],
			},
		});
	};

	const handleWithdrawal = () => {
		dispatchAppState({
			isModalOpen: true,
			modalInfo: {
				modalState: ModalState.WITHDRAWAL,
				optionalData: {},
			},
		});
	};

	const handleDeposit = () => {
		dispatchAppState({
			isModalOpen: true,
			modalInfo: {
				modalState: ModalState.DEPOSIT,
				optionalData: {},
			},
		});
	};

	const moduleConfig: any = {
		moduleId,
		website: app_name,
	};

	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<AppConfigContext.Provider
					value={{ ...moduleConfig, appState, dispatchAppState }}
				>
					<App />
				</AppConfigContext.Provider>
				<UserInterfaceContext.Provider
					value={{
						handleConnectWallet,
						// handleDisconnectWallet,
						handleProtocolTransaction,
						handleDeposit,
						handleWithdrawal,
					}}
				>
					<Click />
				</UserInterfaceContext.Provider>
			</QueryClientProvider>
		</WagmiProvider>
	);
};

export default TradableSDKProvider;
