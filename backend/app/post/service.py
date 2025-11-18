from ..auth.serializers import User
from ..db.config import get_db
from typing import Optional, List
from .serializers import CreatePostRequest, Post, CreatorInfo
from ..image.serializers import Image
from ..image.service import generate_presigned_url
import traceback

def create_post(user: User, data: CreatePostRequest, images: List[Image]) -> Optional[Post]:
    conn = get_db()

    try:
        with conn.cursor() as cursor:
            if data.reply_to_post_id:
                cursor.execute("UPDATE post SET reply_count = reply_count + 1 WHERE id = %s", (data.reply_to_post_id,))
                cursor.execute("INSERT INTO post (creator_id, content, reply_to) VALUES (%s, %s, %s) RETURNING *", (user.id, data.content, data.reply_to_post_id))
            else:
                cursor.execute("INSERT INTO post (creator_id, content) VALUES (%s, %s) RETURNING *", (user.id, data.content))

            post = cursor.fetchone()

            if not post:
                return None
            
            if post['reply_to']:
                post['reply_to'] = get_post_by_id(post['reply_to'], 1)

            post = Post(**post)

            for image in images:
                cursor.execute("INSERT INTO post_image (post_id, image_id) VALUES (%s, %s)", (post.id, image.id))

            post.images = [generate_presigned_url(f"{img.container}/{img.image_name}") for img in images]

            conn.commit()
        return post
    except Exception as e:
        print(e)
        conn.rollback()
        return None

def get_post_by_id(post_id: int, d = 0, user_id: Optional[int] = None) -> Optional[Post]:
    if d > 1:
        return None
    
    conn = get_db()

    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM post WHERE id = %s", (post_id,))
            post_data = cursor.fetchone()

            if not post_data:
                return None
            
            if post_data['reply_to']:
                post_data['reply_to'] = get_post_by_id(post_data['reply_to'], d + 1, user_id)

            post = Post(**post_data)

            cursor.execute("""
                SELECT i.id, i.image_path, i.image_name, i.image_type, i.container
                FROM image i
                JOIN post_image pi ON i.id = pi.image_id
                WHERE pi.post_id = %s
            """, (post.id,))
            images_data = cursor.fetchall() 

            post.images = [generate_presigned_url(img['image_path']) for img in images_data]

            cursor.execute("SELECT id, username, pfp_id, full_name FROM app_user WHERE id = %s", (post_data['creator_id'],))

            user_data = cursor.fetchone()

            if not user_data:
                return None
            
            post.creator = CreatorInfo(**user_data)
            
            if user_data['pfp_id']:
                cursor.execute("SELECT image_name FROM image WHERE id = %s", (user_data['pfp_id'],))
                pfp_data = cursor.fetchone()
                if pfp_data:
                    post.creator.pfp_url = f"/api/image/{pfp_data['image_name']}"
            else:
                post.creator.pfp_url = "https://i.pinimg.com/236x/13/74/20/137420f5b9c39bc911e472f5d20f053e.jpg?nii=t"
            
            # Check if user liked the post
            if user_id:
                post.is_liked = check_user_liked_post(user_id, post.id)

        return post
    except Exception as e:
        print(e)
        traceback.print_exc()
        return None
    
