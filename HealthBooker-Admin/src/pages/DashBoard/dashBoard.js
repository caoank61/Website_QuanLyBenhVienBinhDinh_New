import {
    ContactsTwoTone,
    DashboardOutlined,
    EnvironmentTwoTone,
    FolderOpenTwoTone,
    HddTwoTone,
    HomeOutlined,
    NotificationTwoTone,
    ShopTwoTone,
    ShoppingTwoTone
} from '@ant-design/icons';
import {
    BackTop,
    Breadcrumb,
    Card,
    Col,
    Row,
    Spin,
    Tag
} from 'antd';
import React, { useEffect, useState } from 'react';
import dashBoardApi from "../../apis/dashBoardApi";
import "./dashBoard.css";
import fieldtypesApi from '../../apis/fieldtypesApi';
import areaManagementApi from '../../apis/areaManagementApi';
import productTypeAPI from '../../apis/productTypeApi';
import productAPI from '../../apis/productApi';
import tournamentApi from '../../apis/tournamentApi';
import courtsManagementApi from '../../apis/courtsManagementApi';
import userApi from '../../apis/userApi';
import statisticsApi from '../../apis/statisticsApi';
import bookingApi from '../../apis/bookingApi';


const DashBoard = () => {
    const [statisticList, setStatisticList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotalList] = useState();
    const [area, setArea] = useState(null);
    const [type, setType] = useState(null);
    const [tournament, setTournament] = useState(null);
    const [product, setProduct] = useState(null);
    const [courts, setCourts] = useState(null);
    const [userData, setUserData] = useState([]);
    const [statisticListSeller, setStatisticListSeller] = useState([]);
    const [bookingData, setBookingData] = useState([]);
    const [startDate, setStartDate] = useState('2024-01-01'); // Default start date
    const [endDate, setEndDate] = useState('2024-12-31');

    useEffect(() => {
        (async () => {
            try {

                const response = await userApi.getProfile();
                console.log(response);
                setUserData(response.user);


                if(response.user.role == "isAdmin"){

                    const res = await bookingApi.getDetailedRevenueReport(startDate, endDate);
                    setBookingData(res);
                }else{
                    const res = await bookingApi.getDetailedRevenueReport(startDate, endDate, response.user.id);
                    setBookingData(res);
                }

                await fieldtypesApi.getAllFieldTypes().then((res) => {
                    console.log(res);
                    setTotalList(res)
                    setLoading(false);
                });

                await statisticsApi.getAllStatistics(response.user.id).then((res) => {
                    console.log(res);
                    setStatisticListSeller(res)
                    setLoading(false);
                });


                await productTypeAPI.getAllProductTypes().then((res) => {
                    console.log(res);
                    setType(res)
                    setLoading(false);
                });


                await productAPI.getAllProducts().then((res) => {
                    console.log(res);
                    setProduct(res)
                    setLoading(false);
                });

                await courtsManagementApi.getAllCourts().then((res) => {
                    console.log(res);
                    setCourts(res)
                    setLoading(false);
                });

                await areaManagementApi.getAllAreas().then((res) => {
                    console.log(res);
                    setArea(res)
                    setLoading(false);
                });

                await tournamentApi.getAllTournaments().then((res) => {
                    console.log(res);
                    setTournament(res)
                    setLoading(false);
                });

                await dashBoardApi.getAssetStatistics().then((res) => {
                    console.log(res);
                    setStatisticList(res);
                    setLoading(false);
                });


            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }, [startDate, endDate]);
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
                                <DashboardOutlined />
                                <span>DashBoard</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    {userData.role === "isAdmin" ?
                        <>
                            <Row gutter={12} style={{ marginTop: 20 }}>
                                <Col span={6}>
                                    <Card className="card_total" bordered={false}>
                                        <div className='card_number'>
                                            <div>
                                                <div className='number_total'>{statisticList?.userCount}</div>
                                                <div className='title_total'>Số thành viên</div>
                                            </div>
                                            <div>
                                                <ContactsTwoTone style={{ fontSize: 48 }} />
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card className="card_total" bordered={false}>
                                        <div className='card_number'>
                                            <div>
                                                <div className='number_total'>{total?.length}</div>
                                                <div className='title_total'>Tổng chuyên khoa</div>
                                            </div>
                                            <div>
                                                <NotificationTwoTone style={{ fontSize: 48 }} />
                                            </div>
                                        </div>
                                    </Card>
                                </Col>

                                <Col span={6}>
                                    <Card className="card_total" bordered={false}>
                                        <div className='card_number'>
                                            <div>
                                                <div className='number_total'>{area?.length}</div>
                                                <div className='title_total'>Số khu vực</div>
                                            </div>
                                            <div>
                                                <EnvironmentTwoTone style={{ fontSize: 48 }} />
                                            </div>
                                        </div>
                                    </Card>
                                </Col>

                                <Col span={6}>
                                    <Card className="card_total" bordered={false}>
                                        <div className='card_number'>
                                            <div>
                                                <div className='number_total'>{type?.length}</div>
                                                <div className='title_total'>Số loại dịch vụ</div>
                                            </div>
                                            <div>
                                                <ShoppingTwoTone style={{ fontSize: 48 }} />
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            </Row>

                            <Row gutter={12} style={{ marginTop: 20 }}>
                                <Col span={6}>
                                    <Card className="card_total" bordered={false}>
                                        <div className='card_number'>
                                            <div>
                                                <div className='number_total'>{product?.length}</div>
                                                <div className='title_total'>Số dịch vụ</div>
                                            </div>
                                            <div>
                                                <FolderOpenTwoTone style={{ fontSize: 48 }} />
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card className="card_total" bordered={false}>
                                        <div className='card_number'>
                                            <div>
                                                <div className='number_total'>{tournament?.length}</div>
                                                <div className='title_total'>Tổng số kết quả</div>
                                            </div>
                                            <div>
                                                <HddTwoTone style={{ fontSize: 48 }} />
                                            </div>
                                        </div>
                                    </Card>
                                </Col>

                                {/* <Col span={6}>
                                    <Card className="card_total" bordered={false}>
                                        <div className='card_number'>
                                            <div>
                                                <div className='number_total'>{courts?.length}</div>
                                                <div className='title_total'>Số kết quả</div>
                                            </div>
                                            <div>
                                                <ShopTwoTone style={{ fontSize: 48 }} />
                                            </div>
                                        </div>
                                    </Card>
                                </Col> */}

                                {/* <Col span={6}>
                            <Card className="card_total" bordered={false}>
                                <div className='card_number'>
                                    <div>
                                        <div className='number_total'>{type?.length}</div>
                                        <div className='title_total'>Số loại dịch vụ</div>
                                    </div>
                                    <div>
                                        <ShopTwoTone style={{ fontSize: 48 }} />
                                    </div>
                                </div>
                            </Card>
                        </Col> */}
                            </Row>
                            <div className="container mx-auto p-8">
                                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Báo Cáo Đặt Lịch Khám</h1>
                                <div className="flex justify-center mb-8">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="mr-2 p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-400"
                                    />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="mr-2 p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-400"
                                    />
                                </div>

                                {loading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                                            <thead className="bg-gray-800 text-white">
                                                <tr>
                                                    <th className="py-3 px-6 text-left">Tên Sân</th>
                                                    <th className="py-3 px-6 text-left">Số Lượt Đặt</th>
                                                    <th className="py-3 px-6 text-left">Tổng Doanh Thu</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-700">
                                                {bookingData?.map((item, index) => (
                                                    <tr key={index} className="border-b hover:bg-gray-100">
                                                        <td className="py-3 px-6">{item.court_name}</td>
                                                        <td className="py-3 px-6">{item.booking_count}</td>
                                                        <td className="py-3 px-6">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total_revenue)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </> :
                        <>
                            <Row gutter={12} style={{ marginTop: 20 }}>
                                <Col span={6}>
                                    <Card className="card_total" bordered={false}>
                                        <div className='card_number'>
                                            <div>
                                                <div className='number_total'>{statisticListSeller?.courts?.length}</div>
                                                <div className='title_total'>Số bác sỹ</div>
                                            </div>
                                            <div>
                                                <ContactsTwoTone style={{ fontSize: 48 }} />
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                                <Col span={6}>
                                    <Card className="card_total" bordered={false}>
                                        <div className='card_number'>
                                            <div>
                                                <div className='number_total'>{statisticListSeller?.products?.length}</div>
                                                <div className='title_total'>Số sản phẩm</div>
                                            </div>
                                            <div>
                                                <NotificationTwoTone style={{ fontSize: 48 }} />
                                            </div>
                                        </div>
                                    </Card>
                                </Col>

                                <Col span={6}>
                                    <Card className="card_total" bordered={false}>
                                        <div className='card_number'>
                                            <div>
                                                <div className='number_total'>{statisticListSeller?.tournaments?.length}</div>
                                                <div className='title_total'>Số giải đấu</div>
                                            </div>
                                            <div>
                                                <EnvironmentTwoTone style={{ fontSize: 48 }} />
                                            </div>
                                        </div>
                                    </Card>
                                </Col>

                                <Col span={6}>
                                    <Card className="card_total" bordered={false}>
                                        <div className='card_number'>
                                            <div>
                                                <div className='number_total'>{statisticListSeller?.bookings?.length || 0}</div>
                                                <div className='title_total'>Số lượt đặt sân</div>
                                            </div>
                                            <div>
                                                <ShoppingTwoTone style={{ fontSize: 48 }} />
                                            </div>
                                        </div>
                                    </Card>
                                </Col>
                            </Row>

                            <div className="container mx-auto p-8">
                                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Báo Cáo Đặt Sân</h1>
                                <div className="flex justify-center mb-8">
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="mr-2 p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-400"
                                    />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="mr-2 p-3 border rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-400"
                                    />
                                </div>

                                {loading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                                            <thead className="bg-gray-800 text-white">
                                                <tr>
                                                    <th className="py-3 px-6 text-left">Tên Sân</th>
                                                    <th className="py-3 px-6 text-left">Số Lượt Đặt</th>
                                                    <th className="py-3 px-6 text-left">Tổng Doanh Thu</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-700">
                                                {bookingData?.map((item, index) => (
                                                    <tr key={index} className="border-b hover:bg-gray-100">
                                                        <td className="py-3 px-6">{item.court_name}</td>
                                                        <td className="py-3 px-6">{item.booking_count}</td>
                                                        <td className="py-3 px-6">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.total_revenue)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                        </>
                    }
                </div>
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default DashBoard;