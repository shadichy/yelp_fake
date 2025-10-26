from fastapi import FastAPI
from .database import engine
from .models import user as user_model
from .routers import user as user_router

user_model.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user_router.router)

@app.get("/")
def read_root():
    return {"Hello": "World"}
