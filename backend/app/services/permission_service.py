from flask import request
from app.models.file import File
from app.models.permission import FilePermission
from datetime import datetime
from app.models.share import FileShare

class PermissionService:
    def can_write(self, user_id, file_id, share_code=None):
        """检查用户是否有写权限"""
        try:
            print(f"Checking write permission - user_id: {user_id}, file_id: {file_id}, share_code: {share_code}")
            
            # 如果有分享码，优先检查分享权限
            if share_code:
                from app.services.share_service import ShareService
                share_service = ShareService()
                share = share_service.get_share_by_code(share_code)
                
                if share and share.file_id == int(file_id) and not share.is_expired:
                    print(f"Share permission check - can_write: {share.can_write}")
                    return share.can_write
                    
                print("Share not found or invalid")
                return False
            
            # 检查直接权限
            file = File.query.get(file_id)
            if not file:
                print("File not found")
                return False
                
            # 文件所有者有完全权限
            if str(file.owner_id) == str(user_id):
                print("User is file owner")
                return True
                
            # 检查公开分享
            try:
                public_share = FileShare.query.filter(
                    FileShare.file_id == file_id,
                    FileShare.shared_with == None,  # 使用 shared_with 为空表示公开分享
                    FileShare.can_write == True,
                    (FileShare.expires_at.is_(None) | (FileShare.expires_at > datetime.utcnow()))
                ).first()
                
                if public_share:
                    print("Public share with write permission found")
                    return True
            except Exception as e:
                print(f"Error checking public share: {str(e)}")
            
            # 检查权限记录
            permission = FilePermission.query.filter_by(
                file_id=file_id,
                user_id=user_id
            ).first()
            
            if permission:
                print(f"Direct permission check - can_write: {permission.can_write}")
                return permission.can_write
                
            print("No permission record found")
            return False
            
        except Exception as e:
            print(f"Error checking write permission: {str(e)}")
            return False
            
    def can_read(self, user_id, file_id, share_code=None):
        """检查用户是否有读权限"""
        try:
            print(f"Checking read permission - user_id: {user_id}, file_id: {file_id}, share_code: {share_code}")
            
            # 如果有分享码，优先检查分享权限
            if share_code:
                from app.services.share_service import ShareService
                share_service = ShareService()
                share = share_service.get_share_by_code(share_code)
                
                if share and share.file_id == int(file_id) and not share.is_expired:
                    print("Share exists and is valid")
                    return True
                    
                print("Share not found or invalid")
                return False
            
            # 检查直接权限
            file = File.query.get(file_id)
            if not file:
                print("File not found")
                return False
                
            # 文件所有者有完全权限
            if str(file.owner_id) == str(user_id):
                print("User is file owner")
                return True
                
            # 检查公开分享
            try:
                public_share = FileShare.query.filter(
                    FileShare.file_id == file_id,
                    FileShare.shared_with == None,  # 使用 shared_with 为空表示公开分享
                    (FileShare.expires_at.is_(None) | (FileShare.expires_at > datetime.utcnow()))
                ).first()
                
                if public_share:
                    print("Public share found")
                    return True
            except Exception as e:
                print(f"Error checking public share: {str(e)}")
            
            # 检查权限记录
            permission = FilePermission.query.filter_by(
                file_id=file_id,
                user_id=user_id
            ).first()
            
            if permission:
                print(f"Direct permission check - can_read: {permission.can_read}")
                return permission.can_read
                
            print("No permission record found")
            return False
            
        except Exception as e:
            print(f"Error checking read permission: {str(e)}")
            return False
        
    def grant_permission(self, file_id, user_id, can_read=True, can_write=False, expires_at=None):
        """授予用户文件权限"""
        permission = FilePermission(
            file_id=file_id,
            user_id=user_id,
            can_read=can_read,
            can_write=can_write,
            expires_at=expires_at
        )
        db.session.add(permission)
        db.session.commit()
        return permission 