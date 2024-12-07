const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql123",
    database: "employee_management",
});

db.connect((err) => {
    if (err) throw err;
    console.log('Database connected!');
});

// Add Employee API
app.post('/api/employees', (req, res) => {
    const { employee_id, name, email, phone_number, department, date_of_joining, role } = req.body;

    // Check if Employee ID or Email already exists
    const checkQuery = `SELECT * FROM employees WHERE employee_id = ? OR email = ?`;
    db.query(checkQuery, [employee_id, email], (err, result) => {
        if (err) return res.status(500).send('Database error.');
        if (result.length > 0)
            return res.status(400).send('Employee ID or Email already exists.');

        // Insert employee into the database
        const insertQuery = `INSERT INTO employees (employee_id, name, email, phone_number, department, date_of_joining, role) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(
            insertQuery,
            [employee_id, name, email, phone_number, department, date_of_joining, role],
            (err) => {
                if (err) return res.status(500).send('Failed to add employee.');
                res.status(200).send('Employee added successfully.');
            }
        );
    });
});

// Start server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));
