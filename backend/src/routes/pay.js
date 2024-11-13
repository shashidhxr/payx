import express from 'express';
import db from '../lib/db.js';
const router = express.Router();

// Endpoint to transfer money between accounts
router.post('/transfer', async (req, res) => {
    const { sender, recipient, amount } = req.query;
    if (!sender || !recipient || !amount) {
        return res.status(400).send("Missing sender, recipient, or amount");
    }

    try {
        // Start transaction
        await db.query('START TRANSACTION');

        // Deduct amount from sender's account
        const [senderAccount] = await db.query('SELECT balance FROM accounts WHERE account_number = ?', [sender]);
        if (!senderAccount || senderAccount.balance < amount) {
            throw new Error('Insufficient funds or account not found');
        }

        await db.query('UPDATE accounts SET balance = balance - ? WHERE account_number = ?', [amount, sender]);

        // Add amount to recipient's account
        await db.query('UPDATE accounts SET balance = balance + ? WHERE account_number = ?', [amount, recipient]);

        // Log transaction
        await db.query('INSERT INTO transactions (account_id, transaction_type, amount, description) VALUES (?, "transfer", ?, "Fund transfer")', [sender, amount]);

        // Commit transaction
        await db.query('COMMIT');
        res.send('Transaction successful');
    } catch (error) {
        await db.query('ROLLBACK');
        res.status(500).send('Transaction failed');
    }
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch all transactions for accounts belonging to a specific user
        const result = await db.execute(
            `SELECT t.transaction_id, t.amount, t.transaction_type, t.description, t.transaction_date, 
                    a.account_number, u.first_name AS senderName, u.last_name AS recipientName
             FROM transactions t
             JOIN accounts a ON t.account_id = a.account_id
             JOIN users u ON a.user_id = u.user_id
             WHERE u.user_id = ?`,
            [userId]
        );

        // Log the result to check the format of the returned value
        console.log(result);  // Log the full result to inspect

        // Check if result[0] is the array of transactions
        const transactions = result[0] || []; // Adjust this line based on actual structure

        // Check if transactions are found
        if (transactions.length === 0) {
            return res.status(404).json({ message: 'No transactions found for this user.' });
        }

        // Send transactions as JSON response
        res.json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error); // Log error for debugging
        res.status(500).json({ message: 'Failed to retrieve transactions' });
    }
});


// Endpoint to deposit money into an account
router.post('/deposit', async (req, res) => {
    const { accountNumber, amount } = req.query;
    if (!accountNumber || !amount) {
        return res.status(400).send("Missing account number or amount");
    }

    try {
        await db.query('UPDATE accounts SET balance = balance + ? WHERE account_number = ?', [amount, accountNumber]);
        await db.query('INSERT INTO transactions (account_id, transaction_type, amount, description) VALUES (?, "deposit", ?, "Account deposit")', [accountNumber, amount]);
        res.send('Deposit successful');
    } catch (error) {
        res.status(500).send('Deposit failed');
    }
});

// Endpoint to withdraw money from an account
router.post('/withdraw', async (req, res) => {
    const { accountNumber, amount } = req.query;
    if (!accountNumber || !amount) {
        return res.status(400).send("Missing account number or amount");
    }

    try {
        const [account] = await db.query('SELECT balance FROM accounts WHERE account_number = ?', [accountNumber]);
        if (!account || account.balance < amount) {
            return res.status(400).send('Insufficient funds or account not found');
        }

        await db.query('UPDATE accounts SET balance = balance - ? WHERE account_number = ?', [amount, accountNumber]);
        await db.query('INSERT INTO transactions (account_id, transaction_type, amount, description) VALUES (?, "withdrawal", ?, "Account withdrawal")', [accountNumber, amount]);
        res.send('Withdrawal successful');
    } catch (error) {
        res.status(500).send('Withdrawal failed');
    }
});

export default router;
