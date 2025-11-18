from flask import request
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename
import uuid
from dotenv import load_dotenv
import os
from app.db.config import get_db
from .serializers import Image
from typing import Optional
import boto3
from botocore.exceptions import ClientError
from botocore.config import Config

load_dotenv()

IMAGE_STORAGE_PATH = os.getenv("IMAGE_UPLOAD_PATH", "images")
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
AWS_REGION_NAME = os.getenv("AWS_REGION_NAME")
AWS_STORAGE_BUCKET = os.getenv("AWS_STORAGE_BUCKET_NAME")

def get_s3_client():
    s3 = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY, aws_secret_access_key=AWS_SECRET_KEY, region_name=AWS_REGION_NAME, endpoint_url="https://s3.us-east-2.amazonaws.com", config=Config(signature_version='s3v4'))
    return s3

def upload_image(image: FileStorage, container: str) -> Optional[Image]:
    '''
    Uploads an image to the specified container and returns the image ID.

    :param FileStorage image: The image file to be uploaded.
    :param str container: The container where the image will be stored (profile picture, post, banner).
    '''

    original_file_name = secure_filename(image.filename)
    temp_path = os.path.join('/tmp', original_file_name)

    file_extension = os.path.splitext(original_file_name)[1]
    unique_file_name = f"{uuid.uuid4()}{file_extension}"

    container_path = os.path.join(IMAGE_STORAGE_PATH, container)

    image_path = os.path.join(container_path, unique_file_name)

    conn = get_db()
    s3 = get_s3_client()

    try:
        with conn.cursor() as cursor:
            cursor.execute('INSERT INTO image (container, image_name, image_path, image_type) VALUES (%s, %s, %s, %s) RETURNING id, image_name, image_path, image_type, container', (container, unique_file_name, image_path, image.content_type))
            image_data = cursor.fetchone()

            conn.commit()

        image.save(temp_path)
        with open(temp_path, 'rb') as f:
            s3.put_object(Body=f, Bucket=AWS_STORAGE_BUCKET, Key=image_path, ContentType=image.content_type, ContentDisposition='inline')

        os.remove(temp_path)

        return Image(**image_data)
    except Exception as e:
        print(e)
        conn.rollback()
        if os.path.exists(image_path):
            os.remove(image_path)
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

def generate_presigned_url(key: str, expiration: int = 3600) -> str:
    s3 = get_s3_client()

    try:
        res = s3.generate_presigned_url(
            'get_object', 
            Params={
                'Bucket': AWS_STORAGE_BUCKET, 
                'Key': key
            }, 
            ExpiresIn=expiration)
    except ClientError as e:
        print(e)
        return None
    
    return res