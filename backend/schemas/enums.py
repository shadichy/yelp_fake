import enum

class UserType(str, enum.Enum):
    PATIENT = "PATIENT"
    THERAPIST = "THERAPIST"
    ADMIN = "ADMIN"

class AppointmentStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"
    COMPLETED = "COMPLETED"
