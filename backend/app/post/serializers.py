from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from typing import List

class CreatePostRequest(BaseModel):
    content: str = Field(..., max_length=250, description="Content of the post, max 250 characters")
    reply_to_post_id: Optional[int] = Field(None, description="ID of the post being replied to, if applicable")

class Post(BaseModel):
    id: int
    creator_id: int
    like_count: int
    reply_count: int    
    content: str = Field(..., max_length=250, description="Content of the post, max 250 characters")
    reply_to: Optional[int] = None    
    created_at: datetime
    images: Optional[List[str]] = []