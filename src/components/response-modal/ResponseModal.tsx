import "./response.css";
import successImg from "../../images/successfulmessage.gif";
import { AppFeatures, ModalState, ResponseVal } from "../../types.ts";
import CloseBtn from "../../close-btn.tsx";

interface ResponseModalProps extends ResponseVal, AppFeatures {}

const ResponseModal = ({
  isSuccessful,
  amount,
  interactType,
  responseMsg,
  changeModal,
  closeModal,
}: ResponseModalProps) => {
  const imgUrl = isSuccessful
    ? successImg
    : "https://res.cloudinary.com/dskqzdlrm/image/upload/v1711345367/tradable/unusccessfulmessage_ygyypg.gif";

  return (
    <div className="app-modal response-modal">
      <CloseBtn closeModal={closeModal!} />
      <img
        src={imgUrl}
        alt={isSuccessful ? "success image" : "failure image"}
        style={isSuccessful ? { width: "100px" } : { width: "200px" }}
      />
      <h3>
        ${ amount && amount < 0 ? "" : `${amount}`} {interactType}{" "}
        {isSuccessful ? "Successful" : "Failed"}
      </h3>
      <p>{responseMsg.substring(0, 150)} ...</p>
      <button
        onClick={()=>{
          changeModal!({modalState: ModalState.USER_INTERFACE});
        }}
      >
        Proceed To Trade
      </button>
    </div>
  );
};

export default ResponseModal;