def get_posts_with_details(post_ids: List[int], user_id: Optional[int] = None) -> List[Post]:
    if not post_ids:
        return []
    
    posts = []
    conn = get_db()

    with conn.cursor() as cursor:
        format_strings = ','.join(['%s'] * len(post_ids))

        cursor.execute(f"""
                SELECT 
                    p.id, p.creator_id, p.like_count, p.reply_count, p.content, p.created_at, p.reply_to,
                    u.username, u.full_name, u.pfp_id,
                    COALESCE(array_agg(i.image_path) FILTER (WHERE i.image_path IS NOT NULL), '{{}}') as images,
                    pfp_img.image_name as pfp_image_name
                FROM post p
                JOIN app_user u ON p.creator_id = u.id
                LEFT JOIN post_image pi ON p.id = pi.post_id
                LEFT JOIN image i ON pi.image_id = i.id
                LEFT JOIN image pfp_img ON u.pfp_id = pfp_img.id
                LEFT JOIN post p2 ON p.reply_to = p2.id
                WHERE p.id IN ({format_strings})
                GROUP BY p.id, u.id, pfp_img.image_name
                ORDER BY p.created_at DESC
        """, tuple(post_ids))
        
        posts_data = cursor.fetchall()

        for post_data in posts_data:
            is_liked = check_user_liked_post(user_id, post_data['id']) if user_id else False
            
            post = Post(
                id=post_data['id'],
                like_count=post_data['like_count'],
                reply_count=post_data['reply_count'],
                content=post_data['content'],
                created_at=post_data['created_at'],
                images=[generate_presigned_url(img_path) for img_path in post_data['images']] if post_data['images'] else [],
                creator=CreatorInfo(
                    id=post_data['creator_id'],
                    username=post_data['username'],
                    full_name=post_data['full_name'],
                    pfp_url=generate_presigned_url('pfp/' + post_data['pfp_image_name']) if post_data['pfp_image_name'] else "https://i.pinimg.com/236x/13/74/20/137420f5b9c39bc911e472f5d20f053e.jpg?nii=t"
                ),
                reply_to=get_post_by_id(post_data['reply_to'], user_id=user_id) if post_data['reply_to'] else None,
                is_liked=is_liked
            )
            posts.append(post)

    return posts
    
def get_all_posts(user_id: Optional[int] = None) -> List[Post]:
    conn = get_db()

    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id FROM post ORDER BY created_at DESC")
            posts_data = cursor.fetchall()
        return get_posts_with_details([post_id['id'] for post_id in posts_data], user_id)
    except Exception as e:
        traceback.print_exc()
        return []
    
def get_friends_feed(followees_id: List[int], user_id: Optional[int] = None) -> List[Post]:
    if not followees_id:
        return []

    conn = get_db()

    try:
        with conn.cursor() as cursor:
            format_strings = ','.join(['%s'] * len(followees_id))

            cursor.execute(f"SELECT id FROM post WHERE creator_id IN ({format_strings}) ORDER BY created_at DESC", tuple(followees_id))
            posts_data = cursor.fetchall()

        return get_posts_with_details([post_id['id'] for post_id in posts_data], user_id)
    except Exception as e:
        print(e)
        return []
    
def get_post_replies(post_id: int, user_id: Optional[int] = None) -> List[Post]:
    conn= get_db()
    replies = []
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id FROM post WHERE reply_to = %s ORDER BY created_at DESC", (post_id,))
            replies_data = cursor.fetchall()
            replies = get_posts_with_details([reply['id'] for reply in replies_data], user_id)

    except Exception as e:
        print(e)

    return replies

def like_post(user_id: int, post_id: int) -> Optional[bool]:
    conn = get_db()
    
    try:
        with conn.cursor() as cursor:
            # Check if already liked
            cursor.execute("SELECT id FROM post_like WHERE user_id = %s AND post_id = %s", (user_id, post_id))
            existing_like = cursor.fetchone()
            
            if existing_like:
                return False
            
            # Insert like
            cursor.execute("INSERT INTO post_like (user_id, post_id) VALUES (%s, %s)", (user_id, post_id))
            
            # Update like count
            cursor.execute("UPDATE post SET like_count = like_count + 1 WHERE id = %s", (post_id,))
            
            conn.commit()
            return True
    except Exception as e:
        print(e)
        traceback.print_exc()
        conn.rollback()
        return None

def unlike_post(user_id: int, post_id: int) -> Optional[bool]:
    conn = get_db()
    
    try:
        with conn.cursor() as cursor:
            # Check if like exists
            cursor.execute("SELECT id FROM post_like WHERE user_id = %s AND post_id = %s", (user_id, post_id))
            existing_like = cursor.fetchone()
            
            if not existing_like:
                return False
            
            # Delete like
            cursor.execute("DELETE FROM post_like WHERE user_id = %s AND post_id = %s", (user_id, post_id))
            
            # Update like count
            cursor.execute("UPDATE post SET like_count = like_count - 1 WHERE id = %s", (post_id,))
            
            conn.commit()
            return True
    except Exception as e:
        print(e)
        traceback.print_exc()
        conn.rollback()
        return None

def check_user_liked_post(user_id: int, post_id: int) -> bool:
    conn = get_db()
    
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id FROM post_like WHERE user_id = %s AND post_id = %s", (user_id, post_id))
            return cursor.fetchone() is not None
    except Exception as e:
        print(e)
        return False