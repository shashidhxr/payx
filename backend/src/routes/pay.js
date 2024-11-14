import express from 'express';
import db from '../lib/db.js';
const router = express.Router();

// Endpoint to transfer money between accounts
router.post('/transfer', async (req, res) => {
    const { senderId, recipientId, amount } = req.query;
    if (!senderId || !recipientId || !amount || isNaN(amount)) {
        return res.status(400).send("Missing or invalid senderId, recipientId, or amount");
    }

    try {
        // Start transaction
        await db.query('START TRANSACTION');

        // Deduct amount from sender's account
        const [senderAccount] = await db.query('SELECT balance FROM accounts WHERE account_number = ?', [String(senderId)]);
        if (!senderAccount || senderAccount.balance < parseFloat(amount)) {
            throw new Error('Insufficient funds or account not found');
        }

        await db.query('UPDATE accounts SET balance = balance - ? WHERE account_number = ?', [parseFloat(amount), String(senderId)]);

        // Add amount to recipient's account
        await db.query('UPDATE accounts SET balance = balance + ? WHERE account_number = ?', [parseFloat(amount), String(recipientId)]);

        // Log transaction
        await db.query('INSERT INTO transactions (account_id, user_id, transaction_type, amount, description) VALUES (?, ?, "transfer", ?, "Fund transfer")', 
            [senderAccount.account_id, senderAccount.user_id, parseFloat(amount)]);

        // Commit transaction
        await db.query('COMMIT');
        res.send('Transaction successful');
    } catch (error) {
        await db.query('ROLLBACK');
        res.status(500).send('Transaction failed');
    }
});

// Endpoint to fetch all transactions for a specific user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
    }

    // Use the callback version of db.execute
    db.execute(`
        SELECT t.transaction_id, t.amount, t.transaction_type, t.description, t.transaction_date, 
               a.account_number, u.first_name AS senderName, u.last_name AS recipientName
        FROM transactions t
        JOIN accounts a ON t.account_id = a.account_id
        JOIN users u ON a.user_id = u.user_id
        WHERE u.user_id = ?`, 
        [parseInt(userId)],
        (err, transactions) => {
            if (err) {
                console.error("Error fetching transactions:", err);
                return res.status(500).json({ message: 'Failed to retrieve transactions' });
            }

            if (transactions.length === 0) {
                return res.status(404).json({ message: 'No transactions found for this user.' });
            }

            res.json(transactions);
        }
    );
});


// Deposit endpoint
router.post('/deposit', (req, res) => {
    const { accountNumber, amount, userId } = req.body;
    if (!accountNumber || !amount || !userId) {
        return res.status(400).send("Missing or invalid account number, amount, or user ID");
    }

    // Retrieve the account information
    db.query('SELECT account_id, balance FROM accounts WHERE account_number = ? AND user_id = ?', [accountNumber, userId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send('Internal server error');
        }

        const account = results[0];
        if (!account) {
            return res.status(404).send("Account not found");
        }

        // Perform the deposit by updating the balance
        const newBalance = account.balance + parseFloat(amount);
        db.query('UPDATE accounts SET balance = ? WHERE account_id = ?', [newBalance, account.account_id], (err) => {
            if (err) {
                console.error("Update error:", err);
                return res.status(500).send('Deposit failed');
            }

            // Insert a transaction record
            db.query('INSERT INTO transactions (user_id, account_id, transaction_type, amount, description) VALUES (?, ?, "deposit", ?, "Account deposit")', 
                [userId, account.account_id, parseFloat(amount)], (err) => {
                if (err) {
                    console.error("Transaction insert error:", err);
                    return res.status(500).send('Deposit failed');
                }

                res.send('Deposit successful');
            });
        });
    });
});




// Endpoint to withdraw money from an account
// Withdraw endpoint
router.post('/withdraw', (req, res) => {
    const { accountNumber, amount, userId } = req.body;
    if (!accountNumber || !amount || !userId) {
        return res.status(400).send("Missing or invalid account number, amount, or user ID");
    }

    // Retrieve the account information
    db.query('SELECT account_id, balance FROM accounts WHERE account_number = ? AND user_id = ?', [accountNumber, userId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send('Internal server error');
        }

        const account = results[0];
        if (!account) {
            return res.status(404).send("Account not found");
        }

        // Check for sufficient balance
        if (account.balance < parseFloat(amount)) {
            return res.status(400).send('Insufficient funds');
        }

        // Perform the withdrawal by updating the balance
        const newBalance = account.balance - parseFloat(amount);
        db.query('UPDATE accounts SET balance = ? WHERE account_id = ?', [newBalance, account.account_id], (err) => {
            if (err) {
                console.error("Update error:", err);
                return res.status(500).send('Withdrawal failed');
            }

            // Insert a transaction record
            db.query('INSERT INTO transactions (user_id, account_id, transaction_type, amount, description) VALUES (?, ?, "withdrawal", ?, "Account withdrawal")', 
                [userId, account.account_id, parseFloat(amount)], (err) => {
                if (err) {
                    console.error("Transaction insert error:", err);
                    return res.status(500).send('Withdrawal failed');
                }

                res.send('Withdrawal successful');
            });
        });
    });
});

export default router;
