from ..auth.serializers import User
from ..db.config import get_db
from typing import Optional, List
from .serializers import CreatePostRequest, Post
from ..image.serializers import Image

def create_post(user: User, data: CreatePostRequest, images: List[Image]) -> Optional[Post]:
    conn = get_db()

    try:
        with conn.cursor() as cursor:
            cursor.execute("INSERT INTO post (creator_id, content) VALUES (%s, %s) RETURNING *", (user.id, data.content))
            post = cursor.fetchone()

            if not post:
                return None

            post = Post(**post)

            for image in images:
                cursor.execute("INSERT INTO post_image (post_id, image_id) VALUES (%s, %s)", (post.id, image.id))

            post.images = [f"/api/image/{img.image_name}" for img in images]

            conn.commit()
        return post
    except Exception as e:
        print(e)
        conn.rollback()
        return None

def get_post_by_id(post_id: int) -> Optional[Post]:
    conn = get_db()

    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM post WHERE id = %s", (post_id,))
            post_data = cursor.fetchone()

            if not post_data:
                return None

            post = Post(**post_data)

            cursor.execute("""
                SELECT i.id, i.image_path, i.image_name, i.image_type, i.container
                FROM image i
                JOIN post_image pi ON i.id = pi.image_id
                WHERE pi.post_id = %s
            """, (post.id,))
            images_data = cursor.fetchall()

            post.images = [f"/api/image/{img['image_name']}" for img in images_data]

        return post
    except Exception as e:
        print(e)
        return None
    
def get_all_posts() -> List[Post]:
    conn = get_db()
    posts = []

    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM post ORDER BY created_at DESC")
            posts_data = cursor.fetchall()

            for post_data in posts_data:
                post = Post(**post_data)

                cursor.execute("""
                    SELECT i.id, i.image_path, i.image_name, i.image_type, i.container
                    FROM image i
                    JOIN post_image pi ON i.id = pi.image_id
                    WHERE pi.post_id = %s
                """, (post.id,))
                images_data = cursor.fetchall()

                post.images = [f"/api/image/{img['image_name']}" for img in images_data]

                posts.append(post)

        return posts
    except Exception as e:
        print(e)
        return []