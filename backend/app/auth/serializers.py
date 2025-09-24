from pydantic import BaseModel, Field

class RegistrationRequest(BaseModel):
    email: str
    username: str = Field(None, max_length=100)
    full_name: str = Field(None, max_length=50)
    password: str