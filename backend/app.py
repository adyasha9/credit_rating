from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from backend import models, crud
from database import schema, database
from fastapi.middleware.cors import CORSMiddleware
from backend.logging_config import setup_logger

logger = setup_logger(__name__)


app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")  
def read_root():
    logger.info("Root endpoint accessed")
    return {"message": "Fast API is working!"}

@app.post("/mortgages/", response_model=schema.MortgageOut)
def create_mortgage(mortgage: schema.MortgageCreate, db: Session = Depends(get_db)):
    logger.info("Creating a new mortgage")
    return crud.create_mortgage(db=db, mortgage=mortgage)


@app.get("/mortgages/", response_model=list[schema.MortgageOut])
def read_mortgages(db: Session = Depends(get_db)):
    logger.info("Fetching all mortgages")
    return crud.get_mortgages(db=db)


@app.get("/mortgages/{id}/", response_model=schema.MortgageOut)
def get_mortgage(id: int, db: Session = Depends(get_db)):
    logger.info(f"Fetching mortgage with ID {id}")
    mortgage = crud.get_mortgages(db, id)
    if mortgage is None:
        raise HTTPException(status_code=404, detail="Mortgage not found")
    return mortgage


@app.put("/mortgages/{id}")
def update_mortgage(id: int, mortgage: schema.MortgageCreate, db: Session = Depends(get_db)):
    logger.info(f"Updating mortgage with ID {id}")
    updated_mortgage = crud.update_mortgage(db=db, id=id, mortgage=mortgage)
    if updated_mortgage is None:
        raise HTTPException(status_code=404, detail="Mortgage not found")
    return updated_mortgage


@app.delete("/mortgages/{id}")
def delete_mortgage(id: int, db: Session = Depends(get_db)):
    logger.info(f"Deleting mortgage with ID {id}")
    try:
        success = crud.delete_mortgage(db=db, id=id)
        if not success:
            raise HTTPException(status_code=404, detail="Mortgage not found")
        return {"message": "Mortgage deleted successfully"}
    except Exception as e:
        print(f"Error: {e}") 
        raise HTTPException(status_code=500, detail="Internal Server Error")


@app.post("/calculate-rating/", response_model=schema.CreditRatingResponse)
def calculate_credit_rating(mortgages: list[schema.MortgageCreate], db: Session = Depends(get_db)):
    return crud.calculate_credit_rating(db=db, mortgages=mortgages)
