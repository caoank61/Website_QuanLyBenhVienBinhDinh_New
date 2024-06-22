import { Breadcrumb, Card, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import tournamentApi from "../../apis/tournamentApi";
import tournamentResultApi from "../../apis/tournamentResultApi";

const TournamentDetail = () => {
  const [tournament, setTournament] = useState(null);
  const [tournamentResult, setTournamentResult] = useState(null);

  const { id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchTournament = async () => {
      try {
        const response = await tournamentApi.getTournamentById(id);
        const response2 = await tournamentResultApi.getTournamentResultById(id);
        setTournament(response);
        setTournamentResult(response2);

      } catch (error) {
        console.error("Failed to fetch tournament detail:", error);
      }
    };

    fetchTournament();
  }, [id]);

  return (
    <div className="container mx-auto px-4 mt-4 mb-4">
      <Spin spinning={!tournament}>
        <Card className="my-8">
          <div className="p-4">
            <Breadcrumb separator=">">
              <Breadcrumb.Item>
                <a href="http://localhost:3500/home">Trang chủ</a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <a href="http://localhost:3500/tournament">Kết quả giải đấu</a>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{tournament?.name}</Breadcrumb.Item>
            </Breadcrumb>
            <hr className="my-4" />
            <div className="pb-4">
              <img src={tournament?.image} alt="Tournament Image" className="w-full my-4" />

              <h2 className="text-3xl font-bold mb-4">{tournament?.name}</h2>
              <p className="text-gray-600">{tournament?.info}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 2a1 1 0 011 1v5a1 1 0 01-1 1H9a1 1 0 01-1-1V3a1 1 0 011-1h6zM5 12a1 1 0 100 2h10a1 1 0 100-2H5zm1-3a1 1 0 011-1h8a1 1 0 110 2H7a1 1 0 01-1-1zm8-6a1 1 0 00-1 1v3a1 1 0 102 0V4a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Số đội: {tournament?.teams}</span>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 4.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 7.586V3a1 1 0 112 0v4.586l2.293-2.293z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M3 8a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM8 17a1 1 0 00-1 1v-4a1 1 0 112 0v4a1 1 0 00-1-1zm7-9a1 1 0 00-1-1H6a1 1 0 100 2h8a1 1 0 001-1zm-7-4a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Số trận: {tournament?.matches}</span>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Số nhóm: {tournament?.group_count}</span>
                </div>
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Giải thưởng: {tournament?.prizes.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                </div>
              </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: tournament?.description }} />
          </div>
        </Card>
      </Spin>
      <Spin spinning={!tournamentResult}>
        <Card className="my-8">
          <div className="p-4">
            <h2 className="text-3xl font-bold mb-4">Kết quả giải đấu</h2>
            {tournamentResult ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-300 rounded-lg p-4">
                  <img src={tournamentResult?.image} alt="Tournament Result Image" className="w-full mb-4 rounded-lg" />
                  <p className="text-gray-600">{tournamentResult?.result_info}</p>
                </div>
              </div>
            ) : (
              <p>Không có kết quả được hiển thị</p>
            )}

          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default TournamentDetail;
