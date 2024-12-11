import { useState, useEffect } from "react";
import { AppFeatures, Interaction, InteractionConfirm, ModalState } from "../../types.ts";
import "./interact-modal.css";
import CloseBtn from "../../close-btn.tsx";
import contractConfig from "../../utils/test-config.json";
import useContractInteract from "../../hooks/useContractInteract.tsx";
import tradableLogo from "../../images/tradable-square.svg";
import avalancheLogo from "../../images/avalanche-square.svg";
import { useSwitchChain } from "wagmi";
import { AbiCoder, BytesLike } from "ethers";
import { config } from "../../wagmi.ts";

interface InteractModalProps extends Interaction, InteractionConfirm, AppFeatures {}

const InteractConfirmModal = ({
  website,
  interactType,
  interactAmount,
  tokenDenom,
  changeModal,
  closeModal,
  receiptId,
  funcId,
}: InteractModalProps) => {
  const { transactionConfirmation, transactionRejection } = useContractInteract();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { switchChain } = useSwitchChain();

  // getting side vault from func id
  const abiCoder: AbiCoder = AbiCoder.defaultAbiCoder();
  const [moduleId] = abiCoder.decode(["bytes", "bytes"], funcId);
  const [, vaultAddr] = abiCoder.decode(["address", "address"], moduleId);
  
  // getting side vault network id
  const sideChainId = Object.values(contractConfig.tradableSideVault.vault).filter(vault=> vault.tradableSideVault === vaultAddr)[0].networkId

  const handleTransactionConfirmation = async () => {
    try{
      setIsLoading(true);
      await transactionConfirmation(receiptId);

      // @ts-ignore
      switchChain({ chainId: sideChainId });
      changeModal!({
        modalState: ModalState.TRANS_LOADING,
        optionalData: {
          transType: "Transaction Confirmation",
          source: tradableLogo,
          destination: avalancheLogo,
          eventOptions: {
            address: vaultAddr,
            abi: contractConfig.tradableSideVault.abi,
            eventName: "ReceiptFunctionExecuted",
            chainId: sideChainId,
            onLogs() {},
          },
          eventQuery: {
            key: "receiptId",
            value: receiptId,
          },
          amount: interactAmount,
        },
      });
    }catch(e:any){
      console.log(e)
      changeModal!({
        modalState: ModalState.RESPONSE,
        optionalData: {
          isSuccessful: false,
          amount: interactAmount,
          interactType,
          responseMsg: e.shortMessage ? e.shortMessage : e.toString(),
        },
      });
    }finally{
      setIsLoading(false);
    }
  }

  const handleTransactionRejection = async () => {
    try{
      setIsLoading(true);
      await transactionRejection(receiptId);

      // @ts-ignore
      switchChain({ chainId: sideChainId });
      changeModal!({
        modalState: ModalState.TRANS_LOADING,
        optionalData: {
          transType: "Transaction Rejection",
          source: tradableLogo,
          destination: avalancheLogo,
          eventOptions: {
            address: vaultAddr,
            abi: contractConfig.tradableSideVault.abi,
            eventName: "BalanceApprovalCancelled",
            chainId: sideChainId,
            onLogs() {},
          },
          eventQuery: {
            key: "receiptId",
            value: receiptId,
          },
          amount: interactAmount,
        },
      });
    }catch(e:any){
      console.log(e)
      changeModal!({
        modalState: ModalState.RESPONSE,
        optionalData: {
          isSuccessful: false,
          amount: interactAmount,
          interactType,
          responseMsg: e.shortMessage ? e.shortMessage : e.toString(),
        },
      });
    }finally{
      setIsLoading(false);
    }
  }

  return (
    <div className="app-modal interact-modal interact-confirm-modal">
      <CloseBtn closeModal={closeModal!} />
      <div className="modal-heading">
        <span className="modal-topic">Confirm Transaction</span>
      </div>
      <div className="interact-detail">
        <span>Website</span>
        <span>{website}</span>
      </div>
      <div className="interact-detail">
        <span>Interaction</span>
        <span>{interactType}</span>
      </div>
      <div className="interact-detail interact-total">
        <span>Amount to Spend</span>
        <span>
          {interactAmount} {tokenDenom}
        </span>
      </div>

      <div className="interact-btn-holder">
      <button
        className="interact-btn-full interact-btn-half"
        onClick={handleTransactionConfirmation}
        disabled={isLoading}
      >
        {isLoading ? "Loading...." : "Confirm"}
      </button>

      <button
        className="interact-btn-full interact-btn-half reject-btn"
        onClick={handleTransactionRejection}
        disabled={isLoading}
      >
        {isLoading ? "Loading...." : "Reject"}
      </button>

      </div>
    </div>
  );
};

export default InteractConfirmModal;
