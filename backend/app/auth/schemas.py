from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True
        
class UserUpdate(BaseModel):
    name: Optional[str] = None
    current_password: str
    new_password: Optional[str] = None