import "./deposit.css";
import avalancheSquare from "../../images/avalanche-square.svg";
import CloseBtn from "../../close-btn.tsx";
import { AppFeatures, Deposit, ModalState } from "../../types.ts";
import { useEffect, useState } from "react";

interface AssetSelectionModalProps extends Deposit, AppFeatures {}

const AssetSelectionModal = ({
  closeModal,
  changeModal,
  transactType
}: AssetSelectionModalProps) => {
  const data = [
    {
      name: "bsc",
      logo: avalancheSquare,
      tokens: [
        { name: "USDC", address: "", logo: avalancheSquare },
        { name: "USDT", address: "", logo: avalancheSquare },
        { name: "USDF", address: "", logo: avalancheSquare }
      ]
    },
    {
      name: "avax",
      logo: avalancheSquare,
      tokens: [
        { name: "USDC_avax", address: "", logo: avalancheSquare },
        { name: "USDT_avax", address: "", logo: avalancheSquare },
        { name: "USDF_avax", address: "", logo: avalancheSquare }
      ]
    }
  ];

  const [searchQuery, setSearchQuery] = useState<any>("");
  const [assets, setAsset] = useState<any>(data);
  const [selectedAsset, setSelectedAsset] = useState<any>({});

  useEffect(() => {
    // setAsset()
  }, []);

  const handleAssetSelection = (token: any) => {
    changeModal!({
      modalState:
        transactType === "deposit" ? ModalState.DEPOSIT : ModalState.WITHDRAWAL,
      optionalData: {
        asset: selectedAsset?.name,
        assetImage: selectedAsset?.logo,
        chain: token?.name,
        chainImage: token?.logo
      }
    });
  };

  const filteredTokens = !selectedAsset?.tokens
    ? []
    : selectedAsset?.tokens.filter((token: any) =>
        token.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="app-modal deposit-modal asset-selection">
      <CloseBtn closeModal={closeModal!} />
      <div className="chain-holder">
        {assets.map((asset: any, index: number) => (
          <span
            key={index}
            className="asset-item hoverable"
            onClick={() => setSelectedAsset(asset)}
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
          placeholder={`${!selectedAsset?.tokens ? "Select a chain from the above" : "Search for desired asset"}`}
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
