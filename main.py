from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
import os
import motor.motor_asyncio

load_dotenv()  # loads the .env file

USERNAME = os.getenv("API_USERNAME")
PASSWORD = os.getenv("API_PASSWORD")
MONGO_URL = os.getenv("MONGO_URL")
MONGO_DB = os.getenv("MONGO_DB")

# MongoDB Verbindung
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URL)
db = client[MONGO_DB]

app = FastAPI(title="Rezeptplattform API")


class Recipe(BaseModel):
   name: str
   description: str
   origin: str
   ingredients: list[str]
   instructions: str
   servings: Optional[int] = 4


   

@app.get("/")
async def root():
    return {"message": "Willkommen bei der Rezeptplattform API!"}