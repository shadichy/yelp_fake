from sqlalchemy.orm import relationship
from .user import User
from .profile import Patient, Therapist
from .verification_token import VerificationToken
from .appointment import Appointment
from .availability import Availability
from .review import Review
from .message import Message

def create_relationships():
    User.patient_profile = relationship("Patient", back_populates="user", uselist=False)
    User.therapist_profile = relationship("Therapist", back_populates="user", uselist=False)
    User.verification_tokens = relationship("VerificationToken", back_populates="user")
    User.availabilities = relationship("Availability", back_populates="therapist")
    User.patient_appointments = relationship("Appointment", back_populates="patient", foreign_keys="[Appointment.patient_id]")
    User.therapist_appointments = relationship("Appointment", back_populates="therapist", foreign_keys="[Appointment.therapist_id]")
    User.patient_reviews = relationship("Review", back_populates="patient", foreign_keys="[Review.patient_id]")
    User.therapist_reviews = relationship("Review", back_populates="therapist", foreign_keys="[Review.therapist_id]")
    User.sent_messages = relationship("Message", back_populates="sender", foreign_keys="[Message.sender_id]")
    User.received_messages = relationship("Message", back_populates="receiver", foreign_keys="[Message.receiver_id]")

    Patient.user = relationship("User", back_populates="patient_profile")
    Therapist.user = relationship("User", back_populates="therapist_profile")
    VerificationToken.user = relationship("User", back_populates="verification_tokens")
    Availability.therapist = relationship("User", back_populates="availabilities")
    Appointment.patient = relationship("User", back_populates="patient_appointments", foreign_keys=[Appointment.patient_id])
    Appointment.therapist = relationship("User", back_populates="therapist_appointments", foreign_keys=[Appointment.therapist_id])
    Review.patient = relationship("User", back_populates="patient_reviews", foreign_keys=[Review.patient_id])
    Review.therapist = relationship("User", back_populates="therapist_reviews", foreign_keys=[Review.therapist_id])
    Message.sender = relationship("User", back_populates="sent_messages", foreign_keys=[Message.sender_id])
    Message.receiver = relationship("User", back_populates="received_messages", foreign_keys=[Message.receiver_id])
