import React from "react";
import ReactModal from "react-modal";

// ReactModal.setAppElement("#__next"); // Make sure to set the root element for accessibility

export const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="Modal"
      overlayClassName="Overlay"
    >
      {/* <button
        onClick={onClose}
        className="absolute top-2 right-2 bg-blue-600 text-white rounded p-1"
      >
        Close
      </button> */}
      {children}
    </ReactModal>
  );
};
