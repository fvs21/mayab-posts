from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
from typing import List

class CreatePostRequest(BaseModel):
    content: str = Field(..., max_length=250, description="Content of the post, max 250 characters")
    reply_to_post_id: Optional[int] = Field(None, description="ID of the post being replied to, if applicable")

    @field_validator('content')
    def content_must_not_be_empty(cls, v):
        if v is not None:
            v = v.strip()
            if not v:
                raise ValueError('Content must not be empty')
        return v

class CreatorInfo(BaseModel):
    username: str
    pfp_url: Optional[str] = None
    full_name: Optional[str] = None

class Post(BaseModel):
    id: int
    like_count: int
    reply_count: int
    creator_id: int    
    content: str = Field(..., max_length=250, description="Content of the post, max 250 characters")
    reply_to: Optional[int] = None    
    created_at: datetime
    images: Optional[List[str]] = []
    creator_info: Optional[CreatorInfo] = None