from sqlalchemy.orm import Session
from ..models.user import User
from ..models.profile import Patient as PatientModel, Therapist as TherapistModel
from ..schemas.profile import PatientCreate, TherapistCreate, PatientUpdate, TherapistUpdate, PatientDelete, TherapistDelete
from ..schemas.enums import UserType
from fastapi import HTTPException, UploadFile
from typing import List, Optional, Tuple
from math import radians, sin, cos, sqrt, atan2
import shutil
import requests

class ProfileViewModel:
    def __init__(self, db: Session):
        self.db = db

    def _haversine(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        R = 6371  # Radius of Earth in kilometers
        dLat = radians(lat2 - lat1)
        dLon = radians(lon2 - lon1)
        a = sin(dLat / 2) * sin(dLat / 2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dLon / 2) * sin(dLon / 2)
        c = 2 * atan2(sqrt(a), sqrt(1 - a))
        distance = R * c
        return distance

    def _geocode(self, location: str) -> Tuple[Optional[float], Optional[float]]:
        try:
            url = "https://nominatim.openstreetmap.org/search"
            headers = {'User-Agent': 'TherapyFinder/1.0'}
            params = {
                'q': location,
                'format': 'json',
                'limit': 1
            }
            response = requests.get(url, params=params, headers=headers)
            if response.status_code == 200:
                data = response.json()
                if data:
                    return float(data[0]['lat']), float(data[0]['lon'])
        except Exception as e:
            print(f"Geocoding error: {e}")
        return None, None

    def upload_therapist_picture(self, current_user: User, file: UploadFile):
        if current_user.user_type != UserType.THERAPIST:
            raise HTTPException(status_code=403, detail="Only therapists can upload pictures.")
        
        db_profile = current_user.therapist_profile
        if not db_profile:
            raise HTTPException(status_code=404, detail="Therapist profile not found.")

        file_path = f"yelp/backend/static/images/{current_user.id}_{file.filename}" # Adjusted path
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Update DB with relative path for serving
        db_profile.profile_picture_url = f"/static/images/{current_user.id}_{file.filename}"
        self.db.commit()
        return {"message": "Profile picture updated successfully"}

    def search_therapists(self, specialization: Optional[str], lat: Optional[float], lon: Optional[float], radius: Optional[float], location: Optional[str], page: int, limit: int) -> List[TherapistModel]:
        query = self.db.query(TherapistModel)

        if specialization:
            query = query.filter(TherapistModel.specialization.ilike(f"%{specialization}%"))

        therapists = query.all()

        # If location string provided but no coordinates, geocode it
        if location and (lat is None or lon is None):
            geo_lat, geo_lon = self._geocode(location)
            if geo_lat is not None and geo_lon is not None:
                lat, lon = geo_lat, geo_lon
                # Default radius if not provided when searching by location
                if radius is None:
                    radius = 50.0 

        if lat is not None and lon is not None and radius is not None:
            filtered_therapists = []
            for therapist in therapists:
                if therapist.latitude is not None and therapist.longitude is not None:
                    distance = self._haversine(lat, lon, therapist.latitude, therapist.longitude)
                    if distance <= radius:
                        # therapist.average_rating = 4.5 # Mock rating - removed for now or should be handled properly
                        filtered_therapists.append(therapist)
            therapists = filtered_therapists

        offset = (page - 1) * limit
        therapists = therapists[offset:offset + limit]
        return therapists

    def create_patient_profile(self, current_user: User, profile: PatientCreate) -> PatientModel:
        if current_user.user_type != UserType.PATIENT:
            raise HTTPException(status_code=403, detail="Only patients can create patient profiles.")
        if current_user.patient_profile:
            raise HTTPException(status_code=400, detail="Patient profile already exists.")
        
        db_profile = PatientModel(**profile.model_dump(), user_id=current_user.id)
        self.db.add(db_profile)
        self.db.commit()
        self.db.refresh(db_profile)
        return db_profile

    def update_patient_profile(self, current_user: User, profile_update: PatientUpdate) -> PatientModel:
        if current_user.user_type != UserType.PATIENT:
            raise HTTPException(status_code=403, detail="Only patients can update patient profiles.")
        
        db_profile = current_user.patient_profile
        if not db_profile:
            raise HTTPException(status_code=404, detail="Patient profile not found.")

        update_data = profile_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_profile, key, value)
        
        self.db.add(db_profile)
        self.db.commit()
        self.db.refresh(db_profile)
        return db_profile

    def delete_patient_profile(self, current_user: User) -> PatientDelete:
        if current_user.user_type != UserType.PATIENT:
            raise HTTPException(status_code=403, detail="Only patients can delete patient profiles.")
        
        db_profile = current_user.patient_profile
        if not db_profile:
            raise HTTPException(status_code=404, detail="Patient profile not found.")

        self.db.delete(db_profile)
        self.db.commit()
        return PatientDelete()

    def create_therapist_profile(self, current_user: User, profile: TherapistCreate) -> TherapistModel:
        if current_user.user_type != UserType.THERAPIST:
            raise HTTPException(status_code=403, detail="Only therapists can create therapist profiles.")
        if current_user.therapist_profile:
            raise HTTPException(status_code=400, detail="Therapist profile already exists.")

        db_profile = TherapistModel(**profile.model_dump(), user_id=current_user.id)
        self.db.add(db_profile)
        self.db.commit()
        self.db.refresh(db_profile)
        return db_profile

    def update_therapist_profile(self, current_user: User, profile_update: TherapistUpdate) -> TherapistModel:
        if current_user.user_type != UserType.THERAPIST:
            raise HTTPException(status_code=403, detail="Only therapists can update therapist profiles.")
        
        db_profile = current_user.therapist_profile
        if not db_profile:
            raise HTTPException(status_code=404, detail="Therapist profile not found.")

        update_data = profile_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_profile, key, value)
        
        self.db.add(db_profile)
        self.db.commit()
        self.db.refresh(db_profile)
        return db_profile

    def delete_therapist_profile(self, current_user: User) -> TherapistDelete:
        if current_user.user_type != UserType.THERAPIST:
            raise HTTPException(status_code=403, detail="Only therapists can delete therapist profiles.")
        
        db_profile = current_user.therapist_profile
        if not db_profile:
            raise HTTPException(status_code=404, detail="Therapist profile not found.")

        self.db.delete(db_profile)
        self.db.commit()
        return TherapistDelete()

    def get_therapist_profile_by_id(self, therapist_id: int) -> TherapistModel:
        db_profile = self.db.query(TherapistModel).filter(TherapistModel.id == therapist_id).first()
        if not db_profile:
            raise HTTPException(status_code=404, detail="Therapist profile not found.")
        return db_profile

    def get_my_profile(self, current_user: User):
        if current_user.user_type == UserType.PATIENT:
            return current_user.patient_profile
        elif current_user.user_type == UserType.THERAPIST:
            return current_user.therapist_profile
        return None
