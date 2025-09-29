from flask import Blueprint
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename
from . import service
from flask import send_file

image_bp = Blueprint("image", __name__, url_prefix="/api/image")

@image_bp.route('/<name>', methods=['GET'])  
def upload_image(name: str):
    print(name)
    image_name = secure_filename(name)

    image = service.retrieve_image(image_name)

    if not image:
        return {"error": True, "details": "Image not found"}, 404
    
    return send_file(image._image_path, mimetype=image.image_type)