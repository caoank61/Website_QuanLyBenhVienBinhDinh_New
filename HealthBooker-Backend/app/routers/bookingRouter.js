const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Đặt sân
router.post('/book', bookingController.bookCourt);

router.get('/revenue-report', bookingController.getRevenueReport);


// Xem lịch sử đặt sân
router.get('/history/:user_id', bookingController.getBookingHistory);

// Lấy thông tin đặt sân theo court_id
router.get('/court/:court_id', bookingController.getBookingByCourtId);

// API cập nhật trạng thái đặt sân
router.put('/:id/update-status', bookingController.updateBookingStatus);

router.get('/user/:user_id', bookingController.getBookingByUserID);
router.get('/userCourts/:user_id', bookingController.getBookingByUserCourtsID);


router.get('/:id', bookingController.getBookingByID);

module.exports = router;
