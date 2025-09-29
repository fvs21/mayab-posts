from flask import Blueprint
from flask_jwt_extended import jwt_required

image_bp = Blueprint("image", __name__, url_prefix="/api/image")

@image_bp.route('/<name:str>', methods=['POST'])  
@jwt_required()
def upload_image(name: str):
    return "Not implemented", 501