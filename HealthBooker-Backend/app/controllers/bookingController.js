const db = require('../config/db');
const moment = require('moment');

exports.getRevenueReport = async (req, res) => {
    try {
        const { start_date, end_date, user_id } = req.query;

        // Validate date format
        if (!moment(start_date, 'YYYY-MM-DD', true).isValid() || !moment(end_date, 'YYYY-MM-DD', true).isValid()) {
            return res.status(400).json({ message: 'Invalid date format. Please use YYYY-MM-DD.' });
        }

        let query = `
            SELECT 
                courts.name AS court_name,
                COUNT(bookings.id) AS booking_count,
                SUM(bookings.total_amount) AS total_revenue
            FROM bookings
            INNER JOIN courts ON bookings.court_id = courts.id
            WHERE bookings.booking_date BETWEEN ? AND ?
        `;

        const params = [start_date, end_date];

        // Check if user_id is provided
        if (user_id) {
            query += ' AND courts.id_users = ?';
            params.push(user_id);
        }

        query += ' GROUP BY courts.name';

        const [rows] = await db.execute(query, params);

        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating detailed revenue report' });
    }
};


exports.bookCourt = async (req, res) => {
    try {
        const { user_id, court_id, booking_date, start_time, end_time, payment_method, total_amount } = req.body;

        // Lấy tất cả các đặt lịch trong khoảng thời gian này của lịch khám đó
        const [existingBookings] = await db.execute('SELECT * FROM bookings WHERE court_id = ? AND booking_date = ?', [court_id, booking_date]);
        
        // Kiểm tra xem khoảng thời gian mới có chồng lên bất kỳ đặt lịch nào khác không
        for (const booking of existingBookings) {
            const existingStartTime = moment(booking.start_time, 'HH:mm');
            const existingEndTime = moment(booking.end_time, 'HH:mm');

            const newStartTime = moment(start_time, 'HH:mm');
            const newEndTime = moment(end_time, 'HH:mm');

            // Kiểm tra xem thời gian đặt lịch mới có chồng lên thời gian của các đặt lịch khác không
            if (
                (newStartTime.isBetween(existingStartTime, existingEndTime, undefined, '[)') || 
                newEndTime.isBetween(existingStartTime, existingEndTime, undefined, '(]')) ||
                (existingStartTime.isBetween(newStartTime, newEndTime, undefined, '(]') ||
                existingEndTime.isBetween(newStartTime, newEndTime, undefined, '[)'))
            ) {
                return res.status(200).json({ message: 'Booking time conflicts with existing booking' });
            }
        }

        // Nếu không có xung đột, thêm đặt lịch mới vào cơ sở dữ liệu
        const [result] = await db.execute('INSERT INTO bookings (user_id, court_id, booking_date, start_time, end_time, payment_method, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?)', [user_id, court_id, booking_date, start_time, end_time, payment_method, total_amount]);
        res.status(200).json({ id: result.insertId, user_id, court_id, booking_date, start_time, end_time, payment_method, total_amount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error booking court' });
    }
};



// API xem lịch sử đặt lịch của người dùng
exports.getBookingHistory = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const [rows] = await db.execute(`
            SELECT bookings.*, courts.name
            FROM bookings
            INNER JOIN courts ON bookings.court_id = courts.id
            WHERE bookings.user_id = ?
        `, [user_id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting booking history' });
    }
};


// Cập nhật trạng thái đặt lịch
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const bookingId = req.params.id;

        await db.execute('UPDATE bookings SET status = ? WHERE id = ?', [status, bookingId]);

        res.status(200).json({ message: 'Booking status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating booking status' });
    }
};

// API lấy thông tin đặt lịch của một chủ sân dựa trên user_id
exports.getBookingByUserID = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        console.log(user_id)
        const [rows] = await db.execute(`
            SELECT 
                bookings.*, 
                courts.name AS court_name,
                users.username AS user_name,
                users.phone AS phone,
                owners.username AS owner_name
            FROM bookings
            INNER JOIN courts ON bookings.court_id = courts.id
            INNER JOIN users ON bookings.user_id = users.id
            INNER JOIN users AS owners ON courts.id_users = owners.id
            WHERE bookings.user_id = ? 
        `, [user_id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting booking by user id' });
    }
};

// API lấy thông tin đặt lịch của một chủ sân dựa trên user_id
exports.getBookingByUserCourtsID = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        console.log(user_id);
        const [rows] = await db.execute(`
            SELECT b.*, 
                   courts.name AS court_name, 
                   users.username AS user_name, 
                   users.phone AS phone, 
                   owners.username AS owner_name
            FROM bookings b
            INNER JOIN courts ON b.court_id = courts.id
            INNER JOIN users ON b.user_id = users.id
            INNER JOIN users AS owners ON courts.id_users = owners.id
            WHERE courts.id_users = ?
        `, [user_id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting booking by user id' });
    }
};



// API lấy thông tin đặt lịch theo court_id
exports.getBookingByCourtId = async (req, res) => {
    try {
        const court_id = req.params.court_id;
        const [rows] = await db.execute('SELECT * FROM bookings WHERE court_id = ?', [court_id]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting booking by court id' });
    }
};

// API lấy thông tin đặt lịch theo ID
exports.getBookingByID = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const [rows] = await db.execute(`
            SELECT 
                bookings.*, 
                courts.name AS court_name,
                users.username AS user_name,
                owners.username AS owner_name
            FROM bookings
            INNER JOIN courts ON bookings.court_id = courts.id
            INNER JOIN users ON bookings.user_id = users.id
            INNER JOIN users AS owners ON courts.id_users = owners.id
            WHERE bookings.id = ?
        `, [bookingId]);
        res.status(200).json(rows[0]); // Trả về kết quả đầu tiên, vì chỉ có một đặt lịch có ID tương ứng
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting booking by ID' });
    }
};
