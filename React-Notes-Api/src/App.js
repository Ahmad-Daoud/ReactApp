import { BrowserRouter, Routes, Route, Link, Navigate, useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";
import Note from "./components/Note";
import DeleteConfirmationModal from "./components/deleteModal";
import LabelModal from "./components/labelsModal";

function App() {
  const [notes, setNotes] = useState([]);
  const { id: currentNoteId } = useParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 10;
  const [maxPage, setMaxPage] = useState(1); 



  const handleDeleteButtonClick = (id) => {
    setDeleteNoteId(id);
    setIsDeleteModalOpen(true);
  };
  const handleConfirmDelete = () => {
    if (deleteNoteId) {
      UpdateNoteInTrash(deleteNoteId);
      setIsDeleteModalOpen(false);
    }
  };
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };
  async function fetchNotes() {
    console.log("fetchingnotes");
    try {
      const response = await fetch("http://localhost:4000/notes");
      const data = await response.json();
      const filteredNotes = data.filter((note) => !note?.inTrash);
      const pinnedNotes = filteredNotes.filter((note) => note?.isPinned);
      const unpinnedNotes = filteredNotes.filter((note) => !note?.isPinned);
      const sortedPinnedNotes = pinnedNotes.sort((a, b) => {
        const dateA = new Date(a.dateModified);
        const dateB = new Date(b.dateModified);
        return dateB - dateA;
      });
      const sortedUnpinnedNotes = unpinnedNotes.sort((a, b) => {
        const dateA = new Date(a.dateModified);
        const dateB = new Date(b.dateModified);
        return dateB - dateA;
      });
      const sortedNotes = [...sortedPinnedNotes, ...sortedUnpinnedNotes];
      setMaxPage(Math.ceil(sortedNotes.length / notesPerPage));
      // Calcul des 10 notes par page
      const startIndex = (currentPage - 1) * notesPerPage;
      const endIndex = startIndex + notesPerPage;
      const notesForCurrentPage = sortedNotes.slice(startIndex, endIndex);
      setNotes(notesForCurrentPage);

    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }
  useEffect(function () {
    fetchNotes();
  }, []);
  useEffect(() => {
    fetchNotes();
  }, [currentPage]);
  
  async function findId() {
    try {
      const response = await fetch("http://localhost:4000/notes");
      const data = await response.json();
      if (data && Array.isArray(data)) {
        if (data.length > 0) {
          const maxId = data.reduce((max, note) => {
            const noteId = parseInt(note.id, 10);
            return noteId > max ? noteId : max;
          }, 0);
          const newId = isNaN(maxId) ? 1 : maxId + 1;
          return newId;
        } else {
          console.error("Empty notes array in server response:", data);
          return 1;
        }
      } else {
        console.error("Invalid server response format:", data);
        return 1;
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      return null;
    }
  }
  async function UpdateNoteInTrash(id) {
    try {
      const response = await fetch(`http://localhost:4000/notes/${id}`, {
        method: "PATCH", // You can also use "PUT" depending on your server implementation
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inTrash: true,
        }),
      });
  
      if (response.ok) {
        // After successful update, refetch the notes
        fetchNotes();
      } else {
        console.error(`Error updating note with id ${id}. Server response: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error updating note with id ${id}:`, error);
    }
  }
  
  function formatDate(date) {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return date.toLocaleString("en-US", options);
  }

  async function AddNote() {
    let id = await findId();
    const currentDate = new Date();
    const newNote = {
      id: String(id),
      title: "Nouvelle note ",
      content: "Ecrivez ici ",
      dateCreated: formatDate(currentDate),
      dateModified: formatDate(currentDate),
      isPinned: false,
      isChecked: false,
      labels:[],
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    };
    const response = await fetch("http://localhost:4000/notes", requestOptions);
    const createdNote = await response.json();

    createdNote.title = `Ma note ${createdNote.id}`;

    const updateTitleRequestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: createdNote.title }),
    };
    await fetch(`http://localhost:4000/notes/${createdNote.id}`, updateTitleRequestOptions);

    fetchNotes();
  }

  async function toggleNotePinned(id, isPinned) {
    try {
      const response = await fetch(`http://localhost:4000/notes/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPinned,
        }),
      });
  
      if (response.ok) {
        // After successful update, refetch the notes
        fetchNotes();
      } else {
        console.error(`Error updating note with id ${id}. Server response: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error updating note with id ${id}:`, error);
    }
  }
  


  async function toggleNoteChecked(id, isChecked) {
    try {
      const response = await fetch(`http://localhost:4000/notes/${id}`, {
        method: "PATCH", // You can also use "PUT" depending on your server implementation
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isChecked,
        }),
      });
  
      if (response.ok) {
        // After successful update, refetch the notes
        fetchNotes();
      } else {
        console.error(`Error updating note with id ${id}. Server response: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error updating note with id ${id}:`, error);
    }
  }
  return (
    <BrowserRouter>
      <aside className="Side">
        <div>
          <div className="addPageDiv">
            <button className="Button Button-create-note" onClick={AddNote}>
              +
            </button>
            <button onClick={() => setCurrentPage(currentPage-1)} disabled={currentPage === 1} className="pageButtons">
              Page précedente
            </button>
            <button onClick={() => setCurrentPage(currentPage+1)} disabled={currentPage === maxPage} className="pageButtons">
              Page suivante
            </button>
          </div>
          {notes !== null ? (
            <ol className="Notes-list">
              {notes.map((note) => (
                <li key={note.id} className={`Note-item ${currentNoteId === note.id ? 'highlighted' : ''}`}>
                  <div className="Note-link">
                    <Link to={`/notes/${note.id}`}>
                      <span className="Note-Title">{note.title}</span>
                    </Link>
                    <button className="delete-icon"onClick={() => handleDeleteButtonClick(note.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                      </svg>
                    </button>
                    <button
                      className={`Note-Check ${note.isChecked ? 'checked' : 'unchecked'}`}
                      onClick={() => toggleNoteChecked(note.id, !note.isChecked)}>
                      {note.isChecked ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-square" viewBox="0 0 16 16">
                          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                          <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-square" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                      </svg>
                      )}
                    </button>
                      <button
                        className={`Note-Pin ${note.isPinned ? 'pinned' : 'unpinned'}`}
                        onClick={() => toggleNotePinned(note.id, !note.isPinned)}>
                        {note.isPinned ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pin-angle-fill" viewBox="0 0 16 16" className="Note-pin-button">
                            <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a6 6 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707s.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a6 6 0 0 1 1.013.16l3.134-3.133a3 3 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146"/>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pin-angle" viewBox="0 0 16 16" className="Note-pin">
                            <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a6 6 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707s.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a6 6 0 0 1 1.013.16l3.134-3.133a3 3 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146m.122 2.112v-.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a5 5 0 0 0-.288-.076 5 5 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a5 5 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034q.172.002.343-.04L9.927 2.028q-.042.172-.04.343a1.8 1.8 0 0 0 .062.46z"/>
                          </svg>
                        )}
                    </button>
                  </div>
                  <div className="labels-container">
                    {note.labels && note.labels.length > 0 && (
                    <div className="Note-Labels">
                      {note.labels.map((label) => (
                        <span key={label} className="Note-Label">{label} | </span>
                      ))}
                    </div>
                  )}
                  </div>
                </li>
              ))}
            </ol>
            
          ) : null}
          
        </div>
        
      </aside>
      <main className="Main">
        <Routes>
          <Route path="/" element="Sélectionner une note" />
          <Route
            path="/notes/:id"
            element={<Note onSaveSuccess={fetchNotes} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <LabelModal
        fetchNotes={fetchNotes}
      />

    </BrowserRouter>
  );
}
export default App;