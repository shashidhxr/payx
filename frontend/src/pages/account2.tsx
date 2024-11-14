import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Account {
  account_id: number;
  account_number: string;
  user_id: number;
  branch_id: number;
  account_type: 'savings' | 'checking' | 'fixed_deposit';
  balance: string;
  status: 'active' | 'inactive' | 'frozen';
  created_at: string;
}

const AccountPage: React.FC = () => {
  const { accountNumber } = useParams<{ accountNumber: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await axios.get<{ account: Account }>(
          `http://localhost:3000/api/v1/account/${accountNumber}`
        );
        setAccount(response.data.account);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Failed to fetch account data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [accountNumber]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      {loading ? (
        <div className="text-center text-xl font-medium">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center font-medium">{error}</div>
      ) : account ? (
        <>
          <h2 className="text-2xl font-bold text-gray-800">Account Details</h2>
          <div className="mt-4">
            <p className="text-lg">Account Number: <span className="font-semibold">{account.account_number}</span></p>
            <p className="text-lg">Account Type: <span className="font-semibold">{account.account_type}</span></p>
            <p className="text-lg">Balance: <span className="font-semibold">{account.balance}</span></p>
            <p className="text-lg">Status: <span className="font-semibold">{account.status}</span></p>
            <p className="text-lg">Created At: <span className="font-semibold">{new Date(account.created_at).toLocaleString()}</span></p>
          </div>
        </>
      ) : (
        <div className="text-center text-xl font-medium">Account not found</div>
      )}
    </div>
  );
};

export default AccountPage;
