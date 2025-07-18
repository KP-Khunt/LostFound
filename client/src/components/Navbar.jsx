import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          LostFound
        </Link>
        
        <div className="flex space-x-4">
          <Link 
            to="/" 
            className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive('/')}`}
          >
            Home
          </Link>
          <Link 
            to="/lost-form" 
            className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive('/lost-form')}`}
          >
            Report Lost
          </Link>
          <Link 
            to="/found-form" 
            className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive('/found-form')}`}
          >
            Report Found
          </Link>
          <Link 
            to="/matches" 
            className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive('/matches')}`}
          >
            Matches
          </Link>
          <Link 
            to="/history" 
            className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive('/history')}`}
          >
            History
          </Link>
          <Link 
            to="/graph" 
            className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive('/graph')}`}
          >
            Stats
          </Link>
          <Link 
            to="/about" 
            className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive('/about')}`}
          >
            About
          </Link>
          <Link 
            to="/login" 
            className={`px-3 py-2 rounded hover:bg-blue-700 ${isActive('/login')}`}
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
