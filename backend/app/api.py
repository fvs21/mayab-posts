from app.auth.routes import auth_bp

BLUEPRINTS = [ 
    auth_bp
]

def register_blueprints(app):
    for blueprint in BLUEPRINTS:
        app.register_blueprint(blueprint)