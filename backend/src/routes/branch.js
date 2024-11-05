import express from 'express'
import db from '../lib/db.js'

const router = express.Router()

router.get('/', (req, res) => {
    const q = 'SELECT branch_id, branch_name, branch_code, address, phone FROM branches';
    db.query(q, (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.status(200).json(data);
    });
});

router.get('/:branchId', (req, res) => {
    const branchId = req.params.branchId;
    const q = 'SELECT branch_id, branch_name, branch_code, address, phone FROM branches WHERE branch_id = ?';
    db.query(q, [branchId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.length === 0) {
            return res.status(404).json({ message: 'Branch not found' });
        }
        return res.status(200).json(data[0]);
    });
});

router.post('/', (req, res) => {
    const { branch_name, branch_code, address, phone } = req.body;
    const q = 'INSERT INTO branches (branch_name, branch_code, address, phone) VALUES (?, ?, ?, ?)';
    const values = [branch_name, branch_code, address, phone];
    
    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.status(201).json({ message: 'Branch created successfully', branchId: data.insertId });
    });
});

router.delete('/:branchId', (req, res) => {
    const branchId = req.params.branchId;
    const q = 'DELETE FROM branches WHERE branch_id = ?';

    db.query(q, [branchId], (err, data) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (data.affectedRows === 0) {
            return res.status(404).json({ message: 'Branch not found' });
        }
        return res.status(200).json({ message: 'Branch deleted successfully' });
    });
});

export default router