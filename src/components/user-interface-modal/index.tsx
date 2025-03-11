import { useAccount, useDisconnect } from "wagmi";
import { AppFeatures, ModalState } from "../../types";
import useGetUserTransactions from "../../hooks/useGetUserTransaction";
import { useContext, useEffect } from "react";
import { AppConfigContext } from "../../contexts";

interface UserInterfaceModalProps extends AppFeatures {}

const UserInterfaceDemo = ({
	changeModal,
	userAddr,
}: UserInterfaceModalProps) => {
	const { isConnected } = useAccount();
	const { disconnect } = useDisconnect();
	const { appState } = useContext(AppConfigContext);
	const { moduleId } = appState;
	const { pending } = useGetUserTransactions({
		moduleId: moduleId as string,
		userAddr: userAddr as string,
	});

	// useEffect(()=>{
	// 	if(!isConnected) {
	// 		changeModal!({
	// 			modalState: ModalState.CONNECT_WALLET,
	// 			optionalData: {
	// 				nextModal: {modalState: ModalState.USER_INTERFACE},
	// 			},
	// 		});
	// 	}
	// })

	const handleConnectWallet = () => {
		if (isConnected) {
			alert("Already connected");
			return;
		}
		changeModal!({
			modalState: ModalState.CONNECT_WALLET,
			optionalData: {
				nextModal: {modalState: ModalState.USER_INTERFACE},
			},
		});
	};

	const handleDisconnectWallet = () => {
		if (!isConnected) return;
		disconnect();
		changeModal!({
			modalState: ModalState.USER_INTERFACE,
			optionalData: {},
		});
	};

	const handleProtocolTransaction = () => {
		changeModal!({
			modalState: ModalState.INTERACT,
			optionalData: pending[1],
		});
	};

	const handleWithdrawal = () => {
		changeModal!({
			modalState: ModalState.WITHDRAWAL,
			optionalData: {},
		});
	};

	const handleDeposit = () => {
		changeModal!({
			modalState: ModalState.DEPOSIT,
			optionalData: {},
		});
	};

	return (
		<div className="app-modal animate interact-modal">
			<div className="modal-heading">
				<span className="modal-topic"></span>
			</div>

			<div className="interact-history-detail">
				<div className="modal-heading">
					<span className="modal-topic">Interactions List</span>
					<span></span>
				</div>
				<div className="hoverable">
					<div
						className="interact-detail"
						onClick={handleConnectWallet}
					>
						Connect wallet interaction
					</div>
					<div
						className="interact-detail"
						onClick={handleDisconnectWallet}
					>
						Disconnect wallet
					</div>
					<div
						className="interact-detail"
						onClick={handleProtocolTransaction}
					>
						{" "}
						Protocol transaction interaction
					</div>
					<div className="interact-detail" onClick={handleWithdrawal}>
						{" "}
						Withdrawal interaction
					</div>
					<div className="interact-detail" onClick={handleDeposit}>
						{" "}
						Deposit interaction
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserInterfaceDemo;
