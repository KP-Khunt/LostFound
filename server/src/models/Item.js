const Database = require('./database');

class Item {
  // Create a new item
  static create(itemData) {
    const { userId, type, name, description, category, location, dateOccurred, contact, imagePath } = itemData;
    
    const newItem = Database.addItem({
      user_id: userId,
      type,
      name,
      description,
      category,
      location,
      date_occurred: dateOccurred,
      contact,
      image_path: imagePath,
      status: 'active'
    });

    return newItem;
  }

  // Find item by ID
  static findById(id) {
    return Database.findItem({ id });
  }

  // Get all items with optional filters
  static getAll(filters = {}) {
    let items = Database.getItems();
    
    if (filters.type) {
      items = items.filter(item => item.type === filters.type);
    }
    
    if (filters.category) {
      items = items.filter(item => item.category === filters.category);
    }
    
    if (filters.status) {
      items = items.filter(item => item.status === filters.status);
    }
    
    if (filters.userId) {
      items = items.filter(item => item.user_id === filters.userId);
    }
    
    // Sort by created_at descending
    items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    if (filters.limit) {
      items = items.slice(0, filters.limit);
    }
    
    return items;
  }

  // Get recent items
  static getRecent(limit = 10) {
    const items = Database.getItems()
      .filter(item => item.status === 'active')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);
    
    return items;
  }

  // Update item
  static update(id, updates) {
    return Database.updateItem(id, updates);
  }

  // Delete item
  static delete(id) {
    return Database.deleteItem(id);
  }

  // Get user's items
  static getByUserId(userId) {
    return Database.getItems()
      .filter(item => item.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  // Search items
  static search(searchTerm) {
    const items = Database.getItems();
    const searchLower = searchTerm.toLowerCase();
    
    return items.filter(item => 
      item.name.toLowerCase().includes(searchLower) ||
      item.description.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower) ||
      item.location.toLowerCase().includes(searchLower)
    ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  // Get items for matching (opposite type)
  static getForMatching(type, category, location) {
    const oppositeType = type === 'lost' ? 'found' : 'lost';
    const items = Database.getItems();
    
    return items.filter(item => 
      item.type === oppositeType &&
      item.status === 'active' &&
      (item.category === category || item.location.toLowerCase().includes(location.toLowerCase()))
    ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
}

module.exports = Item;
