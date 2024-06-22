import { Breadcrumb, Card, Input, List, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./tournament.css";
import tournamentApi from "../../apis/tournamentApi";

const { Search } = Input;

const Tournament = () => {
  const [news, setNews] = useState([]);
  let history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        const item = await tournamentApi.getAllTournaments();
        // Lọc dữ liệu có approval_status khác "pending"
        const filteredItem = item.filter(item => item.approval_status !== "pending");
        setNews(filteredItem);
    } catch (error) {
        console.log("Failed to fetch event detail:" + error);
    }
    
    })();
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <Spin spinning={false}>
        <Card className="container_details">
          <div className="product_detail">
            <div style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }}>
              <Breadcrumb>
                <Breadcrumb.Item href="http://localhost:3500/home">
                  {/* <HomeOutlined /> */}
                  <span>Trang chủ</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="http://localhost:3500/news">
                  {/* <AuditOutlined /> */}
                  <span>Giải đấu</span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr></hr>
            <div class="news grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {news.map((item) => (
                <Link to={`/tournament-result/${item.id}`} key={item.id}>
                  <div class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg">
                    <img
                      src={item.image}
                      alt="News Image"
                      class="w-full h-48 object-cover"
                    />
                    <div class="p-4">
                      <h3 class="text-lg font-bold mb-2">{item.name}</h3>
                      <p class="text-gray-700">{item.info}</p>
                     
                      <div class="mt-4">
                        {/* Hàng 1 */}
                        <div class="flex items-center">
                          <div class="flex items-center mr-4">
                            <svg
                              class="w-6 h-6 mr-2 text-gray-500"
                              fill="none"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              ></path>
                            </svg>
                            <span>Đội: {item.teams}</span>
                          </div>
                          <div class="flex items-center mr-4">
                            <svg
                              class="w-6 h-6 mr-2 text-gray-500"
                              fill="none"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              ></path>
                            </svg>
                            <span>Trận: {item.matches}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default Tournament;
