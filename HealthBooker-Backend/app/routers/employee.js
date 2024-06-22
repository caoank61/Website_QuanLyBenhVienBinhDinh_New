const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/middleware');
const employeeController = require('../controllers/employeeController');

router.post('/addEmployee', verifyToken.checkLogin, employeeController.addEmployee);
router.put('/updateEmployee/:id', verifyToken.checkLogin, employeeController.updateEmployee);
router.delete('/deleteEmployee/:id', verifyToken.checkLogin, employeeController.deleteEmployee);
router.get('/getAllEmployees', verifyToken.checkLogin, employeeController.getAllEmployees);
router.get('/getEmployeeById/:id', verifyToken.checkLogin, employeeController.getEmployeeById);
router.get('/getEmployeeByUserId/:userId', verifyToken.checkLogin, employeeController.getEmployeeByUserId);

module.exports = router;
