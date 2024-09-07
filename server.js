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

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Function to generate a session token
const generateSessionToken = () => {
    return crypto.randomBytes(16).toString('hex');
};

// Middleware to verify the session token
const verifyToken = (req, res, next) => {
    const token = req.cookies.session_token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const isValid = true;
    if (isValid) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

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

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);

        if (result.rows.length > 0) {
            const isAdmin = result.rows[0].is_admin;
            const sessionToken = generateSessionToken();
            res.cookie('session_token', sessionToken, { httpOnly: true, secure: false });
            res.cookie('username', username, { httpOnly: false, secure: false });
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
        res.cookie('session_token', sessionToken, { httpOnly: true, secure: false });
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

app.get('/api/stock/:id', async (req, res) => {
    const itemId = parseInt(req.params.id, 10);

    if (isNaN(itemId)) {
        console.log('Invalid ID:', req.params.id);
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    console.log('Fetching item ID:', itemId);

    try {
        const { rows } = await db.query('SELECT * FROM stock WHERE item_id = $1' , [itemId]);

        console.log('Query result:', rows);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching item:', error);
        res.status(500).json({ error: 'Internal server error' });
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

// API endpoint to add a new stock item
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

// API endpoint to edit stock item
app.patch('/api/stock/:item_id', async (req, res) => {
    const item_id = req.params.item_id;
    
     if (!item_id || item_id === 'undefined') {
        return res.status(400).json({ error: 'Invalid item ID' });
    }
    console.log('Item ID:', item_id);
    const { name, categoryid, description, price, stock, material, colour, image } = req.body;

    const updates = [];
    const values = [];
    let index = 1;

    if (name) {
        updates.push(`name = $${index++}`);
        values.push(name);
    }
    if (categoryid) {
        updates.push(`categoryid = $${index++}`);
        values.push(categoryid);
    }
    if (description) {
        updates.push(`description = $${index++}`);
        values.push(description);
    }
    if (price) {
        updates.push(`price = $${index++}`);
        values.push(price);
    }
    if (stock) {
        updates.push(`stock = $${index++}`);
        values.push(stock);
    }
    if (material) {
        updates.push(`material = $${index++}`);
        values.push(material);
    }
    if (colour) {
        updates.push(`colour = $${index++}`);
        values.push(colour);
    }
    if (image) {
        updates.push(`image = $${index++}`);
        values.push(image);
    }

    // Check if there are any updates
    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    // Add the ID to the end of the values array
    values.push(item_id); 

    try {
        const result = await pool.query(
            `UPDATE stock SET ${updates.join(', ')} WHERE item_id = $${index} RETURNING *`,
            values
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error in PATCH /api/stock/:item_id:', error);
        res.status(500).json({ error: 'Internal Server Error during item update' });
    }
});

// API endpoint to delete a stock item
app.delete('/api/stock/:id', async (req, res) => {
    const { id } = req.params;
    try {
        
        const result = await pool.query('DELETE FROM stock WHERE item_id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error deleting item:', err);
        res.status(500).json({ error: 'Internal Server Error during item deletion' });
    }
});
 
// API endpoint to handle checkout and send a success message
app.post('/api/checkout', async (req, res) => {
    const { cartItems } = req.body;

    try {
        res.status(200).json({ message: 'Order placed successfully!' });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ error: 'Internal Server Error during checkout.' });
    }
});

// API endpoint to calculate the total amount
app.post('/api/calculate-total', async (req, res) => {
    const { cartItems } = req.body;

    try {
        let totalAmount = 0;

        for (const item of cartItems) {
            const { item_id, quantity } = item;

            // Get the price of the item
            const priceResult = await pool.query('SELECT price FROM stock WHERE item_id = $1', [item_id]);
            const price = priceResult.rows[0].price;

            totalAmount += price * quantity;
        }

        res.json({ totalAmount });
    } catch (error) {
        console.error('Error calculating total amount:', error);
        res.status(500).json({ error: 'Internal Server Error during total calculation' });
    }
});

// API endpoint to update the quantity of an item in the cart 
app.patch('/api/cart/:item_id', async (req, res) => {
    const item_id = req.params.item_id;
    const { quantity } = req.body;

    try {
        res.status(200).json({ message: 'Quantity updated successfully' });
    } catch (error) {
        console.error('Error updating quantity:', error);
        res.status(500).json({ error: 'Internal Server Error during quantity update' });
    }
});

// API endpoint to delete an item from the cart
app.delete('/api/cart/:item_id', async (req, res) => {
    const item_id = req.params.item_id;

    try {
        await pool.query('DELETE FROM cart WHERE item_id = $1', [item_id]);
        res.status(200).json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ error: 'Internal Server Error during item removal' });
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

// Example protected route
app.get('/protected-route', verifyToken, (req, res) => {
    res.send('This is a protected route.');
});

// Handle the sign-up page
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup-page.html'));
});

// Logout endpoint
app.post('/logout', (req, res) => {
    res.clearCookie('session_token', { path: '/' });
    res.clearCookie('username', { path: '/' });
    res.status(200).json({ success: true });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});