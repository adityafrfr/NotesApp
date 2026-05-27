import { useState } from "react"
import { useEffect } from "react"
import Note from "./components/Note"
import Notification from "./components/Notification"
import noteService from './services/notes'
import Footer from "./components/Footer"

const initialNotes = [
  {
    id: "1",
    content: "My code has two states: compiling and 'just one more log statement'.",
    important: true
  },
  {
    id: "2",
    content: "I tried to catch a bug, but it threw an exception and escaped the debugger.",
    important: false
  },
  {
    id: "3",
    content: "Our servers don't crash; they take unscheduled coffee breaks.",
    important: true
  }
]

const App = () => {
  const [notes, setNotes] = useState(initialNotes)
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errMessage, setErrMessage] = useState(null)
  const [messageType, setMessageType] = useState('error')

  useEffect(() => {
    noteService.getAll().then(response => setNotes(response))
  }, [])

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService.update(id, changedNote).then(response => {
      setNotes(currentNotes =>
        currentNotes.map(currentNote => currentNote.id === id ? response : currentNote)
      )
    })
    .catch(error => {
      console.log(error)
      setErrMessage(`Note '${note.content}' was already removed from server`)
      setMessageType('error')
      setTimeout(() => {
        setErrMessage(null)
      }, 5000)
      setNotes(currentNotes => currentNotes.filter(n => n.id !== id))
    })
  }


  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      id: String(notes.length + 1)
    }

    noteService
      .create(noteObject)
      .then(response => {
        setNotes(currentNotes => currentNotes.concat(response))
        setNewNote('')
        setErrMessage(`Added '${response.content}'`)
        setMessageType('success')
        setTimeout(() => {
          setErrMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.log(error)
        alert(
          `the note '${newNote}' was already deleted from server`
        )
        setErrMessage(`Could not save note '${newNote}'`)
        setMessageType('error')
        setTimeout(() => {
          setErrMessage(null)
        }, 5000)  
      })
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <div className="app-shell">
      <div className="app-card">
        <div className="app-header">
          <div>
            <p className="eyebrow">Stay organized</p>
            <h1>Notes</h1>
          </div>
          <button
            className="filter-button"
            type="button"
            onClick={() => setShowAll(!showAll)}
          >
            Show {showAll ? 'important' : 'all'}
          </button>
        </div>

        <Notification message={errMessage} type={messageType} />

        <ul className="note-list">
          {notesToShow.map(note => (
            <Note
              key={note.id}
              note={note}
              toggleImportance={() => toggleImportanceOf(note.id)}
            />
          ))}
        </ul>

        <form className="note-form" onSubmit={addNote}>
          <label className="note-form-label" htmlFor="new-note">Make a note</label>
          <div className="note-form-row">
            <input
              id="new-note"
              className="note-input"
              value={newNote}
              onChange={handleNoteChange}
              placeholder="Write something down..."
            />
            <button className="primary-button" type="submit">Save</button>
          </div>
        </form>

        <Footer />
      </div>
    </div>
  )
}
export default App
