CREATE TABLE follower (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    followed_id INTEGER NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    followed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (follower_id, followed_id)
);