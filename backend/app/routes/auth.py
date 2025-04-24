from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from app import db
from app.models.user import User
from app.utils.auth import login_required
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from config import Config
from flask_jwt_extended import create_access_token

bp = Blueprint('auth', __name__, url_prefix='/api/auth')
# —— 新增测试路由 —— 
@bp.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Auth API working'}), 200

# —— 原有的 register, login, logout, profile 等路由 —— 
@bp.route('/register', methods=['POST'])
def register():
    """用户注册"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')
        
        if not username or not password:
            return jsonify({'error': '用户名和密码不能为空'}), 400
            
        if User.query.filter_by(username=username).first():
            return jsonify({'error': '用户名已存在'}), 400
            
        if email and User.query.filter_by(email=email).first():
            return jsonify({'error': '邮箱已被使用'}), 400
            
        user = User(
            username=username,
            email=email,
            password_hash=generate_password_hash(password)
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': '注册成功',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        })
        
    except Exception as e:
        print(f"Register error: {str(e)}")  # 调试日志
        db.session.rollback()
        return jsonify({'error': '注册失败'}), 500

@bp.route('/login', methods=['POST'])
def login():
    """用户登录"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': '用户名和密码不能为空'}), 400
            
        user = User.query.filter_by(username=username).first()
        
        if user and user.check_password(password):
            # 创建访问令牌，确保 identity 是字符串类型
            access_token = create_access_token(
                identity=str(user.id),  # 转换为字符串
                additional_claims={
                    'username': user.username,
                    'role': user.role
                }
            )
            
            return jsonify({
                'token': access_token,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'role': user.role
                }
            })
        else:
            return jsonify({'error': '用户名或密码错误'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': '退出成功'})

@bp.route('/profile')
@login_required
def get_profile():
    """获取用户信息"""
    try:
        return jsonify({
            'user': {
                'id': current_user.id,
                'username': current_user.username,
                'email': current_user.email,
                'role': current_user.role
            }
        })
    except Exception as e:
        print(f"Get profile error: {str(e)}")  # 调试日志
        return jsonify({'error': '获取用户信息失败'}), 500 
