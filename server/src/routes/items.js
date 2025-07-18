const express = require('express');
const { body, validationResult } = require('express-validator');
const Item = require('../models/Item');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { findMatches } = require('../utils/matching');

const router = express.Router();

// Get all items or filter by type/category
router.get('/', (req, res) => {
  try {
    const { type, category, status, limit } = req.query;
    
    const filters = {};
    if (type) filters.type = type;
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (limit) filters.limit = parseInt(limit);
    
    const items = Item.getAll(filters);
    
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
        createdAt: item.created_at,
        userName: item.user_name
      }))
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get recent items
router.get('/recent', (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const items = Item.getRecent(parseInt(limit));
    
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
        createdAt: item.created_at,
        userName: item.user_name
      }))
    });
  } catch (error) {
    console.error('Error fetching recent items:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new item
router.post('/', authenticateToken, upload.single('image'), [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').notEmpty().withMessage('Category is required'),
  body('location').trim().isLength({ min: 2 }).withMessage('Location must be at least 2 characters'),
  body('date').isISO8601().toDate().withMessage('Please provide a valid date'),
  body('contact').trim().isLength({ min: 5 }).withMessage('Contact information is required'),
  body('type').isIn(['lost', 'found']).withMessage('Type must be either lost or found')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, description, category, location, date, contact, type } = req.body;
    const imagePath = req.file ? req.file.path : null;

    // Create new item
    const item = Item.create({
      userId: req.user.id,
      type,
      name,
      description,
      category,
      location,
      dateOccurred: date,
      contact,
      imagePath
    });

    // Find potential matches
    try {
      const matches = await findMatches(item.id);
      console.log(`Found ${matches.length} potential matches for item ${item.id}`);
    } catch (matchError) {
      console.error('Error finding matches:', matchError);
      // Continue even if matching fails
    }

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      item: {
        id: item.id,
        name: item.name,
        description: item.description,
        category: item.category,
        location: item.location,
        date: item.dateOccurred,
        contact: item.contact,
        image: item.imagePath,
        type: item.type,
        status: 'active'
      }
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single item
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const item = Item.findById(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      item: {
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
        createdAt: item.created_at,
        userName: item.user_name,
        userEmail: item.user_email
      }
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update item
router.put('/:id', authenticateToken, upload.single('image'), [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').optional().notEmpty().withMessage('Category cannot be empty'),
  body('location').optional().trim().isLength({ min: 2 }).withMessage('Location must be at least 2 characters'),
  body('contact').optional().trim().isLength({ min: 5 }).withMessage('Contact information is required'),
  body('status').optional().isIn(['active', 'matched', 'resolved']).withMessage('Invalid status')
], (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const item = Item.findById(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user owns the item
    if (item.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own items'
      });
    }

    // Prepare updates
    const updates = {};
    const { name, description, category, location, contact, status } = req.body;
    
    if (name) updates.name = name;
    if (description) updates.description = description;
    if (category) updates.category = category;
    if (location) updates.location = location;
    if (contact) updates.contact = contact;
    if (status) updates.status = status;
    if (req.file) updates.image_path = req.file.path;

    // Update item
    const updated = Item.update(id, updates);
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update item'
      });
    }

    res.json({
      success: true,
      message: 'Item updated successfully'
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete item
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const item = Item.findById(id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check if user owns the item
    if (item.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own items'
      });
    }

    // Delete item
    const deleted = Item.delete(id);
    
    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete item'
      });
    }

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Search items
router.get('/search/:term', (req, res) => {
  try {
    const { term } = req.params;
    const items = Item.search(term);
    
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
        createdAt: item.created_at,
        userName: item.user_name
      }))
    });
  } catch (error) {
    console.error('Error searching items:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
