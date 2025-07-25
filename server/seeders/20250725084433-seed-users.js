'use strict';

const bcrypt = require('bcryptjs'); // or `bcrypt`

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin',
        email: 'admin@gmail.com',
        password: bcrypt.hashSync('12345', 10),
        role: 1,
        status: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Teacher',
        email: 'teacher@gmail.com',
        password: bcrypt.hashSync('12345', 10),
        role: 1,
        status: 1,
        createdAt: now,
        updatedAt: now,
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete('Users', {
      email: { [Op.in]: ['admin@gmail.com', 'teacher@gmail.com'] }
    }, {});
  }
};
