const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

router.get('/all', scheduleController.getAllSchedules);
router.get('/search', scheduleController.searchSchedules); 
router.post('/add', scheduleController.addSchedule);
router.put('/update/:id', scheduleController.updateSchedule);
router.delete('/delete/:id', scheduleController.deleteSchedule);
router.get('/:id', scheduleController.getScheduleById);

module.exports = router;
