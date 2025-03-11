import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
	AppFeatures,
	ModalState,
	FunctionConfig,
} from "../../types.ts";
import "./interact-modal.css";
import CloseBtn from "../close-btn.tsx";
import { AppConfigContext } from "../../contexts.tsx";
import useGetAssets, { getTokenConfig } from "../../hooks/useGetAssets.tsx";
import useDeserializer, { DestructuredReceiptId } from "../../hooks/useDeserializer.tsx";
import { useEthersProvider } from "../../hooks/useEthersSigner.tsx";
import ContractConfig from "../../utils/test-config.json";
import { BytesLike, Contract, formatUnits } from "ethers";

export interface InteractionHistoryModalProps extends AppFeatures {}

const InteractHistoryModal = ({
	changeModal,
	userAddr,
	closeModal,
}: InteractionHistoryModalProps) => {
	const { appState } = useContext(AppConfigContext);
	const { website, moduleId, getFuncConfig } = appState;
	const {
		getVaultAddressFromModuleId,
		getVaultChainId,
		deconstructReceiptId,
		constructReceiptId
	} = useDeserializer();
	const handleOpenPendingTx = (payload:BytesLike, receiptId:BytesLike) => {
		if (changeModal) {
			changeModal({
				modalState: ModalState.INTERACT_CONFIRM,
				optionalData: {
					payload,
					receiptId
				},
			});
		}
	};

	const [pendingTx, setPendingTx] = useState<DestructuredReceiptId[]>([]);
	const [completedTx, setCompletedTx] = useState<DestructuredReceiptId[]>([]);
	const vaultAddr = getVaultAddressFromModuleId(moduleId) as string;
	const chainId = getVaultChainId(vaultAddr) as number;
	const provider = useEthersProvider({ chainId });

	useEffect(() => {
		(async () => {
			const sideVaultContract = new Contract(
				vaultAddr,
				ContractConfig.tradableSideVault.abi,
				provider,
			);
			const pendingReceipts =
				await sideVaultContract.getPendingFuncReceipt(userAddr);
			const completedReceipts =
				await sideVaultContract.getClaimedFuncReceipt(userAddr);
			console.log("working");
			setPendingTx(
				pendingReceipts.map((receiptId: BytesLike) =>
					deconstructReceiptId(receiptId),
				),
			);
			setCompletedTx(
				completedReceipts.map((receiptId: BytesLike) =>
					deconstructReceiptId(receiptId),
				),
			);
		})();
	}, []);

	// Getting token denom
	const assets = useGetAssets();

	return (
		<div className="app-modal animate interact-modal">
			<CloseBtn closeModal={closeModal!} />
			<div className="modal-heading">
				<span className="modal-topic"></span>
			</div>

			{pendingTx.length > 0 ? (
				<div className="interact-history-detail">
					<div className="modal-heading">
						<span className="modal-topic">Pending Requests</span>
						<span></span>
					</div>
					<div className="detail-holder scrollable-div">
						{pendingTx.map((receipt: DestructuredReceiptId) => {
							const { funcId, tokenAddr } = receipt;
							let funcConfig: FunctionConfig | null = null;
							try {
								const tokenData = getTokenConfig(
									assets,
									tokenAddr,
								);

								funcConfig = getFuncConfig!(funcId as string);

								const interactType = funcConfig
									? funcConfig.interactType
									: "Unknown Action";
								const receiptId = constructReceiptId(receipt.funcId, userAddr, receipt.tokenAddr, receipt.amount, receipt.nonce);
								
								return (
									<div
										className="interact-detail hoverable"
										key={uuidv4()}
										onClick={() => {
											handleOpenPendingTx(receipt.payload, receiptId);
										}}
									>
										<span>
											{interactType.substring(0, 15)}
										</span>
										<div>
											<span>
												{formatUnits(receipt.amount.toString(), 18)}{" "}
												{tokenData?.name}
											</span>
											<span>{website}</span>
										</div>
									</div>
								);
							} catch (e: any) {
								changeModal!({
									modalState: ModalState.RESPONSE,
									optionalData: {
										isSuccessful: false,
										responseMsg: e?.shortMessage
											? e.shortMessage
											: e.toString(),
									},
								});
							}
						})}
					</div>
				</div>
			) : (
				<></>
			)}

			{completedTx.length > 0 ? (
				<div className="interact-history-detail">
					<div className="modal-heading">
						<span className="modal-topic">Completed Requests</span>
						<span></span>
					</div>
					<div className="detail-holder scrollable-div">
						{completedTx.map(
							({
								nonce,
								amount,
								tokenAddr,
							}: DestructuredReceiptId) => {
								try {
									const tokenData = getTokenConfig(
										assets,
										tokenAddr,
									);
									return (
										<div
											className="interact-detail"
											key={uuidv4()}
										>
											<span style={{transform: "scale(.8)"}}>#{nonce.toString().substring(0, 8)}...</span>
											<div>
												<span>
													{formatUnits(amount.toString(), 18)}{" "}
													{tokenData?.name}
												</span>
												<span>{website}</span>
											</div>
										</div>
									);
								} catch (e: any) {
									changeModal!({
										modalState: ModalState.RESPONSE,
										optionalData: {
											isSuccessful: false,
											responseMsg: e?.shortMessage
												? e.shortMessage
												: e.toString(),
										},
									});
								}
							},
						)}
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default InteractHistoryModal;
