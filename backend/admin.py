from sqladmin import ModelView
from .models.user import User
from .models.profile import Patient, Therapist
from .models.verification_token import VerificationToken

class UserAdmin(ModelView, model=User):
    column_list = [User.id, User.email, User.verified, User.user_type, User.created_at]
    column_searchable_list = [User.email]
    column_sortable_list = [User.id, User.email, User.verified, User.user_type, User.created_at]
    column_details_list = [User.id, User.email, User.verified, User.user_type, User.created_at]
    icon = "fas fa-user"

class PatientAdmin(ModelView, model=Patient):
    column_list = [Patient.id, Patient.full_name, Patient.date_of_birth, Patient.address, Patient.phone_number]
    column_searchable_list = [Patient.full_name]
    column_sortable_list = [Patient.id, Patient.full_name, Patient.date_of_birth]
    column_details_list = [Patient.id, Patient.full_name, Patient.date_of_birth, Patient.address, Patient.phone_number]
    icon = "fas fa-user-injured"

class TherapistAdmin(ModelView, model=Therapist):
    column_list = [Therapist.id, Therapist.full_name, Therapist.license_number, Therapist.specialization, Therapist.years_of_experience, Therapist.office_address, Therapist.phone_number, Therapist.website]
    column_searchable_list = [Therapist.full_name, Therapist.specialization]
    column_sortable_list = [Therapist.id, Therapist.full_name, Therapist.specialization, Therapist.years_of_experience]
    column_details_list = [Therapist.id, Therapist.full_name, Therapist.license_number, Therapist.specialization, Therapist.years_of_experience, Therapist.office_address, Therapist.phone_number, Therapist.website]
    icon = "fas fa-user-md"

class VerificationTokenAdmin(ModelView, model=VerificationToken):
    column_list = [VerificationToken.id, VerificationToken.token, VerificationToken.user_id, VerificationToken.expires_at, VerificationToken.created_at]
    icon = "fas fa-key"
