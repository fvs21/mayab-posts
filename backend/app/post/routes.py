from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from ..image.service import upload_image
from ..auth.service import get_current_user
import json
from .serializers import *
from pydantic import ValidationError
from ..utils.errors import format_validation_error
from . import service
from ..user.service import get_user_followees

posts_bp = Blueprint("post", __name__, url_prefix="/api/post")

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

#endpoint para crear un post
@posts_bp.route('/', methods=['POST'])
@jwt_required()
def create_post():
    current_user = get_current_user()
    data = request.form.get('data')

    try:
        json_data = json.loads(data)
        req = CreatePostRequest.model_validate(json_data)
    except Exception as e:
        return jsonify({"error": True, "details": "Invalid JSON data"}), 400
    except ValidationError as e:
        return jsonify({"error": True, "details": format_validation_error(e)}), 400

    images = []

    for file in request.files.values():
        if file and allowed_file(file.filename):
            uploaded_image = upload_image(file, "post")
            if uploaded_image is not None:
                images.append(uploaded_image)

    try:
        post = service.create_post(current_user, req, images)

        if post is None:
            return jsonify({"error": True, "details": "Error creating post"}), 500

        return jsonify({"data": post.model_dump(), "error": False}), 201
    except Exception as e:
        return jsonify({"error": True, "details": str(e)}), 500
    
@posts_bp.route('/<post_id>', methods=['GET'])
@jwt_required()
def get_post(post_id):
    post_id = int(post_id)

    post = service.get_post_by_id(post_id)

    if post is None:
        return jsonify({"error": True, "details": "Post not found"}), 404

    return jsonify({"data": {"post": post.model_dump()}, "error": False}), 200

@posts_bp.route('/feed', methods=['GET'])
@jwt_required()
def get_feed():
    posts = service.get_all_posts()

    return jsonify({"data": {"posts": [post.model_dump() for post in posts]}, "error": False}), 200

@posts_bp.route('/friends', methods=['GET'])
@jwt_required()
def get_friends_posts():
    user = get_current_user()

    followees = get_user_followees(user.id)

    posts = service.get_friends_feed(followees)

    return jsonify({"data": {"posts": [post.model_dump() for post in posts]}, "error": False}), 200

@posts_bp.route('/reply', methods=['POST'])
@jwt_required()
def reply_to_post():
    pass