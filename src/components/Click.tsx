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
					handleProtocolTransaction(
						"0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000c83b376d8ba8ef5baed8a5a890f37ebd591b9690000000000000000000000003b6b709e8720bd847b564a446205c7aa2e0d545100000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000566756e6333000000000000000000000000000000000000000000000000000000",
						"0x75246a2DC8234D54E439CA309905a95cbf93193E",
						10,
						"0x0000000000000000000000000000000000000000000000000000000000000000"
					);
				}}
			>
				Protocol Transaction
			</button>
		</>
	);
};

export default Click;
