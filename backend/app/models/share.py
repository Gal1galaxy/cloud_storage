from app import db
from datetime import datetime

class FileShare(db.Model):
    __tablename__ = 'file_shares'
    
    id = db.Column(db.Integer, primary_key=True)
    file_id = db.Column(db.Integer, db.ForeignKey('files.id'), nullable=False)
    shared_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    shared_with = db.Column(db.Integer, db.ForeignKey('users.id'))  # 为空表示公开分享
    share_code = db.Column(db.String(32), unique=True)
    can_write = db.Column(db.Boolean, default=False)
    is_public = db.Column(db.Boolean, nullable=True, default=False, server_default='0')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime)
    _is_expired = db.Column('is_expired', db.Boolean, default=False, server_default='0')
    
    # 关系
    file = db.relationship('File', 
        foreign_keys=[file_id],
        backref=db.backref('shares', lazy=True, cascade='all, delete-orphan')
    )
    
    owner = db.relationship('User',
        foreign_keys=[shared_by],
        backref=db.backref('shared_files', lazy=True)
    )
    
    recipient = db.relationship('User',
        foreign_keys=[shared_with],
        backref=db.backref('received_shares', lazy=True)
    )
    
    @property
    def is_expired(self):
        """检查分享是否过期"""
        # 如果有过期时间且已过期，更新数据库中的状态
        if self.expires_at and self.expires_at < datetime.utcnow():
            self._is_expired = True
            db.session.add(self)
            db.session.commit()
        return self._is_expired

    @is_expired.setter
    def is_expired(self, value):
        """设置过期状态"""
        self._is_expired = value
        db.session.add(self)
        db.session.commit()

    def __repr__(self):
        return f'<FileShare {self.id} file={self.file_id} shared_by={self.shared_by} shared_with={self.shared_with}>' 