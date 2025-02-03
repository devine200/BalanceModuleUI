import { createContext } from "react";
import { ModalInfo } from "./types";

export interface UserInterfaceState {
    modalInfo: ModalInfo;
    isModalOpen: boolean | true;
}
export const userInteractionReducer = (modalState: UserInterfaceState, action:any) => {
	return modalState
};
export const UserInterfaceContext = createContext<any>(undefined);