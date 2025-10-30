from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqladmin import Admin
from .database import engine
from .admin import UserAdmin, PatientAdmin, TherapistAdmin, VerificationTokenAdmin
from .routers import user as user_router
from .routers import profile as profile_router
from .routers import verification as verification_router
from .routers import availability as availability_router
from .routers import appointment as appointment_router
from .routers import review as review_router
from .routers import message as message_router

from .models.relationships import create_relationships

app = FastAPI()

create_relationships()
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
