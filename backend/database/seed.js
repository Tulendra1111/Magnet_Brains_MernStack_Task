const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Task = require('../models/Task');
const config = require('../config');

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@taskmanager.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'user123',
    role: 'user'
  }
];

const sampleTasks = [
  {
    title: 'Welcome to Task Manager',
    description: 'This is your first task! You can edit, complete, or delete it.',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    priority: 'High',
    status: 'Pending'
  },
  {
    title: 'Set up project documentation',
    description: 'Create comprehensive documentation for the project including API endpoints and user guides.',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    priority: 'Medium',
    status: 'Pending'
  },
  {
    title: 'Review code quality',
    description: 'Perform code review and ensure all best practices are followed.',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    priority: 'Low',
    status: 'Completed'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data...');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
      console.log(`Created user: ${user.name} (${user.email})`);
    }

    // Create tasks
    const adminUser = users.find(user => user.role === 'admin');
    const regularUser = users.find(user => user.role === 'user');

    for (let i = 0; i < sampleTasks.length; i++) {
      const taskData = sampleTasks[i];
      const assignedUser = i % 2 === 0 ? regularUser : adminUser; // Alternate assignment
      
      const task = new Task({
        ...taskData,
        assignedUser: assignedUser._id,
        createdBy: adminUser._id
      });
      
      await task.save();
      console.log(`Created task: ${task.title} (assigned to ${assignedUser.name})`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Sample Accounts:');
    console.log('Admin: admin@taskmanager.com / admin123');
    console.log('User: john@example.com / user123');
    console.log('User: jane@example.com / user123');
    console.log('\n🎉 You can now start the application!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
