import { FiArrowLeft } from "react-icons/fi";
import { AppFeatures } from "./types";

interface backBtn {
  backType: string;
}
//@ts-ignore
interface BackBtnProps extends backBtn, AppFeatures {}

const BackBtn = () => {
  // console.log(backModal,'bdvkdnjijf')
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
