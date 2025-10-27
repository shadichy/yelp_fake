from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from starlette.middleware.session import SessionMiddleware
from .database import engine, Base
from .models import user, profile
from .routers import user as user_router
from .routers import profile as profile_router
from .routers import verification as verification_router
from .admin import admin_app, AdminAuth

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add session middleware
app.add_middleware(SessionMiddleware, secret_key="your-secret-key")

# Initialize admin
admin_app.configure(
    engine=engine,
    authentication=AdminAuth(),
)

app.include_router(user_router.router)
app.include_router(profile_router.router)
app.include_router(verification_router.router)
app.mount('/admin', app=admin_app)


app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    return FileResponse("frontend/dist/index.html")
