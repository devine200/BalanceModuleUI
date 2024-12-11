import "./deposit.css";
import { FiArrowLeft } from "react-icons/fi";
import avalancheSquare from "../../images/avalanche-square.svg";
import CloseBtn from "../../close-btn.tsx";
import { AppFeatures, Deposit, ModalState } from "../../types.ts";
import { useState } from "react";
import useContractInteract from "../../hooks/useContractInteract.tsx";

interface DepositModalProps extends Deposit, AppFeatures {}

const DepositModal = ({
  closeModal,
  changeModal,
  asset,
  assetImage,
  chain,
  chainImage,
  address,
}: DepositModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { balance } = useContractInteract();
  const [amount, setAmount] = useState<number>(0);

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
      if (isLoading || !asset) return;
      if (!amount) alert("Amount field can not be empty!");
      setIsLoading(true);

      changeModal!({
        modalState: ModalState.TRANS_LOADING,
        optionalData: {
          address,
          amount,
          transType: "Deposit",
          eventOptions: { address: "", abi: {}, eventName: "" },
        },
      });

      setIsLoading(false);
    } catch (error) {
      console.log(error);
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
            {asset ? `${chain}` : "Select asset and chain"}
          </span>
        </div>
      </div>
      <div className="form-holder">
        <div className="asset-icon">
          <img src={avalancheSquare} alt="avalanche" />
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
        disabled={!asset || isLoading || !amount}
        className={`${!asset || isLoading || !amount ? "disabled" : ""}`}
      >
        Deposit
      </button>
    </div>
  );
};

export default DepositModal;
