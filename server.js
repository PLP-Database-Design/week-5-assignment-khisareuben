// server.js

const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');

// Initialize dotenv to load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Create MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});

// 1. Retrieve all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving patients');
        } else {
            res.json(results);
        }
    });
});

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_speciality FROM providers';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving providers');
        } else {
            res.json(results);
        }
    });
});

// 3. Filter patients by first name
app.get('/patients/:first_name', (req, res) => {
    const { first_name } = req.params;
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    db.query(query, [first_name], (err, results) => {
        if (err) {
            res.status(500).send('Error filtering patients by first name');
        } else {
            res.json(results);
        }
    });
});

// 4. Retrieve all providers by their specialty
app.get('/providers/specialty/:specialty', (req, res) => {
    const { specialty } = req.params;
    const query = 'SELECT first_name, last_name, provider_speciality FROM providers WHERE provider_speciality = ?';
    db.query(query, [specialty], (err, results) => {
        if (err) {
            res.status(500).send('Error retrieving providers by specialty');
        } else {
            res.json(results);
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
