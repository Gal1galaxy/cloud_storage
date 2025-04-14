from flask import jsonify
from . import auth_bp

@auth_bp.route('/test')
def test():
    return jsonify({'message': 'Auth API working'}) 