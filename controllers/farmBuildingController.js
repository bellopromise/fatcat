/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable camelcase */
const { farmbuilding, FarmUnit } = require('../models');
const config = require('../config/configHealthAndFeed');

const intervalsToFeedUnits = {};

// get all buildings
exports.getFarmBuildings = async (req, res) => {
  const farmBuildings = await farmbuilding.findAll({ attributes: ['id', 'name', 'unit_type', 'unit_count'], include: [{ model: FarmUnit, as: 'FarmUnits', attributes: ['id', 'health_value', 'is_alive'] }] });
  res.status(200).json(farmBuildings);
};

// get unique building
exports.getFarmBuilding = async (req, res) => {
  const { id } = req.params;
  const farmBuilding = await farmbuilding.findOne({ where: { id }, attributes: ['id', 'name', 'unit_type', 'unit_count'], include: [{ model: FarmUnit, as: 'FarmUnits', attributes: ['id', 'health_value', 'is_alive'] }] });
  if (!farmBuilding) return res.status(400).send({ message: 'Farm building could not be found' });
  res.status(200).json(farmBuilding);
};

// delete farm building
exports.deleteFarmBuilding = async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send({ message: 'Please provide a id for the building you are trying to delete!' });
  const farmBuilding = await farmbuilding.findOne({ where: { id }, attributes: ['id', 'name', 'unit_type', 'unit_count'] });
  if (!farmBuilding) return res.status(400).send({ message: 'Farm building could not be found' });
  try {
    // terminate the interval and delete
    if (intervalsToFeedUnits[String(farmBuilding.id)]) {
      clearInterval(intervalsToFeedUnits[String(farmBuilding.id)].interval);
      delete intervalsToFeedUnits[String(farmBuilding.id)];
    }
    await farmBuilding.destroy();
    return res.send({ message: 'FarmBuilding has been deleted!' });
  } catch (err) { return res.status(500).send({ message: `Error: ${err.message}` }); }
};

// create farm building
// eslint-disable-next-line max-len
exports.createFarmBuilding = async (req, res) => {
  const { name, unit_type } = req.body;
  const farmBuilding = { name, unit_type, unit_count: 0 };
  const savedFarmBuilding = await farmbuilding.create(farmBuilding);
  // store the intervals to feed units and feed and recharge half of the health with the existing one on the units
  intervalsToFeedUnits[String(savedFarmBuilding.id)] = {};
  intervalsToFeedUnits[String(savedFarmBuilding.id)].interval = setInterval(async () => {
    const theFarmBuilding = await farmbuilding.findOne({ where: { id: savedFarmBuilding.id }, attributes: ['id', 'unit_count'], include: [{ model: FarmUnit, as: 'FarmUnits', attributes: ['id', 'health_value', 'is_alive'] }] });

    let newHealth = 0;
    // recharge the health of unit
    await Promise.all(theFarmBuilding.FarmUnits.map(async (farmUnit) => {
      if (farmUnit.is_alive) {
        newHealth = Math.ceil(intervalsToFeedUnits[String(theFarmBuilding.id)][String(farmUnit.id)] / 2);
        console.log(`Farm unit that has id of: ${farmUnit.id} has recharged ${newHealth} health, in building with the id of : ${theFarmBuilding.id}`);
        intervalsToFeedUnits[String(theFarmBuilding.id)][String(farmUnit.id)] = 0;
        await FarmUnit.update({ health_value: farmUnit.health_value + newHealth }, { where: { id: farmUnit.id } });
      }
    }));
  }, config.intervalToFeedBuilding);
  res.status(201).json(savedFarmBuilding);
};
