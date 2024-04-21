const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Hash the password before inserting
    const hashedPassword = await bcrypt.hash('Yash1@', 10);

    // Insert user data with hashed password
    await queryInterface.bulkInsert('users', [
      {
        username: 'Yash Arora',
        email: 'yasharora2678@gmail.com',
        password: hashedPassword,
        isAdmin: true,
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    // Remove all users
    await queryInterface.bulkDelete('users', null, {});
  }
};
