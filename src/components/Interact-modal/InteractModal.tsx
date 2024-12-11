import { useState, useEffect } from "react";
import { AppFeatures, Interaction, ModalState } from "../../types.ts";
import "./interact-modal.css";
import CloseBtn from "../../close-btn.tsx";
import contractConfig from "../../utils/test-config.json";
import useContractInteract from "../../hooks/useContractInteract.tsx";
import tradableLogo from "../../images/tradable-square.svg";
import avalancheLogo from "../../images/avalanche-square.svg";
import { useAccount, useSwitchChain } from "wagmi";
import { AbiCoder } from "ethers";
import { config } from "../../wagmi.ts";
interface InteractModalProps extends Interaction, AppFeatures {}

const InteractModal = (props: InteractModalProps) => {
  const {
    website,
    interactType,
    interactAmount,
    tokenDenom,
    changeModal,
    closeModal,
    tokenAddr,
    funcId,
  } = props;

  const { balance, initiateProtocolTransaction: initiateDepositFromTradable } =
    useContractInteract();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // @ts-ignore
  const { switchChain } = useSwitchChain(config);
  const { address } = useAccount();

  // getting side vault from func id
  const abiCoder: AbiCoder = AbiCoder.defaultAbiCoder();
  const [moduleId] = abiCoder.decode(["bytes", "bytes"], funcId);
  const [, vaultAddr] = abiCoder.decode(["address", "address"], moduleId);

  // getting side vault network id
  const sideChainId = Object.values(
    contractConfig.tradableSideVault.vault
  ).filter((vault) => vault.tradableSideVault === vaultAddr)[0].networkId;

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await initiateDepositFromTradable(funcId, tokenAddr, interactAmount);
      // @ts-ignore
      switchChain({ chainId: sideChainId });
      changeModal!({
        modalState: ModalState.TRANS_LOADING,
        optionalData: {
          transType: "Deposit From Tradable",
          source: tradableLogo,
          destination: avalancheLogo,
          eventOptions: {
            address: vaultAddr,
            abi: contractConfig.tradableSideVault.abi,
            eventName: "PendingFunctionReceiptAdded",
            chainId: sideChainId,
            onLogs() {},
          },
          eventQuery: {
            key: "user",
            value: address,
          },
          nextModal: {
            modalState: ModalState.INTERACT_CONFIRM,
            optionalData: props,
          },
          amount: interactAmount,
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
