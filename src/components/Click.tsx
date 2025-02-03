import { useContext } from "react";
import { UserInterfaceContext } from "../contexts";

const Click = () => {
	const { handleDeposit, handleConnectWallet, handleProtocolTransaction, handleWithdrawal } = useContext(UserInterfaceContext);

	return (
		<>
			<button
				onClick={() => {
					handleConnectWallet();
				}}
			>
				CONNECT WALLET
			</button>
			<button
				onClick={() => {
					handleDeposit();
				}}
			>
				Deposit
			</button>
			<button
				onClick={() => {
					handleWithdrawal();
				}}
			>
				Withdrawal
			</button>
			<button
				onClick={() => {
					handleProtocolTransaction();
				}}
			>
				Protocol Transaction
			</button>
		</>
	);
};

export default Click;
