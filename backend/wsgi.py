from app import create_app
from flask import g

app = create_app()

@app.teardown_appcontext
def close_db(error):
    db = g.pop('db', None)

    if db is not None:
        db.close()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
