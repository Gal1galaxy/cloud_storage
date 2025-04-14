import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import FileList from '../pages/FileList';

const mockFiles = [
  {
    id: 1,
    filename: 'test.txt',
    file_type: 'text/plain',
    file_size: 1024,
    created_at: '2024-01-01T00:00:00Z',
  },
];

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: { owned_files: mockFiles, shared_files: [] } })),
  delete: jest.fn(() => Promise.resolve({ data: { message: '文件删除成功' } })),
}));

const renderFileList = () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <FileList />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('FileList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders file list', async () => {
    renderFileList();
    
    await waitFor(() => {
      expect(screen.getByText('test.txt')).toBeInTheDocument();
      expect(screen.getByText('1.00 KB')).toBeInTheDocument();
    });
  });

  test('handles file deletion', async () => {
    renderFileList();
    
    await waitFor(() => {
      expect(screen.getByText('test.txt')).toBeInTheDocument();
    });
    
    const deleteButton = screen.getByRole('button', { name: '删除' });
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(screen.getByText('文件删除成功')).toBeInTheDocument();
    });
  });

  test('shows file preview', async () => {
    renderFileList();
    
    await waitFor(() => {
      expect(screen.getByText('test.txt')).toBeInTheDocument();
    });
    
    const previewButton = screen.getByRole('button', { name: '预览' });
    fireEvent.click(previewButton);
    
    // 验证是否导航到预览页面
    expect(window.location.pathname).toMatch(/\/preview\/1/);
  });
}); 