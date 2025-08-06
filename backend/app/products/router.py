from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.auth.router import get_current_user
from app.auth.models import User
from . import models, schemas
from typing import Optional
import os
import shutil

router = APIRouter(tags=["Products"])
UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_product(
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    file_location = os.path.join(UPLOAD_FOLDER, image.filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
    
    image_url = f"/static/{image.filename}"
    
    db_product = models.Product(
        title=title,
        description=description,
        price=price,
        image_url=image_url,
        owner_id=current_user.id
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@router.get("/", response_model=list[schemas.ProductOut])
def get_all_products(db: Session = Depends(get_db)):
    products = db.query(models.Product).all()
    # Populate owner_name for the response schema
    products_out = []
    for p in products:
        products_out.append(schemas.ProductOut(
            id=p.id,
            title=p.title,
            description=p.description,
            price=p.price,
            image_url=p.image_url,
            owner_id=p.owner_id,
            owner_email=p.owner.email if p.owner else "N/A",
            owner_name=p.owner.name if p.owner else "N/A"
        ))
    return products_out

@router.put("/{product_id}")
def update_product(
    product_id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    if db_product.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only update your own products")

    # Update fields
    if title is not None:
        db_product.title = title
    if description is not None:
        db_product.description = description
    if price is not None:
        db_product.price = price

    # Handle image update: Delete old image and save new one
    if image is not None:
        # Get the path of the old image file
        old_image_path = os.path.join(UPLOAD_FOLDER, os.path.basename(db_product.image_url))
        # Delete the old image file if it exists
        if os.path.exists(old_image_path):
            os.remove(old_image_path)
            
        # Save the new image file
        new_image_path = os.path.join(UPLOAD_FOLDER, image.filename)
        with open(new_image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        
        # Update the database with the new image URL
        db_product.image_url = f"/static/{image.filename}"
    
    db.commit()
    db.refresh(db_product)
    return {"message": "Product updated successfully"}

@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    if db_product.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only delete your own products")

    # Get the path of the image file to be deleted
    image_path = os.path.join(UPLOAD_FOLDER, os.path.basename(db_product.image_url))
    
    # Delete the database entry first
    db.delete(db_product)
    db.commit()
    
    # Then, delete the physical image file
    if os.path.exists(image_path):
        os.remove(image_path)
    
    return {"message": "Product deleted successfully"}

@router.get("/{product_id}", response_model=schemas.ProductOut)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    
    return schemas.ProductOut(
        id=db_product.id,
        title=db_product.title,
        description=db_product.description,
        price=db_product.price,
        image_url=db_product.image_url,
        owner_id=db_product.owner_id,
        owner_email=db_product.owner.email if db_product.owner else "N/A",
        owner_name=db_product.owner.name if db_product.owner else "N/A"
    )