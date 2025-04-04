import pytest
from fastapi.testclient import TestClient
from backend.app import app
from database import schema


client = TestClient(app)

mortgage_data = {
    "credit_score": 720,
    "loan_amount": 200000,
    "property_value": 250000,
    "annual_income": 80000,
    "debt_amount": 30000,
    "loan_type": "fixed",
    "property_type": "condo"
}

def test_create_mortgage():
    response = client.post("/mortgages/", json=mortgage_data)
    assert response.status_code == 200
    assert response.json()["rating"] == "AAA"  

def test_get_mortgages():
    response = client.get("/mortgages/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_mortgage():
    create_response = client.post("/mortgages/", json=mortgage_data)
    assert create_response.status_code == 200

def test_update_mortgage():
    create_response = client.post("/mortgages/", json=mortgage_data)
    mortgage_id = create_response.json()["id"]
    
    updated_data = mortgage_data.copy()
    updated_data["credit_score"] = 750  
    
    response = client.put(f"/mortgages/{mortgage_id}", json=updated_data)
    assert response.status_code == 200
    assert response.json()["credit_score"] == 750

def test_delete_mortgage():
    create_response = client.post("/mortgages/", json=mortgage_data)
    assert create_response.status_code == 200  
    mortgage_id = create_response.json().get("id")
    assert mortgage_id is not None  

    response = client.delete(f"/mortgages/{mortgage_id}")
    print("First DELETE Response:", response.json()) 
    assert response.status_code == 200
    assert response.json() == {"message": "Mortgage deleted successfully"}