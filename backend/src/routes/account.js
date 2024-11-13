import express from 'express'
import db from '../lib/db.js'
const router = express.Router()

const generateAccountNumber = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
};

router.get('/', (req, res) => {
    const q = 'SELECT * from accounts';
    db.query(q, (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.status(200).json(data);
    });
});

router.post('/create', (req, res) => {
    const accountNumber = generateAccountNumber();
    const q = 'INSERT INTO accounts (account_number, user_id, branch_id, account_type, balance) VALUES (?, ?, ?, ?, ?)';
    const values = [
        accountNumber,
        req.body.user_id,
        req.body.branch_id,
        req.body.account_type,
        req.body.balance,
    ];
    
    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.status(201).json({ message: "Account created successfully", accountNumber: accountNumber });
    });
});

router.delete('/:accountNumber', (req, res) => {
    const accountNumber = req.params.accountNumber;
    const q = 'DELETE FROM accounts WHERE account_number = ?';

    db.query(q, [accountNumber], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.affectedRows === 0) {
            return res.status(404).json({ message: 'Account not found' });
        }
        return res.status(200).json({ message: 'Account deleted successfully' });
    });
});

router.get('/:accountNumber', (req, res) => {
    const accountNumber = req.params.accountNumber;
    const q = 'SELECT * FROM accounts WHERE account_number = ?';

    db.query(q, [accountNumber], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.length === 0) {
            return res.status(404).json({ message: 'Account not found' });
        }
        return res.status(200).json({ account: data[0] });
    });
});

router.post('/:accountNumber/deposit', (req, res) => {
    const accountNumber = req.params.accountNumber;
    const amount = req.body.amount;
    const q = 'UPDATE accounts SET balance = balance + ? WHERE account_number = ?';

    db.query(q, [amount, accountNumber], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.affectedRows === 0) {
            return res.status(404).json({ message: 'Account not found' });
        }
        return res.status(200).json({ message: `Successfully deposited ${amount}` });
    });
});

router.post('/:accountNumber/withdraw', (req, res) => {
    const accountNumber = req.params.accountNumber;
    const amount = req.body.amount;
    const q = 'UPDATE accounts SET balance = balance - ? WHERE account_number = ? AND balance >= ?';

    db.query(q, [amount, accountNumber, amount], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.affectedRows === 0) {
            return res.status(400).json({ message: 'Insufficient balance or account not found' });
        }
        return res.status(200).json({ message: `Successfully withdrew ${amount}` });
    });
});

export default router