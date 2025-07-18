import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Graph = () => {
  const [statsData, setStatsData] = useState({
    lostItems: 0,
    foundItems: 0,
    resolvedItems: 0,
    categoryData: {},
    monthlyData: {}
  });
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('bar');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats');
      setStatsData(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set dummy data if API fails
      setStatsData({
        lostItems: 24,
        foundItems: 18,
        resolvedItems: 12,
        categoryData: {
          'Electronics': { lost: 8, found: 6 },
          'Bags': { lost: 5, found: 4 },
          'Clothing': { lost: 3, found: 2 },
          'Books': { lost: 4, found: 3 },
          'Keys': { lost: 2, found: 2 },
          'Jewelry': { lost: 1, found: 1 },
          'Other': { lost: 1, found: 0 }
        },
        monthlyData: {
          'Jan': { lost: 12, found: 8 },
          'Feb': { lost: 8, found: 6 },
          'Mar': { lost: 4, found: 4 }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const barChartData = {
    labels: Object.keys(statsData.categoryData),
    datasets: [
      {
        label: 'Lost Items',
        data: Object.values(statsData.categoryData).map(cat => cat.lost),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
      {
        label: 'Found Items',
        data: Object.values(statsData.categoryData).map(cat => cat.found),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Lost Items', 'Found Items', 'Resolved Items'],
    datasets: [
      {
        data: [statsData.lostItems, statsData.foundItems, statsData.resolvedItems],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: chartType === 'bar' ? 'Items by Category' : 'Overall Statistics',
      },
    },
    scales: chartType === 'bar' ? {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    } : undefined,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Lost & Found Statistics
        </h1>

        {/* Overall Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Items</h3>
            <p className="text-3xl font-bold text-blue-600">
              {statsData.lostItems + statsData.foundItems}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Lost Items</h3>
            <p className="text-3xl font-bold text-red-600">{statsData.lostItems}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Found Items</h3>
            <p className="text-3xl font-bold text-green-600">{statsData.foundItems}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Resolved</h3>
            <p className="text-3xl font-bold text-blue-600">{statsData.resolvedItems}</p>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Chart Type:
          </label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="bar">Bar Chart - By Category</option>
            <option value="pie">Pie Chart - Overall</option>
          </select>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading statistics...</p>
            </div>
          ) : (
            <div className="h-96">
              {chartType === 'bar' ? (
                <Bar data={barChartData} options={chartOptions} />
              ) : (
                <Pie data={pieChartData} options={chartOptions} />
              )}
            </div>
          )}
        </div>

        {/* Success Rate */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Success Rate</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Items Successfully Returned</span>
                <span>{statsData.resolvedItems} / {statsData.lostItems}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(statsData.resolvedItems / Math.max(statsData.lostItems, 1)) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {Math.round((statsData.resolvedItems / Math.max(statsData.lostItems, 1)) * 100)}% success rate
              </p>
            </div>
            
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Found vs Lost Ratio</span>
                <span>{statsData.foundItems} / {statsData.lostItems}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(statsData.foundItems / Math.max(statsData.lostItems, 1)) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {Math.round((statsData.foundItems / Math.max(statsData.lostItems, 1)) * 100)}% of lost items have been found
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graph;
