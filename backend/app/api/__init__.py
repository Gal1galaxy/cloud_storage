from flask import Blueprint

auth_bp = Blueprint('auth', __name__)
files_bp = Blueprint('files', __name__)
admin_bp = Blueprint('admin', __name__)

# 导入路由处理函数
from . import auth, files, admin 