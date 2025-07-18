const Database = require('./database');

class Match {
  // Create a new match
  static create(matchData) {
    const { lostItemId, foundItemId, matchScore } = matchData;
    
    const newMatch = Database.addMatch({
      lost_item_id: lostItemId,
      found_item_id: foundItemId,
      match_score: matchScore,
      status: 'pending'
    });

    return newMatch;
  }

  // Find match by ID
  static findById(id) {
    const match = Database.findMatch({ id });
    if (!match) return null;

    // Get item details
    const items = Database.getItems();
    const lostItem = items.find(item => item.id === match.lost_item_id);
    const foundItem = items.find(item => item.id === match.found_item_id);

    return {
      ...match,
      lost_item_name: lostItem?.name,
      lost_item_description: lostItem?.description,
      lost_item_category: lostItem?.category,
      lost_item_location: lostItem?.location,
      lost_item_date: lostItem?.date_occurred,
      lost_item_contact: lostItem?.contact,
      lost_item_image: lostItem?.image_path,
      found_item_name: foundItem?.name,
      found_item_description: foundItem?.description,
      found_item_category: foundItem?.category,
      found_item_location: foundItem?.location,
      found_item_date: foundItem?.date_occurred,
      found_item_contact: foundItem?.contact,
      found_item_image: foundItem?.image_path
    };
  }

  // Get all matches with full item details
  static getAll() {
    const matches = Database.getMatches();
    const items = Database.getItems();
    
    return matches.map(match => {
      const lostItem = items.find(item => item.id === match.lost_item_id);
      const foundItem = items.find(item => item.id === match.found_item_id);
      
      return {
        ...match,
        lost_item_name: lostItem?.name,
        lost_item_description: lostItem?.description,
        lost_item_category: lostItem?.category,
        lost_item_location: lostItem?.location,
        lost_item_date: lostItem?.date_occurred,
        lost_item_contact: lostItem?.contact,
        lost_item_image: lostItem?.image_path,
        found_item_name: foundItem?.name,
        found_item_description: foundItem?.description,
        found_item_category: foundItem?.category,
        found_item_location: foundItem?.location,
        found_item_date: foundItem?.date_occurred,
        found_item_contact: foundItem?.contact,
        found_item_image: foundItem?.image_path
      };
    }).sort((a, b) => b.match_score - a.match_score);
  }

  // Get matches for a specific item
  static getByItemId(itemId) {
    const matches = Database.getMatches();
    const items = Database.getItems();
    
    const itemMatches = matches.filter(match => 
      match.lost_item_id === itemId || match.found_item_id === itemId
    );
    
    return itemMatches.map(match => {
      const lostItem = items.find(item => item.id === match.lost_item_id);
      const foundItem = items.find(item => item.id === match.found_item_id);
      
      return {
        ...match,
        lost_item_name: lostItem?.name,
        lost_item_description: lostItem?.description,
        lost_item_category: lostItem?.category,
        lost_item_location: lostItem?.location,
        lost_item_date: lostItem?.date_occurred,
        lost_item_contact: lostItem?.contact,
        lost_item_image: lostItem?.image_path,
        found_item_name: foundItem?.name,
        found_item_description: foundItem?.description,
        found_item_category: foundItem?.category,
        found_item_location: foundItem?.location,
        found_item_date: foundItem?.date_occurred,
        found_item_contact: foundItem?.contact,
        found_item_image: foundItem?.image_path
      };
    }).sort((a, b) => b.match_score - a.match_score);
  }

  // Update match status
  static updateStatus(id, status) {
    return Database.updateMatch(id, { status });
  }

  // Delete match
  static delete(id) {
    const matches = Database.getMatches();
    const filtered = matches.filter(match => match.id !== id);
    if (filtered.length !== matches.length) {
      Database.saveMatches(filtered);
      return true;
    }
    return false;
  }

  // Check if match already exists
  static exists(lostItemId, foundItemId) {
    const matches = Database.getMatches();
    return matches.some(match => 
      match.lost_item_id === lostItemId && match.found_item_id === foundItemId
    );
  }

  // Get match statistics
  static getStats() {
    const matches = Database.getMatches();
    
    const stats = {
      total_matches: matches.length,
      confirmed_matches: matches.filter(m => m.status === 'confirmed').length,
      pending_matches: matches.filter(m => m.status === 'pending').length,
      rejected_matches: matches.filter(m => m.status === 'rejected').length,
      avg_match_score: matches.length > 0 ? 
        matches.reduce((sum, m) => sum + m.match_score, 0) / matches.length : 0
    };
    
    return stats;
  }
}

module.exports = Match;
