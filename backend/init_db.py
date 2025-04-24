from app import create_app, db
from app.models.user import User

def init_db():
    app = create_app()
    with app.app_context():
        # 创建数据库表
        db.create_all()

        # 输出数据库中所有表格的名称
        print("当前数据库中包含的表格:")
        for table in db.metadata.tables:
            print(table)
        
        # 检查是否已存在管理员账户
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            # 创建管理员账户
            admin = User(
                username='admin',
                email='admin@example.com',
                role='admin'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print('管理员账户创建成功')
        else:
            print('管理员账户已存在')

if __name__ == '__main__':
    init_db() 
