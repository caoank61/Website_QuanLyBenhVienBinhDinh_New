const db = require('../config/db');

const dashboardController = {
    getStatistics: async (req, res) => {
        try {
            // Đếm số lượng người dùng
            const [userCountResult] = await db.execute('SELECT COUNT(*) AS userCount FROM users');
            const userCount = userCountResult[0].userCount;

            // Tổng hợp dữ liệu và trả về cho client
            const statistics = {
                userCount,
            };

            res.status(200).json(statistics);
        } catch (error) {
            console.error('Error fetching statistics:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
};

module.exports = dashboardController;
