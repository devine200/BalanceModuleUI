import { useState } from "react";
import { AppFeatures, Interaction, ModalState } from "../../types.ts";
import "./interact-modal.css";
import CloseBtn from "../close-btn.tsx";
import contractConfig from "../../utils/test-config.json";
import useContractInteract from "../../hooks/useContractInteract.tsx";
import tradableLogo from "../../images/tradable-square.svg";
import avalancheLogo from "../../images/avalanche-square.svg";
import { useAccount, useSwitchChain } from "wagmi";
import { config } from "../../wagmi.ts";
import useDeserializer from "../../hooks/useDeserializer.tsx";
import { BytesLike } from "ethers";
interface InteractModalProps extends Interaction, AppFeatures {}

const InteractModal = (props: InteractModalProps) => {
	const {
		website,
		interactType,
		interactAmount,
		tokenDenom,
		changeModal,
		closeModal,
		tokenAddr,
		funcId,
		moduleId,
	} = props;

	const { balance, initiateProtocolTransaction } = useContractInteract();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { getVaultAddressFromModuleId, getVaultChainId } = useDeserializer();
	// @ts-ignore
	const { switchChain } = useSwitchChain(config);
	const { address } = useAccount();

	// getting side vault from func id
	const vaultAddr = getVaultAddressFromModuleId(moduleId as BytesLike);

	// getting side vault network id
	const sideChainId = getVaultChainId(vaultAddr);

	const handleSubmit = async () => {
		try {
			setIsLoading(true);
			const receiptId = await initiateProtocolTransaction(
				funcId,
				tokenAddr,
				interactAmount,
			);

			// @ts-ignore
			switchChain({ chainId: sideChainId });
			changeModal!({
				modalState: ModalState.TRANS_LOADING,
				optionalData: {
					transType: "Deposit From Tradable",
					source: tradableLogo,
					destination: avalancheLogo,
					eventOptions: {
						address: vaultAddr,
						abi: contractConfig.tradableSideVault.abi,
						eventName: "PendingFunctonReceiptAdded",
						chainId: sideChainId,
						onLogs() {},
					},
					eventQuery: {
						key: "user",
						value: address,
					},
					nextModal: {
						modalState: ModalState.INTERACT_CONFIRM,
						optionalData: { ...props, receiptId },
					},
					amount: interactAmount,
				},
			});
		} catch (e: any) {
			console.log(Object.keys(e));
			console.log({ ...e });
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
		<div className="app-modal animate interact-modal">
			<CloseBtn closeModal={closeModal!} />
			<div className="modal-heading">
				<span className="modal-topic">Pending Requests</span>
				<span
					className="requests-trigger"
					onClick={() => {
						if (changeModal)
							changeModal({ modalState: ModalState.HISTORY });
					}}
				>
					all requests
				</span>
			</div>
			<div className="interact-detail">
				<span>Website</span>
				<span>{website}</span>
			</div>
			<div className="interact-detail">
				<span>Interaction</span>
				<span>{interactType}</span>
			</div>
			<div className="interact-detail">
				<span>Balance on Tradable</span>
				<span>{balance.toFixed(2)} USD</span>
			</div>
			<div className="interact-detail interact-total">
				<span>Amount to Spend</span>
				<span>
					{interactAmount} {tokenDenom}
				</span>
			</div>
			<button
				className="interact-btn-full"
				onClick={handleSubmit}
				disabled={isLoading}
			>
				{isLoading ? "Loading...." : `${interactType}`}
			</button>
		</div>
	);
};

export default InteractModal;
