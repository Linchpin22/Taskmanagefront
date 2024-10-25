import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STATIC_TOKENS = {
  user: 'static-user-token',
  admin: 'static-admin-token',
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Admin credentials
    const adminCredentials = {
      email: 'admin@ex.com',
      password: '1234',
      role: 'admin',
    };

    // Check if admin credentials are correct
    if (email === adminCredentials.email && password === adminCredentials.password) {
      localStorage.setItem('token', STATIC_TOKENS.admin);
      localStorage.setItem('role', 'admin');
      localStorage.setItem('email', email); // Store admin email for backend verification
      navigate('/admin');
      return;
    }

    // Test user login with data from localStorage
    const userData = localStorage.getItem(email);
    console.log('User data from localStorage:', userData);

    if (userData) {
      const user = JSON.parse(userData);

      // Verify user password
      if (user.password === password) {
        localStorage.setItem('token', STATIC_TOKENS.user);
        localStorage.setItem('role', 'user');
        localStorage.setItem('userId', user._id); // Store the user’s Object ID
        localStorage.setItem('email', email); // Store user email for backend verification
        navigate('/user');
      } else {
        setError('Invalid email or password');
      }
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>

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
