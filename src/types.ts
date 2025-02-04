import { AddressLike } from "ethers";
import { BytesLike } from "ethers";
import React from "react";

export enum ModalState {
	DEPOSIT,
	TRANS_LOADING,
	DEPOSIT_ASSET_SELECTION,
	HISTORY,
	RESPONSE,
	INTERACT,
	INTERACT_CONFIRM,
	CONNECT_WALLET,
	WITHDRAWAL,
	USER_INTERFACE,
}

export interface AppConfig {
	appState: {
		moduleId: string;
		modalInfo: ModalInfo;
		website: string;
		isModalOpen: boolean;
		getFuncConfig?: (funcId: string) => FunctionConfig;
	};
	dispatchAppState?: React.Dispatch<any>; // Consider typing the action
}

export interface UserInterfaceConfig {
	handleConnectWallet: () => void;
	handleProtocolTransaction: (
		funcId: BytesLike,
		tokenAddr: AddressLike,
		amount: number,
		funcPayload: BytesLike,
	) => void;
	handleDeposit: () => void;
	handleWithdrawal: () => void;
}

export interface FunctionConfig {
	interactType: string;
	interactDescription: string;
}

export interface TradableConfig {
	app_name: string;
	moduleId: string;
	initialModal: ModalInfo;
	moduleFuncConfig: { [key: string]: FunctionConfig };
}

export interface Interaction {
	interactAmount: number;
	funcId: BytesLike;
	payload: BytesLike;
	tokenAddr: AddressLike;
	createdAt?: string;
}

export interface AppSetupParams {
	moduleId: string;
}

export interface InteractionHistory {
	pending: Interaction[];
	completed: Interaction[];
}
export interface TransactionLoading {
	transType: string;
	eventOptions?: any;
	eventQuery?: EventQuery;
	nextModal?: ModalInfo;
	address: AddressLike;
	amount: number;
}

export interface EventQuery {
	key: string;
	value: any;
}

export interface ModuleFuncConfig {
	funcId: BytesLike;
	name: string;
	description: string;
}

export interface ResponseVal {
	isSuccessful: boolean;
	interactType: string;
	amount: number;
	responseMsg: string;
}

export interface ModuleDataSet {
	[key: string]: { [key: string]: InteractionHistory };
}

export interface AppFeatures {
	changeModal?: (modalState: ModalInfo) => void;
	closeModal?: () => void;
	userAddr: string;
}

export interface ModalInfo {
	modalState: ModalState | null;
	optionalData?: any;
}

export enum AssetSelectionTransactionType {
	DEPOSIT,
	WITHDRAWAL,
}

export interface Deposit {
	selectedChainId?: number;
	tokenName?: string;
	assetImage?: string;
	chainImage?: string;
	transactType?: AssetSelectionTransactionType;
	tokenAddr?: AddressLike;
}

export interface ConnectWallet {
	nextModal?: ModalInfo | null;
}
