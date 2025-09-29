from app.auth.routes import auth_bp
from app.user.routes import user_bp
from app.post.routes import posts_bp
from app.image.routes import image_bp

BLUEPRINTS = [ 
    auth_bp,
    user_bp,
    posts_bp,
    image_bp
]

def register_blueprints(app):
    for blueprint in BLUEPRINTS:
        app.register_blueprint(blueprint)