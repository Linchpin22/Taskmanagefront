import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios'; // Import your Axios instance

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // For showing error messages
  const [success, setSuccess] = useState(false); // For showing success message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset any previous error message
    setError(null);

    try {
      // Sending POST request to the signup API via axios
      const response = await axios.post('/auth/signup', {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        // If signup is successful, show success message
        setSuccess(true);
        setTimeout(() => {
          navigate('/'); // Redirect to login page after 2 seconds
        }, 2000);
      }
    } catch (err) {
      // Set error message from response or default
      setError(err.response?.data?.error || 'Failed to sign up. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign Up</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">Signup successful! Redirecting...</p>}
        
        <input
          type="text"
          placeholder="Name"
          className="border p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          Sign Up
        </button>
        
        <p className="text-center mt-4">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/')}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
