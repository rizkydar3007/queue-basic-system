const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Masukan database sesuai dengan konfigurasi XAMPP/MySQL lokal kalian
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'queue_db'
});

connection.connect((error) => {
    if (error) throw error;
    console.log('Successfully connected to the database.');
});

app.post('/generate', cors(), (req, res) => {
    // Generate a ticket number
    const ticketNumber = Math.floor(Math.random() * 10000);

    // Insert the ticket into the database
    const query = 'INSERT INTO tickets (name, services, ticket_number) VALUES (?, ?, ?)';
    connection.query(query, [req.body.name, req.body.service, ticketNumber], (error, results) => {
        if (error) throw error;
        res.send({ ticketNumber });
    });
});

app.get('/current/:service', cors(), (req, res) => {
    // Get the current number of the queue ticket for the specified service
    const query = 'SELECT COUNT(*) as count FROM tickets WHERE services = ?';
    connection.query(query, [req.params.service], (error, results) => {
        if (error) throw error;
        res.send(results[0]);
    });
});



app.get('/tickets/:service', cors(), (req, res) => {
    // Get the queue tickets for the specified service
    const query = 'SELECT * FROM tickets WHERE services = ? ORDER BY ticket_number ASC';
    connection.query(query, [req.params.service], (error, results) => {
      if (error) throw error;
      res.send(results);
    });
  });

app.listen(3000, () => {
    console.log('Server is running on port 3000.');
});