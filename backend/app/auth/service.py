from .serializers import RegistrationRequest, User
from ..db.config import get_db
from werkzeug.security import generate_password_hash
from typing import Tuple
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity
from dotenv import load_dotenv
import os
from datetime import timedelta

load_dotenv()

DEBUG = os.getenv("DEBUG", "False").lower() == "true"

def create_user_token_pair(user_id: int) -> Tuple[str, str]:
    access_token = create_access_token(identity=str(user_id), expires_delta=timedelta(minutes=15))
    refresh_token = create_refresh_token(identity=str(user_id), expires_delta=timedelta(days=30))
    return access_token, refresh_token

def get_current_user() -> User:
    user_id = get_jwt_identity()

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM app_user WHERE id = %s', (user_id,))
    user = cursor.fetchone()

    return User(**user)

def refresh_user_token(refresh_token: str) -> str:
    new_access_token = create_access_token(identity=refresh_token)
    return new_access_token

def username_already_exists(username: str) -> bool:
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('SELECT EXISTS(SELECT 1 FROM app_user WHERE username = %s)', (username, ))

    res = cursor.fetchone()

    return res['exists']

def email_already_exists(email: str) -> bool:
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('SELECT EXISTS(SELECT 1 FROM app_user WHERE email = %s)', (email, ))

    res = cursor.fetchone()

    return res['exists']

def register_user(data: RegistrationRequest) -> User:
    conn = get_db()
    cursor = conn.cursor()

    hashed_password = generate_password_hash(data.password, method='pbkdf2' if DEBUG else 'scrypt', salt_length=8)

    cursor.execute('INSERT INTO app_user (email, username, full_name, password) VALUES (%s, %s, %s, %s) RETURNING id, email, username, full_name, password', (data.email, data.username, data.full_name, hashed_password))

    conn.commit()

    user = cursor.fetchone()

    return User(**user)