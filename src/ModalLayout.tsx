interface ModalLayoutProps {
  children: React.ReactNode;
  closeModal: () => void;
}

const ModalLayout = ({ children, closeModal }: ModalLayoutProps) => {
  return (
    <div className="sdk-container">
      <div className="cover" onClick={()=>{
        closeModal()
      }}></div>
      {children}
    </div>
  )
};

export default ModalLayout;
