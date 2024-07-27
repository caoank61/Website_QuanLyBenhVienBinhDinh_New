import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, Select, Spin, notification, Popconfirm, Row, Col, Space, Breadcrumb, BackTop } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, HomeOutlined, FileTextOutlined } from '@ant-design/icons';
import prescriptionAPI from '../../../apis/prescriptionAPI';
import drugAPI from '../../../apis/drugAPI';
import dayjs from 'dayjs';
import moment from 'moment';
import { PageHeader } from '@ant-design/pro-layout';
import userApi from '../../../apis/userApi';
import PrintablePrescription from './PrintablePrescription';

const PrescriptionManagement = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [drugOptions, setDrugOptions] = useState([]);

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const prescriptionData = {
                user_id: values.user_id,
                doctor_id: values.doctor_id,
                notes: values.notes,
                status: values.status || 'active',
                items: values.drugs.map(drug => ({
                    drug_id: drug.drug_id,
                    dosage: drug.dosage,
                    frequency: drug.frequency,
                    quantity: drug.quantity,
                }))
            };
            await prescriptionAPI.addPrescription(prescriptionData).then(response => {
                if (!response) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Tạo đơn thuốc thất bại',
                    });
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Tạo đơn thuốc thành công',
                    });
                    setOpenModalCreate(false);
                    handlePrescriptionList();
                }
                setLoading(false);
            });
        } catch (error) {
            console.error(error);
            setLoading(false);
            notification["error"]({
                message: `Thông báo`,
                description: 'Tạo đơn thuốc thất bại',
            });
        }
    };

    const handleUpdatePrescription = async (values) => {
        setLoading(true);
        try {
            const prescriptionData = {
                user_id: values.user_id,
                doctor_id: values.doctor_id,
                notes: values.notes,
                status: values.status || 'active',
                items: values.drugs.map(drug => ({
                    drug_id: drug.drug_id,
                    dosage: drug.dosage,
                    frequency: drug.frequency,
                    quantity: drug.quantity,
                }))
            };
            await prescriptionAPI.updatePrescription(prescriptionData, id).then(response => {
                if (!response) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Chỉnh sửa đơn thuốc thất bại',
                    });
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Chỉnh sửa đơn thuốc thành công',
                    });
                    setOpenModalUpdate(false);
                    handlePrescriptionList();
                }
                setLoading(false);
            });
        } catch (error) {
            console.error(error);
            setLoading(false);
            notification["error"]({
                message: `Thông báo`,
                description: 'Chỉnh sửa đơn thuốc thất bại',
            });
        }
    };

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false);
        }
    };

    const handlePrescriptionList = async () => {
        try {
            await prescriptionAPI.getAllPrescriptions().then((res) => {
                setPrescriptions(res);
                setLoading(false);
            });
        } catch (error) {
            console.log('Failed to fetch prescription list: ' + error);
        }
    };

    const handleDeletePrescription = async (id) => {
        setLoading(true);
        try {
            await prescriptionAPI.deletePrescription(id).then(response => {
                if (!response) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Xóa đơn thuốc thất bại',
                    });
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Xóa đơn thuốc thành công',
                    });
                    handlePrescriptionList();
                    setLoading(false);
                }
            });
        } catch (error) {
            console.log('Failed to delete prescription: ' + error);
        }
    };

    const handleEditPrescription = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await prescriptionAPI.getPrescriptionById(id);
                setId(id);
                form2.setFieldsValue({
                    user_id: response.user_id,
                    doctor_id: response.doctor_id,
                    date: dayjs(response.date),
                    drugs: response.drugs.map(drug => ({
                        drug_id: drug.id,
                        dosage: drug.dosage,
                        frequency: drug.frequency,
                        quantity: drug.quantity,
                    })),
                    status: response.status,
                    notes: response.notes,
                });
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    };

    const handleFilter = async (e) => {
        try {
            const keyword = e.target.value;
            const res = await prescriptionAPI.searchPrescriptions(keyword);
            setPrescriptions(res);
        } catch (error) {
            console.log('Search failed: ' + error);
        }
    };

    const nestedColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Mã thuốc',
            dataIndex: 'drug_id',
            key: 'drug_id',
        },
        {
            title: 'Tên thuốc',
            dataIndex: 'drug_name',
            key: 'drug_name',
        },
        {
            title: 'Liều lượng',
            dataIndex: 'dosage',
            key: 'dosage',
        },
        {
            title: 'Tần suất',
            dataIndex: 'frequency',
            key: 'frequency',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
    ];

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Mã bệnh nhân',
            dataIndex: 'user_id',
            key: 'user_id',
        },
        {
            title: 'Tên bệnh nhân',
            dataIndex: 'patient_name',
            key: 'patient_name',
        },
        {
            title: 'Mã bác sĩ',
            dataIndex: 'doctor_id',
            key: 'doctor_id',
        },
        {
            title: 'Tên bác sĩ',
            dataIndex: 'doctor_name',
            key: 'doctor_name',
        },
        {
            title: 'Ngày',
            key: 'date',
            dataIndex: 'date',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'notes',
            key: 'notes',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        <div style={{ marginLeft: 6 }}>
                            <Button
                                size="small"
                                onClick={() => handlePrint(record)}
                                style={{ width: 170, borderRadius: 15, height: 30 }}
                            >
                                {"In đơn thuốc"}
                            </Button>
                            <Popconfirm
                                title="Bạn có chắc chắn xóa đơn thuốc này?"
                                onConfirm={() => handleDeletePrescription(record.id)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button
                                    size="small"
                                    icon={<DeleteOutlined />}
                                    style={{ width: 170, borderRadius: 15, height: 30 }}
                                >{"Xóa"}
                                </Button>
                            </Popconfirm>
                        </div>
                    </Row>
                </div>
            ),
        },
    ];

    const [doctor, setDoctor] = useState([]);
    const [client, setClient] = useState([]);


    useEffect(() => {
        (async () => {
            try {
                await handlePrescriptionList();

                const userResponse = await userApi.listUserByAdmin();
                console.log(userResponse);
                const user = userResponse.data.filter(item => item.role === 'isClient');
                setClient(user);
                const userAreas = userResponse.data.filter(item => item.role === 'isSeller');
                setDoctor(userAreas);

                const drugsResponse = await drugAPI.getAllDrugs();
                setDrugOptions(drugsResponse.map(drug => ({ key: drug.id, value: drug.id, label: drug.name })));
            } catch (error) {
                throw error;
            }
        })();
    }, []);

    const [printablePrescription, setPrintablePrescription] = useState(null);

    const handlePrint = (prescription) => {
        setPrintablePrescription(prescription);
    };

    const handleCloseModal = () => {
        setPrintablePrescription(null);
    };

    return (
        <div>
            <Row>
                <Col span={24}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item href='/'>
                            <HomeOutlined />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href='/prescription'>
                            <FileTextOutlined />
                            <span>Quản lý đơn thuốc</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>

                    <PageHeader
                        subTitle="Danh sách đơn thuốc"
                        style={{ fontSize: 14 }}
                    >
                        <Row>
                            <Col span="18">

                            </Col>
                            <Col span="6">
                                <Row justify="end">
                                    <Space>

                                        <Button
                                            type="primary"
                                            onClick={showModal}
                                            icon={<PlusOutlined />}
                                        >
                                            Thêm mới
                                        </Button>
                                    </Space>
                                </Row>
                            </Col>
                        </Row>

                    </PageHeader>

                </Col>
            </Row>

            <Table
                columns={columns}
                dataSource={prescriptions}
                rowKey="id"
                expandable={{
                    expandedRowRender: record => (
                        <Table
                            columns={nestedColumns}
                            dataSource={record.items}
                            pagination={false}
                            rowKey="id"
                        />
                    ),
                    rowExpandable: record => record.items.length > 0,
                }}
            />
            <Modal
                title="Thêm đơn thuốc"
                visible={openModalCreate}
                onOk={form.submit}
                onCancel={() => handleCancel("create")}
                okText="Lưu"
                cancelText="Hủy"
                width={1000}
            >
                <Form form={form} onFinish={handleOkUser} layout="vertical">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Tên bệnh nhân" name="user_id" rules={[{ required: true, message: 'Vui lòng chọn tên bệnh nhân!' }]}>
                                <Select placeholder="Chọn bệnh nhân">
                                    {client.map(item => (
                                        <Select.Option key={item.id} value={item.id}>
                                            {item.username}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Tên bác sĩ" name="doctor_id" rules={[{ required: true, message: 'Vui lòng chọn tên bác sĩ!' }]}>
                                <Select placeholder="Chọn bác sỹ">
                                    {doctor.map(item => (
                                        <Select.Option key={item.id} value={item.id}>
                                            {item.username}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Ghi chú" name="notes">
                                <Input.TextArea placeholder="Nhập ghi chú" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Trạng thái" name="status">
                                <Select placeholder="Chọn trạng thái">
                                    <Select.Option value="active">Hoạt động</Select.Option>
                                    <Select.Option value="inactive">Không hoạt động</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.List name="drugs">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, index) => (
                                    <div key={field.key}>
                                        <Row gutter={16} align="middle">
                                            <Col span={6}>
                                                <Form.Item
                                                    {...field}
                                                    label="Tên thuốc"
                                                    name={[field.name, "drug_id"]}
                                                    fieldKey={[field.fieldKey, "drug_id"]}
                                                    rules={[{ required: true, message: 'Vui lòng chọn thuốc!' }]}
                                                >
                                                    <Select
                                                        placeholder="Chọn thuốc"
                                                        options={drugOptions}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <Form.Item
                                                    {...field}
                                                    label="Liều lượng"
                                                    name={[field.name, "dosage"]}
                                                    fieldKey={[field.fieldKey, "dosage"]}
                                                    rules={[{ required: true, message: 'Vui lòng nhập liều lượng!' }]}
                                                >
                                                    <Input placeholder="Liều lượng" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <Form.Item
                                                    {...field}
                                                    label="Tần suất"
                                                    name={[field.name, "frequency"]}
                                                    fieldKey={[field.fieldKey, "frequency"]}
                                                    rules={[{ required: true, message: 'Vui lòng nhập tần suất!' }]}
                                                >
                                                    <Input placeholder="Tần suất" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={4}>
                                                <Form.Item
                                                    {...field}
                                                    label="Số lượng"
                                                    name={[field.name, "quantity"]}
                                                    fieldKey={[field.fieldKey, "quantity"]}
                                                    rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
                                                >
                                                    <InputNumber placeholder="Số lượng" />
                                                </Form.Item>
                                            </Col>
                                            <Col span={2}>
                                                <Button
                                                    type="danger"
                                                    onClick={() => remove(field.name)}
                                                >
                                                    Xóa
                                                </Button>
                                            </Col>
                                        </Row>
                                    </div>
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        block
                                        icon={<PlusOutlined />}
                                    >
                                        Thêm thuốc
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>

            {printablePrescription && (
                <PrintablePrescription prescription={printablePrescription} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default PrescriptionManagement;
