import React, { useState } from "react";
import Modal from "react-modal";

const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
    const customStyles = {
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the alpha value for the desired level of transparency
        },
        content: {
          maxWidth: "400px", 
          maxHeight : "200px",
          margin: "auto",
          padding: "20px",
          background: "#fff", 
          borderRadius: "8px", 
        },
      };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      contentLabel="Supression de note"
      style={customStyles}
    >
      <h2 className="deleteTitle">Êtes vous sûr de vouloir supprimer cette note?</h2>
      <div className="deleteButtons">
        <button onClick={onConfirm} className="confirmButton">Confirmer</button>
        <button onClick={onCancel} className="cancelButton">Annuler</button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
