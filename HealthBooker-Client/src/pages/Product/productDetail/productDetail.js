import {
    Breadcrumb, Button, Card, Carousel, Col, Form,
    Modal, Row,
    Spin,
    notification, TimePicker, DatePicker, Select, Calendar
} from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import courtsManagementApi from "../../../apis/courtsManagementApi";
import triangleTopRight from "../../../assets/icon/Triangle-Top-Right.svg";
import { numberWithCommas } from "../../../utils/common";
import bookingApi from "../../../apis/bookingApi";
import dayjs from 'dayjs';
import moment from "moment";
import userApi from "../../../apis/userApi";

const { Option } = Select;

const ProductDetail = () => {
    const [productDetail, setProductDetail] = useState([]);
    const [recommend, setRecommend] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    let { id } = useParams();
    const history = useHistory();

    const handleReadMore = (id) => {
        console.log(id);
        history.push("/product-detail/" + id);
        window.location.reload();
    };


    const [reviews, setProductReview] = useState([]);
    const [reviewsCount, setProductReviewCount] = useState([]);
    const [avgRating, setAvgRating] = useState(null);
    const [bookingCourt, setBookingCourt] = useState([]);

    const [userData, setUserData] = useState([]);

    const [qr, setQR] = useState();

    const handleCategoryList = async () => {
        try {
            await bookingApi.getBookingByCourt(id).then(item => {
                console.log(item);
                setBookingCourt(item);
            })

            await courtsManagementApi.getCourtById(id).then((item) => {
                setProductDetail(item);
                setProductReview(item.reviews);
                setProductReviewCount(item.reviewStats);
                setAvgRating(item.avgRating);
                console.log(((reviewsCount[4] || 0) / reviews.length) * 100);
            });
            await courtsManagementApi.getAllCourts().then((item) => {
                setRecommend(item);
            });
            setLoading(false);

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        };
    }

    useEffect(() => {
        (async () => {
            try {

                await bookingApi.getBookingByCourt(id).then(async item => {
                    console.log(item);
                    setBookingCourt(item);


                });

                // Lấy thông tin user và role từ localStorage
                const user = localStorage.getItem('user');
                const parsedUser = user ? JSON.parse(user) : null;
                setUserData(parsedUser);

                await courtsManagementApi.getCourtById(id).then(async item => {
                    const res = await userApi.getProfileByID(item.id_users); // Sử dụng await ở đây
                    console.log(res);
                    setProductDetail(item);
                    setProductReview(item.reviews);
                    setProductReviewCount(item.reviewStats);
                    setAvgRating(item.avgRating);
                    console.log(((reviewsCount[4] || 0) / reviews.length) * 100);
                });
                await courtsManagementApi.getAllCourts().then((item) => {
                    setRecommend(item);
                });

                setLoading(false);
            } catch (error) {
                console.log("Failed to fetch event detail:" + error);
            }
        })();
        window.scrollTo(0, 0);
    }, []);

    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
        }
        console.log('Clicked cancel button');
    };


    const handleOkUser = async (values) => {
        const user = localStorage.getItem('user');
        if (!user) {
            return history.push("/login")
        }
        setLoading(true);
        try {
            const bookingDateTime = dayjs(values.booking_date); // Chuyển đổi booking_date thành đối tượng dayjs
            const startTime = dayjs(values.start_time);
            const endTime = dayjs(values.end_time);
            // Tính thời gian đặt lịch khám (phút)
            const bookingDuration = endTime.diff(startTime, 'minute');
            console.log("thời gian đặt lịch khám", bookingDuration)
            // Tính total_amount
            const totalAmount = ((bookingDuration / 60) * productDetail.price);
            const categoryList = {
                "booking_date": bookingDateTime.format('YYYY-MM-DD'), // Lấy ngày tháng năm
                "payment_method": values.payment_method,
                "start_time": startTime.format('HH:mm'), // Lấy giờ và phút
                "end_time": endTime.format('HH:mm'),
                "user_id": userData.id,
                "court_id": Number(id),
                "total_amount": totalAmount
            };
            setLoading(false);

            return bookingApi.bookCourt(categoryList).then(response => {
                if (response.message === "Booking time conflicts with existing booking") {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Đặt lịch khám không được trùng',
                    });
                    return;
                }
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Đặt lịch khám thất bại',
                    });
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Đặt lịch khám thành công',
                    });
                    setOpenModalCreate(false);

                    handleCategoryList();
                }

            })

        } catch (error) {
            throw error;
        }
    }

    const [openModalCreate, setOpenModalCreate] = useState(false);

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const isButtonDisabled = productDetail.status !== 'active' ? true : false;
    const buttonText = isButtonDisabled ? 'bác sỹ đang đóng' : 'Đặt lịch';

    function disabledDate(current) {
        // Vô hiệu hóa tất cả các ngày quá khứ
        return current && current < moment().startOf('day');
    }

    return (
        <div>
            <Spin spinning={false}>
                <Card className="container_details">
                    <div className="product_detail">
                        <div style={{ marginLeft: 5, marginBottom: 10 }}>
                            <Breadcrumb>
                                <Breadcrumb.Item href="http://localhost:3500/home">
                                    {/* <HomeOutlined /> */}
                                    <span>Trang chủ</span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item href="http://localhost:3500/product-list/643cd88879b4192efedda4e6">
                                    {/* <AuditOutlined /> */}
                                    <span>bác sỹ</span>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item href="">
                                    <span>{productDetail.name}</span>
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <hr></hr>
                        <Row gutter={12} style={{ marginTop: 20, marginBottom: 20 }}>
                            <Col span={13}>
                                {productDetail?.slide?.length > 0 ? (
                                    <Carousel autoplay className="carousel-image">
                                        {productDetail.slide.map((item) => (
                                            <div className="img" key={item}>
                                                <img
                                                    style={{ width: '100%', objectFit: 'contain', height: '500px' }}
                                                    src={item}
                                                    alt=""
                                                />
                                            </div>
                                        ))}
                                    </Carousel>
                                ) : (
                                    <Card className="card_image" bordered={false}>
                                        <img src={productDetail.image} />
                                        <div className="promotion"></div>
                                    </Card>
                                )}
                            </Col>
                            <Col span={11}>
                                <div className="price" style={{ paddingBottom: 10 }}>
                                    <h1 className="product_name">{productDetail.name}</h1>
                                </div>
                                <Card
                                    className="card_total"
                                    bordered={false}
                                    style={{ width: "90%" }}
                                >
                                    

                                    <div class="box-product-promotion">
                                        <div class="box-product-promotion-header">
                                            <p>Ưu đãi Đặc Biệt</p>
                                        </div>
                                        <div class="box-content-promotion">
                                            <p class="box-product-promotion-number"></p>
                                            <a>
                                                Đặt lịch khám ngay - bác sĩ hàng đầu<br />
                                                <br /> Khuyến mãi giảm giá khi đặt lịch khám trước <br />
                                                <br /> Phòng khám mới, sạch sẽ và hiện đại
                                            </a>
                                        </div>
                                    </div>


                                    <div className="mt-3 flex flex-wrap justify-center items-center gap-4">
                                        {/* Wifi */}
                                        <div className="bg-gray-200 rounded-full p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 16a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 1 0v11a.5.5 0 0 1-.5.5zM10 6a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 1 0v1a.5.5 0 0 1-.5.5z" />
                                                <path fillRule="evenodd" d="M2.146 6.146a.5.5 0 0 1 .708 0l1.414 1.414a.5.5 0 0 1-.708.708L2.146 6.854a1.5 1.5 0 0 1 0-2.122l1.414-1.414a.5.5 0 1 1 .708.708L2.854 4.146a.5.5 0 0 0 0 .708zm15.708 1.708a.5.5 0 0 0-.708 0l-1.414 1.414a.5.5 0 1 0 .708.708l1.414-1.414a1.5 1.5 0 0 0 0-2.122l-1.414-1.414a.5.5 0 1 0-.708.708l1.414 1.414a.5.5 0 0 0 0 .708zM4 9.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 1 0v2a.5.5 0 0 1-.5.5zm12 0a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 1 0v2a.5.5 0 0 1-.5.5zm-9 0a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 1 0v3a.5.5 0 0 1-.5.5zm6 0a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 1 0v3a.5.5 0 0 1-.5.5zm-3-1a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 1 0v1a.5.5 0 0 1-.5.5z" />
                                            </svg>
                                        </div>
                                        <span>Wifi</span>

                                        {/* Bãi đỗ xe máy */}
                                        <div className="bg-gray-200 rounded-full p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M15 3a1 1 0 0 1 1 1v3h2a1 1 0 1 1 0 2h-2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9H1a1 1 0 0 1 0-2h2V4a1 1 0 0 1 1-1h11zM8 4H4v14h12V7h-2V5a1 1 0 0 0-1-1H8z" />
                                            </svg>
                                        </div>
                                        <span>Bãi đỗ xe máy</span>

                                        {/* Căng tin */}
                                        <div className="bg-gray-200 rounded-full p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M1 4a1 1 0 0 1 1-1h2.586A1.986 1.986 0 0 0 5 4.586V6h4V4.586a1.986 1.986 0 0 0-.586-1.414L9 1h2l.586 1.586A1.986 1.986 0 0 0 11 4.586V6h6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm3 8H3V9h1v3zm0-4H3V5h1v3zm4 0H7V5h1v3zm4 0h-1V5h1v3zm0 4H11V9h1v3zm0-4H11V5h1v3zm4 0h-1V5h1v3z" />
                                            </svg>
                                        </div>
                                        <span>Căng tin</span>

                                        {/* Bảo vệ */}
                                        <div className="bg-gray-200 rounded-full p-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 0 0-1 1v12a1 1 0 0 0 2 0V4a1 1 0 0 0-1-1zM4 8a1 1 0 1 0 0 2h12a1 1 0 1 0 0-2H4z" />
                                            </svg>
                                        </div>
                                        <span>Bảo vệ</span>
                                    </div>



                                    <div className="box_cart_1">
                                        <Button
                                            type="primary" // Loại primary cho nút "Mua ngay"
                                            className="by"
                                            size="large"
                                            onClick={showModal}
                                            disabled={isButtonDisabled} // Sử dụng biểu thức điều kiện để disable nút
                                        >
                                            {buttonText}
                                        </Button>

                                    </div>
                                </Card>
                            </Col>
                        </Row>
                        <hr />
                        <div className="title_total" style={{ fontSize: 20, marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>
                            Lịch bệnh nhân đã đặt:
                        </div>                        <Calendar
                            dateCellRender={(date) => {
                                const dateEvents = bookingCourt.filter((booking) => moment(booking.booking_date).isSame(date, 'day'));
                                return (
                                    <div>
                                        {dateEvents.map((booking, index) => (
                                            <div key={index}>
                                                <p>Lịch số: {index + 1}</p>
                                                <p>Giờ bắt đầu: {moment(booking.start_time, 'HH:mm').format('HH:mm')}</p>
                                                <p>Giờ kết thúc: {moment(booking.end_time, 'HH:mm').format('HH:mm')}</p>
                                            </div>
                                        ))}
                                    </div>
                                );
                            }}
                        />





                        <hr />
                        <div className="describe">
                            <div className="title_total" style={{ fontSize: 20, marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>
                                Giới thiệu: "{productDetail.name}"
                            </div>
                            <div
                                className="describe_detail_description"
                                dangerouslySetInnerHTML={{ __html: productDetail.description }}
                            ></div>
                        </div>
                        <hr />
                        <div className="price" style={{ marginTop: 20, fontSize: 20 }}>
                            <h1 className="product_name" style={{ fontWeight: 'bold' }}>Bác sỹ bạn có thể quan tâm</h1>
                        </div>
                        <Row
                            style={{ marginTop: 40 }}
                            className="row-product"
                        >
                            {recommend?.map((item) => (
                                <Col
                                    xl={{ span: 6 }}
                                    lg={{ span: 6 }}
                                    md={{ span: 12 }}
                                    sm={{ span: 12 }}
                                    xs={{ span: 24 }}
                                    onClick={() => handleReadMore(item.id)}
                                    key={item.id}
                                >
                                    <div className="show-product" style={{ marginRight: 15 }}>
                                        {item.image ? (
                                            <img className="image-product" src={item.image} />
                                        ) : (
                                            <img
                                                className="image-product"
                                                src={require("../../../assets/image/NoImageAvailable.jpg")}
                                            />
                                        )}
                                        <div className='wrapper-products'>
                                            <Paragraph
                                                className='title-product'
                                                ellipsis={{ rows: 2 }}
                                            >
                                                {item.name}
                                            </Paragraph>

                                            <div>Khu vực: {item.area}</div>
                                            <div>chuyên khoa: {item.field_type}</div>
                                        </div>


                                    </div>
                                    <Paragraph
                                        className="badge"
                                        style={{ position: "absolute", top: 10, left: 9 }}
                                    >
                                        <span>Gợi ý</span>
                                        <img src={triangleTopRight} />
                                    </Paragraph>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    <Modal
                        title="Tạo đơn đặt lịch khám mới"
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
                            name="courtBookingCreate"
                            layout="vertical"
                            initialValues={{
                                payment_method: 'Thanh toán trực tiếp',
                            }}
                            scrollToFirstError
                        >
                            <Spin spinning={loading}>

                                <Form.Item
                                    name="booking_date"
                                    label="Ngày đặt lịch khám"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn ngày đặt lịch khám!',
                                        },
                                    ]}
                                    style={{ marginBottom: 10 }}
                                >
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        disabledDate={disabledDate}
                                        placeholder="Chọn ngày đặt"
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="start_time"
                                    label="Giờ bắt đầu"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn giờ bắt đầu!',
                                        },
                                    ]}
                                    style={{ marginBottom: 10 }}
                                >
                                    <TimePicker
                                        style={{ width: '100%' }}
                                        placeholder="Chọn thời gian bắt đầu"
                                        format="HH:mm"
                                        disabledHours={() => {
                                            // Giới hạn giờ từ 7h đến 22h
                                            const disabledHours = [];
                                            for (let i = 0; i < 7; i++) {
                                                disabledHours.push(i);
                                            }
                                            for (let i = 23; i < 24; i++) {
                                                disabledHours.push(i);
                                            }
                                            return disabledHours;
                                        }}
                                        disabledMinutes={(selectedHour) => {
                                            // Lấy thời gian hiện tại
                                            const currentTime = new Date();
                                            const currentHour = currentTime.getHours();
                                            const currentMinute = currentTime.getMinutes();

                                            // Nếu giờ được chọn là giờ hiện tại, chỉ chặn các phút nhỏ hơn phút hiện tại
                                            if (selectedHour === currentHour) {
                                                const disabledMinutes = [];
                                                for (let i = 0; i < currentMinute; i++) {
                                                    disabledMinutes.push(i);
                                                }
                                                return disabledMinutes;
                                            }

                                            // Nếu giờ được chọn lớn hơn giờ hiện tại, không chặn bất kỳ phút nào
                                            return [];
                                        }}
                                        minuteStep={30} // Bước nhảy của phút
                                    />

                                </Form.Item>

                                <Form.Item
                                    name="end_time"
                                    label="Giờ kết thúc"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn giờ kết thúc!',
                                        },
                                    ]}
                                    style={{ marginBottom: 10 }}
                                >
                                    <TimePicker
                                        style={{ width: '100%' }}
                                        format="HH:mm"
                                        placeholder="Chọn thời gian kết thúc"
                                        disabledHours={() => {
                                            // Giới hạn giờ từ 7h đến 22h
                                            const disabledHours = [];
                                            for (let i = 0; i < 7; i++) {
                                                disabledHours.push(i);
                                            }
                                            for (let i = 23; i < 24; i++) {
                                                disabledHours.push(i);
                                            }
                                            return disabledHours;
                                        }}
                                        disabledMinutes={(selectedHour) => {
                                            // Lấy thời gian hiện tại
                                            const currentTime = new Date();
                                            const currentHour = currentTime.getHours();
                                            const currentMinute = currentTime.getMinutes();

                                            // Nếu giờ được chọn là giờ hiện tại, chỉ chặn các phút nhỏ hơn phút hiện tại
                                            if (selectedHour === currentHour) {
                                                const disabledMinutes = [];
                                                for (let i = 0; i < currentMinute; i++) {
                                                    disabledMinutes.push(i);
                                                }
                                                return disabledMinutes;
                                            }

                                            // Nếu giờ được chọn lớn hơn giờ hiện tại, không chặn bất kỳ phút nào
                                            return [];
                                        }}
                                        minuteStep={30} // Bước nhảy của phút
                                    />

                                </Form.Item>

                                <Form.Item
                                    name="payment_method"
                                    label="Phương thức thanh toán"
                                    style={{ marginBottom: 10 }}
                                >
                                    <Select style={{ width: '100%' }}>
                                        <Select.Option value="Thanh toán trực tiếp">Thanh toán trực tiếp</Select.Option>
                                        <Select.Option value="Chuyển khoản">Chuyển khoản</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="image_qr"
                                    label="Ảnh QR thanh toán"
                                    style={{ marginBottom: 10 }}
                                >
                                  
                                        <img src="https://i.ibb.co/FzJrSws/448311044-1844405769400493-3358237318138491974-n.jpg" alt="QR Code" style={{ maxWidth: '100%', height: 'auto' }} />
                                 
                                </Form.Item>


                            </Spin>
                        </Form>
                    </Modal>

                </Card>
            </Spin>
        </div>
    );
};

export default ProductDetail;
