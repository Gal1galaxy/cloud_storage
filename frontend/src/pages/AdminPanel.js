import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Modal, Form, Input, Select, message, Space } from 'antd';
import { UserOutlined, FileOutlined, HddOutlined, TeamOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const AdminPanel = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // 获取系统统计信息
  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      message.error('获取系统统计信息失败');
    }
  };

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      message.error('获取用户列表失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  // 处理用户编辑
  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      email: user.email,
      role: user.role
    });
    setModalVisible(true);
  };

  // 处理用户删除
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      message.success('用户删除成功');
      fetchUsers();
    } catch (error) {
      message.error('用户删除失败');
    }
  };

  // 保存用户编辑
  const handleSave = async (values) => {
    try {
      await axios.put(`/api/admin/users/${editingUser.id}`, values);
      message.success('用户更新成功');
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error('用户更新失败');
    }
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => role === 'admin' ? '管理员' : '普通用户',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button 
            danger 
            onClick={() => handleDelete(record.id)}
            disabled={record.role === 'admin'}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={stats.total_users}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总文件数"
              value={stats.total_files}
              prefix={<FileOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="存储空间"
              value={stats.storage_usage}
              prefix={<HddOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="用户管理">
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title="编辑用户"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleSave}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: '请选择角色' }]}
          >
            <Select>
              <Option value="user">普通用户</Option>
              <Option value="admin">管理员</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminPanel; 