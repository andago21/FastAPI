from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
import secrets
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


security = HTTPBasic()

def check_auth(credentials: HTTPBasicCredentials = Depends(security)):
    correct_password = USERS.get(credentials.username)
    correct_user = secrets.compare_digest(credentials.username, USERNAME)
    correct_pass = secrets.compare_digest(credentials.password, PASSWORD)
    
    if not (correct_user and correct_pass):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Falscher Benutzername oder Passwort",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username




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


# DB VERBINDUNG TEST
@app.get("/test-db")
async def test_db():
    collections = await db.list_collection_names()
    return {"status": "Verbindung erfolgreich!", "collections": collections}





# MongoDB Objekt lesbar machen
def recipe_helper(recipe) -> dict:
    recipe["id"] = str(recipe["_id"])  # MongoDB _id zu normalem string
    del recipe["_id"]
    return recipe

# ── GET /api/recipes
@app.get("/api/recipes")
async def get_recipes():
    recipes = []
    async for recipe in db.recipes.find():
        recipes.append(recipe_helper(recipe))
    return {"recipes": recipes, "total": len(recipes)}

# ── GET /api/ingredients
@app.get("/api/ingredients")
async def get_ingredients():
    ingredients = []
    async for ingredient in db.ingredients.find():
        ingredients.append(recipe_helper(ingredient))
    return {"ingredients": ingredients, "total": len(ingredients)}

# ── POST /api/recipes
@app.post("/api/recipes", status_code=201)
async def create_recipe(recipe: Recipe, recipe: Recipe, username: str = Depends(check_auth)):
    result = await db.recipes.insert_one(recipe.dict())
    new_recipe = await db.recipes.find_one({"_id": result.inserted_id})
    return {"message": "Rezept erstellt!", "recipe": recipe_helper(new_recipe)}