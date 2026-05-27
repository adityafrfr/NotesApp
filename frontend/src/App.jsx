import { useState } from "react"
import { useEffect } from "react"
import axios from "axios"
import Note from "./components/Note"
import Notification from "./components/Notification"
import noteService from './services/notes'
import Footer from "./components/Footer"

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errMessage, setErrMessage] = useState(null)
  const [messageType, setMessageType] = useState('error')

  useEffect(() => { noteService.getAll().then(response => setNotes(response)) }, [])

  console.log('render', notes.length, 'notes')

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    console.log(`need to toggle importance of ${id}`);
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService.update(id, changedNote).then(response => {
      setNotes(notes.map(note => note.id === id ? response : note))
    })
    .catch(error => {
      console.log(error)
      setErrMessage(`Note '${note.content}' was already removed from server`)
      setMessageType('error')
      setTimeout(() => {
        setErrMessage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
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
        setNotes(notes.concat(response))
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

  const notesToShow = showAll ? notes : notes.filter(notes => notes.important === true)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errMessage} type={messageType} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />)}
      </ul>
      <form onSubmit={addNote}>
        Make a note: <input
          value={newNote}
          onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
        <Footer />
    </div>
  )
}
export default App
