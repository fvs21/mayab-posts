from ..auth.serializers import User
from ..db.config import get_db
from typing import Optional, List
from .serializers import CreatePostRequest, Post, CreatorInfo
from ..image.serializers import Image

def create_post(user: User, data: CreatePostRequest, images: List[Image]) -> Optional[Post]:
    conn = get_db()

    try:
        with conn.cursor() as cursor:
            if data.reply_to_post_id:
                cursor.execute("INSERT INTO post (creator_id, content, reply_to) VALUES (%s, %s, %s) RETURNING *", (user.id, data.content, data.reply_to_post_id))
                cursor.execute("UPDATE post SET reply_count = reply_count + 1 WHERE id = %s", (data.reply_to_post_id,))
            else:
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
    
def get_posts_with_details(post_ids: List[int]) -> List[Post]:
    posts = []
    conn = get_db()

    with conn.cursor() as cursor:
        format_strings = ','.join(['%s'] * len(post_ids))

        cursor.execute(f"""
                SELECT 
                    p.id, p.creator_id, p.like_count, p.reply_count, p.content, p.created_at,
                    u.username, u.full_name, u.pfp_id,
                    COALESCE(array_agg(i.image_name) FILTER (WHERE i.image_name IS NOT NULL), '{{}}') as image_names,
                    pfp_img.image_name as pfp_image_name
                FROM post p
                JOIN app_user u ON p.creator_id = u.id
                LEFT JOIN post_image pi ON p.id = pi.post_id
                LEFT JOIN image i ON pi.image_id = i.id
                LEFT JOIN image pfp_img ON u.pfp_id = pfp_img.id
                WHERE p.id IN ({format_strings})
                GROUP BY p.id, u.id, pfp_img.image_name
                ORDER BY p.created_at DESC
        """, tuple(post_ids))
        
        posts_data = cursor.fetchall()

        for post_data in posts_data:
            post = Post(
                id=post_data['id'],
                creator_id=post_data['creator_id'],
                like_count=post_data['like_count'],
                reply_count=post_data['reply_count'],
                content=post_data['content'],
                created_at=post_data['created_at'],
                images=[f"/api/image/{img_name}" for img_name in post_data['image_names']] if post_data['image_names'] else [],
                creator_info=CreatorInfo(
                    id=post_data['creator_id'],
                    username=post_data['username'],
                    full_name=post_data['full_name'],
                    pfp_url=f"/api/image/{post_data['pfp_image_name']}" if post_data['pfp_image_name'] else None
                )
            )
            posts.append(post)
    
    return posts
    
def get_all_posts() -> List[Post]:
    conn = get_db()
    posts = []

    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id FROM post ORDER BY created_at DESC")
            posts_data = cursor.fetchall()

        
        return get_posts_with_details([post_id['id'] for post_id in posts_data])
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

        return get_posts_with_details([post_id['id'] for post_id in posts_data])
    except Exception as e:
        print(e)
        return []
    
def get_post_replies(post_id: int) -> List[Post]:
    conn= get_db()
    replies = []
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id FROM post WHERE reply_to = %s ORDER BY created_at DESC", (post_id,))
            replies_data = cursor.fetchall()
            replies = get_posts_with_details([reply['id'] for reply in replies_data])

    except Exception as e:
        print(e)

    return replies