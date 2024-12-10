const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const router = express.Router();

// GET: Login Page
router.get('/', (req, res) => {
    res.render('login', { message: req.flash('message') });
});

// POST: Login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ?';

    db.query(query, [username], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            bcrypt.compare(password, results[0].password, (err, match) => {
                if (match) {
                    req.session.user = results[0];
                    res.redirect('/dashboard');
                } else {
                    req.flash('message', 'Invalid credentials');
                    res.redirect('/');
                }
            });
        } else {
            req.flash('message', 'User not found');
            res.redirect('/');
        }
    });
});

// GET: Dashboard
router.get('/dashboard', (req, res) => {
    if (!req.session.user) return res.redirect('/');

    const query = 'SELECT * FROM books';
    db.query(query, (err, books) => {
        if (err) throw err;
        res.render('dashboard', { user: req.session.user, books });
    });
});

// POST: Add Book
router.post('/add-book', (req, res) => {
    const { title, author } = req.body;
    const query = 'INSERT INTO books (title, author) VALUES (?, ?)';

    db.query(query, [title, author], (err) => {
        if (err) throw err;
        res.redirect('/dashboard');
    });
});

// POST: Delete Book
router.post('/delete-book', (req, res) => {
    const { id } = req.body;
    const query = 'DELETE FROM books WHERE id = ?';

    db.query(query, [id], (err) => {
        if (err) throw err;
        res.redirect('/dashboard');
    });
});

module.exports = router;
