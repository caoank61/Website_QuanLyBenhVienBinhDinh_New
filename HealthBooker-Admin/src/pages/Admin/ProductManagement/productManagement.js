import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    ShoppingOutlined
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
    notification
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import areaManagementApi from '../../../apis/areaManagementApi';
import productTypeApi from '../../../apis/productTypeApi';
import productApi from "../../../apis/productApi";
import uploadFileApi from '../../../apis/uploadFileApi';
import userApi from '../../../apis/userApi';
import "./productManagement.css";

const { Option } = Select;

const ProductManagement = () => {

    const [category, setCategory] = useState([]);
    const [fieldTypes, setFieldTypes] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [file, setUploadFile] = useState();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                "name": values.name,
                "price": values.price,
                "quantity": values.quantity,
                "id_product_type": values.id_product_type,
                "image": file,
                "id_users": userData.id,
                "itemStatus": "new",
                "status": "active"
            };
            return productApi.addProduct(categoryList).then(response => {
                if (response.message === "Tên dịch vụ đã tồn tại") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên dịch vụ không được trùng',
                    });
                    setLoading(false);
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo dịch vụ thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo dịch vụ thành công',
                    });
                    setOpenModalCreate(false);
                    handleCategoryList();
                }
            })

        } catch (error) {
            throw error;
        }
    }

    const handleUpdateCategory = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                "name": values.name,
                "price": values.price,
                "quantity": values.quantity,
                "id_product_type": values.id_product_type,
                "image": file,
                "id_users": userData.id,
                "itemStatus": "new",
                "status": "active"
            };
            return productApi.updateProduct(categoryList, id).then(response => {
                if (response.message === "Tên dịch vụ đã tồn tại") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên dịch vụ không được trùng',
                    });
                    setLoading(false);
                    return;
                }

                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa dịch vụ thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa dịch vụ thành công',
                    });
                    setUploadFile();
                    handleCategoryList();
                    setOpenModalUpdate(false);
                }
            })

        } catch (error) {
            throw error;
        }
    }

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false)
        }
        console.log('Clicked cancel button');
    };

    const handleCategoryList = async () => {
        try {

            await productApi.getProductByUserId(userData.id).then((res) => {
                console.log(res);
                setCategory(res);
                setLoading(false);
            });

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        };
    }

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await productApi.deleteProduct(id).then(response => {
                if (response.message === "Cannot delete the asset because it is referenced in another process or event.") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            "Không thể xóa dịch vụ vì nó đã được sử dụng trong một dịch vụ hoặc quá trình khác.",

                    });
                    setLoading(false);
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa dịch vụ thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa dịch vụ thành công',

                    });
                    handleCategoryList();
                    setLoading(false);
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleEditCategory = (id) => {
        console.log(id);
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await productApi.getProductById(id);
                setId(id);
                form2.setFieldsValue({
                    name: response.name,
                    quantity: response.quantity,
                    price: response.price,
                    id_product_type: response.id_product_type,
                });
                console.log(form2);
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    const handleFilter = async (name) => {
        try {
            const res = await productApi.searchProducts(name);
            setCategory(res.data);
        } catch (error) {
            console.log('search to fetch category list:' + error);
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
            render: (image) => <img src={image} style={{ height: 80 }} />,
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
            title: 'Loại dịch vụ',
            dataIndex: 'product_type_name',
            key: 'product_type_name',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Giá trị',
            dataIndex: 'price',
            key: 'price',
            render: (text, record) => {
                // Định dạng số theo format tiền Việt Nam
                const formattedCost = Number(record.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                return formattedCost;
            },
        },
        {
            title: 'Ngày tạo',
            key: 'created_at',
            dataIndex: 'created_at',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>

                        <Button
                            size="small"
                            icon={<EditOutlined />}
                            style={{ width: 170, borderRadius: 15, height: 30 }}
                            onClick={() => handleEditCategory(record.id)}
                        >{"Chỉnh sửa"}
                        </Button>
                        <div
                            style={{ marginLeft: 6 }}>
                            <Popconfirm
                                title="Bạn có chắc chắn xóa dịch vụ này?"
                                onConfirm={() => handleDeleteCategory(record.id)}
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


    const [userData, setUserData] = useState([]);
    const [area, setArea] = useState([]);


    useEffect(() => {
        (async () => {
            try {

                const response = await userApi.getProfile();
                console.log(response);
                setUserData(response.user);

                const createdById = response.user.id;


                const productTypesResponse = await productTypeApi.getAllProductTypes();
                console.log(productTypesResponse);

                // Lọc các loại sản phẩm có trạng thái là "active"
                const activeProductTypes = productTypesResponse.filter(productType => productType.status === 'active');

                setFieldTypes(activeProductTypes);


                await productApi.getAllProducts(createdById).then((res) => {
                    console.log(res);
                    setCategory(res);
                    setLoading(false);
                });
            } catch (error) {
                console.log('Failed to fetch category list:' + error);
            }
        })();
    }, [])
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
                                <ShoppingOutlined />
                                <span>Quản lý dịch vụ</span>
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
                                        {userData.role == "isAdmin" ?

                                            <Input
                                                placeholder="Tìm kiếm theo tên và mô tả"
                                                allowClear
                                                onChange={handleFilter}
                                                style={{ width: 300 }}
                                            /> : null}
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                {userData.role !== "isAdmin" ?

                                                    <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo dịch vụ</Button> : null}

                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table     scroll={{ x: true }}
 columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={category} />
                    </div>
                </div>

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
                                label="Tên dịch vụ"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên dịch vụ!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Tên dịch vụ" />
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
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} // Sử dụng dấu chấm làm phân cách hàng nghìn
                                    parser={(value) => value.replace(/\./g, '')} // Loại bỏ dấu chấm khi phân tích
                                />
                            </Form.Item>

                            <Form.Item
                                name="id_product_type"
                                label="Loại dịch vụ"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn loại dịch vụ!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Select placeholder="Chọn loại dịch vụ">
                                    {fieldTypes.map(fieldType => (
                                        <Select.Option key={fieldType.id} value={fieldType.id}>
                                            {fieldType.name}
                                        </Select.Option>
                                    ))}
                                </Select>
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
                                handleUpdateCategory(values);
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
                                label="Tên dịch vụ"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên dịch vụ!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Tên dịch vụ" />
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
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} // Sử dụng dấu chấm làm phân cách hàng nghìn
                                    parser={(value) => value.replace(/\./g, '')} // Loại bỏ dấu chấm khi phân tích
                                />
                            </Form.Item>

                            <Form.Item
                                name="id_product_type"
                                label="Loại dịch vụ"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn loại dịch vụ!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Select placeholder="Chọn loại dịch vụ">
                                    {fieldTypes.map(fieldType => (
                                        <Select.Option key={fieldType.id} value={fieldType.id}>
                                            {fieldType.name}
                                        </Select.Option>
                                    ))}
                                </Select>
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

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default ProductManagement;