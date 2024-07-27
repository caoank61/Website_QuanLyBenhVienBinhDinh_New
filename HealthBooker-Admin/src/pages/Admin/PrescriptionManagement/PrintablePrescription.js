import React from 'react';
import { Modal, Button } from 'antd';
import moment from 'moment';

const PrintablePrescription = ({ prescription, onClose }) => {
    return (
        <Modal
            visible={true} // Show the modal when printing
            width={800}
            footer={[
                <Button key="print" type="primary" onClick={() => window.print()}>
                    In đơn thuốc
                </Button>,
            ]}
            onCancel={onClose} // Handle close event
        >
            <div style={{ padding: '20px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Đơn thuốc</h2>
                <div style={{ marginBottom: '10px' }}>
                    <p><strong>Mã bệnh nhân:</strong> {prescription.user_id}</p>
                    <p><strong>Tên bệnh nhân:</strong> {prescription.patient_name}</p>
                    <p><strong>Mã bác sĩ:</strong> {prescription.doctor_id}</p>
                    <p><strong>Tên bác sĩ:</strong> {prescription.doctor_name}</p>
                    <p><strong>Ngày:</strong> {moment(prescription.date).format('YYYY-MM-DD')}</p>
                    <p><strong>Trạng thái:</strong> {prescription.status}</p>
                    <p><strong>Ghi chú:</strong> {prescription.notes}</p>
                </div>
                <h3 style={{ marginBottom: '10px' }}>Các thuốc:</h3>
                <table style={{ width: '100%', border: '1px solid #ccc', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f0f0f0' }}>
                        <tr>
                            <th style={{ padding: '8px', textAlign: 'center' }}>ID</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>Mã thuốc</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>Tên thuốc</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>Liều lượng</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>Tần suất</th>
                            <th style={{ padding: '8px', textAlign: 'center' }}>Số lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {prescription.items.map(item => (
                            <tr key={item.id}>
                                <td style={{ padding: '8px', textAlign: 'center' }}>{item.id}</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>{item.drug_id}</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>{item.drug_name}</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>{item.dosage}</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>{item.frequency}</td>
                                <td style={{ padding: '8px', textAlign: 'center' }}>{item.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Modal>
    );
};

export default PrintablePrescription;
