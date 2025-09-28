from app.auth.routes import auth_bp
from app.user.routes import user_bp

BLUEPRINTS = [ 
    auth_bp,
    user_bp
]

def register_blueprints(app):
    for blueprint in BLUEPRINTS:
        app.register_blueprint(blueprint)