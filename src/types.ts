import { AddressLike } from "ethers";
import { BytesLike } from "ethers";

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

export interface Interaction {
  website: string;
  interactType: string;
  interactDescription?: string;
  balance?: number;
  interactAmount: number;
  tokenDenom: string;
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
  moduleId?: BytesLike;
  userAddr?: string;//TODO:depricate this value
}

export interface ModalInfo {
  modalState: ModalState | null;
  optionalData?: any;
}

export enum AssetSelectionTransactionType {
  DEPOSIT,
  WITHDRAWAL
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
  nextModal?: ModalState | null;
}
