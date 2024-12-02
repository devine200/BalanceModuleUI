
import "./response.css";
import { TransactionLoading, ModalFeatures } from "../../types.ts";
import CloseBtn from '../../close-btn.tsx';
import { useWatchContractEvent } from "wagmi";

interface TransactionLoadingModalProps extends TransactionLoading, ModalFeatures{}

const TransactionLoadingModal = ({transType, source, destination, estimatedTime, closeModal, eventOptions}:TransactionLoadingModalProps) => {
  if(eventOptions){
    useWatchContractEvent(eventOptions);
  }

  return (
    <div className="app-modal response-modal confirmation-modal">
      <CloseBtn closeModal={closeModal!} />
        <h3>Confirming {transType}</h3>
        <div className="loading-section">
            <img src={source} alt="tradable logo" />
            <div className="glint-box"></div>
            <img src={destination} alt="tradable logo" />
        </div>
        <p>Estimated Completion Time is {estimatedTime/60}mins</p>
    </div>
  );
};

export default TransactionLoadingModal;
