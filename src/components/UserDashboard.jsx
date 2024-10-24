import React, { useState, useEffect } from 'react';
import axios from '../axios';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    const name = localStorage.getItem('name'); 
    if (name) {
      setUserName(name);
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/tasks/my-tasks');
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name'); // Remove user name
    navigate('/');
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className='flex flex-row justify-between'>
      <h1 className="text-3xl font-bold mb-4">Welcome, {userName}!</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white p-2 rounded-lg mb-4 hover:bg-red-500 transition duration-300"
      >
        Logout
      </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">My Tasks</h2>
        <ul>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <li key={task._id} className="border p-2 my-2 rounded-lg bg-gray-50">
                <h2 className="text-lg font-bold">{task.title}</h2>
                <p>{task.description}</p>
                <p className="text-sm text-gray-600">Status: {task.status}</p>
              </li>
            ))
          ) : (
            <p>No tasks assigned yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserDashboard;
