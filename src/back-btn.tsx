import { FiArrowLeft } from "react-icons/fi";
import { AppFeatures, ModalState } from "./types";

interface backBtn {
  backType: string;
}
interface BackBtnProps extends backBtn, AppFeatures {}

const BackBtn = ({ backModal, backType }: BackBtnProps) => {
  console.log(backModal,'bdvkdnjijf')
  return (
    <div
      onClick={() => {
        // backModal!({
        //   modalState: ModalState.DEPOSIT_ASSET_SELECTION,
        //   optionalData: {
        //     transactType: "withdraw"
        //   }
        // });
      }}
    >
      <FiArrowLeft />
    </div>
  );
};

export default BackBtn;
