import { useAccount } from "wagmi";
import { AppFeatures, ModalState } from "../../types";
import useContractInteract from "../../hooks/useContractInteract";

interface UserInterfaceModalProps extends AppFeatures {}


const UserInterfaceDemo = ({ changeModal }: UserInterfaceModalProps) => {
  const { isConnected } = useAccount();
  const { balance } = useContractInteract();

  const handleConnectWallet = () => {
    if (isConnected) {
      alert("Already connected");
      return;
    }
    changeModal!({
      modalState: ModalState.CONNECT_WALLET,
      optionalData: {
        nextModal: ModalState.USER_INTERFACE
      }
    });
  };

  const handleProtocolTransaction = () => {};

  const handleWithdrawal = () => {
    changeModal!({
      modalState: ModalState.WITHDRAWAL,
      optionalData: {}
    });
  };

  const handleDeposit = () => {
    changeModal!({
      modalState: ModalState.DEPOSIT,
      optionalData: {}
    });
  };

  return (
    <div className="app-modal interact-modal">
      <div className="modal-heading">
        <span className="modal-topic"></span>
      </div>

      <div className="interact-history-detail">
        <div className="modal-heading">
          <span className="modal-topic">Interactions List</span>
          <span></span>
        </div>
        <div className="hoverable">
          <div className="interact-detail" onClick={handleConnectWallet}>
            Connect wallet interaction
          </div>
          <div className="interact-detail" onClick={handleProtocolTransaction}>
            {" "}
            Protocol transaction interaction
          </div>
          <div className="interact-detail" onClick={handleWithdrawal}>
            {" "}
            Withdrawal interaction
          </div>
          <div className="interact-detail" onClick={handleDeposit}>
            {" "}
            Deposit interaction
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInterfaceDemo;
