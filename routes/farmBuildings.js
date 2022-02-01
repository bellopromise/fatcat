const { Router } = require('express');

const router = Router();
const farmBuilding = require('../controllers/farmBuildingController');

router.route('/').get(farmBuilding.getFarmBuildings).post(farmBuilding.createFarmBuilding);
router.route('/:id').get(farmBuilding.getFarmBuilding).delete(farmBuilding.deleteFarmBuilding);

module.exports = router;
