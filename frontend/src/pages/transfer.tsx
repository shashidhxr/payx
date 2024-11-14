import React, { useState } from 'react';
import axios from 'axios';
import { ArrowRight, Banknote, BanknoteIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TransferPage = () => {
  const navigate = useNavigate(); // Move useNavigate inside the component

  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const userId = 1;
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');

  const handleDeposit = async () => {
    try {
      await axios.post('http://localhost:3000/api/v1/transactions/deposit', {
        accountNumber,
        amount: parseFloat(amount),
        userId,
      });
      alert('Deposit successful');
      navigate(`/transactions/${userId}`); // Navigate to /transactions on success
    } catch (error) {
      console.error(error.response ? error.response.data : error.message);
      alert('Deposit failed');
    }
  };

  const handleWithdrawal = async () => {
    try {
      await axios.post('http://localhost:3000/api/v1/transactions/withdraw', {
        accountNumber,
        amount: parseFloat(amount),
        userId,
      });
      alert('Withdrawal successful');
      navigate(`/transactions/${userId}`); // Navigate to /transactions on success
    } catch (error) {

      console.error(error.response ? error.response.data : error.message);
      alert('Withdrawal failed');
    }
  };

  const handleTransfer = async () => {
    try {
      await axios.post('/api/transfer', {
        sender,
        recipient,
        amount: parseFloat(amount),
      });
      alert('Transfer successful');
    } catch (error) {
      alert('Transfer failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Banking Operations</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h2 className="text-lg font-medium mb-4">Deposit</h2>
            <div className="flex items-center mb-4">
              <Banknote className="w-6 h-6 mr-2" />
              <input
                type="text"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
            <div className="flex items-center mb-4">
              <Banknote className="w-6 h-6 mr-2" />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
            <button
              onClick={handleDeposit}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
            >
              Deposit
            </button>
          </div>
          <div>
            <h2 className="text-lg font-medium mb-4">Withdraw</h2>
            <div className="flex items-center mb-4">
              <BanknoteIcon className="w-6 h-6 mr-2" />
              <input
                type="text"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
            <div className="flex items-center mb-4">
              <BanknoteIcon className="w-6 h-6 mr-2" />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
            <button
              onClick={handleWithdrawal}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
            >
              Withdraw
            </button>
          </div>
          <div>
            <h2 className="text-lg font-medium mb-4">Transfer</h2>
            <div className="flex items-center mb-4">
              <ArrowRight className="w-6 h-6 mr-2" />
              <input
                type="text"
                placeholder="Sender Account"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
            <div className="flex items-center mb-4">
              <ArrowRight className="w-6 h-6 mr-2" />
              <input
                type="text"
                placeholder="Recipient Account"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
            <div className="flex items-center mb-4">
              <ArrowRight className="w-6 h-6 mr-2" />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 w-full"
              />
            </div>
            <button
              onClick={handleTransfer}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
            >
              Transfer
            </button>
          </div>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          Note: Each transaction will be logged in the transactions table.
        </div>
      </div>
    </div>
  );
};

export default TransferPage;
