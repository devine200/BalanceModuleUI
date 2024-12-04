import { useState, useEffect } from "react";
import { AppFeatures, Interaction, ModalState } from "../../types.ts";
import "./interact-modal.css";
import CloseBtn from "../../close-btn.tsx";
import useContractInteract from "../../hooks/useContractInteract.tsx";
import tradableLogo from "../../images/tradable-square.svg";
import avalancheLogo from "../../images/avalanche-square.svg";

interface InteractModalProps extends Interaction, AppFeatures {}

const InteractModal = ({
  website,
  interactType,
  interactAmount,
  tokenDenom,
  changeModal,
  closeModal,
  userAddr,
  tokenAddr,
  funcId,
}: InteractModalProps) => {
  const { balance, initiateDepositFromTradable } = useContractInteract();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await initiateDepositFromTradable(funcId, tokenAddr, interactAmount);
      changeModal!({
        modalState: ModalState.TRANS_LOADING,
        optionalData: {
          transType: "Deposit From Tradable",
          source: tradableLogo,
          destination: avalancheLogo,
          estimatedTime: 180,
          eventOptions: {address: "", abi: {}, eventName: "", },
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
          responseMsg: e.shortMessage,
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-modal interact-modal">
      <CloseBtn closeModal={closeModal!} />
      <div className="modal-heading">
        <span className="modal-topic">Pending Requests</span>
        <span
          className="requests-trigger"
          onClick={() => {
            if (changeModal) changeModal({ modalState: ModalState.HISTORY });
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
        <span>{balance} USD</span>
      </div>
      <div className="interact-detail interact-total">
        <span>Amount to Spend</span>
        <span>
          {interactAmount} {tokenDenom}
        </span>
      </div>
      <button
        className="interact-btn-full"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Loading...." : "Deposit Using Tradable"}
      </button>
    </div>
  );
};

export default InteractModal;
