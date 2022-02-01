/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable no-promise-executor-return */
/* eslint-disable max-len */
/* eslint-disable consistent-return */
const { farmbuilding, FarmUnit } = require('../models');
const config = require('../config/configHealthAndFeed');

const countdownToFeedUnits = {}; // Countdowns for units losing health
const intervalsToFeedUnits = {}; // Countdowns for buildings to feed all units

// get all farm units
exports.getFarmUnits = async (req, res) => {
  const farmUnits = await FarmUnit.findAll({ attributes: ['id', 'farm_product', 'is_feedable', 'is_alive', 'health_value'] });
  res.status(200).json(farmUnits);
};

// get farm unit filtered by Id
exports.getFarmUnit = async (req, res) => {
  const { id } = req.params;
  const farmUnit = await FarmUnit.findOne({ where: { id }, attributes: ['id', 'farm_product', 'is_feedable', 'is_alive', 'health_value'] });
  if (!farmUnit) return res.status(400).send({ message: 'Farm unit could not be found' });
  res.status(200).json(farmUnit);
};

// delete farm unit
exports.deleteFarmUnit = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send({ message: 'Please provide a id for the unit you are trying to delete!' });
  // get the farm unit and building by the id
  const farmUnit = await FarmUnit.findOne({ where: { id }, attributes: ['id', 'farm_product', 'is_alive', 'health_value', 'is_feedable', 'farmbuildingId'] });
  if (!farmUnit) return res.status(400).send({ message: 'Farm unit could not be found' });
  const theFarmBuilding = await farmbuilding.findOne({ where: { id: farmUnit.farmbuildingId }, attributes: ['id', 'name', 'unit_type', 'unit_count'] });
  // decrement the unit count, clear the interval of the countdown to feed the units, then delete the unit
  try {
    if (farmUnit.is_alive) {
      if (theFarmBuilding) await farmbuilding.update({ unit_count: theFarmBuilding.unit_count - 1 }, { where: { id: theFarmBuilding.id } });
      clearInterval(countdownToFeedUnits[String(farmUnit.id)]);
      delete countdownToFeedUnits[String(farmUnit.id)];
    }
    await farmUnit.destroy();
    return res.send({ message: 'FarmUnit has been deleted!' });
  } catch (err) { return res.status(500).send({ message: `Error: ${err.message}` }); }
};

// feed farm unit
exports.feedFarmUnit = async (req, res) => {
  const { id } = req.params;
  const farmUnit = await FarmUnit.findOne({ where: { id }, attributes: ['id', 'farm_product', 'is_alive', 'is_feedable', 'health_value', 'is_feedable'] });
  // return an error if the feedable state is false for multiple requests
  if (!farmUnit.is_feedable) return res.status(400).send({ message: 'Farm unit is not feedable' });
  // manually feed the unit with 1 health value and set the feedable state to false
  await FarmUnit.update({ health_value: farmUnit.health_value + config.manualFeedingValue, is_feedable: false }, { where: { id } });
  // wait for the designated time
  await new Promise((result) => setTimeout(result, config.intervalForUnfeedableUnit));
  // revert the feedable state back after wait
  await FarmUnit.update({ is_feedable: true }, { where: { id } });
  res.status(200).json({ success: true, message: 'farm unit has been fed' });
};

// add unit to farm building
exports.addFarmUnitToFarmBuilding = async (req, res) => {
  // get the farmBuilding for the unit to be added to
  const { farm_product, farmbuildingId } = req.body;
  const theFarmBuilding = await farmbuilding.findOne({ where: { id: farmbuildingId } });
  // check if the unit type of the building corresponds to the farm product name of the unit
  if (!theFarmBuilding.unit_type.includes(farm_product)) return res.status(400).send({ message: 'Farm product name does not correlate with the unit type of farm building' });
  // sets the random number between the maximum and minimum value
  const health_value = Math.floor(Math.random() * (config.maximumHealthValue - config.minimumHealthValue + 1) + config.minimumHealthValue);
  const farmUnit = {
    farm_product, health_value, is_alive: true, farmbuildingId, is_feedable: true,
  };
  const savedFarmUnit = await FarmUnit.create(farmUnit);
  // set the intervals to add units
  intervalsToFeedUnits[String(savedFarmUnit.farmbuildingId)] = {};
  intervalsToFeedUnits[String(savedFarmUnit.farmbuildingId)][String(savedFarmUnit.id)] = 0;
  // set the countdown, kill the unit if the health value is zero, then clear the intervals
  countdownToFeedUnits[String(savedFarmUnit.id)] = setInterval(async () => {
    const unitToUpdate = await FarmUnit.findOne({ where: { id: savedFarmUnit.id } });
    if (unitToUpdate.health_value - config.lostHealthValue <= 0) {
      await FarmUnit.update({ health_value: 0, is_alive: false, is_feedable: false }, { where: { id: unitToUpdate.id } });
      await farmbuilding.update({ unit_count: theFarmBuilding.unit_count - 1 }, { where: { id: theFarmBuilding.id } });
      clearInterval(countdownToFeedUnits[String(unitToUpdate.id)]);
      delete countdownToFeedUnits[String(unitToUpdate.id)];
      delete intervalsToFeedUnits[String(unitToUpdate.farmbuildingId)][String(unitToUpdate.id)];
    } else {
      console.log({ health_value: Number(unitToUpdate.health_value) - config.lostHealthValue, id: Number(unitToUpdate.id) });
      await FarmUnit.update({ health_value: Number(unitToUpdate.health_value) - config.lostHealthValue }, { where: { id: Number(unitToUpdate.id) } });
      intervalsToFeedUnits[String(unitToUpdate.farmbuildingId)][String(unitToUpdate.id)] += config.lostHealthValue;
    }
  }, config.intervalToFeedUnit);
  await farmbuilding.update({ unit_count: theFarmBuilding.unit_count + 1 }, { where: { id: theFarmBuilding.id } });
  res.status(201).json({ savedFarmUnit });
};
