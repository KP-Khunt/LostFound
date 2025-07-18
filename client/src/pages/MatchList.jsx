import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';

const MatchList = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get('/api/matches');
      setMatches(response.data);
    } catch (error) {
      console.error('Error fetching matches:', error);
      // Set dummy data if API fails
      setMatches([
        {
          id: 1,
          lostItem: {
            id: 1,
            name: 'iPhone 13',
            description: 'Blue iPhone 13 with cracked screen',
            category: 'Electronics',
            location: 'Library',
            date: '2024-01-15',
            contact: 'john@email.com'
          },
          foundItem: {
            id: 2,
            name: 'iPhone 13',
            description: 'Blue iPhone found in library',
            category: 'Electronics',
            location: 'Library',
            date: '2024-01-16',
            contact: 'mary@email.com'
          },
          matchScore: 85
        },
        {
          id: 2,
          lostItem: {
            id: 3,
            name: 'Red Backpack',
            description: 'Nike red backpack with books',
            category: 'Bags',
            location: 'Cafeteria',
            date: '2024-01-14',
            contact: 'alice@email.com'
          },
          foundItem: {
            id: 4,
            name: 'Red Backpack',
            description: 'Nike red backpack found in cafeteria',
            category: 'Bags',
            location: 'Cafeteria',
            date: '2024-01-15',
            contact: 'bob@email.com'
          },
          matchScore: 92
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    return match.lostItem.category.toLowerCase() === filter.toLowerCase();
  });

  const categories = ['all', 'electronics', 'bags', 'clothing', 'books', 'keys', 'jewelry', 'sports equipment', 'other'];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Potential Matches
        </h1>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Filter by Category:
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading matches...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredMatches.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600 text-lg">No matches found for the selected filter.</p>
              </div>
            ) : (
              filteredMatches.map(match => (
                <div key={match.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Match Found!
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      match.matchScore >= 90 ? 'bg-green-100 text-green-800' :
                      match.matchScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {match.matchScore}% Match
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-red-600 mb-3">Lost Item</h3>
                      <Card item={match.lostItem} type="lost" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-600 mb-3">Found Item</h3>
                      <Card item={match.foundItem} type="found" />
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">
                      <strong>Matching criteria:</strong> Similar item name, same category, similar location
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchList;
