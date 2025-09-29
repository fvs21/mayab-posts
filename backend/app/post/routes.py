import os
from flask import Blueprint, request, jsonify, current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from db.config import get_db
from werkzeug.utils import secure_filename

posts_bp = Blueprint("posts", __name__)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

#endpoint para crear un post
@posts_bp.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    current_user = get_jwt_identity()
    content=request.form.get('content')
    image=request.files.get('image')

    image_url = None
    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image.save(path)
        image_url = f"/UPLOAD_FOLDER/{filename}"

        cursor= get_db().cursor()
        try:
            cursor.execute("INSERT INTO posts (content, image_url, user_id) VALUES (%s, %s, %s)", (content, image_url, current_user))
            cursor.connection.commit()
            return jsonify({"message": "Post created", "post": {"content": content, "image_url": image_url}}), 201
        except Exception as e:
            return jsonify({"error": f"Could not create post: {str(e)}"}), 500
        finally:
            cursor.close()

