import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/calculators",
});

export const calculateSimpleInterest = (data) => API.post("/simple-interest", data);
export const calculateCompoundInterest = (data) => API.post("/compound-interest", data);
export const calculateLoanPayment = (data) => API.post("/loan-payment", data);

// Other API calls...
