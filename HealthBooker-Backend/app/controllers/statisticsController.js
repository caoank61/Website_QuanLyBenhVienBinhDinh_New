const db = require('../config/db');

// Thống kê số lượng bác sỹ và dịch vụ
exports.countCourtsAndServices = async (req, res) => {
    try {
        const [courts] = await db.execute('SELECT COUNT(*) AS totalCourts FROM courts');
        const [services] = await db.execute('SELECT COUNT(*) AS totalServices FROM products'); 
        res.status(200).json({ totalCourts: courts[0].totalCourts, totalServices: services[0].totalServices });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error counting courts and services' });
    }
};

// Thống kê số lượng khách hàng và lượt đặt lịch
exports.countCustomersAndBookings = async (req, res) => {
    try {
        const [customers] = await db.execute('SELECT COUNT(DISTINCT user_id) AS totalCustomers FROM bookings');
        const [bookings] = await db.execute('SELECT COUNT(*) AS totalBookings FROM bookings');
        res.status(200).json({ totalCustomers: customers[0].totalCustomers, totalBookings: bookings[0].totalBookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error counting customers and bookings' });
    }
};

// Thống kê doanh thu theo ngày, tháng, năm
exports.revenueStatistics = async (req, res) => {
    try {
        // Thống kê doanh thu theo ngày
        const [revenueByDay] = await db.execute('SELECT DATE(booking_date) AS date, SUM(total_amount) AS totalRevenue FROM bookings GROUP BY DATE(booking_date)');

        // Thống kê doanh thu theo tháng
        const [revenueByMonth] = await db.execute('SELECT YEAR(booking_date) AS year, MONTH(booking_date) AS month, SUM(total_amount) AS totalRevenue FROM bookings GROUP BY YEAR(booking_date), MONTH(booking_date)');

        // Thống kê doanh thu theo năm
        const [revenueByYear] = await db.execute('SELECT YEAR(booking_date) AS year, SUM(total_amount) AS totalRevenue FROM bookings GROUP BY YEAR(booking_date)');

        res.status(200).json({ revenueByDay, revenueByMonth, revenueByYear });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting revenue statistics' });
    }
};

exports.statistics = async (req, res) => {
    const userId = req.params.user_id;

    try {
        // Thực hiện truy vấn các bảng để lấy thông tin liên quan đến user_id cung cấp
        const [userData] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
        const [bookingData] = await db.execute('SELECT * FROM bookings INNER JOIN courts ON bookings.court_id = courts.id WHERE courts.id_users = ?', [userId]);
        const [orderData] = await db.execute('SELECT * FROM orders WHERE user_id = ?', [userId]);
        const [productData] = await db.execute('SELECT * FROM products WHERE id_user = ?', [userId]);
        const [courtData] = await db.execute('SELECT * FROM courts WHERE id_users = ?', [userId]);

        // Tổng hợp thông tin từ các bảng
        const statistics = {
            user: userData[0], // Thông tin người dùng
            bookings: bookingData, // Thông tin đặt lịch
            orders: orderData, // Thông tin đơn hàng
            products: productData, // Thông tin sản phẩm
            courts: courtData, // Thông tin sân tennis
            // Thêm các thông tin từ các bảng khác vào đây nếu cần
        };

        res.json(statistics);
    } catch (error) {
        console.error('Error retrieving statistics:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
