const { connectDB, disconnectDB } = require('./connection');
const { seedDatabase } = require('./seed');

module.exports = {
  connectDB,
  disconnectDB,
  seedDatabase
};
