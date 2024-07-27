const nodemailer = require('nodemailer');
const dbConfig = require('../config/db');

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: '587',
    auth: {
        user: 'h5studiogl@gmail.com',
        pass: 'fScdnZ4WmEDqjBA1',
    },
});

// Function to get user email by doctor_id
const getUserEmailByDoctorId = async (doctorId) => {
    try {
        const [rows] = await dbConfig.execute('SELECT email FROM users WHERE id=?', [doctorId]);
        if (rows.length > 0) {
            return rows[0].email;
        } else {
            return null; // Handle case where doctor_id doesn't exist or email isn't found
        }
    } catch (error) {
        console.error('Error getting user email by doctor_id:', error);
        throw error;
    }
};

// Function to get user id_users by doctor_id from courts table
const getUserIdByDoctorId = async (doctorId) => {
    try {
        const [rows] = await dbConfig.execute('SELECT id_users FROM courts WHERE id=?', [doctorId]);
        if (rows.length > 0) {
            return rows[0].id_users;
        } else {
            return null; // Handle case where doctor_id doesn't exist or id_users isn't found
        }
    } catch (error) {
        console.error('Error getting user id_users by doctor_id:', error);
        throw error;
    }
};

// Thêm lịch mới
const addSchedule = async (req, res) => {
    const { date, shift, doctor_id, department_id, start_time, end_time, note, status } = req.body;

    try {
        const [result] = await dbConfig.execute(
            'INSERT INTO schedules (date, shift, doctor_id, department_id, start_time, end_time, note, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [date, shift, doctor_id, department_id, start_time, end_time, note, status]
        );

        const newSchedule = {
            date,
            shift,
            doctor_id,
            department_id,
            start_time,
            end_time,
            note,
            status,
        };

        const id_users = await getUserIdByDoctorId(doctor_id);


        // Lấy userEmail từ doctor_id
        const userEmail = await getUserEmailByDoctorId(id_users);

        if (userEmail) {
            // Gửi email thông báo
            await transporter.sendMail({
                from: 'h5studiogl@gmail.com',
                to: userEmail,
                subject: 'Thông báo: Đã thêm lịch mới',
                text: `Bạn đã thêm lịch hẹn mới vào ngày ${date}`,
            });
        } else {
            console.error(`User email not found for doctor_id ${doctor_id}`);
            // Xử lý khi không tìm thấy email của người dùng
        }

        res.status(201).json(newSchedule);
    } catch (error) {
        console.error('Error adding schedule:', error);
        res.status(500).json({ message: 'Error adding schedule' });
    }
};

// Cập nhật lịch theo ID
const updateSchedule = async (req, res) => {
    const { id } = req.params;
    const { date, shift, doctor_id, department_id, start_time, end_time, note, status } = req.body;

    try {
        const [result] = await dbConfig.execute(
            'UPDATE schedules SET date=?, shift=?, doctor_id=?, department_id=?, start_time=?, end_time=?, note=?, status=? WHERE id=?',
            [date, shift, doctor_id, department_id, start_time, end_time, note, status, id]
        );

        if (result.affectedRows > 0) {
            const updatedSchedule = {
                id: parseInt(id),
                date,
                shift,
                doctor_id,
                department_id,
                start_time,
                end_time,
                note,
                status,
            };

            // Lấy userEmail từ doctor_id
            const id_users = await getUserIdByDoctorId(doctor_id);


            // Lấy userEmail từ doctor_id
            const userEmail = await getUserEmailByDoctorId(id_users);

            if (userEmail) {
                // Gửi email thông báo
                await transporter.sendMail({
                    from: 'h5studiogl@gmail.com',
                    to: userEmail,
                    subject: 'Thông báo: Đã cập nhật lịch hẹn',
                    text: `Bạn đã cập nhật lịch hẹn vào ngày ${date}`,
                });
            } else {
                console.error(`User email not found for doctor_id ${doctor_id}`);
                // Xử lý khi không tìm thấy email của người dùng
            }

            res.status(200).json(updatedSchedule);
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).json({ message: 'Error updating schedule' });
    }
};

// Xóa lịch theo ID
const deleteSchedule = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await dbConfig.execute('DELETE FROM schedules WHERE id=?', [id]);

        if (result.affectedRows > 0) {
            // Lấy userEmail từ doctor_id
            const [rows] = await dbConfig.execute('SELECT doctor_id FROM schedules WHERE id=?', [id]);
            const doctor_id = rows[0].doctor_id;
            const id_users = await getUserIdByDoctorId(doctor_id);
            const userEmail = await getUserEmailById(id_users);

            if (userEmail) {
                // Gửi email thông báo
                await transporter.sendMail({
                    from: 'h5studiogl@gmail.com',
                    to: userEmail,
                    subject: 'Thông báo: Đã xóa lịch hẹn',
                    text: `Bạn đã xóa lịch hẹn có ID ${id}`,
                });
            } else {
                console.error(`User email not found for doctor_id ${doctor_id}`);
                // Xử lý khi không tìm thấy email của người dùng
            }

            res.status(200).json({ message: 'Schedule deleted successfully' });
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (error) {
        console.error('Error deleting schedule:', error);
        res.status(500).json({ message: 'Error deleting schedule' });
    }
};

// Lấy lịch theo ID
const getScheduleById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await dbConfig.execute('SELECT * FROM schedules WHERE id=?', [id]);

        if (rows.length > 0) {
            const schedule = rows[0];
            res.status(200).json(schedule);
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (error) {
        console.error('Error getting schedule by ID:', error);
        res.status(500).json({ message: 'Error getting schedule by ID' });
    }
};

// Lấy tất cả lịch
const getAllSchedules = async (req, res) => {
    try {
        const [rows] = await dbConfig.execute(`
            SELECT s.*, c.name AS doctor_name, ft.type AS department_name
            FROM schedules s
            LEFT JOIN courts c ON s.doctor_id = c.id
            LEFT JOIN field_types ft ON s.department_id = ft.id
        `);

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error getting all schedules:', error);
        res.status(500).json({ message: 'Error getting all schedules' });
    }
};

// Tìm kiếm lịch
const searchSchedules = async (req, res) => {
    const { keyword } = req.query;
    try {
        const [rows] = await dbConfig.execute(
            'SELECT * FROM schedules WHERE date LIKE ? OR shift LIKE ? OR doctor_id LIKE ? OR department_id LIKE ? OR start_time LIKE ? OR end_time LIKE ? OR note LIKE ? OR status LIKE ?',
            Array(8).fill(`%${keyword}%`)
        );

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error searching schedules:', error);
        res.status(500).json({ message: 'Error searching schedules' });
    }
};

module.exports = {
    addSchedule,
    updateSchedule,
    deleteSchedule,
    getScheduleById,
    getAllSchedules,
    searchSchedules,
};
