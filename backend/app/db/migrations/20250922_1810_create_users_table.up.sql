CREATE TABLE app_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    full_name VARCHAR(100),
    password VARCHAR(255)
)