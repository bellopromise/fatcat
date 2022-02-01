'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('farmbuildings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      unit_count:{
        type: Sequelize.INTEGER
      },
      unit_type:{
        type: Sequelize.STRING
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('farmbuildings');
  }
};