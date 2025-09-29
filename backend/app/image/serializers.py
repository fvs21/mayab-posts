from pydantic import BaseModel, Field

class Image(BaseModel):
    id: int
    _image_path: str
    image_name: str
    image_type: str
    container: str = Field(..., description="The container where the image is stored")