from flask import jsonify
from . import admin_bp

@admin_bp.route('/test')
def test():
    return jsonify({'message': 'Admin API working'}) 