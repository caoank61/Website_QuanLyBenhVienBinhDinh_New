const db = require('../config/db');
const bcrypt = require('bcrypt');

const employeeController = {
    addEmployee: async (req, res) => {
        try {
            const { username, email, password, role, status, employeeCode, userId } = req.body;

            // Kiểm tra xem email đã tồn tại chưa
            const [checkEmailExist] = await db.execute('SELECT * FROM employees WHERE email = ?', [email]);
            if (checkEmailExist.length > 0) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Thêm nhân viên vào cơ sở dữ liệu
            const query = 'INSERT INTO employees (username, email, password, role, status, employee_code, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const values = [username, email, hashedPassword, role, status, employeeCode, userId];
            await db.execute(query, values);

            res.status(201).json({ message: 'Employee added successfully' });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    updateEmployee: async (req, res) => {
        try {
            const { username, email, role, status, employeeCode } = req.body;
            const employeeId = req.params.id;

            // Kiểm tra xem nhân viên có tồn tại không
            const [checkEmployeeExist] = await db.execute('SELECT * FROM employees WHERE id = ?', [employeeId]);
            if (checkEmployeeExist.length === 0) {
                return res.status(404).json({ message: 'Employee not found' });
            }

            // Cập nhật thông tin nhân viên
            const updateQuery = 'UPDATE employees SET username = ?, email = ?, role = ?, status = ?, employee_code = ? WHERE id = ?';
            const updatedValues = [username, email, role, status, employeeCode, employeeId];
            await db.execute(updateQuery, updatedValues);

            res.status(200).json({ message: 'Employee updated successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    deleteEmployee: async (req, res) => {
        try {
            const employeeId = req.params.id;

            // Kiểm tra xem nhân viên có tồn tại không
            const [checkEmployeeExist] = await db.execute('SELECT * FROM employees WHERE id = ?', [employeeId]);
            if (checkEmployeeExist.length === 0) {
                return res.status(404).json({ message: 'Employee not found' });
            }

            // Xóa nhân viên khỏi cơ sở dữ liệu
            await db.execute('DELETE FROM employees WHERE id = ?', [employeeId]);

            res.status(200).json({ message: 'Employee deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getAllEmployees: async (req, res) => {
        try {
            const [employees] = await db.execute('SELECT * FROM employees');
            res.status(200).json({ data: employees });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getEmployeeById: async (req, res) => {
        try {
            const employeeId = req.params.id;

            // Lấy thông tin của một nhân viên dựa trên ID
            const [employee] = await db.execute('SELECT * FROM employees WHERE id = ?', [employeeId]);

            if (employee.length === 0) {
                return res.status(404).json({ message: 'Employee not found' });
            }

            res.status(200).json({ data: employee[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    getEmployeeByUserId: async (req, res) => {
        try {
            const userId = req.params.userId;

            // Lấy thông tin của một nhân viên dựa trên ID của người dùng
            const [employee] = await db.execute('SELECT * FROM employees WHERE user_id = ?', [userId]);

            res.status(200).json({ data: employee });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = employeeController;
