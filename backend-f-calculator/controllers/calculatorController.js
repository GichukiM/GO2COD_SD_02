const axios = require('axios');
require('dotenv').config();

const roundToTwoDecimals = (num) => {
  return Math.ceil(num * 100) / 100; // Rounds up to the nearest cent
};

exports.simpleInterest = (req, res) => {
  const { principal, rate, time, unit } = req.body;

  // Convert time to years based on the unit
  let timeInYears;
  switch (unit) {
    case "days":
      timeInYears = time / 365;
      break;
    case "weeks":
      timeInYears = time / 52;
      break;
    case "months":
      timeInYears = time / 12;
      break;
    case "years":
    default:
      timeInYears = time;
      break;
  }

  const amount = principal * (1 + (rate / 100) * timeInYears);
  const interest = amount - principal;

  // Round both amount and interest to 2 decimal places
  const roundedAmount = roundToTwoDecimals(amount);
  const roundedInterest = roundToTwoDecimals(interest);

  res.json({ amount: roundedAmount, interest: roundedInterest });
};

exports.compoundInterest = (req, res) => {
  const { principal, rate, periodUnit, compoundFrequency, periodValue } =
    req.body;

  // Validate inputs
  if (typeof principal !== "number" || principal <= 0) {
    return res
      .status(400)
      .json({ error: "Principal must be a positive number." });
  }
  if (typeof rate !== "number" || rate < 0) {
    return res
      .status(400)
      .json({ error: "Rate must be a non-negative number." });
  }
  if (
    ![
      "daily",
      "weekly",
      "monthly",
      "quarterly",
      "semi-annually",
      "annually",
    ].includes(compoundFrequency)
  ) {
    return res.status(400).json({
      error:
        "Compound frequency must be one of: daily, weekly, monthly, quarterly, semi-annually, annually.",
    });
  }
  if (typeof periodValue !== "number" || periodValue <= 0) {
    return res
      .status(400)
      .json({ error: "Period value must be a positive number." });
  }
  if (!["days", "weeks", "months", "years"].includes(periodUnit)) {
    return res.status(400).json({
      error: "Period unit must be one of: days, weeks, months, years.",
    });
  }

  // Map period unit to time in years
  let timeInYears;
  switch (periodUnit) {
    case "days":
      timeInYears = periodValue / 365; // Convert days to years
      break;
    case "weeks":
      timeInYears = periodValue / 52; // Convert weeks to years
      break;
    case "months":
      timeInYears = periodValue / 12; // Convert months to years
      break;
    case "years":
      timeInYears = periodValue; // Use as is for years
      break;
    default:
      return res.status(400).json({ error: "Invalid period unit." });
  }

  // Map compound frequency to times compounded per year
  let timesCompounded;
  switch (compoundFrequency) {
    case "daily":
      timesCompounded = 365;
      break;
    case "weekly":
      timesCompounded = 52;
      break;
    case "monthly":
      timesCompounded = 12;
      break;
    case "quarterly":
      timesCompounded = 4;
      break;
    case "semi-annually":
      timesCompounded = 2;
      break;
    case "annually":
      timesCompounded = 1;
      break;
    default:
      return res.status(400).json({ error: "Invalid compound frequency." });
  }

  // Calculate compound interest
  const amount =
    principal *
    Math.pow(1 + rate / 100 / timesCompounded, timesCompounded * timeInYears);
  const interest = amount - principal;

  // Send response
  res.json({ amount, interest });
};

exports.loanPayment = (req, res) => {
  const { loanAmount, annualInterestRate, numberOfPayments } = req.body;

  // Validate inputs
  if (typeof loanAmount !== "number" || loanAmount <= 0) {
    return res
      .status(400)
      .json({ error: "Loan amount must be a positive number." });
  }
  if (typeof annualInterestRate !== "number" || annualInterestRate < 0) {
    return res
      .status(400)
      .json({ error: "Annual interest rate must be a non-negative number." });
  }
  if (typeof numberOfPayments !== "number" || numberOfPayments <= 0) {
    return res
      .status(400)
      .json({ error: "Number of payments must be a positive number." });
  }

  const P = loanAmount;
  const r = annualInterestRate / 100 / 12; // Monthly interest rate
  const n = numberOfPayments;

  // Calculate monthly payment using the formula
  const M = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = M * n;
  const totalInterestPaid = totalPayment - P; // Total interest over the loan life

  // Round results to 2 decimal places
  const roundedMonthlyPayment = roundToTwoDecimals(M);
  const roundedTotalPayment = roundToTwoDecimals(totalPayment);
  const roundedTotalInterestPaid = roundToTwoDecimals(totalInterestPaid);

  // Send response with all necessary data
  res.json({
    monthlyPayment: roundedMonthlyPayment,
    totalPayment: roundedTotalPayment,
    totalInterestPaid: roundedTotalInterestPaid,
  });
};

