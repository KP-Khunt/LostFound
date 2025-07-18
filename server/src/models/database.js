const fs = require('fs-extra');
const path = require('path');

// Data file paths
const dataDir = path.join(__dirname, '../../data');
const usersFile = path.join(dataDir, 'users.json');
const itemsFile = path.join(dataDir, 'items.json');
const matchesFile = path.join(dataDir, 'matches.json');

// Ensure data directory exists
fs.ensureDirSync(dataDir);

// Initialize data files
const initializeFiles = () => {
  if (!fs.existsSync(usersFile)) {
    fs.writeJsonSync(usersFile, []);
  }
  if (!fs.existsSync(itemsFile)) {
    fs.writeJsonSync(itemsFile, []);
  }
  if (!fs.existsSync(matchesFile)) {
    fs.writeJsonSync(matchesFile, []);
  }
};

// Database operations
class Database {
  // Users operations
  static getUsers() {
    return fs.readJsonSync(usersFile);
  }

  static saveUsers(users) {
    fs.writeJsonSync(usersFile, users);
  }

  static addUser(user) {
    const users = this.getUsers();
    const newUser = { ...user, id: Date.now() };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  static findUser(query) {
    const users = this.getUsers();
    return users.find(user => {
      return Object.keys(query).every(key => user[key] === query[key]);
    });
  }

  static updateUser(id, updates) {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.saveUsers(users);
      return true;
    }
    return false;
  }

  // Items operations
  static getItems() {
    return fs.readJsonSync(itemsFile);
  }

  static saveItems(items) {
    fs.writeJsonSync(itemsFile, items);
  }

  static addItem(item) {
    const items = this.getItems();
    const newItem = { ...item, id: Date.now(), created_at: new Date().toISOString() };
    items.push(newItem);
    this.saveItems(items);
    return newItem;
  }

  static findItem(query) {
    const items = this.getItems();
    return items.find(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  static updateItem(id, updates) {
    const items = this.getItems();
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      this.saveItems(items);
      return true;
    }
    return false;
  }

  static deleteItem(id) {
    const items = this.getItems();
    const filtered = items.filter(item => item.id !== id);
    if (filtered.length !== items.length) {
      this.saveItems(filtered);
      return true;
    }
    return false;
  }

  // Matches operations
  static getMatches() {
    return fs.readJsonSync(matchesFile);
  }

  static saveMatches(matches) {
    fs.writeJsonSync(matchesFile, matches);
  }

  static addMatch(match) {
    const matches = this.getMatches();
    const newMatch = { ...match, id: Date.now(), created_at: new Date().toISOString() };
    matches.push(newMatch);
    this.saveMatches(matches);
    return newMatch;
  }

  static findMatch(query) {
    const matches = this.getMatches();
    return matches.find(match => {
      return Object.keys(query).every(key => match[key] === query[key]);
    });
  }

  static updateMatch(id, updates) {
    const matches = this.getMatches();
    const index = matches.findIndex(match => match.id === id);
    if (index !== -1) {
      matches[index] = { ...matches[index], ...updates };
      this.saveMatches(matches);
      return true;
    }
    return false;
  }
}

// Initialize files
initializeFiles();

console.log('Database initialized successfully');
module.exports = Database;
