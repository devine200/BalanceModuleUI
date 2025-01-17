import "../deposit-modal/deposit.css";
import ContractConfig from "../../utils/test-config.json";
import { FiArrowLeft } from "react-icons/fi";
import CloseBtn from "../../close-btn.tsx";
import { AppFeatures, AssetSelectionTransactionType, Deposit, ModalState } from "../../types.ts";
import { useEffect, useState } from "react";
import tradableLogo from "../../images/tradable-square.svg";
import avalancheLogo from "../../images/avalanche-square.svg";
import useContractInteract from "../../hooks/useContractInteract.tsx";
import useDeserializer from "../../hooks/useDeserializer.tsx";
import { BytesLike } from "ethers";

interface WithdrawalModalProps extends Deposit, AppFeatures {}

const WithdrawalModal = ({
  closeModal,
  changeModal,
  assetImage,
  tokenName,
  chainImage,
  userAddr,
  tokenAddr,
  moduleId,
}: WithdrawalModalProps) => {
  // console.log("tradableAddress", userAddr)
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { balance, withdrawFromTradable } = useContractInteract();
  const [amount, setAmount] = useState<number>(0);
  const { getVaultAddressFromModuleId } = useDeserializer();

  // useEffect(()=>{
  //   if(!tokenAddr) return;
  //   (async () => {
  //     const tokenBalance = await getTokenBalance(tokenAddr);
  //     //@ts-ignore
  //     setBalance(tokenBalance);
  //     console.log({tokenBalance})
  //   })()
  // },[])

  const handleAssetSelect = () => {
    try {
      changeModal!({
        modalState: ModalState.DEPOSIT_ASSET_SELECTION,
        optionalData: {
          transactType: AssetSelectionTransactionType.WITHDRAWAL,
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
      const vaultAddr = getVaultAddressFromModuleId(moduleId as BytesLike);
      await withdrawFromTradable(vaultAddr, tokenAddr!, amount);
      changeModal!({
        modalState: ModalState.TRANS_LOADING,
        optionalData: {
          source: tradableLogo,
          destination: avalancheLogo,
          tradableAddress: userAddr,
          amount,
          transType: "Withdrawal",
          eventOptions: {
            address: vaultAddr,
            abi: ContractConfig.tradableSideVault.abi,
            eventName: "SideChainWithdrawalProcessed",
          },
          eventQuery: {
            key: "user",
            value: userAddr,
          },
        },
      });
      setIsLoading(false);
    } catch (e: any) {
      console.log(e);
      changeModal!({
        modalState: ModalState.RESPONSE,
        optionalData: {
          isSuccessful: false,
          interactType: "Withdrawal",
          amount: amount,
          responseMsg: `Error: ${e.shortMessage ? e.shortMessage : "Event Error"}`,
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
      <form onSubmit={handleSubmit}>
        <div className="form-holder">
          <div className="asset-icon">
            {assetImage ? <img src={assetImage} alt="avalanche" /> : ""}
          </div>
          <div className="input-holder">
            <input
              onChange={(e) => setAmount(Number(e.target.value))}
              className="display-amount"
              type="text"
              placeholder="0"
            />
            <span className="display-amount display-value">${balance}</span>
          </div>
        </div>
        <button
          type="submit"
          onClick={() => handleSubmit()}
          disabled={!tokenName || isLoading || !amount}
          className={`${!tokenName || isLoading || !amount ? "disabled" : ""}`}
        >
          Withdraw
        </button>
      </form>
    </div>
  );
};

export default WithdrawalModal;