exports.retirementPlanning = (req, res) => {
    const { desiredAmount, currentSavings, yearsUntilRetirement } = req.body;

    // Validation
    if (typeof desiredAmount !== "number" || desiredAmount <= 0) {
      return res.status(400).json({ error: "Desired amount must be a positive number." });
    }
    if (typeof currentSavings !== "number" || currentSavings < 0) {
      return res.status(400).json({ error: "Current savings must be a non-negative number." });
    }
    if (typeof yearsUntilRetirement !== "number" || yearsUntilRetirement <= 0) {
      return res.status(400).json({ error: "Years until retirement must be a positive number." });
    }

    // Calculate the goal amount (desiredAmount - currentSavings)
    const goalAmount = desiredAmount - currentSavings;

    // If you already have enough savings, no monthly contribution is needed
    if (goalAmount <= 0) {
      return res.json({ monthlySavings: 0, message: "You're already on track!" });
    }

    // Calculate total months until retirement
    const totalMonths = yearsUntilRetirement * 12;

    // Monthly savings required to meet the goal
    const monthlySavings = goalAmount / totalMonths;

    res.json({ monthlySavings: monthlySavings.toFixed(2), message: "" });
};

exports.convertCurrency = async (req, res) => {
  const { amount, fromCurrency, toCurrency } = req.body;

  // Validation
  if (typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number." });
  }
  if (typeof fromCurrency !== "string" || !fromCurrency || fromCurrency.length !== 3) {
      return res.status(400).json({ error: "From currency must be a valid 3-letter currency code." });
  }
  if (typeof toCurrency !== "string" || !toCurrency || toCurrency.length !== 3) {
      return res.status(400).json({ error: "To currency must be a valid 3-letter currency code." });
  }

  try {
      // Fetching the exchange rates using the API key from the .env file
      const apiKey = process.env.CURRENCY_API_KEY;
      const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;
      
      const response = await axios.get(url);

      // Check if the response is successful
      if (response.data.result !== "success") {
          return res.status(500).json({ error: "Failed to fetch exchange rates." });
      }

      // Get the exchange rate from the response
      const exchangeRate = response.data.conversion_rates[toCurrency];
      
      if (!exchangeRate) {
          return res.status(400).json({ error: `Conversion rate for ${toCurrency} not found.` });
      }

      // Perform the currency conversion
      const convertedAmount = amount * exchangeRate;

      res.json({
        convertedAmount: convertedAmount,  // Don't use .toFixed here; return it as a number
        fromCurrency,
        toCurrency,
        exchangeRate: exchangeRate.toFixed(4), // You can keep toFixed for exchangeRate to ensure consistent format
    });
    
  } catch (error) {
      console.error("Error fetching exchange rates:", error.response ? error.response.data : error.message);
      res.status(500).json({ error: "An error occurred while fetching the exchange rates." });
  }
};

// Get list of available currencies from the conversion rates
exports.getCurrencies = async (req, res) => {
  try {
    const apiKey = process.env.CURRENCY_API_KEY;
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;  // Fetch rates from USD

    const response = await axios.get(url);

    // Check if the response is successful
    if (response.data.result !== "success") {
      return res.status(500).json({ error: "Failed to fetch currency list." });
    }

    // Extract the list of currencies from the conversion_rates object
    const currencies = Object.keys(response.data.conversion_rates);

    res.json({ currencies });
  } catch (error) {
    console.error("Error fetching currencies:", error);
    res.status(500).json({ error: "An error occurred while fetching currencies." });
  }
};

// Helper function to handle the calculation
const calculate = (expression) => {
  // Replace square root function with JS Math.sqrt
  expression = expression.replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)'); // Handle square root

  // Replace square operation (x²) with Math.pow
  expression = expression.replace(/(\d+)\^2/g, 'Math.pow($1, 2)'); // Handle square

  // Handle reciprocal (1/x) operation
  expression = expression.replace(/1\/\(([^)]+)\)/g, '1/($1)'); // Ensure it's handled properly

  // Replace percentage sign '%' with the correct operation (divide by 100)
  expression = expression.replace(/(\d+)%/g, '($1 / 100)'); // Handle percentage

  // Perform the calculation by evaluating the expression
  try {
    return eval(expression); // Using eval for mathematical expression evaluation
  } catch (err) {
    throw new Error('Invalid expression');
  }
};

// Handle basic arithmetic and advanced operations
exports.basicCalculator = (req, res) => {
  const { expression } = req.body;

  // Validation: Ensure the expression is non-empty and contains only allowed characters
  if (!expression || /[^0-9+\-*/().%sqrt^1x ]/.test(expression)) {
    return res.status(400).json({ error: 'Invalid characters in input' });
  }

  // Validation: Prevent division by zero (this also accounts for any case where there's a divide by zero scenario)
  if (/\/0(\.0+)?(?![^\)])/.test(expression)) {
    return res.status(400).json({ error: 'Cannot divide by zero' });
  }

  try {
    const result = calculate(expression); // Calculate the result
    res.json({ result });
  } catch (error) {
    // Catch any errors in the evaluation (e.g., malformed expression)
    res.status(400).json({ error: error.message });
  }
};


// Other calculator methods...
