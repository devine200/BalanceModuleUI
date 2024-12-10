import { AddressLike } from "ethers";
import { BytesLike } from "ethers";

export enum ModalState {
  DEPOSIT,
  DEPOSIT_LOADING,
  DEPOSIT_ASSET_SELECTION,
  HISTORY,
  TRANS_LOADING,
  RESPONSE,
  INTERACT,
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
  source: string;
  destination: string;
  estimatedTime: number;
  transType: string;
  eventOptions?: any;
  callback?: ()=>void;
  nextModal?: ModalInfo;
  address: AddressLike;
  tradableAddress: AddressLike;
  amount: number;
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
  changeModal?: (modalState:ModalInfo) => void;
  closeModal?: () => void;
  moduleId?: string;
  userAddr?: string;
}

export interface ModalInfo {
  modalState: ModalState | null;
  optionalData?: any;
}

export interface Deposit {
  asset?: string;
  chain: string;
  assetImage?: any;
  chainImage?: any;
  transactType?: string,
  address?: AddressLike | any
  tradableAddress?: AddressLike | any
}

export interface ConnectWallet {
  nextModal?: ModalState | null;
}