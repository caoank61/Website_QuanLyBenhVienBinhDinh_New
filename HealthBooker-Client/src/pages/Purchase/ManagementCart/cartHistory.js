import {
    Breadcrumb, Button, Card, Divider,
    Modal,
    Spin, Table, Tag,
    notification
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import axiosClient from "../../../apis/axiosClient";
import bookingApi from "../../../apis/bookingApi";
import html2pdf from 'html2pdf.js';

import "./cartHistory.css";

const CartHistory = () => {
    const [orderList, setOrderList] = useState([]);
    const [loading, setLoading] = useState(true);
    let { id } = useParams();
    const history = useHistory();


    const handleCancelOrder = (order) => {
        console.log(order);
        Modal.confirm({
            title: 'Xác nhận hủy bác sỹ',
            content: 'Bạn có chắc muốn hủy bác sỹ này?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk() {
                handleUpdateOrder(order._id);
            },
        });
    };


    const handleUpdateOrder = async (id) => {
        setLoading(true);
        try {
            const categoryList = {
                "description": "Khách hàng hủy bác sỹ!",
                "status": "rejected"
            }
            await axiosClient.put("/order/" + id, categoryList).then(response => {
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
                }
            })

            handleList();
            setLoading(false);

        } catch (error) {
            throw error;
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
                            <h1>Hóa đơn bán hàng</h1>
                            <p>Ngày: ${new Date().toLocaleDateString()}</p>
                        </div>
                        <div class="invoice-details">
                            <p><span class="font-semibold">Tên sân:</span> ${order.name}</p>
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
            title: "Tên sân",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Ngày đặt",
            dataIndex: "booking_date",
            key: "booking_date",
            render: (createdAt) => (
                <span>{moment(createdAt).format("DD/MM/YYYY HH:mm")}</span>
            ),
        },
        {
            title: "Giờ bắt đầu",
            dataIndex: "start_time",
            key: "start_time",
        },
        {
            title: "Giờ kết thúc",
            dataIndex: "end_time",
            key: "end_time",
        },
        {
            title: "Tổng tiền",
            dataIndex: "total_amount",
            key: "total_amount",
            render: (products) => (
                <div>
                    {Number(products)?.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                    })}
                </div>
            ),
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
            title: 'In hóa đơn',
            dataIndex: 'order',
            key: 'order',
            render: (text, record) => (
                record.status === 'final' ? (
                    <Button
                        type="primary"
                        onClick={() => handlePrintInvoice(record)}
                    >
                        Xuất hóa đơn
                    </Button>
                ) : null
            ),
        },
        // {
        //     title: 'Hủy bác sỹ',
        //     dataIndex: 'order',
        //     key: 'order',
        //     render: (text, record) => (
        //         <Button
        //             type="danger"
        //             onClick={() => handleCancelOrder(record)}
        //             disabled={record.status !== 'pending'}
        //         >
        //             Hủy bác sỹ
        //         </Button>
        //     ),
        // },
    ];

    const handleList = () => {
        (async () => {
            try {
                const local = localStorage.getItem("user");
                const user = JSON.parse(local);
                await bookingApi.getBookingHistory(user.id).then((item) => {
                    console.log(item);
                    setOrderList(item);
                });
                setLoading(false);
            } catch (error) {
                console.log("Failed to fetch event detail:" + error);
            }
        })();
    }

    useEffect(() => {
        handleList();
        window.scrollTo(0, 0);
    }, []);

    // Thêm vào component của bạn
    const handleProductClick = (id) => {
        history.push("/product-detail/" + id);
    };

    return (
        <div>
            <Spin spinning={false}>
                <Card className="container_details">
                    <div className="product_detail">
                        <div style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }}>
                            <Breadcrumb>
                                <Breadcrumb.Item href="http://localhost:3500/home">
                                    <span>Trang chủ</span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item href="">
                                    <span>Quản lý bác sỹ </span>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <hr></hr>
                        <div className="container" style={{ marginBottom: 30 }}>

                            <br></br>
                            <Card>
                                <Table
                                    columns={columns}
                                    dataSource={orderList}
                                    rowKey="_id"
                                    pagination={{ position: ["bottomCenter"] }}
                                />
                            </Card>
                        </div>
                    </div>
                </Card>
            </Spin>
        </div>
    );
};

export default CartHistory;
