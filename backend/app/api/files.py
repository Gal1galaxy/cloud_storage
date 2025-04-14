from flask import jsonify
from . import files_bp

@files_bp.route('/test')
def test():
    return jsonify({'message': 'Files API working'}) 