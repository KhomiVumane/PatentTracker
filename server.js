const express = require('express');
const mysql = require('mysql2');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'innovashield'
});

db.connect((err) => {
    if (err) {
        console.log('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database!');
    }
});

// Home route
app.get('/', (req, res) => {
    res.send('InnovaShield is running!');
});

// PATENTS - List all
app.get('/patents', (req, res) => {
    db.query('SELECT * FROM patents', (err, results) => {
        if (err) throw err;
        res.render('patents', { patents: results });
    });
});

// PATENTS - Insert new
app.post('/patents/add', (req, res) => {
    const { title, owner, industry, filing_date, expiry_date, status, description } = req.body;
    db.query('INSERT INTO patents (title, owner, industry, filing_date, expiry_date, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, owner, industry, filing_date, expiry_date, status, description],
    (err) => {
        if (err) throw err;
        res.redirect('/patents');
    });
});

// TRADEMARKS - List all
app.get('/trademarks', (req, res) => {
    db.query('SELECT * FROM trademarks', (err, results) => {
        if (err) throw err;
        res.render('trademarks', { trademarks: results });
    });
});

// TRADEMARKS - Get one to edit
app.get('/trademarks/edit/:id', (req, res) => {
    db.query('SELECT * FROM trademarks', (err, results) => {
        if (err) throw err;
        db.query('SELECT * FROM trademarks WHERE trademark_id = ?', [req.params.id], (err2, edit) => {
            if (err2) throw err2;
            res.render('trademarks', { trademarks: results, editTrademark: edit[0] });
        });
    });
});

// TRADEMARKS - Update
app.post('/trademarks/update', (req, res) => {
    const { trademark_id, name, owner, industry, status } = req.body;
    db.query('UPDATE trademarks SET name=?, owner=?, industry=?, status=? WHERE trademark_id=?',
    [name, owner, industry, status, trademark_id],
    (err) => {
        if (err) throw err;
        res.redirect('/trademarks');
    });
});

// WATCHLIST - List all
app.get('/watchlist', (req, res) => {
    db.query('SELECT * FROM watchlist', (err, results) => {
        if (err) throw err;
        res.render('watchlist', { watchlist: results });
    });
});

// WATCHLIST - Delete
app.post('/watchlist/delete/:id', (req, res) => {
    db.query('DELETE FROM watchlist WHERE watchlist_id = ?', [req.params.id], (err) => {
        if (err) throw err;
        res.redirect('/watchlist');
    });
});

// OWNERSHIP CHANGES - List all
app.get('/ownership', (req, res) => {
    db.query('SELECT * FROM ownership_changes', (err, results) => {
        if (err) throw err;
        res.render('ownership', { ownership: results });
    });
});

// OWNERSHIP CHANGES - Insert new
app.post('/ownership/add', (req, res) => {
    const { patent_id, old_owner, new_owner, change_date, reason } = req.body;
    db.query('INSERT INTO ownership_changes (patent_id, old_owner, new_owner, change_date, reason) VALUES (?, ?, ?, ?, ?)',
    [patent_id, old_owner, new_owner, change_date, reason],
    (err) => {
        if (err) throw err;
        res.redirect('/ownership');
    });
});

// USERS - List all
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) throw err;
        res.render('users', { users: results });
    });
});

// USERS - Get one to edit
app.get('/users/edit/:id', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) throw err;
        db.query('SELECT * FROM users WHERE user_id = ?', [req.params.id], (err2, edit) => {
            if (err2) throw err2;
            res.render('users', { users: results, editUser: edit[0] });
        });
    });
});

// USERS - Update
app.post('/users/update', (req, res) => {
    const { user_id, name, email, user_type } = req.body;
    db.query('UPDATE users SET name=?, email=?, user_type=? WHERE user_id=?',
    [name, email, user_type, user_id],
    (err) => {
        if (err) throw err;
        res.redirect('/users');
    });
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
