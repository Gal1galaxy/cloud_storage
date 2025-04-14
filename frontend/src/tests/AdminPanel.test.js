import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import AdminPanel from '../pages/AdminPanel';

const mockStats = {
  total_users: 10,
  total_files: 100,
  storage_usage: '1.5 GB',
};

const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
  },
  {
    id: 2,
    username: 'user',
    email: 'user@example.com',
    role: 'user',
  },
];

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn((url) => {
    if (url.includes('stats')) {
      return Promise.resolve({ data: mockStats });
    }
    if (url.includes('users')) {
      return Promise.resolve({ data: { users: mockUsers } });
    }
  }),
  put: jest.fn(() => Promise.resolve({ data: { message: '用户更新成功' } })),
  delete: jest.fn(() => Promise.resolve({ data: { message: '用户删除成功' } })),
}));

const renderAdminPanel = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <AdminPanel />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AdminPanel Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders statistics', async () => {
    renderAdminPanel();
    
    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument(); // total_users
      expect(screen.getByText('100')).toBeInTheDocument(); // total_files
      expect(screen.getByText('1.5 GB')).toBeInTheDocument(); // storage_usage
    });
  });

  test('renders user list', async () => {
    renderAdminPanel();
    
    await waitFor(() => {
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
      expect(screen.getByText('user@example.com')).toBeInTheDocument();
    });
  });

  test('handles user edit', async () => {
    renderAdminPanel();
    
    await waitFor(() => {
      expect(screen.getByText('user@example.com')).toBeInTheDocument();
    });
    
    const editButtons = screen.getAllByRole('button', { name: '编辑' });
    fireEvent.click(editButtons[1]); // 编辑普通用户
    
    // 修改邮箱
    const emailInput = screen.getByLabelText('邮箱');
    fireEvent.change(emailInput, { target: { value: 'newuser@example.com' } });
    
    // 保存修改
    const saveButton = screen.getByRole('button', { name: '保存' });
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('用户更新成功')).toBeInTheDocument();
    });
  });
}); 