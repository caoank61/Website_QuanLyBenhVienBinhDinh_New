const express = require('express');
const router = express.Router();
const DrugController = require('../controllers/drugController');

router.get('/search', DrugController.searchDrugs); 
router.post('/add', DrugController.addDrug);
router.put('/update/:id', DrugController.updateDrug);
router.delete('/delete/:id', DrugController.deleteDrug);
router.get('/:id', DrugController.getDrugById);
router.get('/', DrugController.getAllDrugs);

module.exports = router;
