from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from .database import engine, Base
from .models import user, profile
from .routers import user as user_router
from .routers import profile as profile_router

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(user_router.router)
app.include_router(profile_router.router)

app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    return FileResponse("frontend/dist/index.html")
