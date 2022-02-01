'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'FarmUnits',
      [
        {
          farm_product: 'Rice',
          is_alive: true,
          is_feedable: true,
          health_value: 100, 
          farmbuildingId: 1,  
          
        },
        {
          farm_product: 'Hay',
          is_alive: true,
          is_feedable: true,
          health_value: 75, 
          farmbuildingId: 1,  
        },
        {
          farm_product: 'Straw',
          is_alive: true,
          is_feedable: true,
          health_value: 90, 
          farmbuildingId: 2,  
        },
      ],

      {},
    );

  },

  async down (queryInterface, Sequelize) {
    
     await queryInterface.bulkDelete('FarmUnits', null, {});
     
  }
};
