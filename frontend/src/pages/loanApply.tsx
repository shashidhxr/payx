import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LoanApplication {
  user_id: number;
  branch_id: string;
  loan_type: 'personal' | 'home' | 'business' | 'education';
  amount: string;
  interest_rate: string;
  term_months: string;
}

const LoanApplyPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const loanData: LoanApplication = {
      user_id: 1,
      branch_id: formData.get('branch_id')?.toString() || '1',
      loan_type: (formData.get('loan_type') as 'personal' | 'home' | 'business' | 'education') || 'personal',
      amount: formData.get('amount')?.toString() || '500',
      interest_rate: formData.get('interest_rate')?.toString() || '12',
      term_months: formData.get('term_months')?.toString() || '18'
    };

    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/loan/apply',
        loanData,
        {
          headers: {
            'Content-Type': 'application/json',
            // Add any authentication headers if needed
          },
        }
      );

      // Change this condition to check for success
      if (response.data && response.data.loanId) {
        navigate(`/loan/${response.data.loanId}`);
      } else {
        throw new Error('Loan application failed - no loan ID received');
      }
    } catch (err) {
      console.error('Loan application error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'Failed to submit loan application. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Apply for a Loan
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="branch_id" className="block text-sm font-medium text-gray-700">
                Branch ID
              </label>
              <input
                id="branch_id"
                name="branch_id"
                type="number"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="loan_type" className="block text-sm font-medium text-gray-700">
                Loan Type
              </label>
              <select
                id="loan_type"
                name="loan_type"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="personal">Personal</option>
                <option value="home">Home</option>
                <option value="business">Business</option>
                <option value="education">Education</option>
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Loan Amount
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                min="0"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="interest_rate" className="block text-sm font-medium text-gray-700">
                Interest Rate (%)
              </label>
              <input
                id="interest_rate"
                name="interest_rate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="term_months" className="block text-sm font-medium text-gray-700">
                Loan Term (months)
              </label>
              <input
                id="term_months"
                name="term_months"
                type="number"
                min="1"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Submitting application...' : 'Apply for Loan'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoanApplyPage;