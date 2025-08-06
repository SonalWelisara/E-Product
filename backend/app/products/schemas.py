from pydantic import BaseModel
from typing import Optional

class ProductCreate(BaseModel):
    title: str
    description: str
    price: float

class ProductOut(BaseModel):
    id: int
    title: str
    description: str
    price: float
    image_url: str
    owner_id: int
    owner_name: str
    owner_email: str

    class Config:
        from_attributes = True

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None