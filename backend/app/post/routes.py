import os
from flask import Blueprint, request, jsonify, current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..db.config import get_db
from werkzeug.utils import secure_filename
from ..image.service import upload_image
from ..auth.service import get_current_user

posts_bp = Blueprint("post", __name__, url_prefix="/api/posts")

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

#endpoint para crear un post
@posts_bp.route('/', methods=['POST'])
@jwt_required()
def create_post():
    current_user = get_current_user()
    content=request.form.get('content')

    image_url = None
    images=[]
    for file in request.files.values():
        if file and allowed_file(file.filename):
            image_list=upload_image(file, "post")
            if image_list is not None:
                images.append(image_list)
        else:
            return jsonify({"error": "Formato de imagen no permitido"}), 400
        

    cursor= get_db().cursor()
    try:
        cursor.execute("INSERT INTO post (creator_id, content) VALUES (%s, %s) RETURNING id", (current_user.id, content))
        post_id = cursor.fetchone()['id']

        for image in images:
            cursor.execute("INSERT INTO image_post (post_id, image_id) VALUES (%s, %s)", (post_id, image['id']))

        cursor.connection.commit()
        return jsonify({"message": "Post created", "post": {"content": content, "image_url": image_url}}), 201
    except Exception as e:
        return jsonify({"error": f"Could not create post: {str(e)}"}), 500
    finally:
        cursor.close()

