import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // to access route params

interface Transaction {
    transactionId: number;
    amount: number;
    fromAccountNumber: string;
    toAccountNumber: string;
    senderName: string;
    recipientName: string;
    transactionDate: string;
    description?: string;
}

const TransactionHistory = () => {
    const { userId } = useParams(); // Access userId from URL params
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!userId) {
                setError("Invalid user ID");
                setLoading(false);
                return;
            }
            try {
                // Use environment variable for API base URL if needed
                const response = await axios.get(`http://localhost:3000/api/v1/transactions/${userId}`);
                setTransactions(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load transactions');
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [userId]);

    if (loading) {
        return <p className="text-center text-gray-500">Loading transactions...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Transaction History</h2>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Date</th>
                        <th className="py-2 px-4 border-b">Amount</th>
                        <th className="py-2 px-4 border-b">From</th>
                        <th className="py-2 px-4 border-b">To</th>
                        <th className="py-2 px-4 border-b">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.transactionId} className="text-center">
                            <td className="py-2 px-4 border-b">{new Date(transaction.transactionDate).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b text-green-600 font-semibold">${transaction.amount}</td>
                            <td className="py-2 px-4 border-b">
                                <span className="block font-medium">{transaction.senderName}</span>
                                <span className="text-sm text-gray-500">{transaction.fromAccountNumber}</span>
                            </td>
                            <td className="py-2 px-4 border-b">
                                <span className="block font-medium">{transaction.recipientName}</span>
                                <span className="text-sm text-gray-500">{transaction.toAccountNumber}</span>
                            </td>
                            <td className="py-2 px-4 border-b">{transaction.description || 'No description'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionHistory;
