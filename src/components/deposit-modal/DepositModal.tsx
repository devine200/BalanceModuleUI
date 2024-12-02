
import "./deposit.css";
import { FiArrowLeft } from "react-icons/fi";
import avalancheSquare from "../../images/avalanche-square.svg";
import CloseBtn from '../../close-btn.tsx';
import { ModalFeatures } from "../../types.ts";

interface DepositModalProps extends ModalFeatures {}

const DepositModal = ({closeModal}:DepositModalProps) => {
  return (
    <div className="app-modal deposit-modal">
      <CloseBtn closeModal={closeModal!} />
      <div className="heading">
        <span>
          <FiArrowLeft />
        </span>{" "}
        <h3>Deposit Funds</h3>
      </div>

      <div className="form-holder">
        <div className="asset-icon">
            <img src={avalancheSquare} alt="avalanche" />
            <img src={avalancheSquare} alt="avalanche" className="chain-icon"/>
        </div>
        <div className="input-holder hoverable">
            <span>Select asset and chain</span>
        </div>
      </div>
      <div className="form-holder">
        <div className="asset-icon">
            <img src={avalancheSquare} alt="avalanche" />
        </div>
        <div className="input-holder">
            <input className="display-amount" type="text" placeholder="0" />
            <span className="display-amount display-value">$0.00</span>
        </div>
      </div>
      <button>Confirm</button>
    </div>
  );
};

export default DepositModal;
