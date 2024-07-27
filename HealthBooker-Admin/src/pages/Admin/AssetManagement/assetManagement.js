import {
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    PlusOutlined,
    ShoppingOutlined,
    CheckCircleOutlined,
    StopOutlined,
    EyeOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop, Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Modal, Popconfirm,
    Row,
    Space,
    Spin,
    Table,
    notification,
    Select,
    InputNumber
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import courtsManagementApi from "../../../apis/courtsManagementApi";
import "./assetManagement.css";
import fieldtypesApi from '../../../apis/fieldtypesApi';
import uploadFileApi from '../../../apis/uploadFileApi';
import userApi from '../../../apis/userApi';
import { useHistory, useParams } from "react-router-dom";
import areaManagementApi from '../../../apis/areaManagementApi';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
const { Option } = Select;

const AssetManagement = () => {

    const [category, setCategory] = useState([]);
    const [fieldTypes, setFieldTypes] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [file, setUploadFile] = useState();
    const [description, setDescription] = useState();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                "name": values.name,
                "description": description,
                "price": values.price,
                "location": values.location,
                "id_field_types": values.id_field_types,
                "id_areas": values.id_areas,
                "image": file,
                "id_users": values.id_users,
                "status": values.status
            };
            return courtsManagementApi.addCourt(categoryList).then(response => {
                if (response.message === "Tên bác sỹ đã tồn tại") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên bác sỹ không được trùng',
                    });
                    setLoading(false);
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo bác sỹ thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo bác sỹ thành công',
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
                "description": description,
                "price": values.price,
                "location": values.location,
                "id_field_types": values.id_field_types,
                "id_areas": values.id_areas,
                "image": file,
                "id_users": values.id_users,
                "status": values.status
            };
            return courtsManagementApi.updateCourt(categoryList, id).then(response => {
                if (response.message === "Tên bác sỹ đã tồn tại") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên bác sỹ không được trùng',
                    });
                    setLoading(false);
                    return;
                }

                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa bác sỹ thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa bác sỹ thành công',
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

            // Lấy tất cả các khu vực có trạng thái là "active"
            const areaResponse = await areaManagementApi.getAllAreas();
            console.log(areaResponse);
            const activeAreas = areaResponse.filter(area => area.status === 'active');
            setArea(activeAreas);

            // Lấy tất cả các chuyên khoa có trạng thái là "active"
            const fieldTypesResponse = await fieldtypesApi.getAllFieldTypes();
            console.log(fieldTypesResponse);
            const activeFieldTypes = fieldTypesResponse.filter(fieldType => fieldType.status === 'active');
            setFieldTypes(activeFieldTypes);

            setLoading(false);

            const response = await userApi.getProfile();
            console.log(response);
            setUserData(response.user);

            const createdById = response.user.id;

            if (response.user.role == "isHead") {

                await courtsManagementApi.getAllCourts().then((res) => {
                    console.log(res);
                    setCategory(res);
                    setLoading(false);
                });
            } else {
                await courtsManagementApi.getCourtByUserId(createdById).then((res) => {
                    console.log(res);
                    setCategory(res);
                    setLoading(false);
                });
            }

            ;
        } catch (error) {
            console.log('Failed to fetch category list:' + error);
        }
    }

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await courtsManagementApi.deleteCourt(id).then(response => {
                if (response.message === "Không thể xóa bác sỹ này vì đã có đặt bác sỹ liên kết đến nó.") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            "Không thể xóa bác sỹ này vì đã có đặt bác sỹ liên kết đến nó.",

                    });
                    setLoading(false);
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa bác sỹ thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa bác sỹ thành công',

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
                const response = await courtsManagementApi.getCourtById(id);
                setId(id);
                form2.setFieldsValue({
                    name: response.name,
                    description: response.description,
                    price: response.price,
                    location: response.location,
                    id_field_types: response.id_field_types,
                    id_areas: response.id_areas,
                    status: response.status,
                    id_users: response.id_users,

                });
                setDescription(response.description)
                console.log(form2);
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    const handleChange = (content) => {
        console.log(content);
        setDescription(content);
    }

    const handleFilter = async (name) => {
        try {
            const res = await courtsManagementApi.searchCourts(name.target.value);
            setCategory(res);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const handleUnBanAccount = async (data) => {
        console.log(data);

        try {
            await courtsManagementApi.updateApprovalStatus(data.id, "approved").then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Phê duyệt thất bại',

                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Phê duyệt thành công',

                    });
                }
                handleCategoryList();
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleBanAccount = async (data) => {
        console.log(data);
        try {
            await courtsManagementApi.updateApprovalStatus(data.id, "pending").then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Từ chối thất bại',

                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Từ chối thành công',

                    });
                }
                handleCategoryList();

            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
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
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (description) => (
                <div 
                    style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'normal', 
                        height: '4.5em'  
                    }} 
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            ),
        },
        {
            title: 'Khu vực',
            dataIndex: 'area',
            key: 'area',
        },
        {
            title: 'chuyên khoa',
            dataIndex: 'field_type',
            key: 'field_type',
        },
        {
            title: 'Bác sỹ',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                const statusText = record.status === 'active' ? 'Hoạt động' : 'Không hoạt động';
                return statusText;
            },
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
            title: 'Phê duyệt',
            dataIndex: 'approval_status',
            key: 'approval_status',
            render: (approval) => {
                return approval === 'pending' ? 'Chưa phê duyệt' : "Phê duyệt";
            }
        },
        {
            title: 'Hành động',
            key: 'Hành động',
            render: (text, record) => (
                <div>
                    <Row>
                        {userData.role !== "isSeller" ? (
                            <>
                                <Popconfirm
                                    title="Bạn muốn phê duyệt bác sỹ này?"
                                    onConfirm={() => handleUnBanAccount(record)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        size="small"
                                        icon={<CheckCircleOutlined />}
                                        style={{ width: 170, borderRadius: 15, height: 30 }}
                                    >
                                        {"Phê duyệt"}
                                    </Button>
                                </Popconfirm>
                                <div
                                    style={{ marginLeft: 10 }}>
                                    <Popconfirm
                                        title="Bạn muốn từ chối bác sỹ này?"
                                        onConfirm={() => handleBanAccount(record)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button
                                            size="small"
                                            icon={<StopOutlined />}
                                            style={{ width: 170, borderRadius: 15, height: 30 }}
                                        >
                                            {"Không phê duyệt"}
                                        </Button>
                                    </Popconfirm>
                                </div>
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
                                        title="Bạn có chắc chắn xóa bác sỹ này?"
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
                            </>
                        ) : (
                            <>

                            </>
                        )}
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
    const [user, setUser] = useState([]);

    useEffect(() => {
        (async () => {
            try {

                // Lấy tất cả các khu vực có trạng thái là "active"
                const areaResponse = await areaManagementApi.getAllAreas();
                console.log(areaResponse);
                const activeAreas = areaResponse.filter(area => area.status === 'active');
                setArea(activeAreas);

                const userResponse = await userApi.listUserByAdmin();
                console.log(userResponse);
                const userAreas = userResponse.data.filter(item => item.role === 'isSeller');
                setUser(userAreas);

                // Lấy tất cả các chuyên khoa có trạng thái là "active"
                const fieldTypesResponse = await fieldtypesApi.getAllFieldTypes();
                console.log(fieldTypesResponse);
                const activeFieldTypes = fieldTypesResponse.filter(fieldType => fieldType.status === 'active');
                setFieldTypes(activeFieldTypes);

                setLoading(false);

                const response = await userApi.getProfile();
                console.log(response);
                setUserData(response.user);

                const createdById = response.user.id;

                if (response.user.role == "isHead") {

                    await courtsManagementApi.getAllCourts().then((res) => {
                        console.log(res);
                        setCategory(res);
                        setLoading(false);
                    });
                } else {
                    await courtsManagementApi.getCourtByUserId(createdById).then((res) => {
                        console.log(res);
                        setCategory(res);
                        setLoading(false);
                    });
                }

                ;
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
                                <span>Quản lý bác sỹ</span>
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
                                        {userData.role == "isHead" ?

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
                                                {userData.role == "isHead" ?

                                                    <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo bác sỹ</Button> : null}

                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table scroll={{ x: true }}
                            columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={category} />
                    </div>
                </div>

                <Modal
                    title="Tạo bác sỹ mới"
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
                                label="Tên bác sỹ"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên bác sỹ!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Tên bác sỹ" />
                            </Form.Item>

                            <Form.Item
                                name="id_users"
                                label="Tài khoản"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn tài khoản cho bác sỹ!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Select placeholder="Chọn tài khoản">
                                    {user.map(item => (
                                        <Select.Option key={item.id} value={item.id}>
                                            {item.username}
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

                                <SunEditor
                                    lang="en"
                                    placeholder="Content"
                                    onChange={handleChange}
                                    setContents={description}
                                    setOptions={{
                                        buttonList: [
                                            ["undo", "redo"],
                                            ["font", "fontSize"],
                                            // ['paragraphStyle', 'blockquote'],
                                            [
                                                "bold",
                                                "underline",
                                                "italic",
                                                "strike",
                                                "subscript",
                                                "superscript"
                                            ],
                                            ["fontColor", "hiliteColor"],
                                            ["align", "list", "lineHeight"],
                                            ["outdent", "indent"],

                                            ["table", "horizontalRule", "link", "image", "video"],
                                            // ['math'] //You must add the 'katex' library at options to use the 'math' plugin.
                                            // ['imageGallery'], // You must add the "imageGalleryUrl".
                                            // ["fullScreen", "showBlocks", "codeView"],
                                            ["preview", "print"],
                                            ["removeFormat"]

                                            // ['save', 'template'],
                                            // '/', Line break
                                        ],
                                        fontSize: [
                                            8, 10, 14, 18, 24,
                                        ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                                        defaultTag: "div",
                                        minHeight: "300px",
                                        showPathLabel: false,
                                        attributesWhitelist: {
                                            all: "style",
                                            table: "cellpadding|width|cellspacing|height|style",
                                            tr: "valign|style",
                                            td: "styleinsert|height|style",
                                            img: "title|alt|src|style"
                                        }
                                    }}
                                />
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
                                name="id_field_types"
                                label="chuyên khoa"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn chuyên khoa!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Select placeholder="Chọn chuyên khoa">
                                    {fieldTypes.map(fieldType => (
                                        <Select.Option key={fieldType.id} value={fieldType.id}>
                                            {fieldType.type}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>



                            <Form.Item
                                name="id_areas"
                                label="Khu vực"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn khu vực!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Select placeholder="Chọn khu vực">
                                    {area.map(fieldType => (
                                        <Select.Option key={fieldType.id} value={fieldType.id}>
                                            {fieldType.name}
                                        </Select.Option>
                                    ))}
                                </Select>
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
                                    <Select.Option value="active">Hoạt động</Select.Option>
                                    <Select.Option value="inactive">Không hoạt động</Select.Option>
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
                    title="Chỉnh bác sỹ"
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
                                label="Tên bác sỹ"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên bác sỹ!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Tên bác sỹ" />
                            </Form.Item>

                            <Form.Item
                                name="id_users"
                                label="Tài khoản"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn tài khoản cho bác sỹ!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Select placeholder="Chọn tài khoản">
                                    {user.map(item => (
                                        <Select.Option key={item.id} value={item.id}>
                                            {item.username}
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

                                <SunEditor
                                    lang="en"
                                    placeholder="Content"
                                    onChange={handleChange}
                                    setContents={description}
                                    setOptions={{
                                        buttonList: [
                                            ["undo", "redo"],
                                            ["font", "fontSize"],
                                            // ['paragraphStyle', 'blockquote'],
                                            [
                                                "bold",
                                                "underline",
                                                "italic",
                                                "strike",
                                                "subscript",
                                                "superscript"
                                            ],
                                            ["fontColor", "hiliteColor"],
                                            ["align", "list", "lineHeight"],
                                            ["outdent", "indent"],

                                            ["table", "horizontalRule", "link", "image", "video"],
                                            // ['math'] //You must add the 'katex' library at options to use the 'math' plugin.
                                            // ['imageGallery'], // You must add the "imageGalleryUrl".
                                            // ["fullScreen", "showBlocks", "codeView"],
                                            ["preview", "print"],
                                            ["removeFormat"]

                                            // ['save', 'template'],
                                            // '/', Line break
                                        ],
                                        fontSize: [
                                            8, 10, 14, 18, 24,
                                        ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                                        defaultTag: "div",
                                        minHeight: "300px",
                                        showPathLabel: false,
                                        attributesWhitelist: {
                                            all: "style",
                                            table: "cellpadding|width|cellspacing|height|style",
                                            tr: "valign|style",
                                            td: "styleinsert|height|style",
                                            img: "title|alt|src|style"
                                        }
                                    }}
                                />
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
                                name="id_field_types"
                                label="chuyên khoa"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn chuyên khoa!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Select placeholder="Chọn chuyên khoa">
                                    {fieldTypes.map(fieldType => (
                                        <Select.Option key={fieldType.id} value={fieldType.id}>
                                            {fieldType.type}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="id_areas"
                                label="Khu vực"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn khu vực!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Select placeholder="Chọn khu vực">
                                    {area.map(fieldType => (
                                        <Select.Option key={fieldType.id} value={fieldType.id}>
                                            {fieldType.name}
                                        </Select.Option>
                                    ))}
                                </Select>
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
                                    <Select.Option value="active">Hoạt động</Select.Option>
                                    <Select.Option value="inactive">Không hoạt động</Select.Option>
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

export default AssetManagement;