// users/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../lib/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key'; 


router.post('/signup', async (req, res) => {
    const { first_name, last_name, email, password, phone, address } = req.body;
    
    try {
        // Check if user already exists
        const checkUser = 'SELECT * FROM users WHERE email = ?';
        db.query(checkUser, [email], async (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            if (result.length > 0) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            
            // Default CIBIL score for new users
            const defaultCibilScore = 600;

            // Insert new user
            const insertUser = `
                INSERT INTO users 
                (first_name, last_name, email, password, phone, address, cibil_score) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            
            db.query(
                insertUser, 
                [first_name, last_name, email, hashedPassword, phone, address, defaultCibilScore],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    // Create JWT token
                    const token = jwt.sign(
                        { userId: result.insertId, email }, 
                        JWT_SECRET,
                        { expiresIn: '24h' }
                    );

                    res.status(201).json({
                        message: 'User created successfully',
                        token,
                        user: {
                            id: result.insertId,    // Return the userId here
                            first_name,
                            last_name,
                            email
                        }
                    });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/signin', (req, res) => {
    const { email, password } = req.body;

    try {
        const q = 'SELECT * FROM users WHERE email = ?';
        
        db.query(q, [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (results.length === 0) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            const user = results[0];

            // Compare password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Create JWT token
            const token = jwt.sign(
                { userId: user.user_id, email: user.email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                token,
                user: {
                    id: user.user_id,  // Return the userId here
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Middleware to protect routes
export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

export default router;