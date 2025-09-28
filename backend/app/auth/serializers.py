from pydantic import BaseModel, Field
from typing import Optional

class RegistrationRequest(BaseModel):
    email: str = Field(..., min_length=8, max_length=255)
    username: str = Field(..., min_length=3, max_length=100)
    full_name: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=128)

class LoginRequest(BaseModel):
    username: str
    password: str

class User(BaseModel):  
    id: int
    email: str
    full_name: str
    username: str
    _password: str
    pfp_id: Optional[int] = None
    banner_id: Optional[int] = None
    bio: Optional[str] = None