import React, { useState } from 'react';
import { Modal, Form, Radio, InputNumber, message } from 'antd';
import axios from 'axios';

const ShareModal = ({ visible, onClose, file }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleShare = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/share/create/${file.id}`, values);
      message.success('分享成功');
      if (response.data.share_token) {
        Modal.success({
          title: '分享链接',
          content: `${window.location.origin}/share/${response.data.share_token}`,
        });
      }
      onClose();
    } catch (error) {
      message.error('分享失败');
    }
    setLoading(false);
  };

  return (
    <Modal
      title="分享文件"
      visible={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form
        form={form}
        onFinish={handleShare}
        initialValues={{ type: 'private', expires_in: 7 }}
      >
        <Form.Item
          name="type"
          label="分享类型"
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value="private">私有</Radio>
            <Radio value="shared">共享</Radio>
            <Radio value="public">公开</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="expires_in"
          label="有效期(天)"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} max={30} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ShareModal; 