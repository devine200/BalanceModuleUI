import { useContext, useState } from "react";
import { AppFeatures, Interaction, ModalState } from "../../types.ts";
import "./interact-modal.css";
import CloseBtn from "../close-btn.tsx";
import contractConfig from "../../utils/test-config.json";
import useContractInteract from "../../hooks/useContractInteract.tsx";
import useGetAssets, { getTokenConfig } from "../../hooks/useGetAssets.tsx";
import tradableLogo from "../../images/tradable-square.svg";
import avalancheLogo from "../../images/avalanche-square.svg";
import { useSwitchChain } from "wagmi";
import { BytesLike, formatUnits } from "ethers";
import { config } from "../../wagmi.ts";
import useDeserializer from "../../hooks/useDeserializer.tsx";
import { AppConfigContext } from "../../contexts.tsx";

interface InteractModalProps extends Interaction, AppFeatures {
	receiptId: BytesLike;
}

const InteractConfirmModal = ({
	changeModal,
	closeModal,
	payload,
	receiptId,
}: InteractModalProps) => {
	const { transactionConfirmation, transactionRejection } =
		useContractInteract();
	const { appState } = useContext(AppConfigContext);
	const { website, moduleId, getFuncConfig } = appState;
	const { deconstructReceiptId, getVaultAddressFromModuleId, getVaultChainId } = useDeserializer();
	const {
		funcId,
		tokenAddr,
		amount: interactAmount
	} = deconstructReceiptId(receiptId);
	
	const { interactType } = getFuncConfig!(funcId.toString());
	const TOKEN_DEFAULT_DECIMAL = 18;
	const [isLoading, setIsLoading] = useState<boolean>(false);
	// @ts-ignore
	const { switchChain } = useSwitchChain(config);

	// getting side vault from func id
	const vaultAddr = getVaultAddressFromModuleId(moduleId as BytesLike);

	// getting side vault network id
	const sideChainId = getVaultChainId(vaultAddr);

	// Getting token denom
	const assets = useGetAssets();
	let tokenData;
	try {
		tokenData = getTokenConfig(assets, tokenAddr);
	} catch (e: any) {
		changeModal!({
			modalState: ModalState.RESPONSE,
			optionalData: {
				isSuccessful: false,
				amount: interactAmount,
				interactType,
				responseMsg: e?.shortMessage ? e.shortMessage : e.toString(),
			},
		});
	}

	const handleTransactionConfirmation = async () => {
		try {
			setIsLoading(true);
			// @ts-ignore
			switchChain({ chainId: sideChainId });
			// console.log({receiptId})
			await transactionConfirmation(vaultAddr, receiptId, payload);

			changeModal!({
				modalState: ModalState.TRANS_LOADING,
				optionalData: {
					transType: "Transaction Confirmation",
					source: tradableLogo,
					destination: avalancheLogo,
					eventOptions: {
						address: vaultAddr,
						abi: contractConfig.tradableSideVault.abi,
						eventName: "ReceiptFunctionExecuted",
						chainId: sideChainId,
						onLogs() {},
					},
					eventQuery: {
						key: "receiptId",
						value: receiptId,
					},
					amount: interactAmount,
				},
			});
		} catch (e: any) {
			console.log(e);
			changeModal!({
				modalState: ModalState.RESPONSE,
				optionalData: {
					isSuccessful: false,
					amount: interactAmount,
					interactType,
					responseMsg: e.shortMessage ? e.shortMessage : e.toString(),
				},
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleTransactionRejection = async () => {
		try {
			setIsLoading(true);
			// @ts-ignore
			switchChain({ chainId: sideChainId });

			await transactionRejection(vaultAddr, receiptId);

			changeModal!({
				modalState: ModalState.TRANS_LOADING,
				optionalData: {
					transType: "Transaction Rejection",
					source: tradableLogo,
					destination: avalancheLogo,
					eventOptions: {
						address: vaultAddr,
						abi: contractConfig.tradableSideVault.abi,
						eventName: "BalanceApprovalCancelled",
						chainId: sideChainId,
						onLogs() {},
					},
					eventQuery: {
						key: "receiptId",
						value: receiptId,
					},
					amount: interactAmount,
				},
			});
		} catch (e: any) {
			changeModal!({
				modalState: ModalState.RESPONSE,
				optionalData: {
					isSuccessful: false,
					amount: interactAmount,
					interactType,
					responseMsg: e.shortMessage ? e.shortMessage : e.toString(),
				},
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="app-modal animate interact-modal interact-confirm-modal">
			<CloseBtn closeModal={closeModal!} />
			<div className="modal-heading">
				<span className="modal-topic">Confirm Transaction</span>
			</div>
			<div className="interact-detail">
				<span>Website</span>
				<span>{website}</span>
			</div>
			<div className="interact-detail">
				<span>Interaction</span>
				<span>{interactType}</span>
			</div>
			<div className="interact-detail interact-total">
				<span>Amount to Spend</span>
				<span>
					{formatUnits(interactAmount, TOKEN_DEFAULT_DECIMAL)} {tokenData?.name}
				</span>
			</div>

			<div className="interact-btn-holder">
				<button
					className="interact-btn-full interact-btn-half"
					onClick={handleTransactionConfirmation}
					disabled={isLoading}
				>
					{isLoading ? "Loading...." : "Confirm"}
				</button>

				<button
					className="interact-btn-full interact-btn-half reject-btn"
					onClick={handleTransactionRejection}
					disabled={isLoading}
				>
					{isLoading ? "Loading...." : "Reject"}
				</button>
			</div>
		</div>
	);
};

export default InteractConfirmModal;
