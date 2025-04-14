import React, { useState, useEffect } from 'react';
import { List, Button, Tag, Space, Popconfirm, message, Typography } from 'antd';
import { DeleteOutlined, CopyOutlined, FileOutlined } from '@ant-design/icons';
import { shareService } from '../services/shareService';
import { formatDate, getTimeLeft, isExpired } from '../utils/dateUtils';
import { formatFileSize } from '../utils/fileUtils';

const { Text, Paragraph } = Typography;

const SharedByMeList = () => {
  const [shares, setShares] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadShares = async () => {
    try {
      setLoading(true);
      const data = await shareService.getShares();
      setShares(data.sharedFiles);
    } catch (error) {
      message.error('加载分享列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShares();
  }, []);

  const handleRevoke = async (shareId) => {
    try {
      await shareService.revokeShare(shareId);
      message.success('已撤销分享');
      loadShares();
    } catch (error) {
      message.error('撤销分享失败');
    }
  };

  const copyShareLink = (shareCode) => {
    const link = `${window.location.origin}/share/${shareCode}`;
    navigator.clipboard.writeText(link);
    message.success('分享链接已复制到剪贴板');
  };

  const renderShareItem = (share) => {
    return (
      <List.Item.Meta
        avatar={<FileOutlined style={{ fontSize: 24 }} />}
        title={share.file?.filename}
        description={
          <Space direction="vertical">
            <Space>
              {share.canWrite ? (
                <Tag color="green">可编辑</Tag>
              ) : (
                <Tag color="blue">只读</Tag>
              )}
              {share.expiresAt && (
                <Tag color={isExpired(share.expiresAt) ? 'red' : 'orange'}>
                  {isExpired(share.expiresAt) ? '已过期' : `剩余：${getTimeLeft(share.expiresAt)}`}
                </Tag>
              )}
              <Tag>{formatFileSize(share.file?.file_size || 0)}</Tag>
            </Space>
            <Text type="secondary">
              创建时间：{formatDate(share.createdAt)}
            </Text>
            <Paragraph copyable={{ text: share.shareCode }}>
              分享码：{share.shareCode}
            </Paragraph>
            {share.sharedWith && (
              <Text type="secondary">
                分享给：用户 {share.sharedWith}
              </Text>
            )}
          </Space>
        }
      />
    );
  };

  return (
    <List
      loading={loading}
      dataSource={shares}
      renderItem={(share) => (
        <List.Item
          actions={[
            <Button
              icon={<CopyOutlined />}
              onClick={() => copyShareLink(share.shareCode)}
            >
              复制链接
            </Button>,
            <Popconfirm
              title="确定要撤销此分享吗？"
              onConfirm={() => handleRevoke(share.id)}
            >
              <Button icon={<DeleteOutlined />} danger>
                撤销
              </Button>
            </Popconfirm>
          ]}
        >
          {renderShareItem(share)}
        </List.Item>
      )}
    />
  );
};

export default SharedByMeList; 