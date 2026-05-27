const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li className="note">
      <div className="note-content-group">
        <span className="note-content">{note.content}</span>
        <span className={`note-badge ${note.important ? 'important' : 'normal'}`}>
          {note.important ? 'Important' : 'Normal'}
        </span>
      </div>
      <button className="importance-button" type="button" onClick={toggleImportance}>
        {label}
      </button>
    </li>
  )
}

export default Note