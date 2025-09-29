ALTER TABLE app_user ADD password_reset_token VARCHAR(128),
ADD password_reset_token_created_at TIMESTAMP,
ADD password_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP; 