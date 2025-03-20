// Modal.tsx
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

const ProfilePageModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-opacity-50 backdrop-blur-md">
      <div className="bg-[#C3E0E5] p-6 rounded-lg shadow-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
        {title && <h2 className="text-xl font-bold mb-2">{title}</h2>}
        <div className="bg-white text-gray-800 max-h-[60vh] overflow-y-auto p-2 border border-gray-300 rounded">
          {children}
        </div>
        <button
          className="mt-4 bg-[#26455D] text-white px-4 py-2 rounded-lg w-full cursor-pointer"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfilePageModal;
