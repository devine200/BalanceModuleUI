
import "./deposit.css";
import avalancheSquare from "../../images/avalanche-square.svg";
import CloseBtn from '../../close-btn.tsx';
import { ModalFeatures } from "../../types.ts";

interface AssetSelectionModalProps extends ModalFeatures {}

const AssetSelectionModal = ({closeModal}:AssetSelectionModalProps) => {
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
        <input type="text" placeholder="Search for desired asset" />
      </div>

        <div className="token-holder scrollable-div">
            <div className="token-item"><img src={avalancheSquare} alt="" /><span>USDC</span></div>
            <div className="token-item"><img src={avalancheSquare} alt="" /><span>USDC</span></div>
            <div className="token-item"><img src={avalancheSquare} alt="" /><span>USDC</span></div>
            <div className="token-item"><img src={avalancheSquare} alt="" /><span>USDC</span></div>
        </div>
    </div>
  );
};

export default AssetSelectionModal;
