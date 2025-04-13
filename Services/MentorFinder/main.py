from fastapi import FastAPI 
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from enum import Enum
import motor.motor_asyncio
from sentenceTransformer import find_mentors_for_student
from fastapi.middleware.cors import CORSMiddleware  

# Motor setup
client = motor.motor_asyncio.AsyncIOMotorClient("localhost", 3000)
db = client['AlumniPortal']
collection = db.users

app = FastAPI()

origins = [
    "http://localhost", 
    "http://localhost:3000", 
    "http://127.0.0.1:3000", 
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
    MENTOR = "mentor"

class Project(BaseModel):
    title: str
    description: str
    url: str
    technologiesUsed: List[str]

class Job(BaseModel):
    jobTitle: str
    company: str

class UserBase(BaseModel):
    firstName: str
    lastName: Optional[str] = None
    _id: str
    profileImageURL: Optional[str] = None
    skills: List[str]
    bio: str
    location: str
    linkedin: Optional[str] = None
    github: Optional[str] = None
    languages: List[str]
    role: UserRole
    projects: Optional[List[Project]] = None

    class Config:
        orm_mode = True

class Alumni(UserBase):
    availableForMentorship: Optional[bool] = False
    jobDetails: Optional[Job] = None

    class Config:
        orm_mode = True

@app.get('/api/mentor')
def get():
    return {'message': "It's working bud"}

@app.post('/api/mentor', response_model=List[Alumni])
async def get_mentors(student: UserBase):
    cursor = await db.users.find({ "role": "alumni" })

    alumni_list = []
    for alumni in cursor:
        alumni['_id'] = str(alumni['_id'])
        alumni_list.append(Alumni(**alumni))

    # Process for finding mentors
    mentors = find_mentors_for_student(student, alumni_list)    

    return mentors    