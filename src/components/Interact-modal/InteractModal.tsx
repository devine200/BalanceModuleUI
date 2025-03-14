import { useContext, useState, useEffect, useCallback } from "react";
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
import { AppConfigContext } from "../../contexts.tsx";
import useGetAssets, { getTokenConfig, TokenData } from "../../hooks/useGetAssets.tsx";

interface InteractModalProps extends Interaction, AppFeatures {}

const InteractModal = (props: InteractModalProps) => {
	const {
		interactAmount,
		changeModal,
		closeModal,
		tokenAddr,
		funcId,
		payload,
	} = props;
	const { appState } = useContext(AppConfigContext);
	const { website, moduleId, getFuncConfig } = appState;
	const [interactType, setInteractType] = useState<string>();
	const showConfigError = useCallback((msg:string)=>{
		changeModal!({
			modalState: ModalState.RESPONSE,
			optionalData: {
				isSuccessful: false,
				interactType: "Function Execution",
				responseMsg: msg,
			},
		});
	}, [])

	useEffect(() => {
		try{
			const { interactType:transType } = getFuncConfig!(funcId.toString());
			setInteractType(transType);
		}catch(e:any) {
			console.log("error")
			showConfigError(e.toString());
		}
	}, [])

	const { balance, initiateProtocolTransaction } = useContractInteract();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { getVaultAddressFromModuleId, getVaultChainId } = useDeserializer();
	// @ts-ignore
	const { switchChain } = useSwitchChain(config);
	const { address, isConnected } = useAccount();

	// getting side vault from func id
	const vaultAddr = getVaultAddressFromModuleId(moduleId as BytesLike);

	// getting side vault network id
	const sideChainId = getVaultChainId(vaultAddr);

	// Getting token denom
	const assets = useGetAssets();
	const [tokenData, setTokenData] = useState<TokenData>();

	useEffect(() => {
		if (!isConnected) {
			changeModal!({
				modalState: ModalState.CONNECT_WALLET,
				optionalData: {
					nextModal: {
						modalState: ModalState.INTERACT,
						optionalData: {
							createdAt: "10/2/2025",
							funcId,
							tokenAddr,
							interactAmount,
							payload,
						},
					},
				},
			});
		}
		
		try {
			setTokenData(getTokenConfig(assets, tokenAddr));
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
	}, []);
	
	useEffect(() => {
		if (!isConnected) {
			changeModal!({
				modalState: ModalState.CONNECT_WALLET,
				optionalData: {
					nextModal: {
						modalState: ModalState.INTERACT,
						optionalData: {
							createdAt: "10/2/2025",
							funcId,
							tokenAddr,
							interactAmount,
							payload,
						},
					},
				},
			});
		}
	}, [isConnected]);


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
					{interactAmount} { tokenData ? tokenData?.name : ""}
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
