import axios from 'axios';
import { Mortgage, CreditRatingResponse } from '../types';

const API_URL = 'http://localhost:8000';

// Get all mortgages
export const getMortgages = async (): Promise<Mortgage[]> => {
  try {
    const response = await axios.get(`${API_URL}/mortgages/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching mortgages:', error);
    throw error;
  }
};

// Get a single mortgage by ID
export const getMortgage = async (id: number): Promise<Mortgage> => {
  try {
    const response = await axios.get(`${API_URL}/mortgages/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching mortgage with ID ${id}:`, error);
    throw error;
  }
};

// Create a new mortgage
export const createMortgage = async (mortgage: Mortgage): Promise<Mortgage> => {
  try {
    const response = await axios.post(`${API_URL}/mortgages/`, mortgage);
    return response.data;
  } catch (error) {
    console.error('Error creating mortgage:', error);
    throw error;
  }
};

// Update an existing mortgage
export const updateMortgage = async (id: number, mortgage: Mortgage): Promise<Mortgage> => {
  try {
    const response = await axios.put(`${API_URL}/mortgages/${id}`, mortgage);
    return response.data;
  } catch (error) {
    console.error(`Error updating mortgage with ID ${id}:`, error);
    throw error;
  }
};

// Delete a mortgage
export const deleteMortgage = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/mortgages/${id}`);
  } catch (error) {
    console.error(`Error deleting mortgage with ID ${id}:`, error);
    throw error;
  }
};

// Calculate credit rating
export const calculateCreditRating = async (mortgages: Mortgage[]): Promise<CreditRatingResponse> => {
  try {
    const response = await axios.post(`${API_URL}/calculate-rating/`, {
      mortgages: mortgages
    });
    return response.data;
  } catch (error) {
    console.error('Error calculating credit rating:', error);
    throw error;
  }
};