import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form states
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    name: localStorage.getItem('name') || 'User', // Get username from localStorage if available
    priority: 'High'
  });
  
  // Filter states
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  
  // Task statistics
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0
  });
  
  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);
  
  // Update filtered tasks when filters or tasks change
  useEffect(() => {
    filterTasks();
  }, [tasks, priorityFilter, statusFilter]);
  
  // Calculate task statistics whenever tasks change
  useEffect(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'Completed').length;
    const inProgress = tasks.filter(task => task.status === 'In Progress').length;
    const pending = tasks.filter(task => task.status === 'Pending').length;
    
    setTaskStats({
      total,
      completed,
      inProgress,
      pending
    });
  }, [tasks]);
  
  // Fetch all tasks from the server
  const fetchTasks = async () => {
    setLoading(true);
    try {
        const response = await API.get('/tasks/fetchP');

        // Assuming fetchP returns { tasks: [...] }
        const tasks = response.data.tasks ? response.data.tasks : response.data;

        setTasks(tasks);
        setError(null);
    } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setError('Failed to load tasks. Please try again.');
    } finally {
        setLoading(false);
    }
};

  
  // Apply filters to the tasks
  const filterTasks = () => {
    let filtered = [...tasks];
    
    // Apply status filter if not set to 'all'
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
  }
    
    setFilteredTasks(filtered);
  };
  
  // Handle input changes for the add task form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle add task form submission
  const handleAddTask = async (e) => {
    e.preventDefault();
    
    try {
      await API.post('/tasks/add', newTask);
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        name: localStorage.getItem('name') || 'User',
        priority: ''
      });
      
      // Refresh task list
      fetchTasks();
    } catch (err) {
      console.error('Failed to add task:', err);
      setError('Failed to add task. Please try again.');
    }
  };
  
  // Open modal with task details
  const openTaskModal = (task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };
  
  // Close task modal
  const closeTaskModal = () => {
    setIsModalOpen(false);
    setCurrentTask(null);
  };
  
  // Handle status update
  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    
    if (!currentTask) return;
    
    const updatedTask = {
      title: currentTask.title,
      status: e.target.status.value
    };
    
    try {
      await API.post('/tasks/update', updatedTask);
      closeTaskModal();
      fetchTasks();
    } catch (err) {
      console.error('Failed to update status:', err);
      setError('Failed to update task status. Please try again.');
    }
  };
  
  // Handle priority update
  const handlePriorityUpdate = async (e) => {
    e.preventDefault();
    
    if (!currentTask) return;
    
    const updateData = {
      priority: e.target.priority.value,
      title: currentTask.title
    };
    
    try {
      await API.post('/tasks/updateP', updateData);
      closeTaskModal();
      fetchTasks();
    } catch (err) {
      console.error('Failed to update priority:', err);
      setError('Failed to update task priority. Please try again.');
    }
  };
  
  // Handle task deletion
  const handleDeleteTask = async () => {
    if (!currentTask || !window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    try {
      await API.delete('/tasks/delete', { data: { title: currentTask.title } });
      closeTaskModal();
      fetchTasks();
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task. Please try again.');
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    window.location.href = '/'; // Redirect to login page
  };
  
  // Get appropriate color class for priority badge
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get appropriate color class for status badge
  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navigation Bar */}
      <nav className="bg-indigo-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">TaskFlow</div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              Welcome, {localStorage.getItem('name') || 'User'}
            </div>
            <button 
              onClick={handleLogout}
              className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-4 md:p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column: Task list */}
          <div className="w-full md:w-2/3 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">My Tasks</h2>
                <div className="flex items-center space-x-2">
                  <select 
                    className="border rounded-md p-2 text-sm"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="all">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <select 
                    className="border rounded-md p-2 text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-16 bg-gray-200 rounded-md"></div>
                    <div className="h-16 bg-gray-200 rounded-md"></div>
                    <div className="h-16 bg-gray-200 rounded-md"></div>
                  </div>
                ) : filteredTasks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <i className="fas fa-tasks text-4xl mb-3"></i>
                    <p>No tasks found. Add your first task!</p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div 
                      key={task.id || task.title} 
                      className="bg-white border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                      onClick={() => openTaskModal(task)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">{task.title}</h3>
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                            {task.description || 'No description'}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityClass(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusClass(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right column: Add task form and statistics */}
          <div className="w-full md:w-1/3 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Task</h2>
              <form onSubmit={handleAddTask} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input 
                    type="text" 
                    id="title"
                    name="title"
                    value={newTask.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md" 
                    placeholder="Enter task title" 
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea 
                    id="description"
                    name="description"
                    value={newTask.description}
                    onChange={handleInputChange}
                    rows="3" 
                    className="w-full p-2 border rounded-md" 
                    placeholder="Enter task description"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select 
                    id="priority"
                    name="priority"
                    value={newTask.priority}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                >
                  <i className="fas fa-plus mr-2"></i>Add Task
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Task Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Tasks:</span>
                  <span className="font-bold">{taskStats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completed:</span>
                  <span className="font-bold text-green-600">{taskStats.completed}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">In Progress:</span>
                  <span className="font-bold text-blue-600">{taskStats.inProgress}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending:</span>
                  <span className="font-bold text-yellow-600">{taskStats.pending}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task details modal */}
      {isModalOpen && currentTask && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-black opacity-50" 
            onClick={closeTaskModal}
          ></div>
          <div className="bg-white rounded-lg shadow-xl p-6 z-10 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Task Details</h3>
              <button 
                onClick={closeTaskModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="mb-6">
              <h4 className="font-bold text-xl mb-2">{currentTask.title}</h4>
              <p className="text-gray-700">{currentTask.description || 'No description'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-1">Current Status</h5>
                <span className={`px-2 py-1 rounded-full text-sm ${getStatusClass(currentTask.status)}`}>
                  {currentTask.status}
                </span>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-1">Current Priority</h5>
                <span className={`px-2 py-1 rounded-full text-sm ${getPriorityClass(currentTask.priority)}`}>
                  {currentTask.priority}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Update Status Form */}
              <form onSubmit={handleStatusUpdate} className="mb-4">
                <div className="flex space-x-2">
                  <select 
                    name="status"
                    defaultValue={currentTask.status}
                    className="flex-1 p-2 border rounded-md"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button 
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Update Status
                  </button>
                </div>
              </form>
              
              {/* Update Priority Form */}
              <form onSubmit={handlePriorityUpdate} className="mb-4">
                <div className="flex space-x-2">
                  <select 
                    name="priority"
                    defaultValue={currentTask.priority}
                    className="flex-1 p-2 border rounded-md"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <button 
                    type="submit"
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
                  >
                    Update Priority
                  </button>
                </div>
              </form>
              
              {/* Delete Button */}
              <button 
                onClick={handleDeleteTask}
                className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
              >
                Delete Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;