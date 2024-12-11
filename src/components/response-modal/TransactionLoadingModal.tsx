import "./response.css";
import { TransactionLoading, AppFeatures, ModalState } from "../../types.ts";
import CloseBtn from "../../close-btn.tsx";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import useContractInteract from "../../hooks/useContractInteract.tsx";
import { watchContractEvent } from "@wagmi/core";
import { config } from "../../wagmi.ts";

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
  amount,
  nextModal,
  eventQuery,
}: TransactionLoadingModalProps) => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const loadingTimeoutLimit = estimatedTime ? estimatedTime : 300000;
  let unwatch:any;
  try {
    unwatch = watchContractEvent(config, {
      ...eventOptions,
      // @ts-ignore
      onLogs([{args}]) {
        // check if event meets query criteria
        if (args && args[eventQuery?.key] !== eventQuery?.value) return;

        setIsLoading(false);
        if (!nextModal) {
          changeModal!({
            modalState: ModalState.RESPONSE,
            optionalData: {
              isSuccessful: true,
              interactType: transType,
              amount,
              responseMsg: `${transType.toLocaleUpperCase()} Completed Successfully`,
            },
          });
        } else if (nextModal) {
          changeModal!(nextModal);
        }else{
          throw Error("invalid next screen option")
        }
    
      },
      onError(e:any) {
        changeModal!({
          modalState: ModalState.RESPONSE,
          optionalData: {
            isSuccessful: false,
            interactType: transType,
            amount,
            responseMsg: `Error: ${e.shortMessage ? e.shortMessage : "Event Error"}`,
          },
        });
        console.log({ e });
      },
    });
  } catch (e: any) {
    changeModal!({
      modalState: ModalState.RESPONSE,
      optionalData: {
        isSuccessful: false,
        interactType: transType,
        amount,
        responseMsg: `Error: System Error`,
      },
    });

    console.log("////// event watcher ///////");
    console.log(e);
    console.log("////////////////////////////");
  } finally {
    setTimeout(() => {
      unwatch();
    }, loadingTimeoutLimit - 30_000);
  }

  useEffect(() => {
    const interval = setTimeout(() => {
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

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="app-modal response-modal confirmation-modal">
      <CloseBtn closeModal={closeModal!} />
      <h3>Confirming {transType}</h3>
      <div className="loading-section">
        <img src={source} alt="tradable logo" />
        <div className="glint-box"></div>
        <img src={destination} alt="tradable logo" />
      </div>
      <p>Estimated Completion Time is {loadingTimeoutLimit / 60_000}mins</p>
    </div>
  );
};

export default TransactionLoadingModal;
