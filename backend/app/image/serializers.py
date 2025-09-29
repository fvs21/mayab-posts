from pydantic import BaseModel, Field

class Image(BaseModel):
    id: int
    image_path: str
    image_name: str
    image_type: str
    container: str = Field(..., description="The container where the image is stored")

    @property
    def key(self) -> str:
        return f"image/{self.container}/{self.image_name}"