from app import db
from datetime import datetime

class Log(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(50), nullable=False)  # upload, download, delete, share, etc.
    resource_type = db.Column(db.String(50), nullable=False)  # file, user, permission
    resource_id = db.Column(db.Integer)
    details = db.Column(db.JSON, nullable=True)
    ip_address = db.Column(db.String(50))
    user_agent = db.Column(db.String(200))
    status = db.Column(db.String(20))  # success, failed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='logs') 