'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const classData = [];

    for (let i = 1; i <= 10; i++) {
      classData.push({
        name: `Class ${i}`,
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await queryInterface.bulkInsert('Classes', classData);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Classes', null, {});
  }
};
