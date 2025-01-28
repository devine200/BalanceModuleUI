import "./response.css";
import { TransactionLoading, AppFeatures, ModalState } from "../../types.ts";
import CloseBtn from "../../close-btn.tsx";
import { useEffect, useState } from "react";
import { watchContractEvent } from "@wagmi/core";
import { config } from "../../wagmi.ts";
import tradableLogo from "../../images/tradable-square.svg";
import useGetAssets from "../../hooks/useGetAssets.tsx";
import { useChainId } from "wagmi";

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
	const chainDataList = useGetAssets();

	const currentChainData = chainDataList.filter(
		({ chainId: currentChainId }) => currentChainId === chainId,
	);
	const destinationLogo =
		currentChainData.length > 0 ? currentChainData[0].logo : tradableLogo;
	const loadingTimeoutLimit = 180_000;
	//@ts-ignore
	const [interval, setInterval] = useState<Node.Timeout>(
		setTimeout(() => {
			unwatch();
			changeModal!({
				modalState: ModalState.RESPONSE,
				optionalData: nextModal !== undefined ? {
					isSuccessful: false,
					interactType: transType,
					amount,
					responseMsg: "Error: Event Watcher Timeout",
				} : {
					isSuccessful: true,
					interactType: transType,
					amount,
					responseMsg: `${transType} completed successfully`,
				},
			});
		}, loadingTimeoutLimit),
	);
	let unwatch: any;

	try {
		unwatch = watchContractEvent(config, {
			...eventOptions,
			// @ts-ignore
			onLogs([{ args }]) {
				// check if event meets query criteria
				if (args && args[eventQuery?.key] !== eventQuery?.value) return;

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
				} else if (nextModal) {
					changeModal!(nextModal);
				} else {
					throw Error("invalid next screen option");
				}
				unwatch();
				clearInterval(interval);
			},
			onError(e: any) {
				changeModal!({
					modalState: ModalState.RESPONSE,
					optionalData: {
						isSuccessful: false,
						interactType: transType,
						amount,
						responseMsg: e.shortMessage ? `${e.shortMessage.substring(0, 50)}...` : e.toString().substring(0, 50),
					},
				});
				console.log(e);
				unwatch();
				clearInterval(interval);
			}
		});
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
		unwatch();
	} finally {
		setTimeout(() => {
			unwatch();
		}, loadingTimeoutLimit);
	}

	useEffect(() => {
		return () => {
			clearInterval(interval);
		};
	}, []);

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
