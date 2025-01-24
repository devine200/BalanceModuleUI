import "./deposit.css";
import { FiArrowLeft } from "react-icons/fi";
import CloseBtn from "../../close-btn.tsx";
import {
	AppFeatures,
	AssetSelectionTransactionType,
	Deposit,
	ModalState,
} from "../../types.ts";
import { useState } from "react";
import useContractInteract from "../../hooks/useContractInteract.tsx";
import useDeserializer from "../../hooks/useDeserializer.tsx";
import { AddressLike, BytesLike } from "ethers";
import ContractConfig from "../../utils/test-config.json";
import { useAccount } from "wagmi";
import useGetTokenBalance from "../../hooks/useGetTokenBalance.tsx";
import loadingGif from "../../images/loading_gif.gif";

interface DepositModalProps extends Deposit, AppFeatures {}

const DepositModal = ({
	selectedChainId,
	closeModal,
	changeModal,
	assetImage,
	tokenName,
	chainImage,
	tokenAddr,
	moduleId,
}: DepositModalProps) => {
	const { depositIntoTradable } = useContractInteract();
	const { getVaultAddressFromModuleId } = useDeserializer();
	const balance =
		tokenAddr && selectedChainId
			? useGetTokenBalance({
					tokenAddr,
					selectedChainId: selectedChainId,
				})
			: 0;

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [amount, setAmount] = useState<number>(0);
	const { address: userAddr } = useAccount();

	const handleAssetSelect = () => {
		try {
			changeModal!({
				modalState: ModalState.DEPOSIT_ASSET_SELECTION,
				optionalData: {
					transactType: AssetSelectionTransactionType.DEPOSIT,
				},
			});
		} catch (error) {
			console.log(error);
		}
	};

	const handleSubmit = async () => {
		try {
			if (isLoading || !tokenName) return;
			if (!amount) alert("Amount field can not be empty!");

			setIsLoading(true);
			const vaultAddr = getVaultAddressFromModuleId(
				moduleId as BytesLike,
			);
			await depositIntoTradable(
				vaultAddr,
				tokenAddr as AddressLike,
				amount,
			);

			changeModal!({
				modalState: ModalState.TRANS_LOADING,
				optionalData: {
					address: tokenAddr,
					amount,
					transType: "Deposit",
					eventOptions: {
						address: vaultAddr,
						abi: ContractConfig.tradableSideVault.abi,
						eventName: "SideChainMarginDepositInitiated",
						chainId: selectedChainId,
					},
					eventQuery: {
						key: "user",
						value: userAddr,
					},
				},
			});

			setIsLoading(false);
		} catch (error) {
			console.log(error);
			changeModal!({
				modalState: ModalState.RESPONSE,
				optionalData: {
					isSuccessful: false,
					interactType: "Deposit",
					amount: amount,
					responseMsg: error?.toString(),
				},
			});
		}
	};

	return (
		<div className="app-modal animate deposit-modal">
			<CloseBtn closeModal={closeModal!} />
			<div className="heading">
				<span onClick={closeModal}>
					<FiArrowLeft />
				</span>{" "}
				<h3>Deposit Funds</h3>
			</div>

			<div
				onClick={() => handleAssetSelect()}
				className="form-holder hoverable"
			>
				<div className="asset-icon">
					{assetImage ? <img src={assetImage} alt="avalanche" /> : ""}
					{chainImage ? (
						<img
							src={chainImage}
							alt="avalanche"
							className="chain-icon"
						/>
					) : (
						""
					)}
				</div>
				<div className="input-holder">
					<span className="asset-chain">
						{tokenName ? `${tokenName}` : "Select asset and chain"}
					</span>
				</div>
			</div>
			<form onSubmit={handleSubmit}>
				<div className="form-holder">
					<div className="asset-icon">
						{assetImage ? (
							<img src={assetImage} alt="avalanche" />
						) : (
							""
						)}
					</div>
					<div className="input-holder">
						<input
							onChange={(e) => setAmount(Number(e.target.value))}
							className="display-amount"
							type="number"
							placeholder="0"
              autoFocus
						/>
						<span className="display-amount display-value">
							${balance.toString()}
						</span>
					</div>
				</div>
				<button
					type="submit"
					onClick={() => handleSubmit()}
					disabled={!tokenName || isLoading || !amount}
					className={`${!tokenName || isLoading || !amount ? "disabled" : ""}`}
				>
					Deposit
					{isLoading && (
						<span>
							<img
								src={loadingGif}
								className="loading-gif"
								alt="Loading"
							/>
						</span>
					)}
				</button>
			</form>
		</div>
	);
};

export default DepositModal;
