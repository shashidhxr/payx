import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Loan {
  user_id: string;
  branch_id: string;
  amount: string;
  loan_type: 'personal' | 'mortgage' | 'business';
  interest_rate: string;
  term_months: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  applicant: {
    name: string;
    email: string;
  };
}

const LoanPage: React.FC = () => {
  const { loanId } = useParams<{ loanId: string }>();
  const navigate = useNavigate();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const response = await axios.get<Loan>(`http://localhost:3000/api/v1/loan/${loanId}`);
        setLoan(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Failed to fetch loan data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLoanData();
  }, [loanId]);

  const handleCancelLoan = async () => {
    if (!window.confirm('Are you sure you want to cancel this loan application?')) {
      return;
    }

    setCancelling(true);
    setError(null);

    try {
      const response = await axios.put(
        `http://localhost:3000/api/v1/loan/cancel/${loanId}`
      );
      
      if (response.status === 200) {
        // Update the local loan status
        setLoan(prev => prev ? { ...prev, status: 'cancelled' } : null);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to cancel loan application');
      }
    } finally {
      setCancelling(false);
    }
  };

  const getCancelButtonStyle = () => {
    if (cancelling) {
      return "bg-gray-500 cursor-not-allowed";
    }
    if (loan?.status !== 'pending') {
      return "bg-gray-500 cursor-not-allowed";
    }
    return "bg-red-600 hover:bg-red-700";
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      {loading ? (
        <div className="text-center text-xl font-medium">Loading...</div>
      ) : error ? (
        <div className="text-red-500 text-center font-medium">{error}</div>
      ) : loan ? (
        <>
          <h2 className="text-2xl font-bold text-gray-800">Loan Details</h2>
          <div className="mt-4">
            <p className="text-lg">Applicant: <span className="font-semibold">{loan.applicant.name}</span></p>
            <p className="text-lg">Applicant Email: <span className="font-semibold">{loan.applicant.email}</span></p>
            <p className="text-lg">Loan Amount: <span className="font-semibold">{loan.amount}</span></p>
            <p className="text-lg">Loan Type: <span className="font-semibold">{loan.loan_type}</span></p>
            <p className="text-lg">Interest Rate: <span className="font-semibold">{loan.interest_rate}%</span></p>
            <p className="text-lg">Term: <span className="font-semibold">{loan.term_months} months</span></p>
            <p className="text-lg">Status: <span className="font-semibold">{loan.status}</span></p>
            
            <div className="mt-6">
              <button
                onClick={handleCancelLoan}
                disabled={cancelling || loan.status !== 'pending'}
                className={`${getCancelButtonStyle()} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              >
                {cancelling ? 'Cancelling...' : 'Cancel Loan Application'}
              </button>
              {loan.status !== 'pending' && (
                <p className="mt-2 text-sm text-gray-600">
                  This loan application cannot be cancelled as its status is {loan.status}
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-xl font-medium">Loan not found</div>
      )}
    </div>
  );
};

export default LoanPage;