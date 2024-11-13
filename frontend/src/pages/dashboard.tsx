import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BankAdminDashboard = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchesResponse, usersResponse, loansResponse] = await Promise.all([
          axios.get('http://localhost:3000/api/v1/admin/branches'),
          axios.get('http://localhost:3000/api/v1/admin/users'),
          axios.get('http://localhost:3000/api/v1/admin/loans')
        ]);
        setBranches(branchesResponse.data);
        setUsers(usersResponse.data);
        setLoans(loansResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleLoanRepayment = async (loanId, amount) => {
    try {
      await axios.put(`http://localhost:3000/api/v1/admin/${loanId}/repayment`, { amount });
      // Refresh loans data
      const loansResponse = await axios.get('http://localhost:3000/api/v1/admin/loans');
      setLoans(loansResponse.data);
    } catch (error) {
      console.error('Error updating loan repayment:', error);
    }
  };

  const handleLoanClosure = async (loanId) => {
    try {
      await axios.put(`http://localhost:3000/api/v1/admin/${loanId}/closure`);
      // Refresh loans data
      const loansResponse = await axios.get('http://localhost:3000/api/v1/admin/loans');
      setLoans(loansResponse.data);
    } catch (error) {
      console.error('Error closing loan:', error);
    }
  };

  const getBranchUsers = async (branchId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/admin/${branchId}/users`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching users for branch ${branchId}:`, error);
      return [];
    }
  };

  const getBranchLoans = async (branchId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/admin/${branchId}/loans`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching loans for branch ${branchId}:`, error);
      return [];
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Bank Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-xl font-bold mb-2">Branches</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2 border-b">Branch ID</th>
                <th className="text-left p-2 border-b">Branch Name</th>
                <th className="text-left p-2 border-b">Users</th>
                <th className="text-left p-2 border-b">Loans</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((branch) => (
                <tr key={branch.id}>
                  <td className="p-2 border-b">{branch.id}</td>
                  <td className="p-2 border-b">{branch.name}</td>
                  <td className="p-2 border-b">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => navigate(`/admin/branches/${branch.id}/users`)}
                    >
                      View Users
                    </button>
                  </td>
                  <td className="p-2 border-b">
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => navigate(`/admin/branches/${branch.id}/loans`)}
                    >
                      View Loans
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white shadow-md rounded-md p-4">
          <h2 className="text-xl font-bold mb-2">Loan Repayments</h2>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2 border-b">Loan ID</th>
                <th className="text-left p-2 border-b">Loan Amount</th>
                <th className="text-left p-2 border-b">Repayment</th>
                <th className="text-left p-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id}>
                  <td className="p-2 border-b">{loan.id}</td>
                  <td className="p-2 border-b">{loan.amount}</td>
                  <td className="p-2 border-b">
                    <input
                      type="number"
                      className="border rounded px-2 py-1"
                      placeholder="Enter repayment amount"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleLoanRepayment(loan.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                  </td>
                  <td className="p-2 border-b">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleLoanClosure(loan.id)}
                    >
                      Close Loan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-white shadow-md rounded-md p-4">
        <h2 className="text-xl font-bold mb-2">Loan Trends</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={loans}>
            <XAxis dataKey="id" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BankAdminDashboard;