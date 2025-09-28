from flask import Blueprint, g, jsonify, request
from .serializers import RegistrationRequest
from pydantic import ValidationError
from . import service
from flask_jwt_extended import jwt_required

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        user = RegistrationRequest.model_validate(request.get_json())

        if service.username_already_exists(user.username):
            return jsonify({'details': 'Username already in use', 'code': 'username_already_exists', 'error': True}), 403
        
        if service.email_already_exists(user.email):
            return jsonify({'details': 'Email already in use', 'code': 'email_already_exists', 'error': True}), 403     
        
        user = service.register_user(user)

        access_token, refresh_token = service.create_user_token_pair(user.id)

        return jsonify({"data": {"user": user.model_dump(), "access_token": access_token, "refresh_token": refresh_token}, "error": False}), 201

    except ValidationError as e:
        return jsonify({'details': 'Invalid input', 'code': 'invalid_data', 'error': True}), 400
    
@auth_bp.route('/session', methods=['GET'])
@jwt_required()
def session():
    user = service.get_current_user()
    return jsonify({"data": {"user": user.model_dump()}, "error": False}), 200