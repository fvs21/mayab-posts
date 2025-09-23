CREATE TABLE image (
    id SERIAL PRIMARY KEY,
    image_path VARCHAR(120) NOT NULL,
    image_name VARCHAR(100) NOT NULL,
    image_type VARCHAR(50) NOT NULL,
    container VARCHAR(15) NOT NULL
);

CREATE TABLE app_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(50) NOT NULL,
    pfp_id BIGINT REFERENCES image(id) ON DELETE SET NULL,
    banner_id BIGINT REFERENCES image(id) ON DELETE SET NULL,
    bio VARCHAR(200),
    password VARCHAR(255) NOT NULL
);

CREATE TABLE post (
    id SERIAL PRIMARY KEY,
    creator_id BIGINT REFERENCES app_user(id) ON DELETE CASCADE,
    like_count INT DEFAULT 0 NOT NULL,
    reply_count INT DEFAULT 0 NOT NULL,
    content VARCHAR(250)
);

CREATE TABLE post_like (
    post_id BIGINT REFERENCES post(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES app_user(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, user_id)
);

CREATE TABLE post_image (
    post_id BIGINT REFERENCES post(id) ON DELETE CASCADE,
    image_id BIGINT REFERENCES image(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, image_id)
);