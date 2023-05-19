const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//homepage GET Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
}); 

//notes page GET Route
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

//GET Route for getting notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

//POST Route for a new note
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        const allNotes = JSON.parse(data);
        allNotes.push(newNote);

    fs.writeFile('./db/db.json', JSON.stringify(allNotes, null, 2), (err) => {
        if (err) throw err;
        res.status(200).json(newNote);
        });
    });
});

//DELETE Route for an existing note
app.delete('/api/notes/:id', (req, res) => {
    const noteID = req.params.id;

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        let allNotes = JSON.parse(data);

        allNotes = allNotes.filter(note => note.id !== noteID);

        fs.writeFile('./db/db.json', JSON.stringify(allNotes, null, 2), (err) => {
            if (err) throw err;
            res.sendStatus(200);
        });
    });
});

app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT}`)
);