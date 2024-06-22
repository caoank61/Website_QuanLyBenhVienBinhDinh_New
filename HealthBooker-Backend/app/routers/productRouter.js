const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');

router.get('/search', ProductController.searchProducts);
router.post('/add', ProductController.addProduct);
router.put('/update/:id', ProductController.updateProduct);
router.delete('/delete/:id', ProductController.deleteProduct);
router.get('/:id', ProductController.getProductById);
router.get('/', ProductController.getAllProducts);
router.get('/user/:id', ProductController.getProductsByUser);

module.exports = router;
