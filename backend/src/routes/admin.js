import express from 'express'
import db from '../lib/db.js';

const router = express.Router()

router.get('/branches', (req, res) => {
    const q = 'SELECT * FROM branches';
    db.query(q, (err, data) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).json(data);
    });
});

router.get('/users', (req, res) => {
    const q = 'SELECT * FROM users';
    db.query(q, (err, data) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).json(data);
    });
});

router.get('/:branchId/users', (req, res) => {
    const branchId = req.params.branchId;
    const q = 'SELECT * FROM users WHERE user_id IN (SELECT user_id FROM accounts WHERE branch_id = ?)';
    
    db.query(q, [branchId], (err, data) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).json(data);
    });
});

router.get('/loans', (req, res) => {
    const q = 'SELECT * FROM loans';
    db.query(q, (err, data) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).json(data);
    });
});


router.put('/:loanId/repayment', (req, res) => {
    const loanId = req.params.loanId;
    const repaymentAmount = req.body.amount;

    // Query to decrease loan balance by the repayment amount
    const q = `
        UPDATE loans 
        SET amount = amount - ? 
        WHERE loan_id = ? AND amount >= ?;
    `;

    db.query(q, [repaymentAmount, loanId, repaymentAmount], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.affectedRows === 0) {
            return res.status(400).json({ message: "Insufficient balance or invalid loan ID." });
        }
        return res.status(200).json({ message: "Loan balance updated successfully" });
    });
});

router.put('/:loanId/closure', (req, res) => {
    const loanId = req.params.loanId;

    const q = `
        UPDATE loans 
        SET status = 'closed' 
        WHERE loan_id = ? AND status = 'active';
    `;

    db.query(q, [loanId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.affectedRows === 0) {
            return res.status(400).json({ message: "Invalid loan ID or loan is not active." });
        }
        return res.status(200).json({ message: "Loan closed successfully" });
    });
});

router.get('/:branchId/loans', (req, res) => {
    const branchId = req.params.branchId;
    const q = 'SELECT * FROM loans WHERE branch_id = ?';
    
    db.query(q, [branchId], (err, data) => {
        if (err) {
            return res.status(500).send(err);
        }
        return res.status(200).json(data);
    });
});

export default router