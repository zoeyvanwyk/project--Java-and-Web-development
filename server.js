const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// PostgreSQL pool setup
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'CraftersCorner',
    password: '1234',
    port: 5432,
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to get data from the database
app.get('/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

        if (result.rows.length > 0) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({success: false, error: 'Internal Server Error' });
    }
});

// API endpoint to get category name by ID
app.get('/api/category/:id', async (req, res) => {
    const categoryId = req.params.id;

    try {
        const result = await pool.query('SELECT categoryname FROM Category WHERE CategoryID = $1', [categoryId]);
        if (result.rows.length > 0) {
        res.json({ categoryName: result.rows[0].categoryname });
        } else {
            console.log('Category not found');
            res.status(404).json({ error: 'Category not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    });


// // API endpoint to get items by category ID
// app.get('/api/items/:categoryId', async (req, res) => {
//     const categoryId = req.params.categoryId;
  
//     try {
//         // Fix this, this is chat helping i dont think thisll pull from the right table
//       const result = await pool.query('SELECT * FROM Items WHERE categoryid = $1', [categoryId]);
//       res.json(result.rows);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
  
//   app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
//   });


// // Endpoint to fetch items for a specific category
// app.get('/api/items/:categoryId', async (req, res) => {
//     const categoryId = req.params.categoryId;
//     try {
//         const query = 'SELECT * FROM stock WHERE categoryid = $1';
//         const values = [categoryId];
//         const result = await pool.query(query, values);
//         res.json(result.rows);
//     } catch (error) {
//         console.error('Error fetching items:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


app.get('/api/products/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM stock WHERE categoryid = $1', [categoryId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// Handle sign-up requests
app.post('/sign-up', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        await pool.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)', [username, password, email]);
        res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Handle the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login-page.html'));
});

// Handle the sign-up page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup-page.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
