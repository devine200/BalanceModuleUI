import React from "react";

interface ModalLayoutProps {
  children: React.ReactNode;
}

const ModalLayout = ({ children }: ModalLayoutProps) => {
  return (
    <div className="sdk-container">
      <div className="cover"></div>
      {children}
    </div>
  );
};

export default ModalLayout;
