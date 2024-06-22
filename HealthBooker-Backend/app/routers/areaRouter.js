const express = require('express');
const router = express.Router();
const AreaController = require('../controllers/areaController');

router.get('/search', AreaController.searchAreas);
router.post('/add', AreaController.addArea);
router.put('/update/:id', AreaController.updateArea);
router.delete('/delete/:id', AreaController.deleteArea);
router.get('/:id', AreaController.getAreaById);
router.get('/', AreaController.getAllAreas);

module.exports = router;
