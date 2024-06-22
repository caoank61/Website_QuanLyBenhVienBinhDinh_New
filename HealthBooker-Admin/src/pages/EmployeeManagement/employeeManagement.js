import { CheckCircleOutlined, CopyOutlined, HomeOutlined, PlusOutlined, StopOutlined, UserOutlined } from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import { BackTop, Breadcrumb, Button, Modal, Form, Card, Col, Input, Popconfirm, Row, Space, Spin, Table, Tag, notification, message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import employeeApi from "../../apis/employeeApi";
import "./employeeManagement.css";
import axiosClient from '../../apis/axiosClient';
import userApi from '../../apis/userApi';

const { Option } = Select;

const EmployeeManagement = () => {

    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [selectedInput, setSelectedInput] = useState();
    const [form] = Form.useForm();

    const history = useHistory();

    const titleCase = (str) => {
        var splitStr = str?.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        // Directly return the joined string
        return splitStr.join(' ');
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'index',
            render: (value, item, index) => (
                (page - 1) * 10 + (index + 1)
            ),
        },
        {
            title: 'Mã nhân viên',
            dataIndex: 'employee_code',
            key: 'employee_code',
        },
        {
            title: 'Tên',
            dataIndex: 'username',
            key: 'username',
            render: (text, record) => (
                <Space size="middle">
                    {
                        text == null || text == undefined ? "" :
                            <p style={{ margin: 0 }}>{titleCase(text)}</p>
                    }

                </Space>
            ),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            width: '12%',
            render: (text, record) => (
                <Space size="middle">
                    {
                        text === "isAdmin" ?
                            <Tag color="blue" key={text} style={{ width: 120, textAlign: "center" }} icon={<CopyOutlined />}>
                                Quản lý
                            </Tag> : text === "isEmployee" ?
                                <Tag color="green" key={text} style={{ width: 120, textAlign: "center" }} icon={<CheckCircleOutlined />}>
                                    Nhân viên
                                </Tag> : text === "isClient" ?
                                    <Tag color="geekblue" key={text} style={{ width: 120, textAlign: "center" }} icon={<UserOutlined />}>
                                        Khách hàng
                                    </Tag> : null
                    }
                </Space>
            ),
        },

        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => (
                <Space size="middle">
                    {

                        text === "actived" ?
                            <Tag color="green" key={text} style={{ width: 80, textAlign: "center" }}>
                                Hoạt động
                            </Tag> : text == "newer" ? <Tag color="blue" key={text} style={{ width: 80, textAlign: "center" }}>
                                Newer
                            </Tag>

                                : <Tag color="default" key={text} style={{ width: 80, textAlign: "center" }}>
                                    Chặn
                                </Tag>
                    }

                </Space>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        {record.status !== "actived" ? <Popconfirm
                            title="Bạn muốn mở chặn nhân viên này?"
                            onConfirm={() => handleUnBanAccount(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                size="small"
                                icon={<CheckCircleOutlined />}
                                style={{ width: 160, borderRadius: 15, height: 30 }}
                            >{"Mở chặn nhân viên"}
                            </Button>
                        </Popconfirm> : <Popconfirm
                            title="Bạn muốn chặn nhân viên này?"
                            onConfirm={() => handleBanAccount(record)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button
                                size="small"
                                icon={<StopOutlined />}
                                style={{ width: 160, borderRadius: 15, height: 30 }}
                            >{"Chặn nhân viên"}
                            </Button>
                        </Popconfirm>}
                    </Row>

                </div >
            ),
        },
    ];

    const handleListUser = async () => {
        try {

            const response = await employeeApi.getEmployeeByUserId(userData.id);
            console.log(response);
            setUser(response);
            setLoading(false);
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleUnBanAccount = async (data) => {
        const params = {
            "username": data.username,
            "email": data.email,
            "employeeCode": data.employee_code,
            "password": data.password,
            "role": data.role,
            "status": "actived",
            "userId": userData.id,
            "role": "isEmployee"
        }
        try {
            await employeeApi.unBanAccount(params, data.id).then(response => {
                if (response.message === "Email already exists") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Mở khóa thất bại',

                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Mở khóa thành công',

                    });
                    handleListUser();
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleBanAccount = async (data) => {
        console.log(data);
        const params = {
            "username": data.username,
            "email": data.email,
            "employeeCode": data.employee_code,
            "password": data.password,
            "role": data.role,
            "status": "noactive",
            "userId": userData.id,
            "role": "isEmployee"
        }
        try {
            await employeeApi.banAccount(params, data.id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Chặn thất bại',

                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Chặn thành công',

                    });
                    handleListUser();
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleFilterEmail = async (email) => {
        try {
            const response = await employeeApi.searchUser(email);
            setUser(response.data);
        } catch (error) {
            console.log('search to fetch user list:' + error);
        }
    }

    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const accountCreate = async (values) => {
        try {
            const formatData = {
                "username": values.name,
                "email": values.email,
                "employeeCode": values.employee_code,
                "password": values.password,
                "role": values.role,
                "status": "actived",
                "userId": userData.id,
                "role": "isEmployee"

            }
            await axiosClient.post("/employee/addEmployee", formatData)
                .then(response => {
                    console.log(response)
                    if (response == "User with this phone number already exists") {
                        return message.error('Số điện thoại không được trùng');
                    }

                    if (response == "User with this email already exists") {
                        return message.error('Email không được trùng');
                    }

                    if (response == "User already exists") {
                        return message.error('nhân viên đã tổn tại');
                    } else
                        if (response.message == "Validation failed: Email has already been taken") {
                            message.error('Email has already been taken');
                        } else
                            if (response.message == "Validation failed: Phone has already been taken") {
                                message.error('Validation failed: Phone has already been taken');
                            } else
                                if (response == undefined) {
                                    notification["error"]({
                                        message: `Thông báo`,
                                        description:
                                            'Tạo nhân viên thất bại',

                                    });
                                }
                                else {
                                    notification["success"]({
                                        message: `Thông báo`,
                                        description:
                                            'Tạo nhân viên thành công',
                                    });
                                    form.resetFields();
                                    handleList();
                                }
                }
                );

            setIsModalVisible(false);

        } catch (error) {
            throw error;
        }
        setTimeout(function () {
            setLoading(false);
        }, 1000);
    }

    const CancelCreateRecruitment = () => {
        setIsModalVisible(false);
        form.resetFields();
        history.push("/account-management");
    }


    const [userData, setUserData] = useState([]);
    const handleList = () => {
        (async () => {
            try {

                const response = await userApi.getProfile();
                console.log(response);
                setUserData(response.user);

                const response2 = await employeeApi.getEmployeeByUserId(response.user.id);
                console.log(response2);
                setUser(response2);
                setLoading(false);
            } catch (error) {
                console.log('Failed to fetch user list:' + error);
            }
        })();
    }

    useEffect(() => {
        handleList();
        window.scrollTo(0, 0);

    }, [])
    return (
        <div>
            <Spin spinning={loading}>
                <div style={{ marginTop: 20, marginLeft: 24 }}>
                    <Breadcrumb>
                        <Breadcrumb.Item href="">
                            <HomeOutlined />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="">
                            <UserOutlined />
                            <span>Quản lý nhân viên</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div id="account">
                    <div id="account_container">
                        <PageHeader
                            subTitle=""
                            style={{ fontSize: 14, paddingTop: 20, paddingBottom: 20 }}
                        >
                            <Row>
                                <Col span="12">
                                    <Input
                                        placeholder="Tìm kiếm theo email"
                                        allowClear
                                        style={{ width: 300 }}
                                        onChange={handleFilterEmail}
                                        value={selectedInput}
                                    />
                                </Col>
                                <Col span="12">
                                    <Row justify="end">
                                        <Button style={{ marginLeft: 10 }} icon={<PlusOutlined />} size="middle" onClick={showModal}>{"Tạo nhân viên"}</Button>
                                    </Row>
                                </Col>
                            </Row>

                        </PageHeader>
                    </div>
                </div>
                <div style={{ marginTop: 20, marginRight: 5 }}>
                    <div id="account">
                        <div id="account_container">
                            <Card title="Quản lý nhân viên" bordered={false} >
                                <Table      scroll={{ x: true }}
 columns={columns} dataSource={user} pagination={{ position: ['bottomCenter'] }}
                                />
                            </Card>
                        </div>
                    </div>
                </div>
                <Modal
                    title="Thêm nhân viên"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Form
                        form={form}
                        onFinish={accountCreate}
                        name="accountCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="name"
                            label="Tên"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên!',
                                },
                                { max: 100, message: 'Tên tối đa 100 ký tự' },
                                { min: 5, message: 'Tên ít nhất 5 ký tự' },
                            ]
                            }
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            hasFeedback
                            rules={[
                                {
                                    type: 'email',
                                    message: 'Email không hợp lệ!',
                                },
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập password!',
                                },
                                { max: 20, message: 'Mật khẩu tối đa 20 ký tự' },
                                { min: 6, message: 'Mật khẩu ít nhất 5 ký tự' },
                            ]
                            }
                            style={{ marginBottom: 10 }}
                        >
                            <Input.Password placeholder="Mật khẩu" />
                        </Form.Item>

                        <Form.Item
                            name="employee_code"
                            label="Mã nhân viên"
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mã nhân viên!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >

                            <Input placeholder="Mã nhân viêni" />
                        </Form.Item>

                        <Form.Item >
                            <Button style={{ background: "#FF8000", color: '#FFFFFF', float: 'right', marginTop: 20, marginLeft: 8 }} htmlType="submit">
                                Hoàn thành
                            </Button>
                            <Button style={{ background: "#FF8000", color: '#FFFFFF', float: 'right', marginTop: 20 }} onClick={CancelCreateRecruitment}>
                                Hủy
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div>
    )
}

export default EmployeeManagement;