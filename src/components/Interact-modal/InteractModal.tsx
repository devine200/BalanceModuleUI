import { useState, useEffect } from "react";
import { AppFeatures, Interaction, ModalState } from "../../types.ts";
import "./interact-modal.css";
import CloseBtn from "../../close-btn.tsx";
import contractConfig from "../../utils/test-config.json";
import useContractInteract from "../../hooks/useContractInteract.tsx";
import tradableLogo from "../../images/tradable-square.svg";
import avalancheLogo from "../../images/avalanche-square.svg";
import { useSwitchChain } from "wagmi";

interface InteractModalProps extends Interaction, AppFeatures {}

const InteractModal = ({
  website,
  interactType,
  interactAmount,
  tokenDenom,
  changeModal,
  closeModal,
  tokenAddr,
  funcId,
}: InteractModalProps) => {
  const { balance, initiateProtocolTransaction: initiateDepositFromTradable } =
    useContractInteract();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { switchChain } = useSwitchChain();
  const baseChainId = contractConfig.tradableMessageAdapter.chainId
  // (bytes memory moduleId, bytes memory funcSig) = abi.decode(funcId, (bytes, bytes));
  // (address module, ) = abi.decode(moduleId, (address, address));
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await initiateDepositFromTradable(funcId, tokenAddr, interactAmount);
      try {
        changeModal!({
          modalState: ModalState.TRANS_LOADING,
          optionalData: {
            transType: "Deposit From Tradable",
            source: tradableLogo,
            destination: avalancheLogo,
            estimatedTime: 180,
            eventOptions: {
              address: "",
              abi: {},
              eventName: "",
              onLogs(logs: any) {
                switchChain({chainId: baseChainId});

              },
            },
            amount: interactAmount,
          },
        });
      } catch (e) {
        console.log(e);
      }
    } catch (e: any) {
      console.log(Object.keys(e));
      console.log({ ...e });
      changeModal!({
        modalState: ModalState.RESPONSE,
        optionalData: {
          isSuccessful: false,
          amount: interactAmount,
          interactType,
          responseMsg: e.shortMessage ? e.shortMessage : e.toString(),
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
        <span>{balance.toFixed(2)} USD</span>
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
