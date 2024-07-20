const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
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
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Function to generate a session token
const generateSessionToken = () => {
    return crypto.randomBytes(64).toString('hex');
};


// Middleware to verify the session token
const verifyToken = (req, res, next) => {
    const token = req.cookies.session_token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    // Placeholder for token validation logic
    const isValid = true; // Replace with actual validation
    if (isValid) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};


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

// // Login route
// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

//         if (result.rows.length > 0) {
//             res.status(200).json({ message: 'Login successful' });
//         } else {
//             res.status(401).json({ error: 'Invalid credentials' });
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({success: false, error: 'Internal Server Error' });
//     }
// });


// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

        if (result.rows.length > 0) {
            // // Generate a session token
            const sessionToken = generateSessionToken();
            // Set the token as a cookie
            res.cookie('session_token', sessionToken, { httpOnly: true, secure: false }); // Set secure: true if using HTTPS
            // Set the username as a cookie
            res.cookie('username', username, { httpOnly: false, secure: false }); // Ensure secure: true if using HTTPS
            res.status(200).json({ success: true });

        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Sign-up endpoint
app.post('/sign-up', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const existingUser = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        await pool.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)', [username, password, email]);

        // Generate a session token
        const sessionToken = generateSessionToken();
        // Set the token as a cookie
        res.cookie('session_token', sessionToken, { httpOnly: true, secure: false }); // Set secure: true if using HTTPS
        res.status(200).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
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




app.get('/api/stock/:categoryId', async (req, res) => {
    const { categoryId } = req.params;
    try {
        const result = await pool.query('SELECT * FROM stock WHERE categoryid = $1', [categoryId]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// // Handle sign-up requests
// app.post('/sign-up', async (req, res) => {
//     const { username, password, email } = req.body;

//     try {
//         const existingUser = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);

//         if (existingUser.rows.length > 0) {
//             return res.status(400).json({ error: 'Username or email already exists' });
//         }

//         await pool.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)', [username, password, email]);
//         res.status(200).json({ message: 'User registered successfully' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


// Handle the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login-page.html'));
});

// Example protected route
app.get('/protected-route', verifyToken, (req, res) => {
    res.send('This is a protected route.');
});


// Handle the sign-up page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup-page.html'));
});

// app.get('/logout', (req, res) => {
//     res.clearCookie('session_token');
//     res.clearCookie('username');
//     res.redirect('/login');
// });

// Add this to your server.js
app.post('/logout', (req, res) => {
    res.clearCookie('session_token', { path: '/' });
    res.clearCookie('username', { path: '/' });
    res.status(200).json({ success: true });
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

