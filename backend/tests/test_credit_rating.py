import pytest
from backend import crud
from database import schema

# Test data setup for different mortgage cases

valid_mortgage = schema.MortgageCreate(
    credit_score=720,
    loan_amount=200000,
    property_value=250000,
    annual_income=80000,
    debt_amount=30000,
    loan_type="fixed",
    property_type="condo"
)

invalid_mortgage = schema.MortgageCreate(
    credit_score=600,
    loan_amount=-100000,  # Invalid loan amount (negative value)
    property_value=250000,
    annual_income=80000,
    debt_amount=30000,
    loan_type="adjustable",
    property_type="single_family"
)

edge_case_mortgage = schema.MortgageCreate(
    credit_score=640,
    loan_amount=225000,
    property_value=250000,
    annual_income=90000,
    debt_amount=40000,
    loan_type="adjustable",
    property_type="condo"
)

# Test for a valid mortgage case, expecting a "BBB" rating
def test_valid_credit_rating():
    rating = crud.calculate_credit_rating(
        valid_mortgage.credit_score,
        valid_mortgage.loan_amount,
        valid_mortgage.property_value,
        valid_mortgage.annual_income,
        valid_mortgage.debt_amount,
        valid_mortgage.loan_type,
        valid_mortgage.property_type
    )
    # For the given mortgage, the risk score will be calculated based on the rules.
    # It will add points for the property type (condo) and loan type (fixed rate).
    # The final rating would likely be "BBB" for medium risk.
    assert rating == "AAA"

# Test for an invalid mortgage case, where loan amount is negative
def test_invalid_credit_rating():
    with pytest.raises(ValueError):
        crud.calculate_credit_rating(
            invalid_mortgage.credit_score,
            invalid_mortgage.loan_amount,
            invalid_mortgage.property_value,
            invalid_mortgage.annual_income,
            invalid_mortgage.debt_amount,
            invalid_mortgage.loan_type,
            invalid_mortgage.property_type
        )

# Test for an edge case mortgage scenario with credit score of 650
def test_edge_case_credit_rating():
    rating = crud.calculate_credit_rating(
        edge_case_mortgage.credit_score,
        edge_case_mortgage.loan_amount,
        edge_case_mortgage.property_value,
        edge_case_mortgage.annual_income,
        edge_case_mortgage.debt_amount,
        edge_case_mortgage.loan_type,
        edge_case_mortgage.property_type
    )
    # In this case, the mortgage has a credit score exactly at the lower end of the medium-risk range.
    # Since other attributes are not too risky, the expected rating should still be "BBB".
    assert rating == "BBB"

# Test for a very high-risk mortgage (credit score < 650, high LTV, and high DTI)
def test_high_risk_credit_rating():
    high_risk_mortgage = schema.MortgageCreate(
        credit_score=620,
        loan_amount=250000,
        property_value=200000,
        annual_income=50000,
        debt_amount=40000,
        loan_type="adjustable",
        property_type="condo"
    )
    
    rating = crud.calculate_credit_rating(
        high_risk_mortgage.credit_score,
        high_risk_mortgage.loan_amount,
        high_risk_mortgage.property_value,
        high_risk_mortgage.annual_income,
        high_risk_mortgage.debt_amount,
        high_risk_mortgage.loan_type,
        high_risk_mortgage.property_type
    )
    # With a credit score below 650, high loan-to-value, high debt-to-income ratio,
    # adjustable-rate loan, and condo property, this mortgage is highly risky.
    # The expected rating should be "C" (Highly speculative or distressed).
    assert rating == "C"

# Test for a very low-risk mortgage (credit score >= 700, low LTV, and low DTI)
def test_low_risk_credit_rating():
    low_risk_mortgage = schema.MortgageCreate(
        credit_score=750,
        loan_amount=150000,
        property_value=200000,
        annual_income=100000,
        debt_amount=10000,
        loan_type="fixed",
        property_type="single_family"
    )
    
    rating = crud.calculate_credit_rating(
        low_risk_mortgage.credit_score,
        low_risk_mortgage.loan_amount,
        low_risk_mortgage.property_value,
        low_risk_mortgage.annual_income,
        low_risk_mortgage.debt_amount,
        low_risk_mortgage.loan_type,
        low_risk_mortgage.property_type
    )
    assert rating == "AAA"
