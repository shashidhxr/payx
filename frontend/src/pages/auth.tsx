// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { User, Lock, Mail, Phone, MapPin } from 'lucide-react';

// // AuthContext for managing authentication state
// import { createContext, useContext, useReducer } from 'react';

// // @ts-ignore
// const AuthContext = createContext();

// // @ts-ignore
// export const AuthProvider = ({ children }) => {
//     // @ts-ignore
//   const [state, dispatch] = useReducer(authReducer, {
//     user: null,
//     token: localStorage.getItem('token'),
//     isAuthenticated: !!localStorage.getItem('token')
//   });

//   return (
//     <AuthContext.Provider value={{ ...state, dispatch }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// // Sign In Page Component
// export const SignIn = () => {
//   const navigate = useNavigate();
//   // @ts-ignore
//   const { dispatch } = useAuth();
//   const [formData, setFormData] = useState({
//       email: '',
//       password: '',
//     });
//     const [error, setError] = useState('');
    
//     // @ts-ignore
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
        
//         try {
//             const response = await fetch('/api/users/signin', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(formData),
//             });
            
//             const data = await response.json();
            
//             if (!response.ok) {
//                 throw new Error(data.error || 'Sign in failed');
//             }
            
//             localStorage.setItem('token', data.token);
//             dispatch({ type: 'LOGIN', payload: { user: data.user, token: data.token } });
//             navigate('/dashboard');
//         } catch (err) {
//         // @ts-ignore
//         setError(err.message);
//     }
// };

// return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="text-center text-3xl font-extrabold text-gray-900">
//           Sign in to your account
//         </h2>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             {error && (
//                 <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
//                 {error}
//               </div>
//             )}

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email address
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="email"
//                   name="email"
//                   id="email"
//                   className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   required
//                   />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="password"
//                   name="password"
//                   id="password"
//                   className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Sign in
//               </button>
//             </div>
//           </form>

//           <div className="mt-6">
//             <div className="relative">
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 bg-white text-gray-500">
//                   Don't have an account?{' '}
//                   <button
//                     onClick={() => navigate('/signup')}
//                     className="font-medium text-blue-600 hover:text-blue-500"
//                   >
//                     Sign up
//                   </button>
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Sign Up Page Component
// export const SignUp = () => {
//     const navigate = useNavigate();
//     // @ts-ignore
//     const { dispatch } = useAuth();
//     const [formData, setFormData] = useState({
//         first_name: '',
//         last_name: '',
//         email: '',
//         password: '',
//         phone: '',
//         address: '',
//     });
//     const [error, setError] = useState('');
    
//     // @ts-ignore
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
        
//         try {
//             const response = await fetch('/api/users/signup', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(formData),
//             });
            
//             const data = await response.json();
            
//             if (!response.ok) {
//                 throw new Error(data.error || 'Sign up failed');
//             }
            
//             localStorage.setItem('token', data.token);
//             dispatch({ type: 'LOGIN', payload: { user: data.user, token: data.token } });
//             navigate('/dashboard');
//         } catch (err) {
//         // @ts-ignore
//         setError(err.message);
//     }
// };

// return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <h2 className="text-center text-3xl font-extrabold text-gray-900">
//           Create your account
//         </h2>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             {error && (
//               <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
//                 {error}
//               </div>
//             )}

//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
//                   First name
//                 </label>
//                 <div className="mt-1 relative rounded-md shadow-sm">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
//                     <User className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     name="first_name"
//                     id="first_name"
//                     className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     value={formData.first_name}
//                     onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
//                     required
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
//                   Last name
//                 </label>
//                 <div className="mt-1 relative rounded-md shadow-sm">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
//                     <User className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     name="last_name"
//                     id="last_name"
//                     className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     value={formData.last_name}
//                     onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
//                     required
//                   />
//                 </div>
//               </div>
//             </div>

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email address
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="email"
//                   name="email"
//                   id="email"
//                   className="pl-10 block w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   value={formData.email}
//                   onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <div className="mt-1 relative rounded-md shadow-sm">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
//                   <Lock className="h-5