from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from app.auth.models import User

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    image_url = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User")