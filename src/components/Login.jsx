import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State to manage error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Static admin credentials
    const adminCredentials = {
      email: 'admin@ex.com',
      password: '1234',
      role: 'admin',
    };

    // Reset previous error message
    setError('');

    // Check admin credentials
    if (email === adminCredentials.email && password === adminCredentials.password) {
      localStorage.setItem('token', 'static-admin-token');
      localStorage.setItem('role', adminCredentials.role);
      navigate('/admin');
      return; // Early return to avoid further checks
    }

    // Check for normal user credentials in localStorage
    const userData = localStorage.getItem(email);
    console.log('User data from localStorage:', userData); // Log the retrieved user data

    if (userData) {
      const user = JSON.parse(userData);
      console.log('User:', user); // Log the parsed user object

      // Log the input password and the stored password for comparison
      console.log('Input Password:', password);
      console.log('Stored Password:', user.password);

      if (user.password === password) {
        localStorage.setItem('token', 'static-user-token'); // Set a static token
        localStorage.setItem('role', user.role);
        navigate('/user');
      } else {
        setError('Invalid email or password'); // Set error message if password doesn't match
      }
    } else {
      setError('Invalid email or password'); // Set error message if no user is found
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>
        
        {/* Display error message */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 rounded-md text-center">
            {error}
          </div>
        )}
        
        <input
          type="email"
          placeholder="Email"
          className="border p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white p-3 rounded-lg w-full hover:bg-blue-500 transition duration-300">
          Login
        </button>
        <p className="text-center mt-4">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
