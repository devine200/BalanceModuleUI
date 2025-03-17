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
						"0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000400000000000000000000000006c93fd6925c8cacc652bfb04867f5228cc9805900000000000000000000000007bdfccc3fd83517fe63d2e4434ce69cc45e44eb200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000566756e6331000000000000000000000000000000000000000000000000000000",
						"0xAE60a000f4094204e0f9B56d1f71E1d7381cA50F",
						100,
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
