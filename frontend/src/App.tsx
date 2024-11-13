import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Landing } from './pages/landing';
import { Home } from './pages/home.tsx';

import BankAdminDashboard from './pages/dashboard.tsx';
import CreateAccountPage from './pages/account.tsx';
import { SignupPage } from './pages/signup.tsx';
import { SigninPage } from './pages/signin.tsx';
import LoanApplyPage from './pages/loanApply.tsx';
import { AuthPage } from './pages/authPage.tsx';
import TransactionHistory from './pages/transcations.tsx';

function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/welcome' element={<Landing></Landing>}></Route>
                <Route path='/' element={<Home></Home>}></Route>
                <Route path='/dashboard' element={<BankAdminDashboard></BankAdminDashboard>}></Route>
                <Route path='/signup' element={<SignupPage></SignupPage>}></Route>
                <Route path='/signin' element={<SigninPage></SigninPage>}></Route>
                <Route path='/account/create' element={<CreateAccountPage></CreateAccountPage>}></Route>
                <Route path='/loan/apply' element={<LoanApplyPage></LoanApplyPage>}></Route>
                <Route path='/auth' element={<AuthPage></AuthPage>}></Route>
                <Route path='/transactions' element={<TransactionHistory></TransactionHistory>}></Route>

            </Routes>
        </BrowserRouter>
    )
}

export default App;
