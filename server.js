const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
// app.set('view engine', 'ejs');
// app.use(express.static(path.join(__dirname, 'public')));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "public"));

// Load JSON Data
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'data.json')));

// For saved rows
let savedRows = [];

// Display table with pagination
app.get('/', (req, res) => {
    let page = parseInt(req.query.page) || 1;
    const rowsPerPage = 5;
    const totalPages = Math.ceil(data.Bleu.length / rowsPerPage);

    // Pagination logic
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const paginatedData = {
        Bleu: data.Bleu.slice(start, end),
        Rouge: data.Rouge.slice(start, end),
        llm: data.llm.slice(start, end),
        CIDEr: data.CIDEr.slice(start, end),
        pred: data.pred.slice(start, end),
        gt: data.gt.slice(start, end)
    };

    res.render('index', { paginatedData, page, totalPages, savedRows });
});

// Save a row
app.post('/save', (req, res) => {
    const { index } = req.body;
    savedRows.push({
        Bleu: data.Bleu[index],
        Rouge: data.Rouge[index],
        llm: data.llm[index],
        CIDEr: data.CIDEr[index],
        caption: `<strong>gt:</strong> ${data.gt[index]}<br><strong>pred:</strong> ${data.pred[index]}`
    });
    res.redirect('/');
});

// View saved rows
app.get('/saved', (req, res) => {
    res.render('saved', { savedRows });
});

// Remove a saved row
app.post('/remove', (req, res) => {
    const { index } = req.body;
    savedRows.splice(index, 1);
    res.redirect('/saved');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
