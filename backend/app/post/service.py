from ..auth.serializers import User
from ..db.config import get_db
from typing import Optional, List
from .serializers import CreatePostRequest, Post, CreatorInfo
from ..image.serializers import Image
from ..user.service import get_user_followees

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

            cursor.execute("SELECT id, username, pfp_id, full_name FROM app_user WHERE id = %s", (post.creator_id,))

            user_data = cursor.fetchone()

            if not user_data:
                return None
            
            post.creator_info = CreatorInfo(**user_data)

            if user_data['pfp_id']:
                cursor.execute("SELECT image_name FROM image WHERE id = %s", (user_data['pfp_id'],))
                pfp_data = cursor.fetchone()
                if pfp_data:
                    post.creator_info.pfp_url = f"/api/image/{pfp_data['image_name']}"

        return post
    except Exception as e:
        print(e)
        return None
    
def get_all_posts() -> List[Post]:
    conn = get_db()
    posts = []

    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id FROM post ORDER BY created_at DESC")
            posts_data = cursor.fetchall()

        
        for post in posts_data:
            post_obj = get_post_by_id(post['id'])      

            if post_obj:
                posts.append(post_obj)  

        return posts
    except Exception as e:
        print(e)
        return []
    
def get_friends_feed(followees_id: List[int]) -> List[Post]:
    if not followees_id:
        return []

    conn = get_db()
    posts = []

    try:
        with conn.cursor() as cursor:
            format_strings = ','.join(['%s'] * len(followees_id))

            cursor.execute(f"SELECT id FROM post WHERE creator_id IN ({format_strings}) ORDER BY created_at DESC", tuple(followees_id))
            posts_data = cursor.fetchall()

            for post_id in posts_data:
                post = get_post_by_id(post_id['id'])

                if post:
                    posts.append(post)

        return posts
    except Exception as e:
        print(e)
        return []