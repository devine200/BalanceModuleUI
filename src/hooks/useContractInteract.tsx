import ContractConfig from "../utils/test-config.json" with { type: "json" };
import {
	Contract,
	formatUnits,
	BytesLike,
	AddressLike,
	toBigInt,
	parseUnits,
} from "ethers";
import {
	useSwitchChain,
	useChainId,
	useAccount,
	useWriteContract,
	useReadContract,
} from "wagmi";
import { useEthersProvider } from "./useEthersSigner";
import { config } from "../wagmi";
import useDeserializer from "./useDeserializer";
import { useEffect, useState } from "react";

interface ContractInteractionVals {
	balance: number;
	depositIntoTradable: (
		vaultAddr: AddressLike,
		token: AddressLike,
		amount: number,
	) => void;
	withdrawFromTradable: (
		vaultAddr: AddressLike,
		token: AddressLike,
		amount: number,
	) => void;
	initiateProtocolTransaction: (
		funcId: BytesLike,
		token: AddressLike,
		amount: number,
	) => void;
	transactionConfirmation: (
		vaultAddr: AddressLike,
		receiptId: BytesLike,
		payload: BytesLike,
	) => Promise<void>;
	transactionRejection: (
		vaultAddr: AddressLike,
		receiptId: BytesLike,
	) => Promise<void>;
	DEFAULT_TOKEN_DECIMALS: number;
}

const useContractInteract = (): ContractInteractionVals => {
	const chainId = useChainId();
	const { address: userAddress } = useAccount();
	const { chains, switchChain } = useSwitchChain();
	const { writeContractAsync } = useWriteContract({ config });
	const provider = useEthersProvider({ chainId });
	const { constructReceiptId } = useDeserializer();
	const baseChainID = import.meta.env.VITE_BASE_CHAIN_NETWORK_ID!;

	const {
		data: userTradableBalanceData,
		isPending: isUserTradableBalancePending,
		error: userBalanceDataError,
	} = useReadContract({
		//@ts-ignore
		address: ContractConfig.tradableBalanceVault.address,
		abi: ContractConfig.tradableBalanceVault.abi,
		functionName: "getUserTokenBalance",
		args: [userAddress],
		//@ts-ignore
		chainId: parseInt(baseChainID),
	});

	const [balance, setBalance] = useState<number>(0);
	const DEFAULT_TOKEN_DECIMALS = 8;

	useEffect(() => {
		if (isUserTradableBalancePending && !userTradableBalanceData) return;
		setBalance(
      parseFloat(
        //@ts-ignore
				formatUnits(userTradableBalanceData, DEFAULT_TOKEN_DECIMALS),
			),
		);
	}, [isUserTradableBalancePending]);

	useEffect(() => {
		if (!userBalanceDataError) return;
		console.log(userBalanceDataError);
	}, [userBalanceDataError]);

	const initiateProtocolTransaction = async (
		funcId: BytesLike,
		token: AddressLike,
		amount: number,
	): Promise<BytesLike> => {
		// check what  chain system is connected to
		if (chainId && baseChainID !== chainId.toString()) {
			const baseChain = chains.filter(
				(chain) => chain.id.toString() === baseChainID,
			)[0];
			switchChain({ chainId: baseChain.id });
		}

		// start balance dedcution approval process
		const salt = Math.floor(Math.random() * 100000000);
		const nonce = toBigInt(Date.now() + salt);

		const tokenContract = new Contract(
			// @ts-ignore
			token,
			ContractConfig.tradableSideVault.stableToken.abi,
			provider,
		);
		const tokenDecimals = await tokenContract.decimals();
		const amountToDecimals = parseUnits(amount.toString(), tokenDecimals);
		await writeContractAsync({
			abi: ContractConfig.tradableBalanceVault.abi,
			// @ts-ignore
			address: ContractConfig.tradableBalanceVault.address,
			functionName: "balanceDeductionApproval",
			args: [funcId, token, amountToDecimals, nonce],
			chainId,
		});

		return constructReceiptId(
			funcId,
			userAddress as AddressLike,
			token,
			amountToDecimals,
			nonce,
		);
	};

	const depositIntoTradable = async (
		vaultAddr: AddressLike,
		token: AddressLike | any,
		amount: number,
	) => {
		// get token decimals for amount calculation
		const tokenContract = new Contract(
			token,
			ContractConfig.tradableSideVault.stableToken.abi,
			provider,
		);
		const tokenDecimals = await tokenContract.decimals();
		const amountToDecimals = parseUnits(amount.toString(), tokenDecimals);
    let userTokenBalance = await tokenContract.balanceOf(userAddress);
    userTokenBalance = formatUnits(userTokenBalance, tokenDecimals);
    if(userTokenBalance < amount) {
      throw new Error("Insufficient Token Balance");
    }
		// approve token to be allocated
		await writeContractAsync({
			abi: ContractConfig.tradableSideVault.stableToken.abi,
			// @ts-ignore
			address: token,
			functionName: "approve",
			args: [vaultAddr, amountToDecimals],
		});

		// trigger function to deposit into tradable
		await writeContractAsync({
			abi: ContractConfig.tradableSideVault.abi,
			// @ts-ignore
			address: vaultAddr,
			functionName: "marginAccountDeposit",
			args: [token, amountToDecimals],
		});
	};

	const withdrawFromTradable = async (
		vaultAddr: AddressLike,
		token: AddressLike,
		amount: number,
	) => {
		// get token decimals for amount calculation
		const tokenContract = new Contract(
			// @ts-ignore
			token,
			ContractConfig.tradableSideVault.stableToken.abi,
			provider,
		);
		const tokenDecimals = await tokenContract.decimals();
		const amountToDecimals = parseUnits(amount.toString(), tokenDecimals);

		// check if user has the balance to withdraw
		if (balance < amount) {
			throw Error("Insufficient Tradable Balance");
		}

		// make withdrawal request
		await writeContractAsync({
			abi: ContractConfig.tradableSideVault.abi,
			// @ts-ignore
			address: vaultAddr,
			functionName: "withdrawalRequest",
			args: [token, amountToDecimals],
			chainId,
		});

		return true;
	};

	const transactionConfirmation = async (
		vaultAddr: AddressLike,
		receiptId: BytesLike,
		payload: BytesLike,
	) => {
		await writeContractAsync({
			abi: ContractConfig.tradableSideVault.abi,
			address: vaultAddr as `0x${string}`,
			functionName: "executeReceiptFunction",
			args: [receiptId, payload],
			chainId,
		});
	};

	const transactionRejection = async (
		vaultAddr: AddressLike,
		receiptId: BytesLike,
	) => {
		await writeContractAsync({
			abi: ContractConfig.tradableSideVault.abi,
			// @ts-ignore
			address: vaultAddr,
			functionName: "cancelBalanceApproval",
			args: [receiptId],
			chainId,
		});
	};

	return {
		balance,
		depositIntoTradable,
		withdrawFromTradable,
		transactionConfirmation,
		transactionRejection,
		initiateProtocolTransaction,
		DEFAULT_TOKEN_DECIMALS,
	};
};

export default useContractInteract;
