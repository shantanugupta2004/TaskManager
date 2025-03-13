import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  const userName = localStorage.getItem('name') || 'User';
  const navigate = useNavigate();
  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      navigate('/');
    };
  return (
    <nav className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-2xl font-bold">TaskFlow</div>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/home" className="hover:text-indigo-200 transition-colors duration-200 font-medium">
            <i className="fas fa-home mr-2"></i>Home
          </Link>
          <Link to="/projects" className="hover:text-indigo-200 transition-colors duration-200 font-medium">
            <i className="fas fa-project-diagram mr-2"></i>Projects
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center">
            <div className="bg-indigo-800 px-3 py-1 rounded-full">
              Welcome, {userName}
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 font-medium transition-colors duration-200 flex items-center"
          >
            <i className="fas fa-sign-out-alt mr-1"></i>Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;