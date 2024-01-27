import { useParams } from "react-router-dom";
import "./Note.css";
import { useEffect, useState } from "react";
import LabelModal from "./labelsModal";
import Loader from "./loader";

function Note({ onSaveSuccess }) {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);

  const handleSaveLabels = (selectedLabels) => {
   
    setNote({ ...note, labels: selectedLabels });
  };

  useEffect(() => {
    async function fetchNote() {
      try {
        const response = await fetch(`http://localhost:4000/notes/${id}`);
        const data = await response.json();
        setNote(data);
      } catch (error) {
        console.error('Error fetching note:', error);
      }
    }

    fetchNote();
  }, [id]);

  async function fetchNote() {
    try {
      const response = await fetch(`http://localhost:4000/notes/${id}`);
      const data = await response.json();
      setNote(data);
    } catch (error) {
      console.error('Error fetching note:', error);
    }
  }

  async function saveNote() {
    try {
      const currentDate = new Date().toISOString();
      note.dateModified = currentDate;
  
      await fetch(`http://localhost:4000/notes/${id}`, {
        method: "PUT",
        body: JSON.stringify(note),
        headers: { "Content-Type": "application/json" },
      });
      setIsSaved(true);
      onSaveSuccess();
      // Display le message enregistré pendant 5 secs
      const timeout = setTimeout(() => {
        setIsSaved(false);
      }, 5000);
      return () => clearTimeout(timeout);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  }
  

  if (!note) {
    // Chargement de la note
    // Place loader here
    return <Loader />;
  }


  return (
    <div className="Form">
      <form
        className="Form"
        onSubmit={(event) => {
          event.preventDefault();
          saveNote();
        }}
      >
        <input
          className="Note-editable Note-title"
          type="text"
          value={note.title}
          onChange={(event) => {
            
            setNote({ ...note, title: event.target.value });
          }}
        />
        <textarea
          className="Note-editable Note-content"
          value={note.content}
          onChange={(event) => {
            setNote({ ...note, content: event.target.value });
          }}
        />
        <div className="Note-actions">
          <button className="Button">Enregistrer</button>
          {isSaved && <span className="Saved-message">Enregistré !</span>}
        </div>
        
      </form>
      <button className="labelButton" onClick={() => setShowLabelModal(true)}>
        Etiquettes
      </button>

      <div className="existing-labels">
        {note.labels && note.labels.map((label) => <span key={label}>{label} | </span>)}
      </div>
      {showLabelModal && (
        <LabelModal
          existingLabels={["Travail", "Personnel", "Famille"]} 
          onSaveLabels={handleSaveLabels}
          onClose={() => setShowLabelModal(false)}
          noteId={id}
          fetchNotes={fetchNote}
        />
      )}
    </div>
  );
}

export default Note;
