from flask import Blueprint, g, jsonify, request
from .serializers import RegistrationRequest
from pydantic import ValidationError
from ..db.config import get_db
from . import service

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        user = RegistrationRequest.model_validate(request.get_json())

        if service.username_already_exists(user.username):
            return jsonify({'details': 'Username already in use', 'code': 'username_already_exists', 'error': True}), 403

        return jsonify({"message": "Unc"})

    except ValidationError as e:
        pass