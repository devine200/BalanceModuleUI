import { useContext, useEffect } from "react";
import { UserInterfaceContext } from "./AppContext";
import { ModalState } from "./types";

const Click = () => {
	const { modalState, dispatchUserInterface } =
		useContext(UserInterfaceContext);
  useEffect(()=>{
    console.log({modalState})
  }, [modalState.isModalOpen])
	return (
		<button
			onClick={() => {
				dispatchUserInterface({
          ...modalState,
					modalInfo: {
						modalState: ModalState.USER_INTERFACE,
						optionalData: {},
					},
					isModalOpen: !modalState.isModalOpen,
				});
			}}
		>
			Click Me
		</button>
	);
};

export default Click;
