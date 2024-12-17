import "./deposit.css";
import { FiArrowLeft } from "react-icons/fi";
import CloseBtn from "../../close-btn.tsx";
import { AppFeatures, Deposit, ModalState } from "../../types.ts";
import { useState } from "react";
import useContractInteract from "../../hooks/useContractInteract.tsx";
import useDeserializer from "../../hooks/useDeserializer.tsx";
import { BytesLike } from "ethers";

interface DepositModalProps extends Deposit, AppFeatures {}

const DepositModal = ({
  closeModal,
  changeModal,
  assetImage,
  tokenName,
  chainImage,
  tokenAddr,
  moduleId,
}: DepositModalProps) => {
  console.log(tokenAddr, 'address')
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { balance, depositIntoTradable } = useContractInteract();
  const [amount, setAmount] = useState<number>(0);
  const { getVaultAddressFromModuleId } = useDeserializer();

  const handleAssetSelect = () => {
    try {
      changeModal!({
        modalState: ModalState.DEPOSIT_ASSET_SELECTION,
        optionalData: {
          transactType: "deposit",
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (isLoading || !tokenName) return;
      if (!amount) alert("Amount field can not be empty!");
      setIsLoading(true);
      const vaultAddr = getVaultAddressFromModuleId(moduleId as BytesLike)
      await depositIntoTradable(vaultAddr, tokenAddr, amount);
      
      changeModal!({
        modalState: ModalState.TRANS_LOADING,
        optionalData: {
          address: tokenAddr,
          amount,
          transType: "Deposit",
          eventOptions: { address: "", abi: {}, eventName: "" },
        },
      });

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      changeModal!({
        modalState: ModalState.RESPONSE,
        optionalData: {
          isSuccessful: false,
          interactType: "Deposit",
          amount: amount,
          responseMsg: error?.toString()
        },
      });
    }
  };

  return (
    <div className="app-modal deposit-modal">
      <CloseBtn closeModal={closeModal!} />
      <div className="heading">
        <span>
          <FiArrowLeft />
        </span>{" "}
        <h3>Deposit Funds</h3>
      </div>

      <div
        onClick={() => handleAssetSelect()}
        className="form-holder hoverable"
      >
        <div className="asset-icon">
          {assetImage ? <img src={assetImage} alt="avalanche" /> : ""}
          {chainImage ? (
            <img src={chainImage} alt="avalanche" className="chain-icon" />
          ) : (
            ""
          )}
        </div>
        <div className="input-holder">
          <span className="asset-chain">
            {tokenName ? `${tokenName}` : "Select asset and chain"}
          </span>
        </div>
      </div>
      <div className="form-holder">
        <div className="asset-icon">
          {assetImage ? <img src={assetImage} alt="avalanche" /> : ""}
        </div>
        <div className="input-holder">
          <input
            onChange={(e) => setAmount(Number(e.target.value))}
            className="display-amount"
            type="number"
            placeholder="0"
          />
          <span className="display-amount display-value">${balance}</span>
        </div>
      </div>
      <button
        onClick={() => handleSubmit()}
        disabled={!tokenName || isLoading || !amount}
        className={`${!tokenName || isLoading || !amount ? "disabled" : ""}`}
      >
        Deposit
      </button>
    </div>
  );
};

export default DepositModal;
