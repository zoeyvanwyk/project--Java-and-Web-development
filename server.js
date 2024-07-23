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
// new  thing added
app.use(express.json());


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
            // check if the user is an admin
            const isAdmin = result.rows[0].is_admin;
            // Generate a session token
            const sessionToken = generateSessionToken();
            // Set the token as a cookie
            res.cookie('session_token', sessionToken, { httpOnly: true, secure: false }); // Set secure: true if using HTTPS
            // Set the username as a cookie
            res.cookie('username', username, { httpOnly: false, secure: false }); // Ensure secure: true if using HTTPS
            // set the value of the admin value as an additional cookie to allow cross site access as an
            res.cookie('is_admin', isAdmin, { path: '/', domain: 'localhost' });
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
        res.status(500).json({ error: 'Internal Server Error category not found' });
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

//trying to see if adding an endpoint for fetching an item by ID will help:
app.get('/api/stock/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM stock WHERE item_id = $1', [id]);
        res.json(result.rows[0]); // Return a single item, not an array
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// API endpoint to fetch all stock items
app.get('/api/stock', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM stock');
        res.json(result.rows);
    } catch (err) {
        console.error(err,);
        res.status(500).json({ error: 'Internal Server Error from getting stock' });
    }
});

// // API endpoint to fetch a specific stock item by ID
// app.get('/api/stock/:id', async (req, res) => {
//     const { id } = req.params;
//     try {
//         const result = await pool.query('SELECT * FROM stock WHERE item_id = $1', [id]);
//         res.json(result.rows[0]); // Return a single item, not an array
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Internal Server Error 0' });
//     }
// });


// API endpoint to add a new stock item
// app.post('/api/stock', async (req, res) => {
//     const { name, categoryid, description, price, stock, material, colour, image } = req.body;
//     console.log('Received payload for POST /api/stock:', req.body); // Add this line
//     try {
//         await pool.query('INSERT INTO stock (name, categoryid, description, price, stock, material, colour, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [name, categoryid, description, price, stock, material, colour, image]);
//         console.log('Executing query:', queryText);
//         console.log('With values:', queryValues);
        
//         await pool.query(queryText, queryValues);
//         res.status(201).json({ success: true });
        
//     } catch (err) {
//         // console.error(err);
//         console.error('Error in POST /api/stock:', err);
//         res.status(500).json({ error: 'Internal Server Error during item addition' });
//     }
// });
// app.post('/api/stock', async (req, res) => {
//     const data = req.body;

//     try {
//         const result = await db.query(
//             'INSERT INTO stock (name, categoryid, description, price, stock, material, colour, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
//             [data.name, data.categoryid, data.description, data.price, data.stock, data.material, data.colour, data.image]
//         );
//         res.status(201).json({ success: true, data: result });
//     } catch (error) {
//         console.error('Error adding item:', error); // Log error details
//         res.status(500).json({ success: false, error: error.message });
//     }
// });
app.post('/api/stock', async (req, res) => {
    const { name, categoryid, description, price, stock, material, colour, image } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO stock (name, categoryid, description, price, stock, material, colour, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [name, categoryid, description, price, stock, material, colour, image]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});






//API endpoint to update an existing stock item
app.put('/api/stock/:id', async (req, res) => {
    const { id } = req.params;
    const { name, categoryid, description, price, stock, material, colour, image } = req.body;
    try {
        await pool.query('UPDATE stock SET name = $1, categoryid = $2, description = $3, price = $4, stock = $5, material = $6, colour = $7, image = $8 WHERE item_id = $9', [name, categoryid, description, price, stock, material, colour, image, id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        console.error('Error in PUT /api/stock/:id:', err);
        res.status(500).json({ error: 'Internal Server Error during item update' });
    }
});
//Update an existing stock item
// app.put('/api/stock/:id', async (req, res) => {
//     const itemId = req.params.id;
//     const { name, categoryid, description, price, stock, material, colour, image } = req.body;

//     try {
//         const query = `
//             UPDATE stock
//             SET name = $1, categoryid = $2, description = $3, price = $4, stock = $5, material = $6, colour = $7, image = $8
//             WHERE item_id = $9
//         `;
//         const values = [name, categoryid, description, price, stock, material, colour, image, itemId];

//         await pool.query(query, values);
//         res.status(200).json({ message: 'Item updated successfully' });
//     } catch (error) {
//         console.error('Error updating item:', error);
//         res.status(500).json({ error: 'Internal Server Error during item update' });
//     }
// });


// API endpoint to delete a stock item
app.delete('/api/stock/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM stock WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error during item deletion' });
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


// Add this to your server.js
app.post('/logout', (req, res) => {
    res.clearCookie('session_token', { path: '/' });
    res.clearCookie('username', { path: '/' });
    res.status(200).json({ success: true });
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

