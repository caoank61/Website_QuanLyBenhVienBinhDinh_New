const db = require('../config/db');

// Thêm thuốc mới
exports.addDrug = async (req, res) => {
    try {
        const { name, price, quantity, expiry_date, status, description, image } = req.body;

        // Kiểm tra xem tên thuốc đã tồn tại chưa
        const [existingDrugs] = await db.execute('SELECT id FROM drugs WHERE name = ?', [name]);
        if (existingDrugs.length > 0) {
            return res.status(200).json({ message: 'Tên thuốc đã tồn tại' });
        }

        // Thêm thuốc mới
        const [result] = await db.execute(
            'INSERT INTO drugs (name, price, quantity, expiry_date, status, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, price, quantity, expiry_date, status, description, image]
        );
        res.status(200).json({ id: result.insertId, name, price, quantity, expiry_date, status, description, image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding drug' });
    }
};

// Cập nhật thông tin thuốc
exports.updateDrug = async (req, res) => {
    try {
        const id = req.params.id;

        // Lấy thông tin hiện tại của thuốc
        const [currentDrug] = await db.execute('SELECT * FROM drugs WHERE id = ?', [id]);
        if (currentDrug.length === 0) {
            return res.status(404).json({ message: 'Drug not found' });
        }

        const { name, price, quantity, expiry_date, status, description, image } = req.body;

        // Kiểm tra tên thuốc mới
        if (name !== undefined) {
            const [existingDrugs] = await db.execute('SELECT id FROM drugs WHERE name = ? AND id != ?', [name, id]);
            if (existingDrugs.length > 0) {
                return res.status(200).json({ message: 'Tên thuốc đã tồn tại' });
            }
        }

        // Cập nhật các trường dữ liệu mới
        const updatedFields = {};
        if (name !== undefined && name !== currentDrug[0].name) {
            updatedFields.name = name;
        }
        if (price !== undefined && price !== currentDrug[0].price) {
            updatedFields.price = price;
        }
        if (quantity !== undefined && quantity !== currentDrug[0].quantity) {
            updatedFields.quantity = quantity;
        }
        if (expiry_date !== undefined && expiry_date !== currentDrug[0].expiry_date) {
            updatedFields.expiry_date = expiry_date;
        }
        if (status !== undefined && status !== currentDrug[0].status) {
            updatedFields.status = status;
        }
        if (description !== undefined && description !== currentDrug[0].description) {
            updatedFields.description = description;
        }
        if (image !== undefined && image !== currentDrug[0].image) {
            updatedFields.image = image;
        }
        
        if (Object.keys(updatedFields).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const values = Object.values(updatedFields);
        values.push(id);

        const updateQuery = `UPDATE drugs SET ${Object.keys(updatedFields).map(field => `${field} = ?`).join(', ')} WHERE id = ?`;
        await db.execute(updateQuery, values);

        res.status(200).json({ id, ...updatedFields });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating drug' });
    }
};

// Xóa thuốc
exports.deleteDrug = async (req, res) => {
    try {
        const id = req.params.id;
        await db.execute('DELETE FROM drugs WHERE id = ?', [id]);
        res.status(200).json({ message: 'Drug deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting drug' });
    }
};

// Lấy thông tin thuốc theo ID
exports.getDrugById = async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await db.execute('SELECT * FROM drugs WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Drug not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting drug' });
    }
};

// Lấy tất cả thông tin thuốc
exports.getAllDrugs = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM drugs');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting drugs' });
    }
};

// Tìm kiếm thuốc
exports.searchDrugs = async (req, res) => {
    try {
        const keyword = req.query.keyword; 
        const query = `
            SELECT * FROM drugs 
            WHERE name LIKE ? OR description LIKE ? OR status LIKE ?
        `;
        const [rows] = await db.execute(query, [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching drugs' });
    }
};
