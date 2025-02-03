import { FaTimesCircle } from "react-icons/fa";

interface CloseBtnProps {
  closeModal: () => void;
}

const CloseBtn = ({closeModal}:CloseBtnProps) => {
  return (
    <div className="close-modal-btn hoverable" onClick={()=>{
      closeModal()
    }}>
      <FaTimesCircle />
    </div>
  );
};

export default CloseBtn;
