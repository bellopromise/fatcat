'use strict';

module.exports = (sequelize, DataTypes) => {
  const farmbuilding = sequelize.define('farmbuilding', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    unit_count: DataTypes.INTEGER,
    unit_type: DataTypes.STRING,
  }, { timestamps: false});

  farmbuilding.associate = (models) => {
    farmbuilding.hasMany(models.FarmUnit, { as: 'FarmUnits' });
  };
  return farmbuilding;
};
