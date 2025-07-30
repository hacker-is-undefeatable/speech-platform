require('dotenv').config();
    const express = require('express');
    const cors = require('cors');
    const { Pool } = require('pg');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');

    const app = express();
    app.use(cors());
    app.use(express.json());

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });

    // Register Endpoint
    app.post('/api/auth/register', async (req, res) => {
      const { lastName, firstName, email, password } = req.body;
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
          'INSERT INTO users (last_name, first_name, email, password_hash, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id',
          [lastName, firstName, email, hashedPassword]
        );
        res.status(201).json({ message: 'User registered successfully', userId: result.rows[0].id });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed' });
      }
    });

    // Login Endpoint
    app.post('/api/auth/login', async (req, res) => {
      const { email, password } = req.body;
      try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(400).json({ error: 'User not found' });

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
      }
    });

    // Middleware to verify token (optional for protected routes)
    const authenticateToken = (req, res, next) => {
      const token = req.headers['authorization']?.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'Access denied' });

      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
      });
    };

    // Protected Home Route (example)
    app.get('/api/home', authenticateToken, (req, res) => {
      res.json({ message: 'Welcome to the Home Page', user: req.user });
    });

    const PORT = 4000;
    pool.connect((err) => {
      if (err) console.error('Database connection error:', err);
      else console.log('Connected to database');
    });
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));