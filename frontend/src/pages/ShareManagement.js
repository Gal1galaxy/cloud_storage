import React, { useState, useEffect } from 'react';
import { Tabs, Card } from 'antd';
import SharedByMeList from '../components/SharedByMeList';
import SharedWithMeList from '../components/SharedWithMeList';

const ShareManagement = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Tabs
          items={[
            {
              key: 'shared',
              label: '我的分享',
              children: <SharedByMeList />
            },
            {
              key: 'received',
              label: '收到的分享',
              children: <SharedWithMeList />
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default ShareManagement; 