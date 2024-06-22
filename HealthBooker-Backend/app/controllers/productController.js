const db = require('../config/db');

// Thêm hàng hóa mới
exports.addProduct = async (req, res) => {
    try {
        const { name, price, quantity, status, itemStatus, id_product_type, id_users, image } = req.body;

        // Kiểm tra xem tên sản phẩm đã tồn tại trong cơ sở dữ liệu chưa
        const [existingProducts] = await db.execute('SELECT id FROM products WHERE name = ?', [name]);
        if (existingProducts.length > 0) {
            return res.status(200).json({ message: 'Tên dịch vụ đã tồn tại' });
        }

        // Tiến hành thêm sản phẩm mới
        const [result] = await db.execute(
            'INSERT INTO products (name, price, quantity, status, item_status, id_product_type, id_user, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, price, quantity, status, itemStatus, id_product_type, id_users, image]
        );
        res.status(200).json({ id: result.insertId, name, price, quantity, status, itemStatus, id_product_type, id_users, image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding product' });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        // Lấy thông tin hiện tại của sản phẩm từ cơ sở dữ liệu
        const [currentProduct] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
        if (currentProduct.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Lấy dữ liệu mới từ req.body
        const { name, price, quantity, status, itemStatus, id_product_type, id_user, image } = req.body;

        // Kiểm tra xem tên sản phẩm mới không trùng với các tên sản phẩm khác (trừ chính sản phẩm đang cập nhật)
        if (name !== undefined) {
            const [existingProducts] = await db.execute('SELECT id FROM products WHERE name = ? AND id != ?', [name, id]);
            if (existingProducts.length > 0) {
                return res.status(200).json({ message: 'Tên dịch vụ đã tồn tại' });
            }
        }

        // Tạo một đối tượng chứa các trường dữ liệu mới cần cập nhật
        const updatedFields = {};
        // So sánh và cập nhật các trường dữ liệu mới
        if (name !== undefined && name !== currentProduct[0].name) {
            updatedFields.name = name;
        }
        if (price !== undefined && price !== currentProduct[0].price) {
            updatedFields.price = price;
        }
        if (quantity !== undefined && quantity !== currentProduct[0].quantity) {
            updatedFields.quantity = quantity;
        }
        if (status !== undefined && status !== currentProduct[0].status) {
            updatedFields.status = status;
        }
        if (itemStatus !== undefined && itemStatus !== currentProduct[0].item_status) {
            updatedFields.item_status = itemStatus;
        }
        if (id_product_type !== undefined && id_product_type !== currentProduct[0].id_product_type) {
            updatedFields.id_product_type = id_product_type;
        }
        if (id_user !== undefined && id_user !== currentProduct[0].id_user) {
            updatedFields.id_user = id_user;
        }
        if (image !== undefined && image !== currentProduct[0].image) {
            updatedFields.image = image;
        }
        if (Object.keys(updatedFields).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }
        const values = Object.values(updatedFields);
        values.push(id);
        const updateQuery = `UPDATE products SET ${Object.keys(updatedFields).map(field => `${field} = ?`).join(', ')} WHERE id = ?`;
        await db.execute(updateQuery, values);
        res.status(200).json({ id, ...updatedFields });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product' });
    }
};


// Xóa hàng hóa
exports.deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        await db.execute('DELETE FROM products WHERE id = ?', [id]);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }
};

// Lấy thông tin hàng hóa theo ID với thông tin người dùng và loại sản phẩm
exports.getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const query = `
            SELECT p.*, u.username AS user_name, pt.name AS product_type_name
            FROM products p
            INNER JOIN users u ON p.id_user = u.id
            INNER JOIN product_types pt ON p.id_product_type = pt.id
            WHERE p.id = ?
        `;
        const [rows] = await db.execute(query, [id]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting product' });
    }
};

// Lấy tất cả hàng hóa
exports.getAllProducts = async (req, res) => {
    try {
        const query = `
            SELECT p.*, u.username AS user_name, pt.name AS product_type_name
            FROM products p
            INNER JOIN users u ON p.id_user = u.id
            INNER JOIN product_types pt ON p.id_product_type = pt.id
        `;
        const [rows] = await db.execute(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting products' });
    }
};

// Tìm kiếm hàng hóa
exports.searchProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const [rows] = await db.execute('SELECT * FROM products WHERE name LIKE ?', [`%${keyword}%`]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching products' });
    }
};

// Lấy thông tin hàng hóa theo ID người dùng
exports.getProductsByUser = async (req, res) => {
    try {
        const id_users = req.params.id;
        const query = `
            SELECT p.*, u.username AS user_name, pt.name AS product_type_name
            FROM products p
            INNER JOIN users u ON p.id_user = u.id
            INNER JOIN product_types pt ON p.id_product_type = pt.id
            WHERE p.id_user = ?
        `;
        const [rows] = await db.execute(query, [id_users]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting products by user id' });
    }
};