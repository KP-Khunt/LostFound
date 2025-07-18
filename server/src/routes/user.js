const express = require('express');
const Item = require('../models/Item');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's items
router.get('/items', authenticateToken, (req, res) => {
  try {
    const items = Item.getByUserId(req.user.id);
    
    res.json({
      success: true,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.category,
        location: item.location,
        date: item.date_occurred,
        contact: item.contact,
        image: item.image_path,
        type: item.type,
        status: item.status,
        createdAt: item.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching user items:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's items by type
router.get('/items/:type', authenticateToken, (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['lost', 'found'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Must be lost or found'
      });
    }
    
    const items = Item.getAll({
      userId: req.user.id,
      type: type
    });
    
    res.json({
      success: true,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.category,
        location: item.location,
        date: item.date_occurred,
        contact: item.contact,
        image: item.image_path,
        type: item.type,
        status: item.status,
        createdAt: item.created_at
      }))
    });
  } catch (error) {
    console.error('Error fetching user items by type:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user's statistics
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const allItems = Item.getByUserId(req.user.id);
    
    const stats = {
      totalItems: allItems.length,
      lostItems: allItems.filter(item => item.type === 'lost').length,
      foundItems: allItems.filter(item => item.type === 'found').length,
      activeItems: allItems.filter(item => item.status === 'active').length,
      matchedItems: allItems.filter(item => item.status === 'matched').length,
      resolvedItems: allItems.filter(item => item.status === 'resolved').length
    };
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
