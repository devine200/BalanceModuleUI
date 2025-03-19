import "./response.css";
import { TransactionLoading, AppFeatures, ModalState } from "../../types.ts";
import CloseBtn from "../close-btn.tsx";
import { useCallback, useEffect, useState } from "react";
import tradableLogo from "../../images/tradable-square.svg";
import useGetAssets from "../../hooks/useGetAssets.tsx";
import { useChainId } from "wagmi";
import { Contract } from "ethers";
import { useEthersProvider } from "../../hooks/useEthersSigner.tsx";

interface TransactionLoadingModalProps
	extends TransactionLoading,
		AppFeatures {}

const TransactionLoadingModal = ({
	transType,
	closeModal,
	changeModal,
	eventOptions,
	amount,
	nextModal,
	eventQuery,
}: TransactionLoadingModalProps) => {
	const chainId = useChainId();
	const provider = useEthersProvider({ chainId: eventOptions.chainId });
	
	const chainDataList = useGetAssets();
	const currentChainData = chainDataList.filter(
		({ chainId: currentChainId }) => currentChainId === chainId,
	);
	const destinationLogo = currentChainData.length > 0 ? currentChainData[0].logo : tradableLogo;
	
	const loadingTimeoutLimit = 240_000;
	const [hasTimedOut, setHasTimedOut] = useState<boolean>(false);
	const interval = setTimeout(() => {
		console.log("interval met!!!!!!!!!!!!!!")
		setHasTimedOut(true);
	}, loadingTimeoutLimit);

	// @ts-ignore
	const handlePendingEvent = useCallback((...data) => {
		if (data[0] !== eventQuery!.value) return;

		if (!nextModal) {
			changeModal!({
				modalState: ModalState.RESPONSE,
				optionalData: {
					isSuccessful: true,
					interactType: transType,
					amount,
					responseMsg: `${transType} completed successfully`,
				},
			});
		} else {
			changeModal!(nextModal);
		}
	}, [])

	useEffect(() => {
		const sideVaultContract = new Contract(
			eventOptions.address,
			eventOptions.abi,
			provider,
		);

		try {
			sideVaultContract.on(eventOptions.eventName, handlePendingEvent);
		} catch (e: any) {
			changeModal!({
				modalState: ModalState.RESPONSE,
				optionalData: {
					isSuccessful: false,
					interactType: transType,
					amount,
					responseMsg: `Error: System Error`,
				},
			});

			console.log("////// event watcher ///////");
			console.log(e);
			console.log("////////////////////////////");
		}
		return () => {
			if(sideVaultContract){
				sideVaultContract.removeListener(eventOptions.eventName, handlePendingEvent);
			}

			if(interval) {
				clearInterval(interval);
			}
		};
	}, []);

	useEffect(() => {
		if (!hasTimedOut) return;
		changeModal!({
			modalState: ModalState.RESPONSE,
			optionalData: {
				isSuccessful: false,
				interactType: transType,
				amount,
				responseMsg: "Error: Event Watcher Timeout",
			},
		});
	}, [hasTimedOut]);

	return (
		<div className="app-modal animate response-modal confirmation-modal">
			<CloseBtn closeModal={closeModal!} />
			<h3>Confirming {transType}</h3>
			<div className="loading-section">
				<img src={tradableLogo} alt="tradable logo" />
				<div className="glint-box"></div>
				<img src={destinationLogo} alt="tradable logo" />
			</div>
			<p>
				Estimated Completion Time is {loadingTimeoutLimit / 60_000}mins
			</p>
		</div>
	);
};

export default TransactionLoadingModal;
