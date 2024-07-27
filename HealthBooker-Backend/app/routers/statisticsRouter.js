const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

// Thống kê số lượng bác sỹ và dịch vụ
router.get('/count-courts-services', statisticsController.countCourtsAndServices);

// Thống kê số lượng khách hàng và lượt đặt lịch
router.get('/count-customers-bookings', statisticsController.countCustomersAndBookings);

// Thống kê doanh thu theo ngày, tháng, năm
router.get('/revenue-statistics', statisticsController.revenueStatistics);

router.get('/:user_id', statisticsController.statistics);

module.exports = router;
