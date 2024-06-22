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
import tournamentApi from "../../../apis/tournamentApi";
import "./tournament.css";
import fieldtypesApi from '../../../apis/fieldtypesApi';
import uploadFileApi from '../../../apis/uploadFileApi';
import userApi from '../../../apis/userApi';
import { useHistory, useParams } from "react-router-dom";
import areaManagementApi from '../../../apis/areaManagementApi';

const { Option } = Select;

const Tournament = () => {

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
            const tournamentInfo = {
                "name": values.name,
                "info": values.info,
                "teams": values.teams,
                "matches": values.matches,
                "group_count": values.group_count,
                "prizes": values.prizes,
                "status": "active", 
                "approval_status": "pending", 
                "id_users": userData.id,
                "image": file, 
            };
            
            return tournamentApi.addTournament(tournamentInfo).then(response => {
                if (response.message === "Asset with the same name already exists") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên giải đấu không được trùng',
                    });
                    setLoading(false);
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo giải đấu thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo giải đấu thành công',
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
            const tournamentInfo = {
                "name": values.name,
                "info": values.info,
                "teams": values.teams,
                "matches": values.matches,
                "group_count": values.group_count,
                "prizes": values.prizes,
                "status": "active", 
                "approval_status": "pending", 
                "id_users": userData.id,
                "image": file, 
            };
            return tournamentApi.updateTournament(tournamentInfo, id).then(response => {
                if (response.message === "Asset with the same name already exists") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tên giải đấu không được trùng',
                    });
                    setLoading(false);
                    return;
                }

                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa giải đấu thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chỉnh sửa giải đấu thành công',
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
        const response = await userApi.getProfile();
        console.log(response);
        setUserData(response.user);

        const createdById = response.user.id;

        if (response.user.role == "isAdmin") {

            await tournamentApi.getAllTournaments().then((res) => {
                console.log(res);
                setCategory(res);
                setLoading(false);
            });
        } else {
            await tournamentApi.getTournamentByUserId(createdById).then((res) => {
                console.log(res);
                setCategory(res);
                setLoading(false);
            });
        }

    }


    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await tournamentApi.deleteTournament(id).then(response => {
                if (response.message === "Cannot delete the asset because it is referenced in another process or event.") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            "Không thể xóa giải đấu vì nó đã được sử dụng trong một giải đấu hoặc quá trình khác.",

                    });
                    setLoading(false);
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa giải đấu thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa giải đấu thành công',

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
                const response = await tournamentApi.getTournamentById(id);
                setId(id);
                form2.setFieldsValue({
                    name: response.name,
                    info: response.info,
                    teams: response.teams,
                    matches: response.matches,
                    group_count: response.group_count,
                    prizes: response.prizes,
                    location: response.location,
                    id_field_types: response.id_field_types,
                    id_areas: response.id_areas,
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
            const res = await tournamentApi.searchTournaments(name.target.value);
            setCategory(res);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const handleUnBanAccount = async (data) => {
        console.log(data);

        try {
            await tournamentApi.approveTournament(data.id, "approved").then(response => {
                if (response.message === undefined) {
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
            await tournamentApi.approveTournament(data.id, "pending").then(response => {
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
            width: '10%',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Thông tin',
            dataIndex: 'info',
            key: 'info',
        },
        {
            title: 'Số đội',
            dataIndex: 'teams',
            key: 'teams',
        },
        {
            title: 'Số trận',
            dataIndex: 'matches',
            key: 'matches',
        },
        {
            title: 'Số bảng',
            dataIndex: 'group_count',
            key: 'group_count',
        },
        {
            title: 'Giải thưởng',
            dataIndex: 'prizes',
            key: 'prizes',
            render: (text, record) => {
                // Định dạng số theo format tiền Việt Nam
                const formattedPrize = Number(record.prizes).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
                return formattedPrize;
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Trạng thái phê duyệt',
            dataIndex: 'approval_status',
            key: 'approval_status',
            render: (approval) => {
                return approval === 'pending' ? 'Chưa phê duyệt' : 'Đã phê duyệt';
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        {userData.role != "isSeller" ? (
                            <>
                                <Popconfirm
                                    title="Bạn muốn phê duyệt giải đấu này?"
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
                                        title="Bạn muốn từ chối giải đấu này?"
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
                            </>
                        ) : (
                            <>
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
                                        title="Bạn có chắc chắn xóa giải đấu này?"
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


    useEffect(() => {
        (async () => {
            try {

                await areaManagementApi.getAllAreas().then((res) => {
                    console.log(res);
                    setArea(res);
                    setLoading(false);
                });

                const response = await userApi.getProfile();
                console.log(response);
                setUserData(response.user);

                const createdById = response.user.id;

                if (response.user.role == "isAdmin") {

                    await tournamentApi.getAllTournaments().then((res) => {
                        console.log(res);
                        setCategory(res);
                        setLoading(false);
                    });
                } else {
                    await tournamentApi.getTournamentByUserId(createdById).then((res) => {
                        console.log(res);
                        setCategory(res);
                        setLoading(false);
                    });
                }


                await fieldtypesApi.getAllFieldTypes().then((res) => {
                    console.log(res);
                    setFieldTypes(res);
                    setLoading(false);
                });
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
                                <span>Quản lý giải đấu</span>
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

                                                    <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo giải đấu</Button> : null}

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
                    title="Tạo giải đấu mới"
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
                        name="tournamentCreate"
                        layout="vertical"
                        initialValues={{
                            status: 'active',
                            approval_status: 'pending',
                        }}
                        scrollToFirstError
                    >
                        <Spin spinning={loading}>

                            <Form.Item
                                name="name"
                                label="Tên giải đấu"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên giải đấu!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Tên giải đấu" />
                            </Form.Item>

                            <Form.Item
                                name="info"
                                label="Thông tin"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập thông tin!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input.TextArea placeholder="Thông tin" />
                            </Form.Item>

                            <Form.Item
                                name="teams"
                                label="Số đội tham gia"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số đội tham gia!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <InputNumber placeholder="Số đội tham gia" />
                            </Form.Item>

                            <Form.Item
                                name="matches"
                                label="Số trận đấu"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số trận đấu!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <InputNumber placeholder="Số trận đấu" />
                            </Form.Item>

                            <Form.Item
                                name="group_count"
                                label="Số bảng đấu"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số bảng đấu!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <InputNumber placeholder="Số bảng đấu" />
                            </Form.Item>

                            <Form.Item
                                name="prizes"
                                label="Giải thưởng"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giải thưởng!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Giải thưởng" />
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
                    title="Chỉnh giải đấu"
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
                                label="Tên giải đấu"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên giải đấu!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Tên giải đấu" />
                            </Form.Item>

                            <Form.Item
                                name="info"
                                label="Thông tin"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập thông tin!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input.TextArea placeholder="Thông tin" />
                            </Form.Item>

                            <Form.Item
                                name="teams"
                                label="Số đội tham gia"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số đội tham gia!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <InputNumber placeholder="Số đội tham gia" />
                            </Form.Item>

                            <Form.Item
                                name="matches"
                                label="Số trận đấu"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số trận đấu!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <InputNumber placeholder="Số trận đấu" />
                            </Form.Item>

                            <Form.Item
                                name="group_count"
                                label="Số bảng đấu"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số bảng đấu!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <InputNumber placeholder="Số bảng đấu" />
                            </Form.Item>

                            <Form.Item
                                name="prizes"
                                label="Giải thưởng"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập giải thưởng!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Giải thưởng" />
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

export default Tournament;