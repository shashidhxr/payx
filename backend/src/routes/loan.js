import express from 'express'
import db from '../lib/db.js';

const router = express.Router()

router.get('/', (req, res) => {
    const q = 'SELECT * from loans';
    db.query(q, (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.status(200).json(data);
    });
});

router.get('/:loanId', (req, res) => {
    const loanId = req.params.loanId;
    
    const q = `
        SELECT loans.status, users.first_name, users.last_name, users.email 
        FROM loans 
        JOIN users ON loans.user_id = users.user_id 
        WHERE loans.loan_id = ?
    `;

    db.query(q, [loanId], (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (data.length === 0) {
            return res.status(404).json({ message: "Loan not found" });
        }
        return res.status(200).json({
            status: data[0].status,
            applicant: {
                name: `${data[0].first_name} ${data[0].last_name}`,
                email: data[0].email
            }
        });
    });
});


router.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const q = 'SELECT * FROM loans WHERE user_id = ?';

    db.query(q, [userId], (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json({ loans: data });
    });
});

router.post('/apply', (req, res) => {
    const { user_id, branch_id, amount, loan_type, interest_rate, term_months } = req.body;
    const q = 'INSERT INTO loans (user_id, branch_id, amount, loan_type, interest_rate, term_months, status) VALUES (?, ?, ?, ?, ?, ?, "pending")';
    const values = [user_id, branch_id, amount, loan_type, interest_rate, term_months];

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json(err); 
        }
        return res.status(201).json({ message: "Loan application submitted", loanId: data.insertId });
    });
});

router.put('/repay/:loanId', (req, res) => {
    const loanId = req.params.loanId;
    const { repaymentAmount } = req.body;

    const getBalanceQuery = 'SELECT balance FROM loans WHERE loan_id = ?';

    db.query(getBalanceQuery, [loanId], (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (data.length === 0) {
            return res.status(404).json({ message: "Loan not found" });
        }

        const currentBalance = data[0].balance;
        const newBalance = currentBalance - repaymentAmount;

        if (newBalance < 0) {
            return res.status(400).json({ message: "Repayment amount exceeds loan balance" });
        }

        const updateBalanceQuery = 'UPDATE loans SET balance = ? WHERE loan_id = ?';
        
        db.query(updateBalanceQuery, [newBalance, loanId], (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Unable to update loan balance" });
            }

            return res.status(200).json({ 
                message: "Repayment processed successfully", 
                remainingBalance: newBalance 
            });
        });
    });
});

router.put('/cancel/:loanId', (req, res) => {
    const loanId = req.params.loanId;
    const q = 'UPDATE loans SET status = "cancelled" WHERE loan_id = ? AND status = "pending"';

    db.query(q, [loanId], (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }
        if (data.affectedRows === 0) {
            return res.status(400).json({ message: "Loan not found or cannot be cancelled" });
        }
        return res.status(200).json({ message: "Loan application cancelled" });
    });
});

export default router