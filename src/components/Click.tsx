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
						"0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000040000000000000000000000000f31467c0ca100abef512002183de7dcbeb9d2fc0000000000000000000000000abd9ca667bc2c737996929c2c9c5fc94af947fd200000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000566756e6331000000000000000000000000000000000000000000000000000000",
						"0x85b97CB8828E237605Bc19Fc0fa622c6d8D6815B",
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
