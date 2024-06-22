const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

// API đặt hàng sản phẩm
router.post('/place-order', OrderController.placeOrder);

// API xem lịch sử mua hàng
router.get('/order-history', OrderController.viewOrderHistory);

module.exports = router;
