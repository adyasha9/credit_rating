import React, { useState } from 'react';
import { Mortgage } from '../types/index';

interface MortgageFormProps {
  onSubmit: (mortgage: Mortgage) => void; 
  initialValues?: Mortgage; 
  buttonText?: string; 
  rating: string | null;
}

const defaultMortgage: Mortgage = {
  credit_score: 0,
  loan_amount: 0,
  property_value: 0,
  annual_income: 0,
  debt_amount: 0,
  loan_type: 'fixed',
  property_type: 'single_family'
};

const MortgageForm: React.FC<MortgageFormProps> = ({
  onSubmit,
  initialValues = defaultMortgage,
  buttonText = 'Submit',
  rating
}) => {
  const [formData, setFormData] = useState<Mortgage>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    const numberFields = ['credit_score', 'loan_amount', 'property_value', 'annual_income', 'debt_amount'];
    const parsedValue = numberFields.includes(name) ? parseFloat(value) : value;
    
    setFormData({
      ...formData,
      [name]: parsedValue
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.credit_score < 300 || formData.credit_score > 850) {
      newErrors.credit_score = 'Credit score must be between 300 and 850';
    }
    
    if (formData.loan_amount <= 0) {
      newErrors.loan_amount = 'Loan amount must be a positive number';
    }
    
    if (formData.property_value <= 0) {
      newErrors.property_value = 'Property value must be a positive number';
    }
    
    if (formData.annual_income <= 0) {
      newErrors.annual_income = 'Annual income must be a positive number';
    }
    
    if (formData.debt_amount < 0) {
      newErrors.debt_amount = 'Debt amount cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mortgage-form">
      <div className="form-group">
        <label htmlFor="credit_score">Credit Score:</label>
        <input
          type="number"
          id="credit_score"
          name="credit_score"
          value={formData.credit_score}
          onChange={handleChange}
          min="300"
          max="850"
          required
        />
        {errors.credit_score && <div className="error">{errors.credit_score}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="loan_amount">Loan Amount:</label>
        <input
          type="number"
          id="loan_amount"
          name="loan_amount"
          value={formData.loan_amount}
          onChange={handleChange}
          min="1"
          required
        />
        {errors.loan_amount && <div className="error">{errors.loan_amount}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="property_value">Property Value:</label>
        <input
          type="number"
          id="property_value"
          name="property_value"
          value={formData.property_value}
          onChange={handleChange}
          min="1"
          required
        />
        {errors.property_value && <div className="error">{errors.property_value}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="annual_income">Annual Income:</label>
        <input
          type="number"
          id="annual_income"
          name="annual_income"
          value={formData.annual_income}
          onChange={handleChange}
          min="1"
          required
        />
        {errors.annual_income && <div className="error">{errors.annual_income}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="debt_amount">Debt Amount:</label>
        <input
          type="number"
          id="debt_amount"
          name="debt_amount"
          value={formData.debt_amount}
          onChange={handleChange}
          min="0"
          required
        />
        {errors.debt_amount && <div className="error">{errors.debt_amount}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="loan_type">Loan Type:</label>
        <select
          id="loan_type"
          name="loan_type"
          value={formData.loan_type}
          onChange={handleChange}
          required
        >
          <option value="fixed">Fixed</option>
          <option value="adjustable">Adjustable</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="property_type">Property Type:</label>
        <select
          id="property_type"
          name="property_type"
          value={formData.property_type}
          onChange={handleChange}
          required
        >
          <option value="single_family">Single Family</option>
          <option value="condo">Condo</option>
        </select>
      </div>
      {rating !== null && (
        <div className="form-group">
          <label>Credit Rating:</label>
          <div className="rating">{rating}</div>
        </div>
      )}

      <button type="submit" className="submit-button">{buttonText}</button>
    </form>
  );
};

export default MortgageForm;