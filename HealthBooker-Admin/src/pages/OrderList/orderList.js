import {
    DeleteOutlined,
    EditOutlined,
    EyeOutlined,
    HomeOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop,
    Breadcrumb,
    Button,
    Col,
    Form,
    Input,
    Modal, Popconfirm,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    notification
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axiosClient from '../../apis/axiosClient';
import bookingApi from "../../apis/bookingApi";
import moment from 'moment';
import html2pdf from 'html2pdf.js';

import "./orderList.css";
const { Option } = Select;

const OrderList = () => {

    const [order, setOrder] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [total, setTotalList] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [id, setId] = useState();

    const history = useHistory();

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            const categoryList = {
                "name": values.name,
                "description": values.description,
                "slug": values.slug
            }
            await axiosClient.post("/category", categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Tạo danh mục thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Tạo danh mục thành công',
                    });
                    setOpenModalCreate(false);
                    handleCategoryList();
                }
            })
            setLoading(false);

        } catch (error) {
            throw error;
        }
    }

    const handleUpdateOrder = async (values) => {
        console.log(values);
        setLoading(true);
        try {
            const categoryList = {
                "status": values.status
            }
            await axiosClient.put("/booking/" + id + "/update-status/", categoryList).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Cập nhật thành công',
                    });
                    setOpenModalUpdate(false);
                    handleCategoryList();
                }
            })
            setLoading(false);

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
            const local = localStorage.getItem("user");
            const user = JSON.parse(local);
            await bookingApi.getBookingByUser(user.id).then((res) => {
                console.log(res);
                setOrder(res);
                setLoading(false);
            });
            ;
        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleEditOrder = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await bookingApi.getBookingByID(id);
                console.log(response);
                setId(id);
                form2.setFieldsValue({
                    status: response.status,
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
            const res = await bookingApi.searchOrder(name);
            setTotalList(res.totalDocs)
            setOrder(res.data.docs);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const handlePrintInvoice = (order) => {
        const formattedDate = moment(order.booking_date).format('DD/MM/YYYY HH:mm');

        const htmlContent = `
            <html>
                <head>
                    <title>Hóa đơn</title>
                    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
                    <style>
                        .invoice {
                            width: 100%;
                            margin: 0 auto;
                            padding: 1rem;
                            background-color: #fff;
                            border: 1px solid #ccc;
                            border-radius: 0.5rem;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
    
                        .invoice-header {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 1rem;
                        }
    
                        .invoice-header h1 {
                            font-size: 2rem;
                            font-weight: bold;
                            color: #333;
                        }
    
                        .invoice-details {
                            margin-bottom: 1rem;
                        }
    
                        .invoice-details p {
                            margin: 0.5rem 0;
                        }
    
                        .invoice-total {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            font-weight: bold;
                        }
                    </style>
                </head>
                <body>
                    <div class="invoice">
                        <div class="invoice-header">
                            <h1>Hóa đơn khám bệnh</h1>
                            <p>Ngày: ${new Date().toLocaleDateString()}</p>
                        </div>
                        <div class="invoice-details">
                            <p><span class="font-semibold">Tên:</span> ${order.court_name}</p>
                            <p><span class="font-semibold">Ngày đặt:</span> ${formattedDate}</p>
                            <p><span class="font-semibold">Giờ bắt đầu:</span> ${order.start_time}</p>
                            <p><span class="font-semibold">Giờ kết thúc:</span> ${order.end_time}</p>
                        </div>
                        <div class="invoice-total">
                            <span>Tổng tiền:</span>
                            <span>${order.total_amount}</span>
                        </div>
                    </div>
                </body>
            </html>
        `;
    
        html2pdf().from(htmlContent).save(`invoice_${order.id}.pdf`);
    };

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên người đặt',
            dataIndex: 'user_name',
            key: 'user_name',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        // {
        //     title: 'Tên bác sỹ',
        //     dataIndex: 'court_name',
        //     key: 'court_name',
        // },
        {
            title: 'Bác sỹ',
            dataIndex: 'owner_name',
            key: 'owner_name',
        },
        {
            title: 'Booking Date',
            dataIndex: 'booking_date',
            key: 'booking_date',
            render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>,

        },
        {
            title: 'Start Time',
            dataIndex: 'start_time',
            key: 'start_time',
        },
        {
            title: 'End Time',
            dataIndex: 'end_time',
            key: 'end_time',
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total_amount',
            key: 'total_amount',
            render: (text) => <a>{text?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</a>,
        },
        {
            title: 'Hình thức thanh toán',
            dataIndex: 'payment_method', // Thêm trường 'payment_method'
            key: 'payment_method',
        },
        {
            title: 'Trạng thái',
            key: 'status',
            dataIndex: 'status',
            render: (slugs) => (
                <span >
                    {slugs === "rejected" ? <Tag style={{ width: 170, textAlign: "center" }} color="red">Đã hủy</Tag> : slugs === "approved" ? <Tag style={{ width: 170, textAlign: "center" }} color="geekblue" key={slugs}>
                        Đang xem xét
                    </Tag> : slugs === "final" ? <Tag color="green" style={{ width: 170, textAlign: "center" }}>Đã xác nhận - Đã thanh toán</Tag> : <Tag color="blue" style={{ width: 170, textAlign: "center" }}>Đợi xác nhận</Tag>}
                </span>
            ),
        },
        {
            title: 'Hành động',
            key: 'Hành động',
            render: (text, record) => (
                <div>
                    <Row>
                        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                style={{ width: 150, borderRadius: 15, height: 30 }}
                                onClick={() => handleEditOrder(record.id)}
                            >
                                Chỉnh sửa
                            </Button>
                            {record.status === 'final' ? (
                                <Button
                                    type="primary"
                                    onClick={() => handlePrintInvoice(record)}
                                >
                                    Xuất hóa đơn
                                </Button>
                            ) : null}
                        </div>
                    </Row>

                </div >
            ),
        },
    ];


    useEffect(() => {
        (async () => {
            try {
                const local = localStorage.getItem("user");
                const user = JSON.parse(local);
                await bookingApi.getBookingByCourtsUser(user.id).then((res) => {
                    console.log(res);
                    setOrder(res);
                    setLoading(false);
                });
                ;
            } catch (error) {
                console.log('Failed to fetch event list:' + error);
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
                                <ShoppingCartOutlined />
                                <span>Quản lý đặt lịch khám</span>
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
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table scroll={{ x: true }}
                            columns={columns} pagination={{ position: ['bottomCenter'] }} dataSource={order} />
                    </div>
                </div>

                <Modal
                    title="Tạo danh mục mới"
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
                            name="name"
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your sender name!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your subject!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Mô tả" />
                        </Form.Item>

                        <Form.Item
                            name="slug"
                            label="Slug"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your content!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Slug" />
                        </Form.Item>

                    </Form>
                </Modal>

                <Modal
                    title="Cập nhật đặt khám"
                    visible={openModalUpdate}
                    style={{ top: 100 }}
                    onOk={() => {
                        form2
                            .validateFields()
                            .then((values) => {
                                form2.resetFields();
                                handleUpdateOrder(values);
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
                        <Form.Item
                            name="status"
                            label="Trạng thái"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your sender name!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select >
                                <Option value="final">Đã xác nhận - Đã thanh toán</Option>
                                <Option value="approved">Đang xem xét</Option>
                                <Option value="pending">Đợi xác nhận</Option>
                                <Option value="rejected">Đã hủy</Option>
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>

                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default OrderList;