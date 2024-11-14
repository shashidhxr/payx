// types/index.ts

export interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    cibil_score: number;
    // created_at: string;
  }
  
  export interface AuthResponse {
    message?: string;
    token: string;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
    };
  }
  
  export interface Branch {
    branch_id: number;
    branch_name: string;
    branch_code: string;
    address: string;
    phone: string;
    created_at: string;
  }
  
  export interface Account {
    account_id: number;
    account_number: string;
    user_id: number;
    branch_id: number;
    account_type: 'savings' | 'checking' | 'fixed_deposit';
    balance: number;
    status: 'active' | 'inactive' | 'frozen';
    created_at: string;
  }
  
  export interface Loan {
    loan_id?: number;
    user_id: number;
    branch_id: number;
    loan_type: 'personal' | 'home' | 'business' | 'education';
    amount: string;
    interest_rate: string;
    term_months: string;
    status: 'pending' | 'approved' | 'rejected' | 'active' | 'closed' | 'cancelled';
    balance: number;
    applied_date: string;
    approval_date: string | null;
  }
  
  export interface Transaction {
    transaction_id: number;
    account_id: number;
    transaction_type: 'deposit' | 'withdrawal' | 'transfer';
    amount: number;
    description: string | null;
    transaction_date: string;
  }