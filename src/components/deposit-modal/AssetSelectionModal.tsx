import "./deposit.css";
import contractConfig from "../../utils/test-config.json";
import CloseBtn from "../../close-btn.tsx";
import {
	AppFeatures,
	AssetSelectionTransactionType,
	Deposit,
	ModalState,
} from "../../types.ts";
import { useState } from "react";
import { useSwitchChain } from "wagmi";
import { config } from "../../wagmi.ts";
import useGetAssets, { ChainData } from "../../hooks/useGetAssets.tsx";

interface AssetSelectionModalProps extends Deposit, AppFeatures {}

const AssetSelectionModal = ({
	closeModal,
	changeModal,
	transactType,
}: AssetSelectionModalProps) => {
	const data: ChainData[] = useGetAssets();

	const [searchQuery, setSearchQuery] = useState<string>("");
	const [selectedChain, setSelectedChain] = useState<ChainData>(data[0]);
	const [showData, setShowData] = useState<boolean>(false);
	//@ts-ignore
	const { switchChain } = useSwitchChain(config);

	const handleAssetSelection = (token: any) => {
		//@ts-ignore
		switchChain({
			chainId:
				contractConfig.tradableSideVault.vault[selectedChain.name]
					.networkId,
		});
		changeModal!({
			modalState:
				transactType === AssetSelectionTransactionType.DEPOSIT
					? ModalState.DEPOSIT
					: ModalState.WITHDRAWAL,
			optionalData: {
				//@ts-ignore
				selectedChainId:
					contractConfig.tradableSideVault.vault[selectedChain.name]
						.networkId,
				chainImage: selectedChain?.logo,
				tokenName: token?.name,
				assetImage: token?.logo,
				tokenAddr: token?.address,
			},
		});
	};

	const handleAssestSwitch = (asset: ChainData) => {
		setSelectedChain(asset);
		setShowData(true);
		setTimeout(() => {
			setShowData(false)
		}, 200);
	};

	const filteredTokens = !selectedChain?.tokens
		? []
		: selectedChain?.tokens.filter((token: any) =>
				token.name.toLowerCase().includes(searchQuery.toLowerCase()),
			);

	return (
		<div className="app-modal animate deposit-modal asset-selection">
			<CloseBtn closeModal={closeModal!} />
			<div className="chain-holder">
				{data.map((asset: any, index: number) => (
					<span
						key={index}
						className={`asset-item hoverable ${selectedChain?.name === asset?.name ? " selected" : ""}`}
						onClick={() => handleAssestSwitch(asset)}
					>
						<img src={asset?.logo} alt={asset?.name} />
					</span>
				))}
			</div>
			<div className="search-bar">
				<input
					onChange={(e) => setSearchQuery(e.target.value)}
					value={searchQuery}
					type="text"
					placeholder={`${!selectedChain?.tokens ? "Select a chain from the above" : "Search for desired asset"}`}
				/>
			</div>

			<div
				className={`token-holder scrollable-div ${showData ? " scale-animate" : ""}`}
			>
				{filteredTokens.map((token: any, index: number) => {
					return (
						<div
							key={index}
							className="token-item"
							onClick={() => handleAssetSelection(token)}
						>
							<img src={token?.logo} alt={token?.name} />
							<span>{token?.name}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default AssetSelectionModal;
