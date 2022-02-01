'use strict';
module.exports = (sequelize, DataTypes) => {
  const FarmUnit = sequelize.define('FarmUnit', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    farm_product: DataTypes.STRING,
    is_alive: DataTypes.BOOLEAN,
    is_feedable: DataTypes.BOOLEAN,
    health_value: DataTypes.INTEGER,
  }, {timestamps: false});

  FarmUnit.associate = (models) => {
    FarmUnit.belongsTo(models.farmbuilding, { foreignKey: 'farmbuildingId' });
  };

  return FarmUnit;
};