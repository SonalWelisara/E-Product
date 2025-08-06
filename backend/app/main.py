from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .auth import router as auth_router
from .products import router as products_router
from .database import Base, engine

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000",  #Next.js frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  
)

app.mount("/static", StaticFiles(directory="uploads"), name="static")

app.include_router(auth_router.router, prefix="/auth")
app.include_router(products_router.router, prefix="/products")