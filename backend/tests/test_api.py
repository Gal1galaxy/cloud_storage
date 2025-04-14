import unittest
import json
from app import create_app
from app.models import db, User, File
from app.utils.security import generate_token

class TestAPI(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
        
        # 创建测试用户
        self.test_user = User(
            username='testuser',
            email='test@example.com'
        )
        self.test_user.set_password('password123')
        db.session.add(self.test_user)
        db.session.commit()
        
        # 生成认证token
        self.token = generate_token(self.test_user)
        self.headers = {'Authorization': f'Bearer {self.token}'}

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_register(self):
        """测试用户注册"""
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpass123'
        }
        response = self.client.post(
            '/api/auth/register',
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 201)
        
    def test_login(self):
        """测试用户登录"""
        data = {
            'username': 'testuser',
            'password': 'password123'
        }
        response = self.client.post(
            '/api/auth/login',
            data=json.dumps(data),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        json_data = json.loads(response.data)
        self.assertIn('token', json_data)

    def test_upload_file(self):
        """测试文件上传"""
        data = {
            'file': (open('tests/test_files/test.txt', 'rb'), 'test.txt')
        }
        response = self.client.post(
            '/api/files/upload',
            data=data,
            headers=self.headers,
            content_type='multipart/form-data'
        )
        self.assertEqual(response.status_code, 200)
        
    def test_file_list(self):
        """测试获取文件列表"""
        response = self.client.get(
            '/api/files/list',
            headers=self.headers
        )
        self.assertEqual(response.status_code, 200)
        json_data = json.loads(response.data)
        self.assertIn('owned_files', json_data)

    def test_file_preview(self):
        """测试文件预览"""
        # 先上传文件
        file = File(
            filename='test.txt',
            file_type='text/plain',
            owner_id=self.test_user.id
        )
        db.session.add(file)
        db.session.commit()
        
        response = self.client.get(
            f'/api/files/preview/{file.id}',
            headers=self.headers
        )
        self.assertEqual(response.status_code, 200)

if __name__ == '__main__':
    unittest.main() 