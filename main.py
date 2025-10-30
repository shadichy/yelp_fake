from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqladmin import Admin
from backend.database import engine
from backend.admin import (
    UserAdmin,
    PatientAdmin,
    TherapistAdmin,
    VerificationTokenAdmin,
)
from backend.routers import user as user_router
from backend.routers import profile as profile_router
from backend.routers import verification as verification_router
from backend.routers import availability as availability_router
from backend.routers import appointment as appointment_router
from backend.routers import review as review_router
from backend.routers import message as message_router

from backend.models.relationships import create_relationships
from backend.firstrun import run_first_time_setup

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

create_relationships()
run_first_time_setup()
admin = Admin(app, engine)

admin.add_view(UserAdmin)
admin.add_view(PatientAdmin)
admin.add_view(TherapistAdmin)
admin.add_view(VerificationTokenAdmin)

app.include_router(user_router.router)
app.include_router(profile_router.router)
app.include_router(verification_router.router)
app.include_router(availability_router.router)
app.include_router(appointment_router.router)
app.include_router(review_router.router)
app.include_router(message_router.router)

app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")


@app.get("/{full_path:path}")
async def serve_react_app(full_path: str) -> FileResponse:
    return FileResponse("frontend/dist/index.html")
