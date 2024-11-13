import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, CreditCard, Wallet, PlusCircle } from 'lucide-react';
import { Account, Loan, User } from '../types/index.ts';

export function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const navigate = useNavigate();
  const userId = 1; // This would come from auth context in a real app

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get(`http://localhost:3000/api/v1/users/${userId}/details`);
        setUser(userResponse.data);

        // Fetch user's accounts
        const accountsResponse = await axios.get(`http://127.0.0.1:3000/api/v1/users/${userId}/accounts`);
        setAccounts(accountsResponse.data.accounts);

        // Fetch user's loans
        const loansResponse = await axios.get(`http://127.0.0.1:3000/api/v1/loan/user/${userId}`);
        setLoans(loansResponse.data.loans);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow ">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex gap-4">

            <button
                onClick={() => navigate('/transactions')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <PlusCircle size={20} />
                View Transactions
              </button>                
              <button
                onClick={() => navigate('/account/create')}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <PlusCircle size={20} />
                New Account
              </button>
              <button
                onClick={() => navigate('/loan/apply')}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <Wallet size={20} />
                Apply for Loan
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* User Profile Section */}
        <section className="bg-white shadow-md max-w-6xl mx-auto px-4 py-6 mt-6 rounded-lg">
            {user && (
                <div className='mx-5'>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">User Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-gray-600">Name:</p>
                    <p className="font-semibold text-gray-900">{user.first_name} {user.last_name}</p>
                </div>
                <div>
                    <p className="text-gray-600">Email:</p>
                    <p className="font-semibold text-gray-900">{user.email}</p>
                </div>
                <div>
                    <p className="text-gray-600">Phone:</p>
                    <p className="font-semibold text-gray-900">{user.phone}</p>
                </div>
                <div>
                    <p className="text-gray-600">Address:</p>
                    <p className="font-semibold text-gray-900">{user.address}</p>
                </div>
                <div>
                    <p className="text-gray-600">CIBIL Score:</p>
                    <p className="font-semibold text-gray-900">{user.cibil_score}</p>
                </div>
                <div>
                    <p className="text-gray-600">Member Since:</p>
                    {/* @ts-ignore */}
                    <p className="font-semibold text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                </div>
            </div>
            )}
        </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto  py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard
            title="Total Balance"
            value={`$${accounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString()}`}
            icon={<LayoutDashboard className="text-blue-600" size={24} />}
          />
          <StatCard
            title="Active Accounts"
            value={accounts.filter(acc => acc.status === 'active').length.toString()}
            icon={<CreditCard className="text-green-600" size={24} />}
          />
          <StatCard
            title="Active Loans"
            value={loans.filter(loan => loan.status === 'active').length.toString()}
            icon={<Wallet className="text-purple-600" size={24} />}
          />
        </div>

        {/* Accounts Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map(account => (
              <AccountCard
                key={account.account_id}
                account={account}
                onClick={() => navigate(`/account/${account.account_number}`)}
              />
            ))}
          </div>
        </section>

        {/* Loans Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Loans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.map(loan => (
              <LoanCard
                key={loan.loan_id}
                loan={loan}
                onClick={() => navigate(`/loan/${loan.loan_id}`)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}


// Helper Components
// @ts-ignore
const StatCard = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      {icon}
    </div>
  </div>
);

// @ts-ignore
const AccountCard = ({ account, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm text-gray-600">Account Number</p>
        <p className="text-lg font-semibold">{account.account_number}</p>
      </div>
      <span className={`px-2 py-1 rounded text-sm ${
        account.status === 'active' ? 'bg-green-100 text-green-800' :
        account.status === 'frozen' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {account.status}
      </span>
    </div>
    <div>
      <p className="text-sm text-gray-600">Balance</p>
      <p className="text-2xl font-bold text-gray-900">${account.balance.toLocaleString()}</p>
    </div>
    <p className="text-sm text-gray-600 mt-2 capitalize">{account.account_type} Account</p>
  </div>
);

// @ts-ignore
const LoanCard = ({ loan, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm text-gray-600">Loan Type</p>
        <p className="text-lg font-semibold capitalize">{loan.loan_type}</p>
      </div>
      <span className={`px-2 py-1 rounded text-sm ${
        loan.status === 'active' ? 'bg-green-100 text-green-800' :
        loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
        loan.status === 'rejected' ? 'bg-red-100 text-red-800' :
        'bg-gray-100 text-gray-800'
      }`}>
        {loan.status}
      </span>
    </div>
    <div>
      <p className="text-sm text-gray-600">Outstanding Balance</p>
      <p className="text-2xl font-bold text-gray-900">${loan.balance.toLocaleString()}</p>
    </div>
    <div className="mt-2">
      <p className="text-sm text-gray-600">Interest Rate</p>
      <p className="text-lg font-semibold">{loan.interest_rate}%</p>
    </div>
  </div>
);
