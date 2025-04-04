import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import MortgageForm from "./components/MortgageForm";
import MortgageList from "./components/MortgageList";
import { Mortgage } from './types/index';
import { createMortgage } from './services/api';
import './styles.css';

function App() {
  const [rating, setRating] = useState<string | null>(null);
  const handleFormSubmit = (mortgage: Mortgage) => {
    console.log("Mortgage submitted:", mortgage);
    createMortgage(mortgage)
      .then((response) => {
        console.log("Mortgage created:", response);
        setRating(response.rating ?? null); 
      }
      )
      .catch((error) => { 
        console.error("Error creating mortgage:", error);
      }
      );
  };
  return (
    <Router>
      <div>
        <h1>RMBS Credit Rating</h1>
        <nav>
          <a href="/add-mortgage">Add Mortgage</a> | <a href="/mortgages">View Mortgages</a>
        </nav>
        <Routes>
          <Route
            path="/add-mortgage"
            element={
              <MortgageForm
                onSubmit={handleFormSubmit}
                initialValues={{
                  id: 0,
                  credit_score: 0,
                  loan_amount: 1,
                  property_value: 1,
                  annual_income: 1,
                  debt_amount: 1,
                  loan_type: "fixed",
                  property_type: "single_family",
                }}
                buttonText="Submit Mortgage"
                rating={rating}
              />
            }
          />
          <Route
            path="/mortgages"
            element={<MortgageList />}
          />
          {/* Add a fallback route for the home page */}
          <Route
            path="/"
            element={<div>Select an option from the menu</div>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
