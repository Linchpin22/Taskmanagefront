import React, { useState, useEffect } from 'react';
import axios from '../axios'; // Adjust the import according to your axios setup
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState(''); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading indication

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchTasks();
    fetchUsers(); // Fetch users on component mount
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      const response = await axios.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the request headers
        },
      });
      console.log('Fetched users:', response.data); // Log fetched users
      setUsers(response.data); // Set users in state
    } catch (error) {
      console.error('Error fetching users:', error.response ? error.response.data : error.message); // Improved error logging
      setError('Failed to fetch users.'); // Optional: set an error state to display in the UI
    }
  };

  const handleCreateTask = async () => {
    if (!title || !description || !assignedTo) {
      setError('Please fill all the fields');
      return;
    }

    setLoading(true); // Set loading to true when starting the request
    setError(''); // Clear any previous error message

    try {
      const token = localStorage.getItem('token'); // Retrieve the token from localStorage
      console.log('Using token:', token); // Log the token for debugging

      const response = await axios.post('/tasks/create', 
        { title, description, assignedTo }, 
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          },
        }
      );
      console.log('Task created successfully');
      
      // Fetch updated tasks after creating
      fetchTasks();
      
      // Reset the input fields
      setTitle('');
      setDescription('');
      setAssignedTo('');
    } catch (error) {
      console.error('Error creating task:', error); // Log the entire error for debugging
      const errorMessage = error.response?.data?.error || error.message || 'Error creating task'; // Improved error handling
      setError(errorMessage); // Set error message to display
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name'); // Remove user name
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className='flex flex-row justify-between'>
        <h1 className="text-3xl font-bold mb-4">Welcome, Admin!</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white p-2 rounded-lg mb-4 hover:bg-red-500 transition duration-300"
        >
          Logout
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Create Task</h2>
        <input
          type="text"
          placeholder="Title"
          className="border p-2 w-full mb-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          className="border p-2 w-full mb-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="border p-2 w-full mb-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Assign To</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>
        <button 
          onClick={handleCreateTask} 
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 transition duration-300"
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
        {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Task List</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task._id} className="border p-2 my-2 rounded-lg bg-gray-50">
              <h2 className="text-lg font-bold">{task.title}</h2>
              <p>{task.description}</p>
              <p className="text-sm text-gray-600">Status: {task.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
