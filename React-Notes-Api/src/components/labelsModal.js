import React, { useState } from "react";
import "./LabelModal.css";


function LabelModal({ existingLabels, onSaveLabels, onClose, noteId }) {
  const [selectedLabels, setSelectedLabels] = useState([]);
  const handleLabelClick = (label) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter((selected) => selected !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };
  const handleSaveLabels = async () => {
    try {
      const response = await fetch(`http://localhost:4000/notes/${noteId}`, {
        method: "PATCH",
        body: JSON.stringify({ labels: selectedLabels }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Failed to update labels. Server error: ${JSON.stringify(errorResponse)}`);
      }
      onSaveLabels(selectedLabels);
      onClose(); 
    } catch (error) {
      console.error("Error updating labels:", error);
    }
  };
  
  return (
    <div className="label-modal-overlay">
      <div className="label-modal">
        <h2>Appliquer des étiquettes</h2>
        <div>
          <p>Choisir les étiquettes</p>
          <div className="existing-labels">
            {existingLabels && existingLabels.map((label) => (
              <span
                key={label}
                className={selectedLabels.includes(label) ? "selected" : "deselected"}
                onClick={() => handleLabelClick(label)}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <button onClick={handleSaveLabels}>Sauvegarder les Etiquettes</button>
        <button onClick={onClose}>Fermer</button>
      </div>
    </div>
  );  
}

export default LabelModal;
