from sqlalchemy.orm import Session
from . import models
from database import schema
import logging

def calculate_credit_rating(credit_score, loan_amount, property_value, annual_income, debt_amount, loan_type, property_type, avg_credit_score=None):
    risk_score = 0

    # Validate input values
    if loan_amount <= 0:
        raise ValueError("Loan amount must be positive")
    
    if property_value <= 0:
        raise ValueError("Property value must be positive")
        
    if annual_income <= 0:
        raise ValueError("Annual income must be positive")
        
    if debt_amount < 0:  
        raise ValueError("Debt amount cannot be negative")
    
    if loan_type not in ['fixed', 'adjustable']:
        raise ValueError("Loan type must be 'fixed' or 'adjustable'")
        
    if property_type not in ['single_family', 'condo']:
        raise ValueError("Property type must be 'single_family' or 'condo'")

    ltv_ratio = loan_amount / property_value
    if ltv_ratio > 0.9:
        risk_score += 2
    elif ltv_ratio > 0.8:
        risk_score += 1

    dti_ratio = debt_amount / annual_income
    if dti_ratio > 0.5:
        risk_score += 2
    elif dti_ratio > 0.4:
        risk_score += 1

    if credit_score >= 700:
        risk_score -= 1
    elif credit_score < 650:
        risk_score += 1

    if loan_type == 'adjustable':
        risk_score += 1
    elif loan_type == 'fixed':
        risk_score -= 1

    if property_type == 'condo':
        risk_score += 1

    if avg_credit_score is not None:
        if avg_credit_score >= 700:
            risk_score -= 1
        elif avg_credit_score < 650:
            risk_score += 1

    if risk_score <= 2:
        return "AAA"
    elif 3 <= risk_score <= 5:
        return "BBB"
    else:
        return "C"



def create_mortgage(db: Session, mortgage: schema.MortgageCreate):
    rating = calculate_credit_rating(
        mortgage.credit_score, mortgage.loan_amount, mortgage.property_value, 
        mortgage.annual_income, mortgage.debt_amount, mortgage.loan_type, 
        mortgage.property_type
    )

    db_mortgage = models.Mortgage(**mortgage.dict())
    db.add(db_mortgage)
    db.commit()
    db.refresh(db_mortgage)
    mortgage_out = schema.MortgageOut(
        id=db_mortgage.id,
        credit_score=db_mortgage.credit_score,
        loan_amount=db_mortgage.loan_amount,
        property_value=db_mortgage.property_value,
        annual_income=db_mortgage.annual_income,
        debt_amount=db_mortgage.debt_amount,
        loan_type=db_mortgage.loan_type,
        property_type=db_mortgage.property_type,
        rating=rating
    )
    return mortgage_out


def get_mortgages(db: Session):
    db_mortgages = db.query(models.Mortgage).all()
    return [schema.MortgageOut(
        id=mortgage.id,
        credit_score=mortgage.credit_score,
        loan_amount=mortgage.loan_amount,
        property_value=mortgage.property_value,
        annual_income=mortgage.annual_income,
        debt_amount=mortgage.debt_amount,
        loan_type=mortgage.loan_type,
        property_type=mortgage.property_type,
    ) for mortgage in db_mortgages]


def delete_mortgage(db: Session, id: int):
    db_mortgage = db.query(models.Mortgage).filter(models.Mortgage.id == id).first()
    if db_mortgage:
        db.delete(db_mortgage)
        db.commit()
        return True
    return False


def update_mortgage(id: int, mortgage: schema.MortgageCreate, db: Session):
    db_mortgage = db.query(models.Mortgage).filter(models.Mortgage.id == id).first()

    if db_mortgage:
        for field, value in mortgage.dict(exclude_unset=True).items():
            setattr(db_mortgage, field, value)

        rating = calculate_credit_rating(
            db_mortgage.credit_score, db_mortgage.loan_amount, db_mortgage.property_value,
            db_mortgage.annual_income, db_mortgage.debt_amount, db_mortgage.loan_type,
            db_mortgage.property_type
        )
        db_mortgage.rating = rating

        db.commit()
        db.refresh(db_mortgage)

        return schema.MortgageOut(
            id=db_mortgage.id,
            credit_score=db_mortgage.credit_score,
            loan_amount=db_mortgage.loan_amount,
            property_value=db_mortgage.property_value,
            annual_income=db_mortgage.annual_income,
            debt_amount=db_mortgage.debt_amount,
            loan_type=db_mortgage.loan_type,
            property_type=db_mortgage.property_type,
            rating=db_mortgage.rating  # Added missing rating field
        )
    else:
        return {"message": "Mortgage not found"}
