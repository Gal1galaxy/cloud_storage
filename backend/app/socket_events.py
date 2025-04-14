@socketio.on('join_edit')
def handle_join_edit(data):
    """处理用户加入编辑"""
    try:
        file_id = data.get('fileId')
        user_id = data.get('userId')
        share_code = data.get('shareCode')
        
        print(f"User {user_id} joining edit for file {file_id}, share_code: {share_code}")
        
        # 检查文件是否存在
        file = File.query.get(file_id)
        if not file:
            print(f"File not found: {file_id}")
            emit('error', {'message': '文件不存在'})
            return
            
        # 检查权限
        has_permission = False
        if share_code:
            # 通过分享码访问
            share = share_service.get_share_by_code(share_code)
            if not share:
                print(f"Invalid share code: {share_code}")
                emit('error', {'message': '分享不存在或已过期'})
                return
                
            if share.file_id != file_id:
                print(f"File ID mismatch: share.file_id={share.file_id}, file_id={file_id}")
                emit('error', {'message': '分享链接无效'})
                return
                
            if share.is_expired:
                print(f"Share expired: {share_code}")
                emit('error', {'message': '分享已过期'})
                return
                
            has_permission = share.can_write
            print(f"Share permission: can_write={has_permission}")
        else:
            # 直接访问需要验证权限
            has_permission = permission_service.can_write(user_id, file_id)
            print(f"Direct access permission: can_write={has_permission}")
        
        # 获取用户信息
        user = User.query.get(user_id)
        if not user:
            print(f"User not found: {user_id}")
            emit('error', {'message': '用户不存在'})
            return
            
        # 加入房间
        join_room(f'file_{file_id}')
        
        # 更新编辑者列表
        editors[file_id] = editors.get(file_id, {})
        editors[file_id][str(user_id)] = user.username
        
        # 广播新用户加入
        join_data = {
            'userId': str(user_id),  # 确保 ID 是字符串
            'username': user.username,
            'editors': editors[file_id],
            'canWrite': has_permission,  # 使用 canWrite
            'currentUser': {  # 添加当前用户的完整信息
                'id': str(user.id),
                'username': user.username
            }
        }
        print(f"Emitting user_joined with data: {join_data}")
        emit('user_joined', join_data, room=f'file_{file_id}')
        
        print(f"User {user.username} joined edit for file {file_id} with permission: {has_permission}")
        
    except Exception as e:
        print(f"Error in handle_join_edit: {str(e)}")
        emit('error', {'message': str(e)})

@socketio.on('cell_updated')
def handle_cell_updated(data):
    """处理单元格更新"""
    try:
        file_id = data.get('fileId')
        user_id = data.get('userId')
        share_code = data.get('shareCode')
        sheet_name = data.get('sheetName')
        row = data.get('row')
        col = data.get('col')
        value = data.get('value')
        all_data = data.get('allData')
        
        print(f"Received cell_updated event: {data}")
        
        # 检查权限
        has_permission = permission_service.can_write(user_id, file_id, share_code)
        print(f"Write permission check result: {has_permission}")
            
        if not has_permission:
            print(f"No write permission for user {user_id}")
            emit('error', {'message': '没有编辑权限'})
            return
            
        print(f"Cell update authorized for user {user_id}")
        
        # 广播更新给其他用户
        emit('cell_updated', {
            'userId': user_id,
            'sheetName': sheet_name,
            'row': row,
            'col': col,
            'value': value,
            'allData': all_data
        }, room=f'file_{file_id}', include_self=False)
        
    except Exception as e:
        print(f"Error in handle_cell_updated: {str(e)}")
        emit('error', {'message': str(e)})

@socketio.on('sheet_switched')
def handle_sheet_switched(data):
    """处理工作表切换"""
    try:
        file_id = data.get('fileId')
        user_id = data.get('userId')
        sheet_name = data.get('sheetName')
        
        print(f"Sheet switched in file {file_id} by user {user_id}: sheet={sheet_name}")
        
        # 广播工作表切换给其他用户
        emit('sheet_switched', {
            'userId': user_id,
            'sheetName': sheet_name
        }, room=f'file_{file_id}', include_self=False)
        
    except Exception as e:
        print(f"Error in handle_sheet_switched: {str(e)}")
        emit('error', {'message': str(e)}) 