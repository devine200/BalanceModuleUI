import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { config } from "./wagmi.ts";
import { FunctionConfig, ModalState, TradableConfig } from "./types.ts";
import Click from "./components/Click.tsx";
import { AppConfigContext, UserInterfaceContext } from "./contexts.tsx";
import { useReducer } from "react";
import useGetUserTransactions from "./hooks/useGetUserTransaction.tsx";
import { AddressLike, BytesLike } from "ethers";

const queryClient = new QueryClient();

const TradableSDKProvider = ({
	moduleId,
	initialModal,
	app_name,
	moduleFuncConfig
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
		modalInfo: initialModal,
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

	const handleProtocolTransaction = (funcId:BytesLike, tokenAddr:AddressLike, amount:number, funcPayload:BytesLike) => {
		dispatchAppState({
			isModalOpen: true,
			modalInfo: {
				modalState: ModalState.INTERACT,
				optionalData: {...pending[1], funcId, tokenAddr, interactAmount: amount, payload:funcPayload},
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

	const getFuncConfig = (funcId:string):FunctionConfig => {
		const config:(string | undefined) = Object.getOwnPropertyNames(moduleFuncConfig).find(configId => configId === funcId);
		if(!config){
			throw new Error("Function not configured");
		}
		return moduleFuncConfig[config];
	}

	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<AppConfigContext.Provider
					value={{ ...moduleConfig, appState, dispatchAppState, getFuncConfig }}
				>
					<App />
				</AppConfigContext.Provider>
				<UserInterfaceContext.Provider
					value={{
						handleConnectWallet,
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
