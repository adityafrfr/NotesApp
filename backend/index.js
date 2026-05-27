const express = require('express');
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
let notes = [{
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

const generateId = () => {
    const maxId = notes.length > 0 ?
        Math.max(...notes.map(n => Number(n.id))) :
        0
    return String(maxId + 1)
}

app.post(`/api/notes`, (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const note = {
        content: body.content,
        important: body.important || false,
        id: generateId()
    }
    notes = notes.concat(note)
    response.json(note)
})


app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)

    if (note) {
        response.json(note)
    } else {
        response.status(404).json('Does not exist')
    }
})

app.put('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const body = request.body
    const note = notes.find(currentNote => currentNote.id === id)

    if (!note) {
        return response.status(404).json({
            error: 'note not found'
        })
    }

    if (!body.content) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const updatedNote = {
        ...note,
        content: body.content,
        important: Boolean(body.important)
    }

    notes = notes.map(currentNote => currentNote.id === id ? updatedNote : currentNote)

    response.json(updatedNote)
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})