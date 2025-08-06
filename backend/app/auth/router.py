from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from . import models, schemas, utils
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

router = APIRouter(tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    user_id = utils.verify_token(token, credentials_exception)
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

@router.post("/signup", response_model=schemas.UserOut)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    hashed_password = utils.pwd_context.hash(user.password)
    db_user = models.User(name=user.name, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not utils.pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid credentials")
    access_token = utils.create_access_token(data={"user_id": db_user.id})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=schemas.UserOut)
def read_current_user(current_user: models.User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=schemas.UserOut)
def update_user(
    user_update: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not utils.pwd_context.verify(user_update.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect current password"
        )

    if user_update.name is not None and user_update.name != current_user.name:
        current_user.name = user_update.name

    if user_update.new_password is not None:
        current_user.hashed_password = utils.pwd_context.hash(user_update.new_password)

    db.commit()
    db.refresh(current_user)
    return current_user