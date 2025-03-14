import { useAccount, useDisconnect } from "wagmi";
import { AppFeatures, ModalState } from "../../types";

interface UserInterfaceModalProps extends AppFeatures {}

const UserInterfaceDemo = ({
	changeModal,
}: UserInterfaceModalProps) => {
	const { isConnected } = useAccount();
	const { disconnect } = useDisconnect();
	const pending = [
		{
			interactAmount: 10,
			payload: "0x0000000000000000000000000000000000000000000000000000000000000000",
			funcId: "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000c83b376d8ba8ef5baed8a5a890f37ebd591b9690000000000000000000000003b6b709e8720bd847b564a446205c7aa2e0d545100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000566756e6331000000000000000000000000000000000000000000000000000000",
			tokenAddr: "0x75246a2DC8234D54E439CA309905a95cbf93193E",
		},
		{
			interactAmount: 150,
			payload:
				"0x0000000000000000000000000000000000000000000000000000000000000000",
			funcId: "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000c83b376d8ba8ef5baed8a5a890f37ebd591b9690000000000000000000000003b6b709e8720bd847b564a446205c7aa2e0d545100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000566756e6332000000000000000000000000000000000000000000000000000000",
			tokenAddr: "0x7E1c8E07085faB0311Fc8df9448Bc054E67fFbC6",
		},
		{
			interactAmount: 400,
			payload:
				"0x0000000000000000000000000000000000000000000000000000000000000000",
			funcId: "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000c83b376d8ba8ef5baed8a5a890f37ebd591b9690000000000000000000000003b6b709e8720bd847b564a446205c7aa2e0d545100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000566756e6333000000000000000000000000000000000000000000000000000000",
			tokenAddr: "0xB28eE801f8105a0e0D064D16897080Aa0cBF3ad2",
		}
	]

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
