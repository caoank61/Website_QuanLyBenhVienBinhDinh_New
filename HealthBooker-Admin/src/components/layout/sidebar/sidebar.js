import { MessageOutlined, AuditOutlined, ContainerOutlined, BarsOutlined, DashboardOutlined, FundProjectionScreenOutlined, FileDoneOutlined, ShoppingOutlined, UserOutlined, HeatMapOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from "react-router-dom";
import "./sidebar.css";

const { Sider } = Layout;

function Sidebar() {

  const history = useHistory();
  const location = useLocation();
  const [user, setUser] = useState([]);

  const menuSidebarAdmin = [
    {
      key: "dash-board",
      title: "Dashboards",
      link: "/dash-board",
      icon: <DashboardOutlined />
    },
    {
      key: "account-management",
      title: "Quản Lý Tài Khoản",
      link: "/account-management",
      icon: <UserOutlined />
    },
    {
      key: "asset-list",
      title: "Quản lý chuyên khoa",
      link: "/asset-list",
      icon: <ShoppingOutlined />
    },
    {
      key: "area-management",
      title: "Quản lý khu vực",
      link: "/area-management",
      icon: <HeatMapOutlined />
    },
    {
      key: "product-type-management",
      title: "Quản lý loại dịch vụ",
      link: "/product-type-management",
      icon: <BarsOutlined />
    },
    {
      key: "product-management",
      title: "Quản lý dịch vụ",
      link: "/product-management",
      icon: <BarsOutlined />
    },
    {
      key: "asset-management",
      title: "Quản lý bác sỹ",
      link: "/asset-management",
      icon: <ContainerOutlined />
    },
    {
      key: "news-list",
      title: "Quản lý sự kiện",
      link: "/news-list",
      icon: <MessageOutlined />
    },
    {
      key: "residence-rules",
      title: "Nội quy hệ thống",
      link: "/residence-rules",
      icon: <FileDoneOutlined />
    },
    {
      key: "notifications",
      title: "Gửi thông báo",
      link: "/notifications",
      icon: <AuditOutlined />
    },

  ];

  const menuSidebarHost = [
    {
      key: "dash-board",
      title: "Dashboards",
      link: "/dash-board",
      icon: <DashboardOutlined />
    },
    {
      key: "employee-management",
      title: "Quản lý nhân viên",
      link: "/employee-management",
      icon: <UserOutlined />
    },
    {
      key: "asset-management",
      title: "Quản lý bác sỹ",
      link: "/asset-management",
      icon: <ContainerOutlined />
    },
    {
      key: "product-management",
      title: "Quản lý dịch vụ",
      link: "/product-management",
      icon: <BarsOutlined />
    },
    {
      key: "news-list",
      title: "Xem sự kiện",
      link: "/news-list",
      icon: <MessageOutlined />
    },
    {
      key: "order-list",
      title: "Danh sách đặt sân",
      link: "/order-list",
      icon:<ShoppingOutlined />
    },
  ];

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, [])



  const navigate = (link, key) => {
    history.push(link);
  }

  useEffect(() => {
  })

  return (
    <Sider
      className={'ant-layout-sider-trigger'}
      width={230}
      style={{
        position: "fixed",
        top: 70,
        height: 'calc(100% - 60px)',
        left: 0,
        padding: 0,
        zIndex: 1,
        marginTop: 0,
        boxShadow: " 0 1px 4px -1px rgb(0 0 0 / 15%)",
        overflowY: 'auto',
        background: '#FFFFFF'
      }}
    >
      <Menu
        mode="inline"
        selectedKeys={location.pathname.split("/")}
        defaultOpenKeys={['account']}
        style={{ height: '100%', borderRight: 0, backgroundColor: "#FFFFFF" }}
        theme='light'
      >

        {user.role === "isSeller" ? (
          menuSidebarHost.map((map) => (
            <Menu.Item
              onClick={() => navigate(map.link, map.key)}
              key={map.key}
              icon={map.icon}
              className="customeClass"
            >
              {map.title}
            </Menu.Item>
          ))
        ) : user.role === "isAdmin" ? (
          menuSidebarAdmin.map((map) => (
            <Menu.Item
              onClick={() => navigate(map.link, map.key)}
              key={map.key}
              icon={map.icon}
              className="customeClass"
            >
              {map.title}
            </Menu.Item>
          ))
        ) : null}
      </Menu>

    </Sider >
  );
}

export default Sidebar;