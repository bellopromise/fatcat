const { Router } = require('express');

const router = Router();

const farmUnit = require('../controllers/farmUnitController');

router.route('/').get(farmUnit.getFarmUnits).post(farmUnit.addFarmUnitToFarmBuilding);
router.route('/:id').get(farmUnit.getFarmUnit).patch(farmUnit.feedFarmUnit).delete(farmUnit.deleteFarmUnit);

module.exports = router;
