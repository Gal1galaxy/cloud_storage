from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app import db
from app.models.file import File
from app.models.permission import FilePermission
from app.services.permission_service import PermissionService
from datetime import datetime, timedelta
from app.models.share import FileShare
import secrets

bp = Blueprint('share', __name__, url_prefix='/api/share')
permission_service = PermissionService()

@bp.route('/create/<int:file_id>', methods=['POST'])
@login_required
def create_share(file_id):
    """创建文件分享"""
    file = File.query.get_or_404(file_id)
    
    # 检查是否有权限分享
    if not permission_service.can_read(current_user.id, file_id):
        return jsonify({'error': '没有权限分享此文件'}), 403
        
    data = request.get_json()
    share_type = data.get('type', 'private')  # private, shared, public
    expires_in = data.get('expires_in', 7)  # 默认7天后过期
    
    # 更新文件公开状态
    if share_type == 'public':
        file.is_public = True
        db.session.commit()
        return jsonify({
            'message': '文件已设为公开',
            'file_id': file_id
        })
        
    # 生成分享链接
    share_token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(days=expires_in)
    
    # 创建分享记录
    share = FileShare(
        file_id=file_id,
        share_token=share_token,
        created_by=current_user.id,
        share_type=share_type,
        expires_at=expires_at
    )
    
    db.session.add(share)
    db.session.commit()
    
    return jsonify({
        'message': '分享创建成功',
        'share_token': share_token,
        'expires_at': expires_at.isoformat() if expires_at else None
    })

@bp.route('/grant/<int:file_id>', methods=['POST'])
@login_required
def grant_access(file_id):
    """授予用户文件访问权限"""
    file = File.query.get_or_404(file_id)
    
    # 检查是否有权限授权
    if file.owner_id != current_user.id:
        return jsonify({'error': '只有文件所有者可以授予权限'}), 403
        
    data = request.get_json()
    user_id = data.get('user_id')
    can_read = data.get('can_read', True)
    can_write = data.get('can_write', False)
    expires_in = data.get('expires_in')  # 天数，可选
    
    expires_at = None
    if expires_in:
        expires_at = datetime.utcnow() + timedelta(days=expires_in)
        
    try:
        permission = permission_service.grant_permission(
            file_id=file_id,
            user_id=user_id,
            can_read=can_read,
            can_write=can_write,
            expires_at=expires_at
        )
        return jsonify({
            'message': '权限授予成功',
            'permission_id': permission.id
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400 