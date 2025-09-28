from flask import Blueprint, g, jsonify, request
from .serializers import RegistrationRequest, LoginRequest
from pydantic import ValidationError
from . import service
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.errors import format_validation_error

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

        if not user:
            return jsonify({'details': 'Error registering user', 'code': 'registration_error', 'error': True}), 500

        access_token, refresh_token = service.create_user_token_pair(user.id)

        return jsonify({"data": {"user": user.model_dump(), "access_token": access_token, "refresh_token": refresh_token}, "error": False}), 201

    except ValidationError as e:
        return jsonify({'details': format_validation_error(e), 'code': 'invalid_data', 'error': True}), 400
    
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        req = LoginRequest.model_validate(request.get_json())

        user = service.authenticate(req.username, req.password)

        if not user:
            return jsonify({'details': 'Invalid username or password', 'code': 'invalid_credentials', 'error': True}), 401
        
        access_token, refresh_token = service.create_user_token_pair(user.id)

        return jsonify({"data": {"user": user.model_dump(), "access_token": access_token, "refresh_token": refresh_token}, "error": False}), 200

    except Exception as e:
        return jsonify({'details': format_validation_error(e), 'code': 'invalid_data', 'error': True}), 400
    

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    user_id = get_jwt_identity()
    access_token = service.refresh_user_token(user_id)
    return jsonify({"data": {"access_token": access_token}, "error": False}), 200


@auth_bp.route('/session', methods=['GET'])
@jwt_required()
def session():
    user = service.get_current_user()
    return jsonify({"data": {"user": user.model_dump()}, "error": False}), 200