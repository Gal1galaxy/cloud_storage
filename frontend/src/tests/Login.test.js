import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Login from '../pages/Login';
import { message } from 'antd';

// Mock antd message
jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  message: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const renderLogin = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders login form', () => {
    renderLogin();
    expect(screen.getByPlaceholderText('用户名')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('密码')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '登录' })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    renderLogin();
    const loginButton = screen.getByRole('button', { name: '登录' });
    
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('请输入用户名')).toBeInTheDocument();
      expect(screen.getByText('请输入密码')).toBeInTheDocument();
    });
  });

  test('handles successful login', async () => {
    renderLogin();
    
    fireEvent.change(screen.getByPlaceholderText('用户名'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('密码'), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: '登录' }));
    
    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith('登录成功');
    });
  });
}); 