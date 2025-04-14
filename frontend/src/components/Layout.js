import React from 'react';
import { Layout as AntLayout, Menu, Avatar, Dropdown } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FileOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  CloudOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Header, Content, Sider } = AntLayout;

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: '/files',
      icon: <FileOutlined />,
      label: <Link to="/files">我的文件</Link>,
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: <Link to="/profile">个人中心</Link>,
    }
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人中心',
      onClick: () => navigate('/profile')
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: logout
    }
  ];

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          zIndex: 10,
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0',
          background: '#001529',
          color: '#fff'
        }}>
          <CloudOutlined style={{ fontSize: '24px', marginRight: '8px' }} />
          <h1 style={{ margin: 0, fontSize: '18px' }}>云存储系统</h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ height: 'calc(100% - 64px)', borderRight: 0 }}
          items={menuItems}
        />
      </Sider>
      <AntLayout style={{ marginLeft: 200 }}>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff',
          boxShadow: '0 1px 4px rgba(0,21,41,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          position: 'fixed',
          width: 'calc(100% - 200px)',
          zIndex: 9,
        }}>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Avatar icon={<UserOutlined />} style={{ marginRight: '8px' }} />
              <span>{user?.username || '用户'}</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ 
          margin: '88px 24px 24px',
          minHeight: 'auto',
          background: '#f0f2f5',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout; 