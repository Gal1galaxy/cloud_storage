from functools import wraps
from flask import request, jsonify
import jwt
from config import Config
from app.models.user import User
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # 使用 flask_jwt_extended 验证 token
            verify_jwt_in_request()
            user_id = get_jwt_identity()  # 这里获取的是字符串类型的 ID
            
            # 获取用户信息，需要转换回整数类型
            user = User.query.get(int(user_id))
            if not user:
                return jsonify({'error': '用户不存在'}), 401
                
            # 将用户信息添加到请求上下文
            request.current_user = user
            
            return f(*args, **kwargs)
            
        except Exception as e:
            print(f"Auth error: {str(e)}")
            return jsonify({'error': '未认证或token无效'}), 401
            
    return decorated_function 