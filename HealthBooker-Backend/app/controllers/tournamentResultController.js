const db = require('../config/db');

// Thêm kết quả giải đấu
exports.addTournamentResult = async (req, res) => {
    try {
        const { tournament_id, result_info, image } = req.body;
        const [result] = await db.execute('INSERT INTO tournament_results (tournament_id, result_info, image) VALUES (?, ?, ?)', [tournament_id, result_info, image]);
        res.status(200).json({ id: result.insertId, tournament_id, result_info, image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding tournament result' });
    }
};

// Sửa kết quả giải đấu
exports.updateTournamentResult = async (req, res) => {
    try {
        const id = req.params.id;
        const { tournament_id, result_info, image } = req.body;
        let updateFields = [];
        let values = [];

        // Kiểm tra và xây dựng danh sách các trường cần cập nhật
        if (tournament_id !== undefined) {
            updateFields.push('tournament_id = ?');
            values.push(tournament_id);
        }
        if (result_info !== undefined) {
            updateFields.push('result_info = ?');
            values.push(result_info);
        }
        if (image !== undefined) {
            updateFields.push('image = ?');
            values.push(image);
        }

        // Kiểm tra xem có trường cần cập nhật không
        if (updateFields.length === 0) {
            return res.status(400).json({ message: 'No fields provided for update' });
        }

        // Thực hiện truy vấn cập nhật
        const query = `UPDATE tournament_results SET ${updateFields.join(', ')} WHERE id = ?`;
        values.push(id);
        await db.execute(query, values);
        
        res.status(200).json({ id, tournament_id, result_info, image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating tournament result' });
    }
};


// Xóa kết quả giải đấu
exports.deleteTournamentResult = async (req, res) => {
    try {
        const id = req.params.id;
        await db.execute('DELETE FROM tournament_results WHERE id = ?', [id]);
        res.status(200).json({ message: 'Tournament result deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting tournament result' });
    }
};

// Lấy thông tin kết quả giải đấu theo id
exports.getTournamentResultById = async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await db.execute('SELECT * FROM tournament_results WHERE tournament_id = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(200).json({ message: 'Tournament result not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting tournament result' });
    }
};

// Lấy tất cả kết quả giải đấu
exports.getAllTournamentResults = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT tr.*, t.name AS tournament_name 
            FROM tournament_results tr
            INNER JOIN tournaments t ON tr.tournament_id = t.id
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting tournament results' });
    }
};


// Tìm kiếm kết quả giải đấu
exports.searchTournamentResults = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const [rows] = await db.execute('SELECT * FROM tournament_results WHERE result_info LIKE ?', [`%${keyword}%`]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching tournament results' });
    }
};


// Lấy kết quả giải đấu theo id người dùng
exports.getTournamentResultsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const [rows] = await db.execute(`
            SELECT tr.*, t.name AS tournament_name 
            FROM tournament_results tr
            INNER JOIN tournaments t ON tr.tournament_id = t.id
            WHERE t.id_users = ?
        `, [userId]);
       
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting tournament results by user id' });
    }
};