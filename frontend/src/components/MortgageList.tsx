// MortgageList.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { Mortgage } from '../types/index';
import MortgageForm from './MortgageForm';
import { getMortgages, deleteMortgage, updateMortgage } from '../services/api';
import ReactPaginate from "react-paginate";
import './MortgageList.css';

const MortgageList = () => {
  const [mortgages, setMortgages] = useState<Mortgage[]>([]);
  const [currentMortgage, setCurrentMortgage] = useState<Mortgage | null>(null);
  const [formData, setFormData] = useState<Partial<Mortgage>>({
    credit_score: 0,
    loan_amount: 0,
    property_value: 0,
    annual_income: 0,
    debt_amount: 0,
    loan_type: "fixed",
    property_type: "single_family",
  });  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const mortgagesPerPage = 5;

  // Fetch all mortgages when component mounts
  useEffect(() => {
    fetchMortgages();
  }, []);

  const fetchMortgages = async () => {
    setLoading(true);
    try {
      const data = await getMortgages();
      setMortgages(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching mortgages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this mortgage?')) {
      try {
        await deleteMortgage(id);
        setMortgages(mortgages.filter((mortgage) => mortgage.id !== id));
      } catch (err) {
        console.error('Error deleting mortgage:', err);
      }
    }
  };

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };
  
  const offset = currentPage * mortgagesPerPage;
  const currentMortgages = mortgages.slice(offset, offset + mortgagesPerPage);
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status" />
        <p>Loading mortgages...</p>
      </div>
    );
  }

  const openEditModal = (mortgage: Mortgage) => {
    setCurrentMortgage(mortgage);
    setFormData({ ...mortgage });
    setShowEditModal(true);
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
  
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.credit_score || Number(formData.credit_score) < 300 || Number(formData.credit_score) > 850) {
      errors.credit_score = 'Credit score must be between 300 and 850';
    }

    if (!formData.loan_amount || Number(formData.loan_amount) <= 0) {
      errors.loan_amount = 'Loan amount must be positive';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      const dataToSubmit = {
        credit_score: parseInt(String(formData.credit_score) || "0"),
        loan_amount: parseFloat(String(formData.loan_amount) || "0"),
        property_value: parseFloat(String(formData.property_value) || "0"),
        annual_income: parseFloat(String(formData.annual_income) || "0"),
        debt_amount: parseFloat(String(formData.debt_amount) || "0"),
        loan_type: formData.loan_type ? formData.loan_type : "fixed",
        property_type: formData.property_type ? formData.property_type : "single_family",
      };

      if (currentMortgage?.id !== undefined) {
        const updatedMortgage = await updateMortgage(currentMortgage.id, dataToSubmit);
        setMortgages(
          mortgages.map((mortgage) =>
            mortgage.id === currentMortgage.id ? { ...mortgage, ...dataToSubmit } : mortgage
          )
        );
        setShowEditModal(false);
      } else {
        console.error("Cannot update mortgage: ID is undefined.");
      }
    } catch (err) {
      console.error('Error updating mortgage:', err);
    }
  };

  // Calculate LTV and DTI ratios for display
  const calculateRatios = (mortgage:Mortgage) => {
    const ltv = ((mortgage.loan_amount / mortgage.property_value) * 100).toFixed(2);
    const dti = ((mortgage.debt_amount / mortgage.annual_income) * 100).toFixed(2);
    return { ltv, dti };
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading mortgages...</p>
      </div>
    );
  }

  return (
    <div className="mortgage-list-container">
      <h2>Mortgage List</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {mortgages.length === 0 ? (
        <Alert variant="info">No mortgages found. Add a new mortgage to get started.</Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Credit Score</th>
                <th>Loan Amount</th>
                <th>Property Value</th>
                <th>LTV Ratio</th>
                <th>Annual Income</th>
                <th>Debt Amount</th>
                <th>DTI Ratio</th>
                <th>Loan Type</th>
                <th>Property Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentMortgages.map(mortgage => {
                const { ltv, dti } = calculateRatios(mortgage);
                return (
                  <tr key={mortgage.id}>
                    <td>{mortgage.id}</td>
                    <td>{mortgage.credit_score}</td>
                    <td>${mortgage.loan_amount.toLocaleString()}</td>
                    <td>${mortgage.property_value.toLocaleString()}</td>
                    <td>{ltv}%</td>
                    <td>${mortgage.annual_income.toLocaleString()}</td>
                    <td>${mortgage.debt_amount.toLocaleString()}</td>
                    <td>{dti}%</td>
                    <td>{mortgage.loan_type === 'fixed' ? 'Fixed Rate' : 'Adjustable Rate'}</td>
                    <td>{mortgage.property_type === 'single_family' ? 'Single Family' : 'Condo'}</td>
                   <td>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => openEditModal(mortgage)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => mortgage.id !== undefined && handleDelete(mortgage.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <ReactPaginate
          previousLabel={'Previous'}
          nextLabel={'Next'}
          breakLabel={'...'}
          pageCount={Math.ceil(mortgages.length / mortgagesPerPage)}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={(event) => {
          handlePageClick(event);
        }}
        containerClassName={'pagination'}
        activeClassName={'active'}
        pageClassName={'page'}
        />
        </div>
      )}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header>
          <Modal.Title>Edit Mortgage</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Credit Score</Form.Label>
              <Form.Control
                type="number"
                name="credit_score"
                value={formData.credit_score?.toString() || ""}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.credit_score}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.credit_score}
              </Form.Control.Feedback>
              <Form.Text className="text-muted">
                Enter a value between 300 and 850
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Loan Amount</Form.Label>
              <Form.Control
                type="number"
                name="loan_amount"
                value={formData.loan_amount}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.loan_amount}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.loan_amount}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Property Value</Form.Label>
              <Form.Control
                type="number"
                name="property_value"
                value={formData.property_value}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.property_value}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.property_value}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Annual Income</Form.Label>
              <Form.Control
                type="number"
                name="annual_income"
                value={formData.annual_income}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.annual_income}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.annual_income}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Debt Amount</Form.Label>
              <Form.Control
                type="number"
                name="debt_amount"
                value={formData.debt_amount?.toString() || ""}
                onChange={handleInputChange}
                isInvalid={!!validationErrors.debt_amount}
              />
              <Form.Control.Feedback type="invalid">
                {validationErrors.debt_amount}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Loan Type</Form.Label>
              <Form.Select
                name="loan_type"
                value={formData.loan_type}
                onChange={handleInputChange}
              >
                <option value="fixed">Fixed Rate</option>
                <option value="adjustable">Adjustable Rate</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Property Type</Form.Label>
              <Form.Select
                name="property_type"
                value={formData.property_type}
                onChange={handleInputChange}
              >
                <option value="single_family">Single Family</option>
                <option value="condo">Condo</option>
              </Form.Select>
            </Form.Group>

            <div className="button-group">
              <Button variant="secondary" onClick={() => setShowEditModal(false)} className="me-2">
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MortgageList;