import "./response.css";
import { TransactionLoading, AppFeatures, ModalState } from "../../types.ts";
import CloseBtn from "../../close-btn.tsx";
import { useWatchContractEvent } from "wagmi";
import { useEffect } from "react";
import useContractInteract from "../../hooks/useContractInteract.tsx";

interface TransactionLoadingModalProps
  extends TransactionLoading,
    AppFeatures {}

const TransactionLoadingModal = ({
  transType,
  source,
  destination,
  estimatedTime,
  closeModal,
  changeModal,
  eventOptions,
  address,
  tradableAddress,
  amount
}: TransactionLoadingModalProps) => {
  if (eventOptions) {
    useWatchContractEvent(eventOptions);
  }
  const { depositIntoTradable, withdrawFromTradable } = useContractInteract();

  useEffect(() => {
    try {
      const handleTransaction = async () => {
        let response: any, isSuccessful: boolean, responseMsg: string;

        if (transType === "Deposit")
          response = await depositIntoTradable(address, amount);
        if (transType === "Withdrawal")
          response = await withdrawFromTradable(tradableAddress, amount);

        if (response) {
          isSuccessful = true;
          responseMsg = `${transType} successful.`;
        } else {
          isSuccessful = false;
          responseMsg = `${transType} failed.`;
        }

        changeModal!({
          modalState: ModalState.RESPONSE,
          optionalData: {
            isSuccessful,
            amount,
            interactType: transType,
            responseMsg
          }
        });
      };

      handleTransaction();
    } catch (error) {
      console.log(error);
    }
  }, [address]);

  return (
    <div className="app-modal response-modal confirmation-modal">
      <CloseBtn closeModal={closeModal!} />
      <h3>Confirming {transType}</h3>
      <div className="loading-section">
        <img src={source} alt="tradable logo" />
        <div className="glint-box"></div>
        <img src={destination} alt="tradable logo" />
      </div>
      <p>Estimated Completion Time is {estimatedTime / 60}mins</p>
    </div>
  );
};

export default TransactionLoadingModal;
