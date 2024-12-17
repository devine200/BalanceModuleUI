import "./deposit.css";
import contractConfig from "../../utils/test-config.json";
import CloseBtn from "../../close-btn.tsx";
import { AppFeatures, Deposit, ModalState } from "../../types.ts";
import { useState } from "react";
import { useSwitchChain } from "wagmi";
import { config } from "../../wagmi.ts";
import useGetAssets, { ChainData } from "../../hooks/useGetAssets.tsx";

interface AssetSelectionModalProps extends Deposit, AppFeatures {}

const AssetSelectionModal = ({
  closeModal,
  changeModal,
  transactType
}: AssetSelectionModalProps) => {
  const data:ChainData[] = useGetAssets();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedChain, setSelectedChain] = useState<ChainData>(data[0]);
  //@ts-ignore
  const { switchChain } = useSwitchChain(config)
  
  const handleAssetSelection = (token: any) => {
    //@ts-ignore
    switchChain({chainId: contractConfig.tradableSideVault.vault[selectedChain.name].networkId})
    changeModal!({
      modalState:
        transactType === "deposit" ? ModalState.DEPOSIT : ModalState.WITHDRAWAL,
      optionalData: {
        asset: selectedChain,
        chainImage: selectedChain?.logo,
        tokenName: token?.name,
        assetImage: token?.logo,
        tokenAddr: token?.address
      }
    });
  };

  const filteredTokens = !selectedChain?.tokens
    ? []
    : selectedChain?.tokens.filter((token: any) =>
        token.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="app-modal deposit-modal asset-selection">
      <CloseBtn closeModal={closeModal!} />
      <div className="chain-holder">
        {data.map((asset: any, index: number) => (
          <span
            key={index}
            className={`asset-item hoverable ${selectedChain?.name === asset?.name ? " selected" : ""}`}
            onClick={() => setSelectedChain(asset)}
          >
            <img src={asset?.logo} alt={asset?.name} />
          </span>
        ))}
      </div>
      <div className="search-bar">
        <input
          onChange={e => setSearchQuery(e.target.value)}
          value={searchQuery}
          type="text"
          placeholder={`${!selectedChain?.tokens ? "Select a chain from the above" : "Search for desired asset"}`}
        />
      </div>

      <div className="token-holder scrollable-div">
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
