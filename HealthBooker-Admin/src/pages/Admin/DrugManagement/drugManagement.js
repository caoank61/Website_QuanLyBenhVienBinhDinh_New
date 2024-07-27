import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    MedicineBoxOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop, Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    InputNumber,
    Modal, Popconfirm,
    Row,
    Select,
    Space,
    Spin,
    Table,
    notification,
    DatePicker
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import drugApi from '../../../apis/drugAPI';
import uploadFileApi from '../../../apis/uploadFileApi';
import userApi from '../../../apis/userApi';
import "./drugManagement.css";
import dayjs from 'dayjs';

const { Option } = Select;

const DrugManagement = () => {

    const [drugs, setDrugs] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [file, setUploadFile] = useState();
    const [userData, setUserData] = useState([]);

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const expiryDate = values.expiry_date ? values.expiry_date.format('YYYY-MM-DD') : null;

            const drugData = {
                name: values.name,
                price: values.price,
                quantity: values.quantity,
                expiry_date: expiryDate,
                status: values.status,
                description: values.description,
                image: file,
            };
            return drugApi.addDrug(drugData).then(response => {
                if (response.message === "Tên thuốc đã tồn tại") {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Tên thuốc không được trùng',
                    });
                    setLoading(false);
                    return;
                }
                if (!response) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Tạo thuốc thất bại',
                    });
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Tạo thuốc thành công',
                    });
                    setOpenModalCreate(false);
                    handleDrugList();
                }
            });
        } catch (error) {
            throw error;
        }
    }

    const handleUpdateDrug = async (values) => {
        setLoading(true);
        const expiryDate = values.expiry_date ? values.expiry_date.format('YYYY-MM-DD') : null;

        try {
            const drugData = {
                name: values.name,
                price: values.price,
                quantity: values.quantity,
                expiry_date: expiryDate,
                status: values.status,
                description: values.description,
                image: file,
            };
            return drugApi.updateDrug(drugData, id).then(response => {
                if (response.message === "Tên thuốc đã tồn tại") {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Tên thuốc không được trùng',
                    });
                    setLoading(false);
                    return;
                }

                if (!response) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Chỉnh sửa thuốc thất bại',
                    });
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Chỉnh sửa thuốc thành công',
                    });
                    setUploadFile(null);
                    handleDrugList();
                    setOpenModalUpdate(false);
                }
            });
        } catch (error) {
            throw error;
        }
    }

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false);
        }
    };

    const handleDrugList = async () => {
        try {
            await drugApi.getAllDrugs().then((res) => {
                setDrugs(res);
                setLoading(false);
            });
        } catch (error) {
            console.log('Failed to fetch drug list: ' + error);
        }
    }

    const handleDeleteDrug = async (id) => {
        setLoading(true);
        try {
            await drugApi.deleteDrug(id).then(response => {
                if (!response) {
                    notification["error"]({
                        message: `Thông báo`,
                        description: 'Xóa thuốc thất bại',
                    });
                } else {
                    notification["success"]({
                        message: `Thông báo`,
                        description: 'Xóa thuốc thành công',
                    });
                    handleDrugList();
                    setLoading(false);
                }
            });
        } catch (error) {
            console.log('Failed to fetch drug list: ' + error);
        }
    }

    const handleEditDrug = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await drugApi.getDrugById(id);
                setId(id);
                form2.setFieldsValue({
                    name: response.name,
                    quantity: response.quantity,
                    price: response.price,
                    expiry_date: dayjs(response.expiry_date), 
                    status: response.status, 
                    description: response.description,
                });
                
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    const handleFilter = async (e) => {
        try {
            const keyword = e.target.value;
            const res = await drugApi.searchDrugs(keyword);
            setDrugs(res);
        } catch (error) {
            console.log('Search failed: ' + error);
        }
    }

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image) => <img src={image} style={{ height: 80 }} alt="Drug" />,
            width: '10%'
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Loại thuốc',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (text, record) => {
                const formattedPrice = Number(record.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                return formattedPrice;
            },
        },
        {
            title: 'Ngày tạo',
            key: 'created_at',
            dataIndex: 'created_at',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Hành động',
            key: 'Hành động',
            render: (text, record) => (
                <div>
                    <Row>
                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            style={{ width: 170, borderRadius: 15, height: 30 }}
                            onClick={() => handleEditDrug(record.id)}
                        >{"Chỉnh sửa"}
                        </Button>
                        <div style={{ marginLeft: 6 }}>
                            <Popconfirm
                                title="Bạn có chắc chắn xóa thuốc này?"
                                onConfirm={() => handleDeleteDrug(record.id)}
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

    const handleChangeImage = async (e) => {
        setLoading(true);
        const response = await uploadFileApi.uploadFile(e);
        if (response) {
            setUploadFile(response);
        }
        setLoading(false);
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await userApi.getProfile();
                setUserData(response.user);
                await handleDrugList();
            } catch (error) {
                console.log('Failed to fetch user data: ' + error);
            }
        })();
    }, []);

    const drugTypes = [
        { id: 1, name: 'Paracetamol' },
        { id: 2, name: 'Ibuprofen' },
        { id: 3, name: 'Aspirin' },
        { id: 4, name: 'Amoxicillin' },
        { id: 5, name: 'Metformin' },
        { id: 6, name: 'Lisinopril' },
        { id: 7, name: 'Atorvastatin' },
        { id: 8, name: 'Amlodipine' },
        { id: 9, name: 'Omeprazole' },
        { id: 10, name: 'Simvastatin' },
        { id: 11, name: 'Clopidogrel' },
        { id: 12, name: 'Losartan' },
        { id: 13, name: 'Alprazolam' },
        { id: 14, name: 'Sertraline' },
        { id: 15, name: 'Montelukast' },
        { id: 16, name: 'Prednisone' },
        { id: 17, name: 'Tramadol' },
        { id: 18, name: 'Furosemide' },
        { id: 19, name: 'Ciprofloxacin' },
        { id: 20, name: 'Gabapentin' },
        { id: 21, name: 'Hydrochlorothiazide' },
        { id: 22, name: 'Levothyroxine' },
        { id: 23, name: 'Pantoprazole' },
        { id: 24, name: 'Rosuvastatin' },
        { id: 25, name: 'Citalopram' },
        { id: 26, name: 'Duloxetine' },
        { id: 27, name: 'Bupropion' },
        { id: 28, name: 'Cephalexin' },
        { id: 29, name: 'Cetrizine' },
        { id: 30, name: 'Atenolol' }
    ];

    const statusOptions = [
        { id: 1, label: 'Còn hàng', value: 'available' },
        { id: 2, label: 'Hết hàng', value: 'out_of_stock' },
        { id: 3, label: 'Ngừng kinh doanh', value: 'discontinued' }
    ];

    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <MedicineBoxOutlined />
                                <span>Quản lý thuốc</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm theo tên thuốc"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button
                                                    icon={<PlusOutlined />}
                                                    onClick={showModal}
                                                >{"Thêm mới"}
                                                </Button>

                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>
                            </PageHeader>

                            <Table
                                columns={columns}
                                dataSource={drugs}
                                pagination={{ pageSize: 10 }}
                            />

                            <Modal
                                title="Tạo dịch vụ mới"
                                visible={openModalCreate}
                                style={{ top: 100 }}
                                onOk={() => {
                                    form
                                        .validateFields()
                                        .then((values) => {
                                            form.resetFields();
                                            handleOkUser(values);
                                        })
                                        .catch((info) => {
                                            console.log('Validate Failed:', info);
                                        });
                                }}
                                onCancel={() => handleCancel("create")}
                                okText="Hoàn thành"
                                cancelText="Hủy"
                                width={600}
                            >
                                <Form
                                    form={form}
                                    name="courtCreate"
                                    layout="vertical"
                                    initialValues={{
                                        status: 'Đang sử dụng',
                                    }}
                                    scrollToFirstError
                                >
                                    <Spin spinning={loading}>

                                        <Form.Item
                                            name="name"
                                            label="Tên thuốc"
                                            rules={[{ required: true, message: 'Tên thuốc không được để trống' }]}
                                            style={{ marginBottom: 10 }}
                                        >
                                            <Input placeholder="Tên thuốc" />
                                        </Form.Item>

                                        <Form.Item
                                            name="quantity"
                                            label="Số lượng"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập số lượng!',
                                                },
                                            ]}
                                            style={{ marginBottom: 10 }}
                                        >
                                            <Input placeholder="Số lượng" />
                                        </Form.Item>

                                        <Form.Item
                                            name="price"
                                            label="Giá"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập giá!',
                                                },
                                            ]}
                                            style={{ marginBottom: 10 }}
                                        >
                                            <InputNumber
                                                placeholder="Giá"
                                                style={{ width: '100%' }}
                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                                parser={(value) => value.replace(/\./g, '')}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="expiry_date"
                                            label="Ngày hết hạn"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng chọn ngày hết hạn!',
                                                },
                                            ]}
                                            style={{ marginBottom: 10 }}
                                        >
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                style={{ width: '100%' }}
                                                placeholder="Chọn ngày hết hạn"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="status"
                                            label="Trạng thái"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng chọn trạng thái!',
                                                },
                                            ]}
                                            style={{ marginBottom: 10 }}
                                        >
                                            <Select placeholder="Chọn trạng thái">
                                                {statusOptions.map((status) => (
                                                    <Select.Option key={status.id} value={status.value}>
                                                        {status.label}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            name="description"
                                            label="Mô tả"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập mô tả!',
                                                },
                                            ]}
                                            style={{ marginBottom: 10 }}
                                        >
                                            <Input.TextArea rows={4} placeholder="Mô tả về thuốc" />
                                        </Form.Item>

                                        <Form.Item
                                            name="image"
                                            label="Chọn ảnh"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng chọn ảnh!',
                                                },
                                            ]}
                                            style={{ marginBottom: 10 }}
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleChangeImage}
                                                id="image"
                                                name="image"
                                            />
                                        </Form.Item>
                                    </Spin>
                                </Form>

                            </Modal>

                            <Modal
                                title="Chỉnh dịch vụ"
                                visible={openModalUpdate}
                                style={{ top: 100 }}
                                onOk={() => {
                                    form2
                                        .validateFields()
                                        .then((values) => {
                                            form2.resetFields();
                                            handleUpdateDrug(values);
                                        })
                                        .catch((info) => {
                                            console.log('Validate Failed:', info);
                                        });
                                }}
                                onCancel={handleCancel}
                                okText="Hoàn thành"
                                cancelText="Hủy"
                                width={600}
                            >
                                <Form
                                    form={form2}
                                    name="eventCreate"
                                    layout="vertical"
                                    initialValues={{
                                        residence: ['zhejiang', 'hangzhou', 'xihu'],
                                        prefix: '86',
                                    }}
                                    scrollToFirstError
                                >
                                    <Spin spinning={loading}>
                                        <Form.Item
                                            name="name"
                                            label="Tên thuốc"
                                            rules={[{ required: true, message: 'Tên thuốc không được để trống' }]}
                                            style={{ marginBottom: 10 }}
                                        >
                                            <Input placeholder="Tên thuốc" />
                                        </Form.Item>

                                        <Form.Item
                                            name="quantity"
                                            label="Số lượng"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập số lượng!',
                                                },
                                            ]}
                                            style={{ marginBottom: 10 }}
                                        >
                                            <Input placeholder="Số lượng" />
                                        </Form.Item>

                                        <Form.Item
                                            name="price"
                                            label="Giá"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập giá!',
                                                },
                                            ]}
                                            style={{ marginBottom: 10 }}
                                        >
                                            <InputNumber
                                                placeholder="Giá"
                                                style={{ width: '100%' }}
                                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                                parser={(value) => value.replace(/\./g, '')}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="expiry_date"
                                            label="Ngày hết hạn"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng chọn ngày hết hạn!',
                                                },
                                            ]}
                                            style={{ marginBottom: 10 }}
                                        >
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                style={{ width: '100%' }}
                                                placeholder="Chọn ngày hết hạn"
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            name="status"
                                            label="Trạng thái"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng chọn trạng thái!',
                                                },
                                            ]}
                                            style={{ marginBottom: 10 }}
                                        >
                                            <Select placeholder="Chọn trạng thái">
                                                {statusOptions.map((status) => (
                                                    <Select.Option key={status.id} value={status.value}>
                                                        {status.label}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            name="description"
                                            label="Mô tả"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'Vui lòng nhập mô tả!',
                                                },
                                            ]}
                                            style={{ marginBottom: 10 }}
                                        >
                                            <Input.TextArea rows={4} placeholder="Mô tả về thuốc" />
                                        </Form.Item>

                                        <Form.Item
                                            name="image"
                                            label="Chọn ảnh"
                                            style={{ marginBottom: 10 }}
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleChangeImage}
                                                id="image"
                                                name="image"
                                            />
                                        </Form.Item>
                                    </Spin>
                                </Form>
                            </Modal>
                        </div>
                    </div>
                </div>
            </Spin>
            <BackTop />
        </div>
    );
}

export default DrugManagement;
