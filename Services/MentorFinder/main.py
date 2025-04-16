from fastapi import FastAPI 
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from enum import Enum
import motor.motor_asyncio
from mentor import find_mentors_for_student
from fastapi.middleware.cors import CORSMiddleware 
from dotenv import load_dotenv
import os

# load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))
# MONGO_URI = os.getenv("MONGO_URI")
MONGO_URI = 'mongodb+srv://Ojas025:sgCJ8jMbzUDKCz7t@cluster0.gfgv7.mongodb.net/AlumniPortal?retryWrites=true&w=majority&appName=Cluster0'

if (not MONGO_URI):
    print("MONGO_URI is not defined")

# MongoDB setup
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = client['AlumniPortal']
collection = db.users

app = FastAPI()

origins = [
    "http://localhost", 
    "http://localhost:5173", 
    "http://127.0.0.1:5173", 
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'] 
)

class UserRole(str, Enum):
    STUDENT = "student"
    ALUMNI = "alumni"
    ADMIN = "admin"

class Project(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    technologiesUsed: Optional[List[str]] = None

class Job(BaseModel):
    jobTitle: Optional[str] = None
    company: Optional[str] = None

class UserBase(BaseModel):
    id: Optional[str] = None
    skills: Optional[List[str]] = None
    bio: Optional[str] = None
    languages: Optional[List[str]] = None
    department: Optional[str] = None
    role: Optional[UserRole] = None
    projects: Optional[List[Project]] = None

    class Config:
        orm_mode = True

class Alumni(UserBase):
    availableForMentorship: Optional[bool] = None
    jobDetails: Optional[Job] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    batch: Optional[date] = None
    location: Optional[str] = None    
    profileImageURL: Optional[str] = None

    class Config:
        orm_mode = True

class MentorResponseItem(BaseModel):
    skills: Optional[List[str]] = None
    bio: Optional[str] = None
    languages: Optional[List[str]] = None
    department: Optional[str] = None
    role: Optional[UserRole] = None
    projects: Optional[List[Project]] = None
    availableForMentorship: Optional[bool] = None
    jobDetails: Optional[Job] = None
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    batch: Optional[date] = None
    location: Optional[str] = None
    profileImageURL: Optional[str] = None
    distance: float
    id: str

    class Config:
        orm_mode: True        

@app.get('/api/mentor')
def get():
    return {'message': "It's working bud"}

@app.post('/api/mentor', response_model=List[MentorResponseItem])
async def get_mentors(student: UserBase):
    cursor = db.users.find({ "role": "alumni" })

    print(cursor)
    alumni_list = []
    async for alumni in cursor:
        alumni['id'] = str(alumni['_id']) 
        alumni_list.append(Alumni(**alumni))

    print(alumni_list)
    mentors = find_mentors_for_student(student, alumni_list) 
    # print(mentors)

    return mentors
