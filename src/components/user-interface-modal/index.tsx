const UserInterfaceDemo = () => {
  const handleConnectWallet = () => {};

  const handleProtocolTransaction = () => {};

  const handleWithdrawal = () => {};

  const handleDeposit = () => {};

  return (
    <div className="app-modal interact-modal">
      <div className="modal-heading">
        <span className="modal-topic"></span>
      </div>

      <div className="interact-history-detail">
        <div className="modal-heading">
          <span className="modal-topic">Interractions List</span>
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
