from .serializers import RegistrationRequest
from ..db.config import get_db

def username_already_exists(username: str) -> bool:
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute('SELECT EXISTS(SELECT 1 FROM app_user WHERE username = %s)', (username, ))

    exists = cursor.fetchone()[0]

    return exists

def register_user(data: RegistrationRequest) -> bool:
    pass