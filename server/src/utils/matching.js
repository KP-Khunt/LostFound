const Item = require('../models/Item');
const Match = require('../models/Match');

// Simple text similarity calculation
const calculateSimilarity = (text1, text2) => {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
};

// Calculate match score between two items
const calculateMatchScore = (lostItem, foundItem) => {
  let score = 0;
  
  // Category match (40 points)
  if (lostItem.category === foundItem.category) {
    score += 40;
  }
  
  // Location similarity (20 points)
  if (lostItem.location.toLowerCase() === foundItem.location.toLowerCase()) {
    score += 20;
  } else if (lostItem.location.toLowerCase().includes(foundItem.location.toLowerCase()) || 
             foundItem.location.toLowerCase().includes(lostItem.location.toLowerCase())) {
    score += 10;
  }
  
  // Name similarity (25 points)
  const nameSimilarity = calculateSimilarity(lostItem.name, foundItem.name);
  score += Math.round(nameSimilarity * 25);
  
  // Description similarity (15 points)
  const descSimilarity = calculateSimilarity(lostItem.description, foundItem.description);
  score += Math.round(descSimilarity * 15);
  
  return Math.min(score, 100); // Cap at 100
};

// Find potential matches for an item
const findMatches = async (itemId) => {
  try {
    const item = Item.findById(itemId);
    if (!item) {
      throw new Error('Item not found');
    }
    
    // Get potential matches (opposite type items)
    const potentialMatches = Item.getForMatching(item.type, item.category, item.location);
    
    const matches = [];
    
    for (const potentialMatch of potentialMatches) {
      // Skip if match already exists
      const lostItemId = item.type === 'lost' ? item.id : potentialMatch.id;
      const foundItemId = item.type === 'found' ? item.id : potentialMatch.id;
      
      if (Match.exists(lostItemId, foundItemId)) {
        continue;
      }
      
      // Calculate match score
      const score = calculateMatchScore(
        item.type === 'lost' ? item : potentialMatch,
        item.type === 'found' ? item : potentialMatch
      );
      
      // Only consider matches with score >= 30
      if (score >= 30) {
        // Create match record
        const match = Match.create({
          lostItemId,
          foundItemId,
          matchScore: score
        });
        
        matches.push({
          ...match,
          lostItem: item.type === 'lost' ? item : potentialMatch,
          foundItem: item.type === 'found' ? item : potentialMatch
        });
      }
    }
    
    return matches;
  } catch (error) {
    console.error('Error finding matches:', error);
    throw error;
  }
};

// Get all matches with formatted data
const getAllMatches = () => {
  try {
    const matches = Match.getAll();
    
    return matches.map(match => ({
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
  } catch (error) {
    console.error('Error getting matches:', error);
    throw error;
  }
};

module.exports = {
  findMatches,
  getAllMatches,
  calculateMatchScore,
  calculateSimilarity
};
