from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime

class RegistrationRequest(BaseModel):
    email: str = Field(..., min_length=8, max_length=255)
    username: str = Field(..., min_length=3, max_length=100)
    full_name: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=8, max_length=128)

    @field_validator('email')
    def validate_email(cls, v):
        if '@' not in v or '.' not in v:
            raise ValueError('Invalid email address')
        return v.lower()
    
    @field_validator('username')
    def validate_username(cls, v):
        if not v.isalnum():
            raise ValueError('Username must be alphanumeric')
        return v.lower()

class LoginRequest(BaseModel):
    username: str
    password: str

class EmailVerificationRequest(BaseModel):
    code: str

class User(BaseModel):  
    id: int
    email: str
    full_name: str
    username: str
    _password: str
    pfp_id: Optional[int] = None
    banner_id: Optional[int] = None
    bio: Optional[str] = None
    email_verified_at: Optional[datetime] = None