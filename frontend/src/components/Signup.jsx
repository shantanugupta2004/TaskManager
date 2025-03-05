import { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [form, setForm] = useState({name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("auth/register", form);
            navigate("/");
        } catch (error) {
            alert("Registration failed!");
            setError("Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Create Your Account
                </h2>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                            Username
                        </label>
                        <input 
                            type="text" 
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            minLength="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Your Name"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email Address
                        </label>
                        <input 
                            type="email" 
                            id="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input 
                            type="password" 
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Create a password"
                        />
                    </div>
                    
                    <div>
                        <button 
                            type="submit" 
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account? 
                        <a href="/" className="ml-1 font-medium text-blue-600 hover:text-blue-500">
                            Log in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;