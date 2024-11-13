import express from 'express'
import db from '../lib/db.js'

const   router = express.Router()

router.get('/', (req, res) => {
    const userId = req.params.userId
    const q = 'select * from users'
    db.query(q, [userId], (err, data) => {
        if(err){
            return res.status(500).send(err)
        }
        return res.status(200).json({
            user: data
        })
    })
})
router.get('/:userId', (req, res) => {
    const userId = req.params.userId
    const q = 'select * from users where user_id = ?'
    db.query(q, [userId], (err, data) => {
        if(err){
            return res.status(500).send(err)
        }
        return res.status(200).json({
            user: data
        })
    })
})

router.get('/:userId/accounts', (req, res) => {
    const userId = req.params.userId;
    const q = 'SELECT * FROM accounts WHERE user_id = ?';
    db.query(q, [userId], (err, data) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).json({
            accounts: data
        });
    });
});


router.post('/create', (req, res) => {
    const { first_name, last_name, email, phone, address, cibil_score } = req.body;
    const q = 'INSERT INTO users (first_name, last_name, email, phone, address, cibil_score) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(q, [first_name, last_name, email, phone, address, cibil_score], (err, data) => {
        if (err) {
            return res.status(500).send(err);
        }
        const userId = data.insertId; // Get the ID of the newly created user
        return res.status(201).json({
            message: "User created successfully",
            userId: userId
        });
    });
});

router.get('/:userId/details', (req, res) => {
    const userId = req.params.userId;
    const q = 'SELECT * FROM users WHERE user_id = ?';
    
    db.query(q, [userId], (err, data) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (data.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(data[0]);
    });
});

router.delete('/:userId', (req, res) => {
    const userId = req.params.userId;
    const q = 'DELETE FROM users WHERE user_id = ?';
    
    db.query(q, [userId], (err, data) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (data.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            message: "User deleted successfully"
        });
    });
});

export default router