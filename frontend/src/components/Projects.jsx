import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import Navbar from './Navbar';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ title: '', description: '' });
  const [members, setMembers] = useState({}); // 🔹 Store members per project
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // ✅ Fetch Projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await API.get('/projects/get');
      console.log("📢 Projects API Response:", response.data);

      if (response.data && Array.isArray(response.data.projects)) {
        setProjects(response.data.projects);
        fetchMembers(response.data.projects); // ✅ Fetch members after projects load
      } else {
        setError('Unexpected data format from server');
      }
    } catch (err) {
      console.error('❌ Error fetching projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Members for All Projects
  const fetchMembers = async (projects) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found, user not authenticated!");
        return;
      }

      const membersData = {}; // 🔹 Store members per project

      await Promise.all(
        projects.map(async (project) => {
          try {
            console.log(`🔍 Fetching members for: ${project.name}`);

            const response = await API.get('/members/get', {
              headers: { Authorization: token },
              params: { title: project.name }
            });

            console.log(`📢 API Response for "${project.name}":`, response.data);

            membersData[project.name] = response.data.members || [];
          } catch (error) {
            console.error(`❌ Error fetching members for "${project.name}":`, error);
            membersData[project.name] = [];
          }
        })
      );

      console.log("✅ Final Members Dictionary:", membersData);
      setMembers(membersData); // 🔹 Update state

    } catch (error) {
      console.error("❌ Error fetching members:", error);
      setMembers({});
    } finally {
      setLoading(false);
    }
  };

  //  Log when members update
  useEffect(() => {
    console.log("👥 Updated Members:", members);
  }, [members]);

  // Handle Delete Project
  const handleDeleteProject = async (name) => {
    if (!window.confirm(`Are you sure you want to delete the project: ${name}?`)) {
      return;
    }

    try {
      setLoading(true);
      await API.delete('/projects/delete', { data: { title: name } });
      fetchProjects(); // Refresh projects after deletion
    } catch (err) {
      console.error('❌ Error deleting project:', err);
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

        {/* ✅ Project Creation Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Create New Project</h2>
            <form onSubmit={fetchProjects}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newProject.title}
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

        {/* ✅ Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            console.log("🔍 Rendering Project:", project);

            const projectMembers = members[project.name] || [];

            console.log(`👥 Found ${projectMembers.length} members for project "${project.name}"`, projectMembers);

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

                  {/* ✅ Display Members */}
                  <div className="mt-4">
                    <h4 className="text-md font-semibold text-gray-700">Members:</h4>
                    <div className="mt-2">
                      {projectMembers.length > 0 ? (
                        <ul>
                          {projectMembers.map((member, index) => (
                            <li key={index} className="text-gray-600 text-sm">
                              {member.name} ({member.role})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 text-sm">No members assigned</p>
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
