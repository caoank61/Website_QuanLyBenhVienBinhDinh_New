const express = require('express');
const router = express.Router();
const ProductTypeController = require('../controllers/productTypeController');


router.get('/search', ProductTypeController.searchProductTypes);
router.post('/add', ProductTypeController.addProductType);
router.put('/update/:id', ProductTypeController.updateProductType);
router.delete('/delete/:id', ProductTypeController.deleteProductType);
router.get('/:id', ProductTypeController.getProductTypeById);
router.get('/', ProductTypeController.getAllProductTypes);

module.exports = router;
