import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface Loan {
  user_id: string;
  branch_id: string;
  amount: string;
  loan_type: 'personal' | 'mortgage' | 'business';
  interest_rate: string;
  term_months: string;
  status: 'pending' | 'approved' | 'rejected';
  applicant: {
    name: string;
    email: string;
  };
}

const LoanPage: React.FC = () => {
  const { loanId } = useParams<{ loanId: string }>();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          </div>
        </>
      ) : (
        <div className="text-center text-xl font-medium">Loan not found</div>
      )}
    </div>
  );
};

export default LoanPage;
