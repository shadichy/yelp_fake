from fastapi import FastAPI
from .database import engine, Base
from .models import user, profile
from .routers import user as user_router
from .routers import profile as profile_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user_router.router)
app.include_router(profile_router.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
