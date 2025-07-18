const express = require('express');
const { getAllMatches } = require('../utils/matching');
const Match = require('../models/Match');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all matches
router.get('/', (req, res) => {
  try {
    const matches = getAllMatches();
    
    res.json({
      success: true,
      matches
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get matches for a specific item
router.get('/item/:id', (req, res) => {
  try {
    const { id } = req.params;
    const matches = Match.getByItemId(id);
    
    const formattedMatches = matches.map(match => ({
      id: match.id,
      matchScore: match.match_score,
      status: match.status,
      createdAt: match.created_at,
      lostItem: {
        id: match.lost_item_id,
        name: match.lost_item_name,
        description: match.lost_item_description,
        category: match.lost_item_category,
        location: match.lost_item_location,
        date: match.lost_item_date,
        contact: match.lost_item_contact,
        image: match.lost_item_image
      },
      foundItem: {
        id: match.found_item_id,
        name: match.found_item_name,
        description: match.found_item_description,
        category: match.found_item_category,
        location: match.found_item_location,
        date: match.found_item_date,
        contact: match.found_item_contact,
        image: match.found_item_image
      }
    }));
    
    res.json({
      success: true,
      matches: formattedMatches
    });
  } catch (error) {
    console.error('Error fetching item matches:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update match status
router.put('/:id/status', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be pending, confirmed, or rejected'
      });
    }
    
    const match = Match.findById(id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }
    
    const updated = Match.updateStatus(id, status);
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update match status'
      });
    }
    
    res.json({
      success: true,
      message: 'Match status updated successfully'
    });
  } catch (error) {
    console.error('Error updating match status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete match
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    
    const match = Match.findById(id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }
    
    const deleted = Match.delete(id);
    
    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete match'
      });
    }
    
    res.json({
      success: true,
      message: 'Match deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting match:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get match statistics
router.get('/stats', (req, res) => {
  try {
    const stats = Match.getStats();
    
    res.json({
      success: true,
      stats: {
        totalMatches: stats.total_matches || 0,
        confirmedMatches: stats.confirmed_matches || 0,
        pendingMatches: stats.pending_matches || 0,
        rejectedMatches: stats.rejected_matches || 0,
        avgMatchScore: Math.round(stats.avg_match_score || 0)
      }
    });
  } catch (error) {
    console.error('Error fetching match stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
