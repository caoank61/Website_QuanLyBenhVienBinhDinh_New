const express = require('express');
const router = express.Router();
const tournamentResultController = require('../controllers/TournamentResultController');

router.get('/tournament-results/:userId', tournamentResultController.getTournamentResultsByUser);

// Lấy thông tin kết quả giải đấu theo id
router.get('/:id', tournamentResultController.getTournamentResultById);

// Thêm kết quả giải đấu
router.post('/', tournamentResultController.addTournamentResult);

// Sửa kết quả giải đấu
router.put('/:id', tournamentResultController.updateTournamentResult);

// Xóa kết quả giải đấu
router.delete('/:id', tournamentResultController.deleteTournamentResult);


// Lấy tất cả kết quả giải đấu
router.get('/', tournamentResultController.getAllTournamentResults);

// Tìm kiếm kết quả giải đấu
router.get('/search', tournamentResultController.searchTournamentResults);

module.exports = router;
