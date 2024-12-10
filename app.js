const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const db = require('./config/db');
const routes = require('./routes/index');

const app = express();
const path = require('path');
const bcrypt = require('bcryptjs');

app.use('/styles', express.static(path.join(__dirname, 'styles')));

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());

// Routes
app.use('/', routes);

// Route xử lý logout
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error while destroying session:', err);
            return res.status(500).send('Failed to logout');
        }
        res.redirect('/login'); // Chuyển hướng về trang đăng nhập sau khi đăng xuất
    });
});

// Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const username = 'admin';
const password = 'admin123';

bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, hash], (err, result) => {
        if (err) throw err;
        console.log('User added with hashed password');
    });
});
