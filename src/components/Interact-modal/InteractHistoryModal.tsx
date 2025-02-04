import { useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { Interaction, AppFeatures, ModalState } from "../../types.ts";
import "./interact-modal.css";
import CloseBtn from "../close-btn.tsx";
import useGetUserTransactions from "../../hooks/useGetUserTransaction.tsx";
import { AppConfigContext } from "../../contexts.tsx";

export interface InteractionHistoryModalProps extends AppFeatures {}

const InteractHistoryModal = ({
	changeModal,
	userAddr,
	closeModal,
}: InteractionHistoryModalProps) => {
	const { website, moduleId, getFuncConfig } = useContext(AppConfigContext);

	const handleOpenPendingTx = (interaction: Interaction) => {
		if (changeModal) {
			changeModal({
				modalState: ModalState.INTERACT,
				optionalData: interaction,
			});
		}
	};

	const { pending, completed } = useGetUserTransactions({
		moduleId: moduleId as string,
		userAddr,
	});
	return (
		<div className="app-modal animate interact-modal">
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
					{pending.map((interaction: Interaction) => {
						const { funcId } = interaction;
						const { interactType } = getFuncConfig(funcId);

						return (
						<div
							className="interact-detail hoverable"
							key={uuidv4()}
							onClick={() => {
								handleOpenPendingTx(interaction);
							}}
						>
								<span>{interactType.substring(0, 15)}</span>
							<div>
								<span>
									{interaction.interactAmount}{" "}
									{interaction.tokenDenom}
								</span>
								<span>{website}</span>
							</div>
						</div>
						);
					})}
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
							// website,
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
						),
					)}
				</div>
			</div>
		</div>
	);
};

export default InteractHistoryModal;
