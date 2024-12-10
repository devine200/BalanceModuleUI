import "./response.css";
import { TransactionLoading, AppFeatures, ModalState } from "../../types.ts";
import CloseBtn from "../../close-btn.tsx";
import { useWatchContractEvent } from "wagmi";
import { useEffect, useState } from "react";
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
  amount,
  nextModal,
}: TransactionLoadingModalProps) => {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const loadingTimeoutLimit = 30000;

  try{
    useWatchContractEvent({
      ...eventOptions,
      onLogs(logs) {
        setIsLoading(false);
        eventOptions.onLogs(logs);
      },
    });
  }catch(e:any){
    changeModal!({
      modalState: ModalState.RESPONSE,
      optionalData: {
        isSuccessful: false,
        interactType: transType,
        amount,
        responseMsg: `Error: System Error`,
      },
    });

    console.log("////// event watcher ///////")
    console.log(e)
    console.log("////////////////////////////")
  }

  useEffect(()=>{
    setTimeout(()=>{
      changeModal!({
        modalState: ModalState.RESPONSE,
        optionalData: {
          isSuccessful: false,
          interactType: transType,
          amount,
          responseMsg: `Error: Request Timeout`,
        },
      });
    }, loadingTimeoutLimit);
  }, [])

  useEffect(() => {
    if (!isLoading && !nextModal) {
      changeModal!({
        modalState: ModalState.RESPONSE,
        optionalData: {
          isSuccessful: true,
          interactType: transType,
          amount,
          responseMsg: `${transType.toLocaleUpperCase()} Completed Successfully`,
        },
      });
    }
    
    else if(!isLoading && nextModal) {
      changeModal!(nextModal);
    }

  }, [isLoading]);

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
