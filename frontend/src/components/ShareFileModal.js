import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Switch, message, Typography, Space, Divider } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { shareService } from '../services/shareService';

const { Text, Paragraph } = Typography;

const ShareFileModal = ({ file, visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [shareResult, setShareResult] = useState(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const shareData = {
        sharedWith: values.sharedWith,
        canWrite: values.canWrite,
        expiresDays: values.expiresDays
      };
      
      const result = await shareService.createShare(file.id, shareData);
      message.success('文件分享成功');
      setShareResult(result.share);
      onSuccess(result.share);
    } catch (error) {
      message.error(error.response?.data?.error || '分享失败');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShareResult(null);
    form.resetFields();
    onClose();
  };

  const getShareLink = (shareCode) => {
    return `${window.location.origin}/share/${shareCode}`;
  };

  return (
    <Modal
      title="分享文件"
      open={visible}
      onCancel={handleClose}
      onOk={shareResult ? handleClose : handleSubmit}
      okText={shareResult ? '完成' : '分享'}
      confirmLoading={loading}
      width={600}
    >
      {!shareResult ? (
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            canWrite: false,
            expiresDays: 7
          }}
        >
          <Form.Item
            label="分享给用户"
            name="sharedWith"
            extra="留空表示创建公开分享链接"
          >
            <Input placeholder="输入用户ID" />
          </Form.Item>

          <Form.Item
            label="有效期（天）"
            name="expiresDays"
            extra="0表示永久有效"
          >
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="允许编辑"
            name="canWrite"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      ) : (
        <div>
          <Text strong>分享成功！</Text>
          <Divider />
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text type="secondary">分享链接：</Text>
              <Paragraph copyable={{ text: getShareLink(shareResult.shareCode) }}>
                {getShareLink(shareResult.shareCode)}
              </Paragraph>
            </div>
            <div>
              <Text type="secondary">分享码：</Text>
              <Paragraph copyable={{ text: shareResult.shareCode }}>
                {shareResult.shareCode}
              </Paragraph>
            </div>
            <div>
              <Text type="secondary">权限：</Text>
              <Text>{shareResult.canWrite ? '可编辑' : '只读'}</Text>
            </div>
            {shareResult.expiresAt && (
              <div>
                <Text type="secondary">过期时间：</Text>
                <Text>{new Date(shareResult.expiresAt).toLocaleString()}</Text>
              </div>
            )}
          </Space>
        </div>
      )}
    </Modal>
  );
};

export default ShareFileModal; 