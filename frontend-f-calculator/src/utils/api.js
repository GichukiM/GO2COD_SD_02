import axios from "axios";

const API = axios.create({
  baseURL: "https://ubuntu-calc-hub-backend.onrender.com/api/calculators",
});

export const calculateSimpleInterest = (data) => API.post("/simple-interest", data);
export const calculateCompoundInterest = (data) => API.post("/compound-interest", data);
export const calculateLoanPayment = (data) => API.post("/loan-payment", data);
export const calculateRetirementSaving = (data) => API.post("/retirement-planning", data);
export const convertCurrency = (data) => API.post("/currency-conversion", data);
export const basicCalculator = (data) => API.post("/basic-calculator", data);


// Other API calls...
