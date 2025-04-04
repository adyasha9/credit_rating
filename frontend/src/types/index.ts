export interface Mortgage {
  id?: number;
  credit_score: number;
  loan_amount: number;
  property_value: number;
  annual_income: number;
  debt_amount: number;
  loan_type: "fixed" | "adjustable";
  property_type: "single_family" | "condo";
  rating?: string;
}
  
  export interface CreditRatingResponse {
    rating: string;
    risk_score: number;
    mortgages_count: number;
    average_credit_score: number;
  }