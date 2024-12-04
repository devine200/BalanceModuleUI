
import "./deposit.css";
import avalancheSquare from "../../images/avalanche-square.svg";
import CloseBtn from '../../close-btn.tsx';
import { ModalFeatures } from "../../types.ts";
import { useState } from "react";

interface AssetSelectionModalProps extends ModalFeatures {}

const AssetSelectionModal = ({closeModal}:AssetSelectionModalProps) => {
  const [searchQuery, setSearchQuery] = useState<any>('')
  const assets = [
    {name: 'USD'}, {name: 'USDC'},
    {name: 'USDF'}, {name: 'USDO'}
  ]

  // For Search
  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
);

  return (
    <div className="app-modal deposit-modal asset-selection">
      <CloseBtn closeModal={closeModal!}/>
      <div className="chain-holder">
        <span className="asset-item">
          <img src={avalancheSquare} alt="" />
        </span>
        <span className="asset-item">
          <img src={avalancheSquare} alt="" />
        </span>
        <span className="asset-item">
          <img src={avalancheSquare} alt="" />
        </span>
        <span className="asset-item">
          <img src={avalancheSquare} alt="" />
        </span>
        <span className="asset-item">
          <img src={avalancheSquare} alt="" />
        </span>
        <span className="asset-item">
          <img src={avalancheSquare} alt="" />
        </span>
        <span className="asset-item">
          <img src={avalancheSquare} alt="" />
        </span>
        <span className="asset-item">
          <img src={avalancheSquare} alt="" />
        </span>
        <span className="asset-item">
          <img src={avalancheSquare} alt="" />
        </span>
        <span className="asset-item">
          <img src={avalancheSquare} alt="" />
        </span>
      </div>
      <div className="search-bar">
        <input onChange={e => setSearchQuery(e.target.value)} value={searchQuery} type="text" placeholder="Search for desired asset" />
      </div>

        <div className="token-holder scrollable-div">
        {filteredAssets.map(asset => {
          return (<div key={asset.name} className="token-item"><img src={avalancheSquare} alt={asset?.name} /><span>{asset?.name}</span></div>)
        })}
        </div>
    </div>
  );
};

export default AssetSelectionModal;
