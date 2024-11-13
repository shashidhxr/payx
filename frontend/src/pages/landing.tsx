import React from "react";

export const Landing = () => {
    return (
        <div className="font-sans max-w-5xl mx-auto">
            {/* Header */}
            <header className="p-4 border-b border-gray-300 text-center">
                <h1 className="text-2xl font-bold">Bank Management System</h1>
            </header>
            
            {/* Welcome Section */}
            <div className="py-8 text-center">
                <h2 className="text-xl font-semibold">Welcome to Our Bank</h2>
                <p className="mt-2 text-gray-700">Your trusted partner in managing finances, loans, and accounts.</p>
            </div>
            
            {/* User Prompt Section */}
            <div className="flex justify-center gap-8 p-4">
                <div className="text-center">
                    <h3 className="text-lg font-medium">Already a user?</h3>
                    <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Sign In
                    </button>
                </div>
                
                <div className="text-center">
                    <h3 className="text-lg font-medium">New to our bank?</h3>
                    <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        Create Account
                    </button>
                </div>
            </div>

            {/* Features Section */}
            <section className="bg-gray-100 py-8 text-center">
                <h3 className="text-xl font-semibold">Our Services</h3>
                <div className="flex justify-center gap-8 mt-4">
                    <div className="max-w-xs">
                        <h4 className="text-lg font-medium">Manage Accounts</h4>
                        <p className="mt-1 text-gray-600">Effortlessly track your account balances, deposits, and withdrawals.</p>
                    </div>
                    <div className="max-w-xs">
                        <h4 className="text-lg font-medium">Loan Services</h4>
                        <p className="mt-1 text-gray-600">Apply for loans and manage repayments with ease.</p>
                    </div>
                    <div className="max-w-xs">
                        <h4 className="text-lg font-medium">Fast Transfers</h4>
                        <p className="mt-1 text-gray-600">Send and receive money securely and quickly.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="p-4 border-t border-gray-300 text-center mt-8">
                <p>&copy; 2024 Bank Management System. All rights reserved.</p>
                <div className="mt-2">
                    <a href="/privacy" className="text-blue-600 hover:underline mr-4">Privacy Policy</a>
                    <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
