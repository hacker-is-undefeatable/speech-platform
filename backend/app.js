require('dotenv').config();
    const express = require('express');
    const cors = require('cors');
    const { createClient } = require('@supabase/supabase-js');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');

    const app = express();
    app.use(cors());
    app.use(express.json());

    // Initialize Supabase Client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase env vars missing. URL:', supabaseUrl, 'Key present:', !!supabaseKey);
    } else {
      console.log('Supabase Client Initialized. URL:', supabaseUrl);
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Register Endpoint
    app.post('/api/auth/register', async (req, res) => {
      const { lastName, firstName, email, password } = req.body;
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert into custom 'users' table
        const { data, error } = await supabase
          .from('users')
          .insert([
            { 
              last_name: lastName, 
              first_name: firstName, 
              email: email, 
              password_hash: hashedPassword 
            }
          ])
          .select('id')
          .single();

        if (error) throw error;
        
        res.status(201).json({ message: 'User registered successfully', userId: data.id });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Registration failed', details: err.message });
      }
    });

    // Login Endpoint
    app.post('/api/auth/login', async (req, res) => {
      const { email, password } = req.body;
      try {
        const { data: user, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (error || !user) return res.status(400).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed', details: err.message });
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

    const PORT = process.env.PORT || 4000;
    if (require.main === module) {
      app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
    }
    
    module.exports = app;