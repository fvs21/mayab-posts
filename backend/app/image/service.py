from flask import request
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename
import uuid
from dotenv import load_dotenv
import os
from app.db.config import get_db
from .serializers import Image
from typing import Optional

load_dotenv()

IMAGE_STORAGE_PATH = os.getenv("IMAGE_UPLOAD_PATH", "/images")

def upload_image(image: FileStorage, container: str) -> Optional[Image]:
    '''
    Uploads an image to the specified container and returns the image ID.

    :param FileStorage image: The image file to be uploaded.
    :param str container: The container where the image will be stored (profile picture, post, banner).
    '''

    original_file_name = secure_filename(image.filename)
    file_extension = os.path.splitext(original_file_name)[1]

    unique_file_name = f"{uuid.uuid4()}{file_extension}"

    container_path = os.path.join(IMAGE_STORAGE_PATH, container)
    os.makedirs(container_path, exist_ok=True)

    image_path = os.path.join(container_path, unique_file_name)

    conn = get_db()

    try:
        with conn.cursor() as cursor:
            cursor.execute('INSERT INTO image (container, image_name, image_path, image_type) VALUES (%s, %s, %s, %s) RETURNING id, image_name, image_path, image_type, container', (container, unique_file_name, image_path, image.content_type))
            image_data = cursor.fetchone()

            conn.commit()

        image.save(image_path)
        return Image(**image_data)
    except Exception as e:
        print(e)
        conn.rollback()
        if os.path.exists(image_path):
            os.remove(image_path)
            #TODO: Raise corresponding error
        return None


def retrieve_image(image_name: str) -> Optional[Image]:
    '''
    Retrieves the image url using the image name.
    '''
    
    conn = get_db()

    with conn.cursor() as cursor:
        cursor.execute('SELECT * FROM image WHERE image_name = %s', (image_name,))
        image = cursor.fetchone()

    if not image:
        return None

    return Image(**image)