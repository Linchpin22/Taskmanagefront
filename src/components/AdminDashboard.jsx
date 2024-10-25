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
  const [editingTask, setEditingTask] = useState(null); // State to track which task is being edited

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
      const response = await axios.get('/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        if (response.data.length === 0) {
          setError('No tasks yet.');
          setTasks([]);
        } else {
          // Map user IDs to user names
          const tasksWithUserNames = response.data.map((task) => {
            const user = users.find((user) => user._id === task.assignedTo); // Find user by ID
            return {
              ...task,
              assignedTo: user ? user.name : 'Unknown User', // Use user name or fallback to 'Unknown User'
            };
          });
          setTasks(tasksWithUserNames);
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

      if (response.status === 201) {
        fetchTasks(); 
        setTitle('');
        setDescription('');
        setAssignedTo('');
        setError(''); 
      } else {
        setError('Failed to create task. Please try again.');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      const errorMessage = error.response?.data?.error || 'Error creating task';
      setError(errorMessage.includes('validation') ? 'Invalid input: ' + errorMessage : errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setAssignedTo(task.assignedTo); // Assuming assignedTo contains the user name now
    setEditingTask(task); // Set the task being edited
  };

  const handleUpdateTask = async () => {
    if (!editingTask || !title || !description || !assignedTo) {
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
      const response = await axios.put(
        `/tasks/${editingTask._id}`, // Make sure this is your update endpoint
        { title, description, assignedTo }, // You might want to send assignedTo as user ID again here
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchTasks(); 
        setTitle('');
        setDescription('');
        setAssignedTo('');
        setEditingTask(null); // Clear editing state
        setError(''); 
      } else {
        setError('Failed to update task. Please try again.');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      setError(error.response?.data?.error || 'Error updating task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please login');
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks(); // Refresh task list after deletion
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task.');
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
            <option key={user._id} value={user._id}> {/* Use user ID for submission */}
              {user.name}
            </option>
          ))}
        </select>
        <button
          onClick={editingTask ? handleUpdateTask : handleCreateTask}
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-500 transition duration-300"
          disabled={loading}
        >
          {loading ? (editingTask ? 'Updating...' : 'Creating...') : (editingTask ? 'Update Task' : 'Create Task')}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Task List</h2>
        <ul>
          {tasks.map((task) => (
            <li key={task._id} className="bg-white p-4 rounded-lg shadow-lg mb-2 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-gray-600">{task.description}</p>
                <p className="text-gray-600">Assigned To: {task.assignedTo}</p>
              </div>
              <div className="flex flex-col">
                <button
                  onClick={() => handleEditTask(task)}
                  className="bg-yellow-500 text-white p-2 rounded-lg mb-2 hover:bg-yellow-400 transition duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-500 transition duration-300"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
