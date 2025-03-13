import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import Navbar from './Navbar';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [members, setMembers] = useState([]); // ✅ Ensuring it's an array
  const [userId, setUserId] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    fetchMembers(); // ✅ Fetch members when component mounts
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await API.get('/projects/get');
      console.log("Projects API Response:", response.data);
  
      if (response.data && Array.isArray(response.data.projects)) {
        // Map the projects to ensure correct ID field
        const formattedProjects = response.data.projects.map(project => {
          console.log("Processing project:", project);
          // Make sure we have a proper ID field
          return {
            ...project,
            id: project.id || project._id || project.project_id
          };
        });
        
        setProjects(formattedProjects);
      } else {
        console.error("Unexpected response format:", response.data);
        setError('Received unexpected data format from server');
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
    
      // Get user's membership data
      const response = await API.get('/members/get');
      console.log("Members API Response 1:", response.data);
  
      if (response.data && Array.isArray(response.data.members) && response.data.members.length > 0) {
        const memberData = response.data.members;
        setMembers(memberData);  // These already have project_id, user_id, and role
        
        // Get user's name
        const userId = memberData[0].user_id;
        setUserId(userId);
  
        const response2 = await API.get('/members/getN', { params: { u_id: userId } });
        console.log("Members API Response 2:", response2.data);
  
        // We now have the user's name from getN response
        if (response2.data && response2.data.name) {
          // Enhance the member data with names
          const enhancedMembers = memberData.map(member => ({
            ...member,
            name: response2.data.name  // Add name to each member entry
          }));
          
          setMembers(enhancedMembers);
        }
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({
      ...newProject,
      [name]: value
    });
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!newProject.title.trim()) {
      setError('Project title is required');
      return;
    }

    const projectData = {
      title: newProject.title,
      description: newProject.description,
      u_name: localStorage.getItem('name')
    };

    try {
      setLoading(true);
      await API.post('/projects/add', projectData);
      setNewProject({ title: '', description: '' });
      fetchProjects();
      setShowForm(false);
    } catch (err) {
      console.error('Error adding project:', err);
      setError('Failed to add project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (name) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      setLoading(true);
      await API.delete('/projects/delete', { data: { title: name } });
      fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Projects</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition flex items-center"
          >
            <span className="mr-1">{showForm ? 'Cancel' : 'New Project'}</span>
            <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
            <p>{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="float-right text-red-700 hover:text-red-900"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Create New Project</h2>
            <form onSubmit={handleAddProject}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newProject.title}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Project title"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={newProject.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Project description"
                  rows="3"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition">
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        )}

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {projects.map((project) => {
    // Debug logging
    console.log("Current project:", project);
    console.log("Project ID type:", typeof project.id);
    
    // Filter members for this project - try different ID formats
    const projectMembers = Array.isArray(members)
      ? members.filter(member => {
          console.log("Comparing member project_id:", member.project_id, "to project.id:", project.id);
          return member.project_id === project.id || 
                 member.project_id === parseInt(project.id) || 
                 parseInt(member.project_id) === project.id;
        })
      : [];
    
    console.log("Found members for project", project.name, ":", projectMembers);

    return (
      <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-800 truncate">{project.name}</h3>
            <button
              onClick={() => handleDeleteProject(project.name)}
              className="text-red-500 hover:text-red-700 transition"
              title="Delete project"
            >
              <i className="fas fa-trash">Delete</i>
            </button>
          </div>
          <p className="text-gray-600 mb-4 line-clamp-2">{project.description || 'No description provided'}</p>
          
          <div className="mt-4">
            <h4 className="text-md font-semibold text-gray-700">Members:</h4>
            <div className="mt-2">
              {projectMembers.length > 0 ? (
                <ul>
                  {projectMembers.map((member, index) => (
                    <li key={index} className="text-gray-600 text-sm">
                      {member.name || 'User'} ({member.role || 'Member'})
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 text-sm">No members assigned</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  })}
</div>
      </div>
    </div>
  );
};

export default Projects;
