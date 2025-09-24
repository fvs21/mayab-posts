from flask import Flask, g
from app.api import register_blueprints

def create_app():
    app = Flask(__name__)

    register_blueprints(app)

    @app.teardown_appcontext
    def close_db(error):
        db = g.pop('db', None)

        if db is not None:
            db.close()

    return app