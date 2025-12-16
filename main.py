from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqladmin import Admin
from .database import engine
from .admin import (
    UserAdmin,
    PatientAdmin,
    TherapistAdmin,
    VerificationTokenAdmin,
    AppointmentAdmin,
)
from .routers import user as user_router
from .routers import profile as profile_router
from .routers import verification as verification_router
from .routers import availability as availability_router
from .routers import appointment as appointment_router
from .routers import review as review_router
from .routers import message as message_router
from .routers import setup as setup_router

from .models.relationships import create_relationships
from .firstrun import run_first_time_setup
import os

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    os.makedirs("backend/static/images", exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
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
admin.add_view(AppointmentAdmin)

app.include_router(user_router.router)
app.include_router(profile_router.router)
app.include_router(verification_router.router)
app.include_router(availability_router.router)
app.include_router(appointment_router.router)
app.include_router(review_router.router)
app.include_router(message_router.router)
app.include_router(setup_router.router)

# Mount static. If running from yelp/, the path to static is backend/static
app.mount("/static", StaticFiles(directory="backend/static"), name="static")

@app.get("/")
def read_root():
    return {"message": "Hello World"}
