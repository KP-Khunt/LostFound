const express = require('express');
const Database = require('../models/database');

const router = express.Router();

// Get overall statistics
router.get('/', (req, res) => {
  try {
    const items = Database.getItems();
    
    // Get basic item counts
    const lostItems = items.filter(item => item.type === 'lost').length;
    const foundItems = items.filter(item => item.type === 'found').length;
    const resolvedItems = items.filter(item => item.status === 'resolved').length;
    const totalItems = items.length;

    // Get category breakdown
    const categoryData = {};
    items.forEach(item => {
      if (!categoryData[item.category]) {
        categoryData[item.category] = { lost: 0, found: 0 };
      }
      categoryData[item.category][item.type]++;
    });

    // Get monthly data for the last 12 months
    const monthlyData = {};
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleString('default', { month: 'short' });
      monthlyData[monthName] = { lost: 0, found: 0 };
    }

    items.forEach(item => {
      const itemDate = new Date(item.created_at);
      const monthName = itemDate.toLocaleString('default', { month: 'short' });
      if (monthlyData[monthName]) {
        monthlyData[monthName][item.type]++;
      }
    });

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivity = items
      .filter(item => new Date(item.created_at) >= thirtyDaysAgo)
      .reduce((acc, item) => {
        const date = new Date(item.created_at).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, lost: 0, found: 0 };
        }
        acc[date][item.type]++;
        return acc;
      }, {});

    res.json({
      success: true,
      stats: {
        lostItems,
        foundItems,
        resolvedItems,
        totalItems,
        categoryData,
        monthlyData,
        recentActivity: Object.values(recentActivity).sort((a, b) => b.date.localeCompare(a.date))
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get category-specific statistics
router.get('/category/:category', (req, res) => {
  try {
    const { category } = req.params;
    const items = Database.getItems().filter(item => item.category === category);
    
    const lostItems = items.filter(item => item.type === 'lost').length;
    const foundItems = items.filter(item => item.type === 'found').length;
    const resolvedItems = items.filter(item => item.status === 'resolved').length;
    const totalItems = items.length;

    // Get location breakdown
    const locationStats = {};
    items.forEach(item => {
      if (!locationStats[item.location]) {
        locationStats[item.location] = { lost: 0, found: 0 };
      }
      locationStats[item.location][item.type]++;
    });

    const topLocations = Object.entries(locationStats)
      .map(([location, counts]) => ({
        location,
        lost: counts.lost,
        found: counts.found,
        total: counts.lost + counts.found
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    res.json({
      success: true,
      category,
      stats: {
        lostItems,
        foundItems,
        resolvedItems,
        totalItems,
        topLocations
      }
    });
  } catch (error) {
    console.error('Error fetching category statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get location-specific statistics
router.get('/location/:location', (req, res) => {
  try {
    const { location } = req.params;
    const items = Database.getItems().filter(item => 
      item.location.toLowerCase().includes(location.toLowerCase())
    );
    
    const lostItems = items.filter(item => item.type === 'lost').length;
    const foundItems = items.filter(item => item.type === 'found').length;
    const resolvedItems = items.filter(item => item.status === 'resolved').length;
    const totalItems = items.length;

    // Get category breakdown
    const categoryStats = {};
    items.forEach(item => {
      if (!categoryStats[item.category]) {
        categoryStats[item.category] = { lost: 0, found: 0 };
      }
      categoryStats[item.category][item.type]++;
    });

    const categoryBreakdown = Object.entries(categoryStats)
      .map(([category, counts]) => ({
        category,
        lost: counts.lost,
        found: counts.found,
        total: counts.lost + counts.found
      }))
      .sort((a, b) => b.total - a.total);

    res.json({
      success: true,
      location,
      stats: {
        lostItems,
        foundItems,
        resolvedItems,
        totalItems,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Error fetching location statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get daily statistics for the last 30 days
router.get('/daily', (req, res) => {
  try {
    const items = Database.getItems();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const dailyStats = items
      .filter(item => new Date(item.created_at) >= thirtyDaysAgo)
      .reduce((acc, item) => {
        const date = new Date(item.created_at).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = { date, lost: 0, found: 0, total: 0 };
        }
        acc[date][item.type]++;
        acc[date].total++;
        return acc;
      }, {});

    res.json({
      success: true,
      dailyStats: Object.values(dailyStats).sort((a, b) => b.date.localeCompare(a.date))
    });
  } catch (error) {
    console.error('Error fetching daily statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
