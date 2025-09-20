from flask import Flask
from app.api import register_blueprints
from app.config import initialize_db

def create_app():
    app = Flask(__name__)

    with app.app_context():
        initialize_db()

    register_blueprints(app)

    return app