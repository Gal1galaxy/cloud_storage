from app import db
from datetime import datetime

class FilePermission(db.Model):
    __tablename__ = 'file_permissions'
    
    id = db.Column(db.Integer, primary_key=True)
    file_id = db.Column(db.Integer, db.ForeignKey('files.id', ondelete='CASCADE'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    can_read = db.Column(db.Boolean, default=True)
    can_write = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=True)
    
    # 关系
    user = db.relationship('User', backref=db.backref('file_permissions', lazy=True))
    # file 关系已经在 File 模型中通过 backref 定义

    def __repr__(self):
        return f"<FilePermission {self.id} for file {self.file_id} and user {self.user_id}>" 