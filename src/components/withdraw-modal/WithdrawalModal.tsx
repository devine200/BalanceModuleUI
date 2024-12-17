import "../deposit-modal/deposit.css";
import { FiArrowLeft } from "react-icons/fi";
import avalancheSquare from "../../images/avalanche-square.svg";
import CloseBtn from "../../close-btn.tsx";
import { AppFeatures, Deposit, ModalState } from "../../types.ts";
import { useEffect, useState } from "react";
import useContractInteract from "../../hooks/useContractInteract.tsx";

interface WithdrawalModalProps extends Deposit, AppFeatures {}

const WithdrawalModal = ({
  closeModal,
  changeModal,
  assetImage,
  tokenName,
  chainImage,
  userAddr, 
  tokenAddr,
}: WithdrawalModalProps) => {
  // console.log("tradableAddress", userAddr)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { getTokenBalance, withdrawFromTradable } = useContractInteract();
  const [amount, setAmount] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);


  useEffect(()=>{
    if(!tokenAddr) return;
    (async () => {
      const tokenBalance = await getTokenBalance(tokenAddr);
      //@ts-ignore
      setBalance(tokenBalance);
    })()
  },[])

  const handleAssetSelect = () => {
    try {
      changeModal!({
        modalState: ModalState.DEPOSIT_ASSET_SELECTION,
        optionalData: {
          transactType: "withdraw"
        }
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
      await withdrawFromTradable(tokenAddr!, amount);
      changeModal!({
        modalState: ModalState.TRANS_LOADING,
        optionalData: {
          tradableAddress: userAddr,
          amount,
          transType: "Withdrawal",
          eventOptions: { address: "", abi: {}, eventName: "" },
        }
      });

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      changeModal!({
        modalState: ModalState.RESPONSE,
        optionalData: {
          isSuccessful: false,
          interactType: "Withdrawal",
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
        <h3>Withdraw Funds</h3>
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
            onChange={e => setAmount(Number(e.target.value))}
            className="display-amount"
            type="text"
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
        Withdraw
      </button>
    </div>
  );
};

export default WithdrawalModal;
