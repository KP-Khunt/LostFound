import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';

const History = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchUserItems();
  }, []);

  const fetchUserItems = async () => {
    try {
      const response = await axios.get('/api/user/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching user items:', error);
      // Set dummy data if API fails
      setItems([
        {
          id: 1,
          name: 'iPhone 13',
          description: 'Blue iPhone 13 with cracked screen',
          category: 'Electronics',
          location: 'Library',
          date: '2024-01-15',
          contact: 'john@email.com',
          type: 'lost',
          status: 'active'
        },
        {
          id: 2,
          name: 'Red Backpack',
          description: 'Nike red backpack found in cafeteria',
          category: 'Bags',
          location: 'Cafeteria',
          date: '2024-01-16',
          contact: 'john@email.com',
          type: 'found',
          status: 'matched'
        },
        {
          id: 3,
          name: 'Keys',
          description: 'Car keys with blue keychain',
          category: 'Keys',
          location: 'Parking Lot',
          date: '2024-01-14',
          contact: 'john@email.com',
          type: 'lost',
          status: 'resolved'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'matched': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'matched': return 'Matched';
      case 'resolved': return 'Resolved';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          My Report History
        </h1>

        {/* Filter and Stats */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Filter by Type:
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Items</option>
                <option value="lost">Lost Items</option>
                <option value="found">Found Items</option>
              </select>
            </div>
            
            <div className="flex space-x-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {items.filter(item => item.type === 'lost').length}
                </p>
                <p className="text-sm text-gray-600">Lost Items</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {items.filter(item => item.type === 'found').length}
                </p>
                <p className="text-sm text-gray-600">Found Items</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {items.filter(item => item.status === 'resolved').length}
                </p>
                <p className="text-sm text-gray-600">Resolved</p>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading your items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.length === 0 ? (
              <div className="col-span-full bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 text-lg">No items found for the selected filter.</p>
              </div>
            ) : (
              filteredItems.map(item => (
                <div key={item.id} className="relative">
                  <Card item={item} type={item.type} />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-md p-4 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Status Legend:</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                Active
              </span>
              <span className="text-sm text-gray-600">Still looking for matches</span>
            </div>
            <div className="flex items-center">
              <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800 mr-2">
                Matched
              </span>
              <span className="text-sm text-gray-600">Potential match found</span>
            </div>
            <div className="flex items-center">
              <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 mr-2">
                Resolved
              </span>
              <span className="text-sm text-gray-600">Item returned to owner</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
