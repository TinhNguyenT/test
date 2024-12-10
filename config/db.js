const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'host.docker.internal',
    user: 'root', // Thay bằng user của bạn
    password: '123', // Thay bằng password của bạn
    database: 'library'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

module.exports = connection;
