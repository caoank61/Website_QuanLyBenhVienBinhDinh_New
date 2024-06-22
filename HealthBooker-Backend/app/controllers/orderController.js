const db = require('../config/db');

// Đặt hàng sản phẩm
exports.placeOrder = async (req, res) => {
    try {
        const { productId, quantity, totalPrice, paymentMethod } = req.body;
        const userId = req.user.id; // Giả sử có thông tin người dùng được gửi kèm trong req

        // Thêm thông tin đơn hàng vào cơ sở dữ liệu
        const [result] = await db.execute('INSERT INTO orders (user_id, product_id, quantity, total_price, payment_method) VALUES (?, ?, ?, ?, ?)', [userId, productId, quantity, totalPrice, paymentMethod]);

        res.status(200).json({ id: result.insertId, userId, productId, quantity, totalPrice, paymentMethod });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error placing order' });
    }
};

// Xem lịch sử mua hàng của người dùng
exports.viewOrderHistory = async (req, res) => {
    try {
        const userId = req.user.id; // Giả sử có thông tin người dùng được gửi kèm trong req

        // Lấy thông tin lịch sử đơn hàng từ cơ sở dữ liệu
        const [rows] = await db.execute('SELECT * FROM orders WHERE user_id = ?', [userId]);

        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting order history' });
    }
};


// Lấy tất cả các đơn hàng
exports.getAllOrders = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM orders');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting orders' });
    }
};

// Lấy đơn hàng theo ID
exports.getOrderById = async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await db.execute('SELECT * FROM orders WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting order' });
    }
};

// Tìm kiếm đơn hàng
exports.searchOrders = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const [rows] = await db.execute('SELECT * FROM orders WHERE id LIKE ?', [`%${keyword}%`]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching orders' });
    }
};