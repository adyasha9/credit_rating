from sqlalchemy import Column, Integer, Float, Enum, TIMESTAMP
from database.database import Base
import enum

class LoanTypeEnum(str, enum.Enum):
    fixed = "fixed"
    adjustable = "adjustable"

class PropertyTypeEnum(str, enum.Enum):
    single_family = "single_family"
    condo = "condo"

class Mortgage(Base):
    __tablename__ = "mortgages"

    id = Column(Integer, primary_key=True, index=True)
    credit_score = Column(Integer, nullable=False)
    loan_amount = Column(Float, nullable=False)
    property_value = Column(Float, nullable=False)
    annual_income = Column(Float, nullable=False)
    debt_amount = Column(Float, nullable=False)
    loan_type = Column(Enum(LoanTypeEnum), nullable=False)
    property_type = Column(Enum(PropertyTypeEnum), nullable=False)

