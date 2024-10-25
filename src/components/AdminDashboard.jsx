import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please login');
      navigate('/login');
    } else {
      fetchTasks();
      fetchUsers();
    }
  }, []);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please login');
      navigate('/login');
      return;
    }

    try {
      console.log('Fetching tasks...'); // Debug log
      console.log('Token:', token); // Log the token to see if it is valid
      
      const response = await axios.get('/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response from server:', response.data); // Debug log

      if (response.data && Array.isArray(response.data)) {
        if (response.data.length === 0) {
          setError('No tasks yet.');
          setTasks([]);
        } else {
          setTasks(response.data);
          setError('');
        }
      } else {
        setError('Unexpected response format.');
        setTasks([]);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error); 
      setError(error.response?.data?.error || 'Failed to fetch tasks. Please try again later.');
    }
  };

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please login');
      navigate('/login');
      return;
    }

    try {
      const response = await axios.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error.response ? error.response.data : error.message);
      setError('Failed to fetch users.');
    }
  };

  const handleCreateTask = async () => {
    if (!title || !description || !assignedTo) {
      setError('Please fill all the fields');
      return;
    }

    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please login');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        '/tasks/create',
        { title, description, assignedTo },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Log the response for debugging
      console.log('Response from server:', response.data);

      if (response.status === 201) { // Changed to 201 for successful creation
        fetchTasks(); 
        setTitle('');
        setDescription('');
        setAssignedTo('');
        setError(''); 
      } else {
        setError('Failed to create task. Please try again.');
      }
    } catch (error) {
      console.error('Error creating task:', error); // Log the entire error object
      const errorMessage = error.response?.data?.error || 'Error creating task';
      setError(errorMessage.includes('validation') ? 'Invalid input: ' + errorMessage : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex flex-row justify-between">
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
            <option key={user._id} value={user._id}>
              {user.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleCreateTask}
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 transition duration-300"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
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
