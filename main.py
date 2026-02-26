from fastapi import FastAPI
from dotenv import load_dotenv
import os

load_dotenv()  # loads the .env file

USERNAME = os.getenv("API_USERNAME")
PASSWORD = os.getenv("API_PASSWORD")

app = FastAPI(title="Rezeptplattform API")

@app.get("/")
async def root():
    return {"message": "Willkommen bei der Rezeptplattform API!"}