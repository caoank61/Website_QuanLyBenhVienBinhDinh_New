const express = require('express');
const router = express.Router();
const FieldTypeController = require('../controllers/fieldTypeController');


router.get('/search', FieldTypeController.searchFieldTypes);
router.post('/add', FieldTypeController.addFieldType);
router.put('/update/:id', FieldTypeController.updateFieldType);
router.delete('/delete/:id', FieldTypeController.deleteFieldType);
router.get('/:id', FieldTypeController.getFieldTypeById);
router.get('/', FieldTypeController.getAllFieldTypes);

module.exports = router;
