from pydantic import BaseModel, Field

class Post(BaseModel):
    id: int
    creator_id: int
    likes: int
    reply_count: int
    content: str = Field(..., max_length=250, description="Content of the post, max 250 characters")
    