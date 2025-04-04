from pydantic import BaseModel
from typing import Optional
from enum import Enum

class LoanTypeEnum(str, Enum):
    fixed = "fixed"
    adjustable = "adjustable"

class PropertyTypeEnum(str, Enum):
    single_family = "single_family"
    condo = "condo"

class MortgageBase(BaseModel):
    credit_score: int
    loan_amount: float
    property_value: float
    annual_income: float
    debt_amount: float
    loan_type: LoanTypeEnum
    property_type: PropertyTypeEnum
    
class MortgageCreate(MortgageBase):
    pass  

class MortgageUpdate(MortgageBase):
    pass  

class MortgageDB(MortgageBase):
    id: int  

    class Config:
        from_attributes = True

class MortgageOut(MortgageDB):
    rating: Optional[str] = None

class CreditRatingResponse(BaseModel):
    credit_score: int
    risk_level: str
    recommendation: Optional[str] = None
