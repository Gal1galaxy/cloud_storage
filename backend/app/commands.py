import click
from flask.cli import with_appcontext
from app import db
from app.models.user import User
from app.models.file import File
from app.services.file_service import FileService
from werkzeug.security import generate_password_hash
import os

@click.command('init-db')
@with_appcontext
def init_db_command():
    """初始化数据库"""
    db.create_all()
    
    # 创建管理员用户
    if not User.query.filter_by(username='admin').first():
        admin = User(
            username='admin',
            email='admin@example.com',
            password_hash=generate_password_hash('admin'),
            role='admin'
        )
        db.session.add(admin)
        db.session.commit()
        click.echo('创建管理员用户成功')
    
    click.echo('数据库初始化完成')

@click.command('reencrypt-files')
@with_appcontext
def reencrypt_files_command():
    """重新加密所有文件"""
    try:
        file_service = FileService()
        files = File.query.all()
        
        for file in files:
            if os.path.exists(file.file_path):
                click.echo(f'重新加密文件: {file.filename}')
                try:
                    # 读取原文件
                    with open(file.file_path, 'rb') as f:
                        file_data = f.read()
                        
                    # 重新加密并保存
                    encrypted_data = file_service.aes.encrypt_file(file_data)
                    with open(file.file_path, 'wb') as f:
                        f.write(encrypted_data)
                        
                    click.echo(f'文件 {file.filename} 重新加密成功')
                except Exception as e:
                    click.echo(f'文件 {file.filename} 重新加密失败: {str(e)}')
            else:
                click.echo(f'文件不存在: {file.filename}')
                
        click.echo('所有文件重新加密完成')
    except Exception as e:
        click.echo(f'重新加密过程出错: {str(e)}') 