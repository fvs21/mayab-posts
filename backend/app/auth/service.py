from .serializers import RegistrationRequest, User
from ..db.config import get_db
from werkzeug.security import generate_password_hash, check_password_hash
from typing import Tuple, Optional
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity
from dotenv import load_dotenv
import os
from datetime import timedelta, datetime, timezone
import secrets

load_dotenv()

DEBUG = os.getenv("DEBUG", "False").lower() == "true"

def create_user_token_pair(user_id: int) -> Tuple[str, str]:
    access_token = create_access_token(identity=str(user_id), expires_delta=timedelta(minutes=15))
    refresh_token = create_refresh_token(identity=str(user_id), expires_delta=timedelta(days=30))
    return access_token, refresh_token

def get_current_user() -> User:
    user_id = get_jwt_identity()
    conn = get_db()

    with conn.cursor() as cursor:
        cursor.execute('SELECT * FROM app_user WHERE id = %s', (user_id,))
        user = cursor.fetchone()

        return User(**user)
    
def generate_verification_code() -> str:
    crypto_gen = secrets.SystemRandom()

    number = crypto_gen.randrange(100000, 999999)   

    return str(number)

def refresh_user_token(user_id: int) -> str:
    new_access_token = create_access_token(identity=str(user_id), expires_delta=timedelta(minutes=15))
    return new_access_token

def username_already_exists(username: str) -> bool:
    conn = get_db()
    
    with conn.cursor() as cursor:
        cursor.execute('SELECT EXISTS(SELECT 1 FROM app_user WHERE username = %s)', (username, ))

        res = cursor.fetchone()

        return res['exists']

def email_already_exists(email: str) -> bool:
    conn = get_db()

    with conn.cursor() as cursor:
        cursor.execute('SELECT EXISTS(SELECT 1 FROM app_user WHERE email = %s)', (email, ))

        res = cursor.fetchone()

        return res['exists']

def register_user(data: RegistrationRequest) -> Optional[User]:
    conn = get_db()

    try:
        with conn:
            with conn.cursor() as cursor:
                hashed_password = generate_password_hash(data.password, method='pbkdf2' if DEBUG else 'scrypt', salt_length=8)

                cursor.execute('INSERT INTO app_user (email, username, full_name, password) VALUES (%s, %s, %s, %s) RETURNING id, email, username, full_name, password', (data.email, data.username, data.full_name, hashed_password))

                user = cursor.fetchone()
                user = User(**user)

                verification_code = generate_verification_code()
                hashed_verification_code = generate_password_hash(verification_code, method='pbkdf2' if DEBUG else 'scrypt', salt_length=8)

                cursor.execute('INSERT INTO email_verification_data (user_id, verification_code) VALUES (%s, %s)', (user.id, hashed_verification_code))

                print(f"Verification code for {user.email}: {verification_code}")

                # Send verification email
                # send_verification_email(user.email, verification_code)

    except Exception as e:
        print(e)
        return None

    return user

def verify_email_code(user_id: int, code: str) -> bool:
    conn = get_db()

    try:
        with conn:
            with conn.cursor() as cursor:
                cursor.execute('SELECT verification_code FROM email_verification_data WHERE user_id = %s ORDER BY created_at DESC LIMIT 1', (user_id, ))

                record = cursor.fetchone()

                if not record:
                    return False

                hashed_code = record['verification_code']

                if not check_password_hash(hashed_code, code):
                    return False

                cursor.execute('UPDATE app_user SET email_verified_at = NOW() WHERE id = %s', (user_id, ))

                cursor.execute('DELETE FROM email_verification_data WHERE user_id = %s', (user_id, ))

    except Exception as e:
        return False

    return True

def resend_verification_email(user: User) -> bool:
    conn = get_db()

    try:
        with conn:
            with conn.cursor() as cursor:
                cursor.execute('SELECT * FROM email_verification_data WHERE user_id = %s', (user.id, ))

                prev_record = cursor.fetchone()

                now = datetime.now(timezone.utc)

                if now - prev_record['created_at'] < timedelta(minutes=1): 
                    return False

                verification_code = generate_verification_code()
                hashed_verification_code = generate_password_hash(verification_code, method='pbkdf2' if DEBUG else 'scrypt', salt_length=8)

                cursor.execute('UPDATE email_verification_data SET verification_code = %s, created_at = NOW() WHERE user_id = %s', (hashed_verification_code, user.id))

                print(f"Verification code for {user.email}: {verification_code}")

                # Send verification email
                # send_verification_email(user.email, verification_code)
    except Exception as e:
        print(e)
        raise

    return True

def authenticate(username: str, password: str) -> Optional[User]:
    conn = get_db()

    with conn.cursor() as cursor:
        cursor.execute('SELECT * FROM app_user WHERE username = %s', (username, ))

        user = cursor.fetchone()

        if not user:
            return None

        if not check_password_hash(user['password'], password):
            return None

        return User(**user)