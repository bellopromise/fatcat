'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FarmUnits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      farm_product: {
        type: Sequelize.STRING
      },
      is_alive: {
        type: Sequelize.BOOLEAN
      },
      is_feedable: {
        type: Sequelize.BOOLEAN
      },
      health_value: {
        type: Sequelize.INTEGER
      },
      farmbuildingId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'farmbuildings', 
          key: 'id', 
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FarmUnits');
  }
};