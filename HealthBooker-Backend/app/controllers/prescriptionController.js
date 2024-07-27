const db = require('../config/db');

// Thêm đơn thuốc mới với nhiều thuốc
exports.addPrescription = async (req, res) => {
    const connection = await db.getConnection(); // Sử dụng transaction
    try {
        const { user_id, doctor_id, notes, status, items } = req.body; // items: mảng các loại thuốc với chi tiết

        await connection.beginTransaction();

        // Chèn vào bảng prescriptions
        const [prescriptionResult] = await connection.execute(
            'INSERT INTO prescriptions (user_id, doctor_id, notes, status) VALUES (?, ?, ?, ?)',
            [user_id, doctor_id, notes, status || 'active']
        );

        const prescriptionId = prescriptionResult.insertId;

        // Chèn vào bảng prescription_items
        for (const item of items) {
            const { drug_id, dosage, frequency, quantity } = item;
            await connection.execute(
                'INSERT INTO prescription_items (prescription_id, drug_id, dosage, frequency, quantity) VALUES (?, ?, ?, ?, ?)',
                [prescriptionId, drug_id, dosage, frequency, quantity]
            );
        }

        await connection.commit();
        res.status(200).json({ prescriptionId, user_id, doctor_id, notes, status, items });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error adding prescription' });
    } finally {
        connection.release();
    }
};

// Cập nhật thông tin đơn thuốc và các thuốc trong đơn
exports.updatePrescription = async (req, res) => {
    const connection = await db.getConnection(); // Sử dụng transaction
    try {
        const prescriptionId = req.params.id;
        const { user_id, doctor_id, notes, status, items } = req.body;

        await connection.beginTransaction();

        // Cập nhật bảng prescriptions
        await connection.execute(
            'UPDATE prescriptions SET user_id = ?, doctor_id = ?, notes = ?, status = ? WHERE id = ?',
            [user_id, doctor_id, notes, status, prescriptionId]
        );

        // Xóa các mục hiện tại của prescription_items
        await connection.execute('DELETE FROM prescription_items WHERE prescription_id = ?', [prescriptionId]);

        // Chèn các mục mới vào prescription_items
        for (const item of items) {
            const { drug_id, dosage, frequency, quantity } = item;
            await connection.execute(
                'INSERT INTO prescription_items (prescription_id, drug_id, dosage, frequency, quantity) VALUES (?, ?, ?, ?, ?)',
                [prescriptionId, drug_id, dosage, frequency, quantity]
            );
        }

        await connection.commit();
        res.status(200).json({ prescriptionId, user_id, doctor_id, notes, status, items });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error updating prescription' });
    } finally {
        connection.release();
    }
};

// Xóa đơn thuốc và các thuốc trong đơn
exports.deletePrescription = async (req, res) => {
    const connection = await db.getConnection(); // Sử dụng transaction
    try {
        const prescriptionId = req.params.id;

        await connection.beginTransaction();

        // Xóa các mục của prescription_items trước
        await connection.execute('DELETE FROM prescription_items WHERE prescription_id = ?', [prescriptionId]);

        // Sau đó xóa prescription
        await connection.execute('DELETE FROM prescriptions WHERE id = ?', [prescriptionId]);

        await connection.commit();
        res.status(200).json({ message: 'Prescription deleted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Error deleting prescription' });
    } finally {
        connection.release();
    }
};

// Lấy thông tin đơn thuốc theo ID cùng với các thuốc trong đơn
exports.getPrescriptionById = async (req, res) => {
    try {
        const prescriptionId = req.params.id;

        const [prescription] = await db.execute('SELECT * FROM prescriptions WHERE id = ?', [prescriptionId]);
        if (prescription.length === 0) {
            return res.status(404).json({ message: 'Prescription not found' });
        }

        const [items] = await db.execute('SELECT * FROM prescription_items WHERE prescription_id = ?', [prescriptionId]);

        res.status(200).json({ ...prescription[0], items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting prescription' });
    }
};

// Lấy tất cả đơn thuốc cùng với các thuốc trong từng đơn
exports.getAllPrescriptions = async (req, res) => {
    try {
        const [prescriptions] = await db.execute('SELECT * FROM prescriptions');

        // Lấy các thuốc cho mỗi đơn thuốc và thông tin bệnh nhân, bác sĩ
        const prescriptionsWithItems = await Promise.all(
            prescriptions.map(async (prescription) => {
                // Lấy tên bệnh nhân và tên bác sĩ
                const [patientResult] = await db.execute('SELECT username FROM users WHERE id = ?', [prescription.user_id]);
                const [doctorResult] = await db.execute('SELECT username FROM users WHERE id = ?', [prescription.doctor_id]);
                console.log(patientResult)
                // Lấy các thuốc của đơn thuốc
                const [items] = await db.execute('SELECT pi.*, d.name AS drug_name FROM prescription_items pi JOIN drugs d ON pi.drug_id = d.id WHERE pi.prescription_id = ?', [prescription.id]);

                return {
                    ...prescription,
                    patient_name: patientResult.length > 0 ? patientResult[0].username : '',
                    doctor_name: doctorResult.length > 0 ? doctorResult[0].username : '',
                    items
                };
            })
        );

        res.status(200).json(prescriptionsWithItems);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting prescriptions' });
    }
};

