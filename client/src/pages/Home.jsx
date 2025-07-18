import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';

const Home = () => {
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentItems();
  }, []);

  const fetchRecentItems = async () => {
    try {
      // Fetch recent lost and found items
      const response = await axios.get('/api/items/recent');
      setRecentItems(response.data);
    } catch (error) {
      console.error('Error fetching recent items:', error);
      // Set dummy data if API fails
      setRecentItems([
        {
          id: 1,
          name: 'iPhone 13',
          description: 'Blue iPhone 13 with cracked screen',
          category: 'Electronics',
          location: 'Library',
          date: '2024-01-15',
          type: 'lost'
        },
        {
          id: 2,
          name: 'Red Backpack',
          description: 'Nike red backpack found in cafeteria',
          category: 'Bags',
          location: 'Cafeteria',
          date: '2024-01-16',
          type: 'found'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        {/* Hero Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to LostFound
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Smart Campus Lost & Found Portal - Helping you find what matters most
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link 
              to="/lost-form" 
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Report Lost Item
            </Link>
            <Link 
              to="/found-form" 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Report Found Item
            </Link>
            <Link 
              to="/matches" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Matches
            </Link>
          </div>
        </div>

        {/* Recent Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Items</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading recent items...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentItems.map(item => (
                <Card key={item.id} item={item} type={item.type} />
              ))}
            </div>
          )}
          
          {!loading && recentItems.length === 0 && (
            <p className="text-gray-600 text-center py-8">
              No recent items found. Be the first to report!
            </p>
          )}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Items Lost</h3>
            <p className="text-3xl font-bold text-red-600">24</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Items Found</h3>
            <p className="text-3xl font-bold text-green-600">18</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Successful Matches</h3>
            <p className="text-3xl font-bold text-blue-600">12</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
