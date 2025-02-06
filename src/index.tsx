import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { config } from "./wagmi.ts";
import { AppConfig, FunctionConfig, ModalState, TradableConfig } from "./types.ts";
import { AppConfigContext, UserInterfaceContext } from "./contexts.tsx";
import { useReducer } from "react";
import useGetUserTransactions from "./hooks/useGetUserTransaction.tsx";
import { AddressLike, BytesLike } from "ethers";

const queryClient = new QueryClient();

interface TradableSDKProviderProps extends TradableConfig {
	children: React.ReactNode
}

const TradableSDKProvider = ({
	moduleId,
	initialModal,
	app_name,
	moduleFuncConfig,
	children
}: TradableSDKProviderProps) => {
	const { pending } = useGetUserTransactions({
		moduleId: moduleId as string,
		userAddr: "userAddr as string",
	});

	console.log(pending)

	const reducer = (state:AppConfig, action: any) => {
		return { ...state, ...action };
	};

	const getFuncConfig = (funcId:string):FunctionConfig => {
		const config:(string | undefined) = Object.getOwnPropertyNames(moduleFuncConfig).find(configId => configId === funcId);
		if(!config){
			throw new Error("Function not configured");
		}
		return moduleFuncConfig[config];
	}

	const [appState, dispatchAppState] = useReducer(reducer, {
		isModalOpen: false,
		modalInfo: initialModal,
		moduleId,
		website: app_name,
		getFuncConfig,
	});

	const handleConnectWallet = () => {
		dispatchAppState({
			isModalOpen: true,
			modalInfo: {
				modalState: ModalState.CONNECT_WALLET,
				optionalData: {
					nextModal: {modalState: ModalState.USER_INTERFACE},
				},
			},
		});
	};

	const handleProtocolTransaction = (funcId:BytesLike, tokenAddr:AddressLike, amount:number, funcPayload:BytesLike) => {
		dispatchAppState({
			isModalOpen: true,
			modalInfo: {
				modalState: ModalState.INTERACT,
				optionalData: {createdAt: "10/2/2025", funcId, tokenAddr, interactAmount: amount, payload:funcPayload},
			},
		});
	};

	const handleWithdrawal = () => {
		dispatchAppState({
			isModalOpen: true,
			modalInfo: {
				modalState: ModalState.WITHDRAWAL
			},
		});
	};

	const handleDeposit = () => {
		dispatchAppState({
			isModalOpen: true,
			modalInfo: {
				modalState: ModalState.DEPOSIT
			},
		});
	};

	
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				<AppConfigContext.Provider
					value={{ appState, dispatchAppState }}
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
					{children}
				</UserInterfaceContext.Provider>
			</QueryClientProvider>
		</WagmiProvider>
	);
};

export default TradableSDKProvider;
