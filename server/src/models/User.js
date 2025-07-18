const Database = require('./database');
const bcrypt = require('bcryptjs');

class User {
  // Create a new user
  static async create(userData) {
    const { name, email, studentId, phone, password } = userData;
    
    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Check if user already exists
    const existingUser = Database.findUser({ email });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const existingStudentId = Database.findUser({ student_id: studentId });
    if (existingStudentId) {
      throw new Error('Student ID already exists');
    }

    const newUser = Database.addUser({
      name,
      email,
      student_id: studentId,
      phone,
      password_hash: passwordHash,
      created_at: new Date().toISOString()
    });

    return newUser;
  }

  // Find user by email
  static async findByEmail(email) {
    return Database.findUser({ email });
  }

  // Find user by ID
  static async findById(id) {
    return Database.findUser({ id });
  }

  // Find user by student ID
  static async findByStudentId(studentId) {
    return Database.findUser({ student_id: studentId });
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user
  static async update(id, updates) {
    return Database.updateUser(id, updates);
  }

  // Delete user
  static async delete(id) {
    const users = Database.getUsers();
    const filtered = users.filter(user => user.id !== id);
    if (filtered.length !== users.length) {
      Database.saveUsers(filtered);
      return true;
    }
    return false;
  }

  // Get all users (admin function)
  static async getAll() {
    return Database.getUsers().map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      student_id: user.student_id,
      phone: user.phone,
      created_at: user.created_at
    }));
  }
}

module.exports = User;
