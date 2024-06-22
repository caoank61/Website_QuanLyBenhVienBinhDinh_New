import {
    HomeOutlined,
    PlusOutlined,
    ShoppingOutlined,
    MailOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop, Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Modal,
    Row,
    Select,
    Space,
    Spin,
    Table,
    notification
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import userApi from "../../../apis/userApi";
import "./notification.css";
const { Option } = Select;

const Visitors = () => {

    const [category, setCategory] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalCreate2, setOpenModalCreate2] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [id, setId] = useState();
    const [newsList, setNewsList] = useState();

    const history = useHistory();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const showModalSend = () => {
        setOpenModalCreate2(true);
    };
    
    

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                "title": values.title,
                "content": values.content,
                "role": values.role,
            };
            return userApi.sendNotification(categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo thông báo thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo thông báo thành công',
                    });
                    setOpenModalCreate(false);
                    handleList();
                }
            })

        } catch (error) {
            throw error;
        }
    }

    const handleOkCreate2 = async (values) => {
        try {
            setLoading(true);
            const { title, content, emails } = values;
            const notificationData = {
                title,
                content,
                emails
            };
            const response = await userApi.createNotificationByEmail(notificationData);
            if (response) {
                notification.success({
                    message: 'Thông báo',
                    description: 'Gửi thông báo thành công',
                });
                setOpenModalCreate2(false);
                handleList();
            } else {
                notification.error({
                    message: 'Thông báo',
                    description: 'Gửi thông báo thất bại',
                });
            }
        } catch (error) {
            console.log('Failed to send notification:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
        }
        console.log('Clicked cancel button');
    };

    const handleCancel2 = () => {
        setOpenModalCreate2(false);
    };

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Ngày bắt đầu',
            dataIndex: 'start_date',
            key: 'start_date',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Ngày kết thúc',
            dataIndex: 'end_date',
            key: 'end_date',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
    ];

    const handleList = () => {
        (async () => {
            try {

                await userApi.listNotification().then((res) => {
                    console.log(res);
                    setNewsList(res);
                    setLoading(false);
                });
            } catch (error) {
                console.log('Failed to fetch category list:' + error);
            }
        })();
    }

    useEffect(() => {
        handleList();
    }, [])
    return (
        <div>
            <Spin spinning={false}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <ShoppingOutlined />
                                <span>Gửi thông báo</span>
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

                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={showModal} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo thông báo</Button>
                                                <Button type="primary" onClick={showModalSend} icon={<MailOutlined />}>Gửi thông báo giới thiệu</Button>

                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table     scroll={{ x: true }}
columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={newsList} />
                    </div>

                    <Modal
                        title="Gửi lời mời tham gia"
                        visible={openModalCreate2}
                        onCancel={handleCancel2}
                        footer={null}
                    >
                        <Form
                            form={form}
                            onFinish={handleOkCreate2}
                            layout="vertical"
                        >
                            <Form.Item
                                name="title"
                                label="Tiêu đề"
                                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                            >
                                <Input placeholder="Tiêu đề" />
                            </Form.Item>
                            <Form.Item
                                name="content"
                                label="Nội dung"
                                rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                            >
                                <Input.TextArea rows={4} placeholder="Nội dung" />
                            </Form.Item>
                            <Form.Item
                                name="emails"
                                label="Emails"
                                rules={[{ required: true, type: 'array', message: 'Vui lòng nhập ít nhất một địa chỉ email' }]}
                            >
                                <Select mode="tags" style={{ width: '100%' }} placeholder="Nhập địa chỉ email">
                                    {/* Option here */}
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading}>Gửi thông báo</Button>
                            </Form.Item>
                        </Form>
                    </Modal>

                    <div style={{ marginTop: 30 }}>
                        <Modal
                            title="Tạo thông báo mới"
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
                                name="eventCreate"
                                layout="vertical"
                                initialValues={{
                                    residence: ['zhejiang', 'hangzhou', 'xihu'],
                                    prefix: '86',
                                }}
                                scrollToFirstError
                            >
                                <Form.Item
                                    name="title"
                                    label="Tiêu đề"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tiêu đề!',
                                        },
                                    ]}
                                    style={{ marginBottom: 10 }}
                                >
                                    <Input placeholder="Tiêu đề" />
                                </Form.Item>
                                <Form.Item
                                    name="content"
                                    label="Nội dung"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập nội dung!',
                                        },
                                    ]}
                                    style={{ marginBottom: 10 }}
                                >
                                    <Input placeholder="Nội dung" />
                                </Form.Item>
                                <Form.Item
                                    name="role"
                                    label="Vai trò"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập vai trò!',
                                        },
                                    ]}
                                    style={{ marginBottom: 10 }}
                                >
                                    <Select placeholder="Chọn vai trò">
                                        <Option value="isSeller">Bác sỹ</Option>
                                        <Option value="isClient">Khách hàng</Option>
                                        <Option value="isAdmin">Admin</Option>
                                    </Select>
                                </Form.Item>

                            </Form>
                        </Modal>
                    </div>
                </div>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default Visitors;