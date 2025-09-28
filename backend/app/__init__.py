from flask import Flask, g
from app.api import register_blueprints
from dotenv import load_dotenv
import os
from flask_jwt_extended import JWTManager

load_dotenv()       

def create_app():
    app = Flask(__name__)

    register_blueprints(app)

    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

    JWTManager(app)

    return app