const db = require('../config/db');

// Thêm sân mới
exports.addCourt = async (req, res) => {
    try {
        const { name, id_areas, id_field_types, id_users, status, price, image, description } = req.body;
        
        // Kiểm tra xem tên đã tồn tại trong cơ sở dữ liệu chưa
        const [existingCourts] = await db.execute('SELECT id FROM courts WHERE name = ?', [name]);
        if (existingCourts.length > 0) {
            return res.status(200).json({ message: 'Tên sân đã tồn tại' });
        }

        // Tiến hành thêm mới
        const [result] = await db.execute(
            'INSERT INTO courts (name, id_areas, id_field_types, id_users, status, price, image, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, id_areas, id_field_types, id_users, status, price, image, description]
        );
        res.status(200).json({ id: result.insertId, name, id_areas, id_field_types, id_users, status, price, image, description });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding court' });
    }
};


// Sửa thông tin sân
exports.updateCourt = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = {}; // Đối tượng chứa các trường cần cập nhật

        // Lặp qua các trường trong req.body và chỉ cập nhật những trường có giá trị
        for (const key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                updates[key] = req.body[key];
            }
        }

        // Kiểm tra xem tên mới không trùng với các tên khác (trừ chính sân đang cập nhật)
        if (updates.hasOwnProperty('name')) {
            const [existingCourts] = await db.execute('SELECT id FROM courts WHERE name = ? AND id != ?', [updates.name, id]);
            if (existingCourts.length > 0) {
                return res.status(200).json({ message: 'Tên sân đã tồn tại' });
            }
        }

        const updateFields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const updateValues = Object.values(updates);

        await db.execute(
            `UPDATE courts SET ${updateFields} WHERE id = ?`,
            [...updateValues, id]
        );

        // Trả về thông tin đã cập nhật
        res.status(200).json({ id, ...updates });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating court' });
    }
};


// Xóa 
exports.deleteCourt = async (req, res) => {
    try {
        const id = req.params.id;
        await db.execute('DELETE FROM courts WHERE id = ?', [id]);
        res.status(200).json({ message: 'Court deleted successfully' });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            res.status(200).json({ message: 'Không thể xóa sân này vì đã có đặt lịch liên kết đến nó.' });
        } else {
            res.status(500).json({ message: 'Error deleting court' });
        }
    }
};


// Lấy thông tin theo id
exports.getCourtById = async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await db.execute(`
            SELECT courts.*, field_types.type AS field_type, areas.name AS area, users.username AS user_name
            FROM courts
            LEFT JOIN field_types ON courts.id_field_types = field_types.id
            LEFT JOIN areas ON courts.id_areas = areas.id
            LEFT JOIN users ON courts.id_users = users.id
            WHERE courts.id = ?
        `, [id]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Court not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting court' });
    }
};

// Lấy tất cả 
exports.getAllCourts = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT courts.*, field_types.type AS field_type, areas.name AS area, users.username AS user_name
            FROM courts
            LEFT JOIN field_types ON courts.id_field_types = field_types.id
            LEFT JOIN areas ON courts.id_areas = areas.id
            LEFT JOIN users ON courts.id_users = users.id
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting courts' });
    }
};

// Tìm kiếm 
exports.searchCourts = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const [rows] = await db.execute('SELECT * FROM courts WHERE name LIKE ?', [`%${keyword}%`]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching courts' });
    }
};

// Cập nhật trạng thái phê duyệt của 
exports.updateApprovalStatus = async (req, res) => {
    try {
        const { approval_status } = req.body;
        const id = req.params.id;
        await db.execute('UPDATE courts SET approval_status = ? WHERE id = ?', [approval_status, id]);
        res.status(200).json({ id, approval_status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating approval status of court' });
    }
};

// Lấy thông tin theo id người dùng
exports.getCourtsByUserId = async (req, res) => {
    try {
        const id_users = req.params.id;
        const [rows] = await db.execute(`
            SELECT courts.*, field_types.type AS field_type, areas.name AS area, users.username AS user_name
            FROM courts
            LEFT JOIN field_types ON courts.id_field_types = field_types.id
            LEFT JOIN areas ON courts.id_areas = areas.id
            LEFT JOIN users ON courts.id_users = users.id
            WHERE courts.id_users = ?
        `, [id_users]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting courts by user id' });
    }
};

// Lấy thông tin theo id khu vực
exports.getCourtsByAreaId = async (req, res) => {
    try {
        const id_areas = req.params.id;
        const [rows] = await db.execute(`
            SELECT courts.*, field_types.type AS field_type, areas.name AS area, users.username AS user_name
            FROM courts
            LEFT JOIN field_types ON courts.id_field_types = field_types.id
            LEFT JOIN areas ON courts.id_areas = areas.id
            LEFT JOIN users ON courts.id_users = users.id
            WHERE courts.id_areas = ?
        `, [id_areas]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting courts by area id' });
    }
};
