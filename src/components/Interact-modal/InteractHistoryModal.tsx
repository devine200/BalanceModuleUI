import { v4 as uuidv4 } from "uuid";
import {
  Interaction,
  ModalFeatures,
  ModalState,
} from "../../types.ts";
import "./interact-modal.css";
import CloseBtn from "../../close-btn";
import useGetUserTransactions from "../../hooks/useGetUserTransaction.tsx";

export interface InteractionHistoryModalProps
  extends ModalFeatures {
    moduleId: string;
    userAddr: string;
  }

const InteractHistoryModal = ({
  changeModal,
  moduleId,
  userAddr,
  closeModal
}: InteractionHistoryModalProps) => {
  const handleOpenPendingTx = (interaction: Interaction) => {
    if (changeModal) {
      changeModal({
        modalState: ModalState.INTERACT,
        optionalData: interaction,
      });
    }
  };

  const {pending, completed} = useGetUserTransactions({moduleId, userAddr})
  return (
    <div className="app-modal interact-modal">
      <CloseBtn closeModal={closeModal!} />
      <div className="modal-heading">
        <span className="modal-topic"></span>
        {/* <span className="requests-trigger">all requests</span> */}
      </div>
      <div className="interact-history-detail">
        <div className="modal-heading">
          <span className="modal-topic">Pending Requests</span>
          <span></span>
        </div>
        <div className="detail-holder scrollable-div">
          {pending.map((interaction: Interaction) => (
            <div
              className="interact-detail hoverable"
              key={uuidv4()}
              onClick={() => {
                handleOpenPendingTx(interaction);
              }}
            >
              <span>{interaction.createdAt}</span>
              <div>
                <span>
                  {interaction.interactAmount} {interaction.tokenDenom}
                </span>
                <span>{interaction.website}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="interact-history-detail">
        <div className="modal-heading">
          <span className="modal-topic">Completed Requests</span>
          <span></span>
        </div>
        <div className="detail-holder scrollable-div">
          {completed.map(
            ({
              createdAt,
              interactAmount,
              tokenDenom,
              website,
            }: Interaction) => (
              <div className="interact-detail" key={uuidv4()}>
                <span>{createdAt}</span>
                <div>
                  <span>
                    {interactAmount} {tokenDenom}
                  </span>
                  <span>{website}</span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractHistoryModal;
