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
			funcId: "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000400000000000000000000000006c93fd6925c8cacc652bfb04867f5228cc9805900000000000000000000000007bdfccc3fd83517fe63d2e4434ce69cc45e44eb200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000566756e6331000000000000000000000000000000000000000000000000000000",
			tokenAddr: "0xAE60a000f4094204e0f9B56d1f71E1d7381cA50F",
		},
		{
			interactAmount: 150,
			payload:
				"0x0000000000000000000000000000000000000000000000000000000000000000",
			funcId: "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000400000000000000000000000006c93fd6925c8cacc652bfb04867f5228cc9805900000000000000000000000007bdfccc3fd83517fe63d2e4434ce69cc45e44eb200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000566756e6331000000000000000000000000000000000000000000000000000000",
			tokenAddr: "0x027Ba418AF13412fE660F6c2EC42382a0ffaC5B7",
		},
		{
			interactAmount: 400,
			payload:
				"0x0000000000000000000000000000000000000000000000000000000000000000",
			funcId: "0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000400000000000000000000000006c93fd6925c8cacc652bfb04867f5228cc9805900000000000000000000000007bdfccc3fd83517fe63d2e4434ce69cc45e44eb200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000566756e6331000000000000000000000000000000000000000000000000000000",
			tokenAddr: "0x410104df99c7c66C691e83EEDA581768C20debBd",
		}
	]

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
