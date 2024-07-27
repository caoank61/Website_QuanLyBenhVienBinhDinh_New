const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');

// Thêm đơn thuốc mới
router.post('/', prescriptionController.addPrescription);

// Cập nhật đơn thuốc theo ID
router.put('/:id', prescriptionController.updatePrescription);

// Xóa đơn thuốc theo ID
router.delete('/:id', prescriptionController.deletePrescription);

// Lấy thông tin đơn thuốc theo ID
router.get('/:id', prescriptionController.getPrescriptionById);

// Lấy tất cả đơn thuốc
router.get('/', prescriptionController.getAllPrescriptions);

module.exports = router;
