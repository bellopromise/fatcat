'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'farmbuildings',
      [
        {
          name: 'Barn',
          unit_count: '0',
          unit_type: 'Hay',
        },
        {
          name: 'Storage House',
          unit_count: '0',
          unit_type: 'Beans',
        },
      ],

      {},
    );
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('farmbuildings', null, {});
    
  }
};
