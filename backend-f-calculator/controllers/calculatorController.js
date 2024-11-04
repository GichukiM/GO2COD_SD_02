const roundToTwoDecimals = (num) => {
    return Math.ceil(num * 100) / 100; // Rounds up to the nearest cent
};

exports.simpleInterest = (req, res) => {
    const { principal, rate, time, unit } = req.body;

    // Convert time to years based on the unit
    let timeInYears;
    switch (unit) {
        case 'days':
            timeInYears = time / 365;
            break;
        case 'weeks':
            timeInYears = time / 52;
            break;
        case 'months':
            timeInYears = time / 12;
            break;
        case 'years':
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
    const { principal, rate, periodUnit, compoundFrequency, periodValue } = req.body;

    // Validate inputs
    if (typeof principal !== 'number' || principal <= 0) {
        return res.status(400).json({ error: "Principal must be a positive number." });
    }
    if (typeof rate !== 'number' || rate < 0) {
        return res.status(400).json({ error: "Rate must be a non-negative number." });
    }
    if (!['daily', 'weekly', 'monthly', 'quarterly', 'semi-annually', 'annually'].includes(compoundFrequency)) {
        return res.status(400).json({ error: "Compound frequency must be one of: daily, weekly, monthly, quarterly, semi-annually, annually." });
    }
    if (typeof periodValue !== 'number' || periodValue <= 0) {
        return res.status(400).json({ error: "Period value must be a positive number." });
    }
    if (!['days', 'weeks', 'months', 'years'].includes(periodUnit)) {
        return res.status(400).json({ error: "Period unit must be one of: days, weeks, months, years." });
    }

    // Map period unit to time in years
    let timeInYears;
    switch (periodUnit) {
        case 'days':
            timeInYears = periodValue / 365; // Convert days to years
            break;
        case 'weeks':
            timeInYears = periodValue / 52; // Convert weeks to years
            break;
        case 'months':
            timeInYears = periodValue / 12; // Convert months to years
            break;
        case 'years':
            timeInYears = periodValue; // Use as is for years
            break;
        default:
            return res.status(400).json({ error: "Invalid period unit." });
    }

    // Map compound frequency to times compounded per year
    let timesCompounded;
    switch (compoundFrequency) {
        case 'daily':
            timesCompounded = 365;
            break;
        case 'weekly':
            timesCompounded = 52;
            break;
        case 'monthly':
            timesCompounded = 12;
            break;
        case 'quarterly':
            timesCompounded = 4;
            break;
        case 'semi-annually':
            timesCompounded = 2;
            break;
        case 'annually':
            timesCompounded = 1;
            break;
        default:
            return res.status(400).json({ error: "Invalid compound frequency." });
    }

    // Calculate compound interest
    const amount = principal * Math.pow(1 + (rate / 100) / timesCompounded, timesCompounded * timeInYears);
    const interest = amount - principal;

    // Send response
    res.json({ amount, interest });
};
  
exports.calculateLoanPayment = (req, res) => {
    const { loanAmount, annualInterestRate, numberOfPayments } = req.body;

    // Validate inputs
    if (typeof loanAmount !== 'number' || loanAmount <= 0) {
        return res.status(400).json({ error: "Loan amount must be a positive number." });
    }
    if (typeof annualInterestRate !== 'number' || annualInterestRate < 0) {
        return res.status(400).json({ error: "Annual interest rate must be a non-negative number." });
    }
    if (typeof numberOfPayments !== 'number' || numberOfPayments <= 0) {
        return res.status(400).json({ error: "Number of payments must be a positive number." });
    }

    const P = loanAmount;
    const r = annualInterestRate / 100 / 12; // Monthly interest rate
    const n = numberOfPayments;

    // Calculate monthly payment using the formula
    const M = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = M * n;

    // Round results to 2 decimal places
    const roundedMonthlyPayment = roundToTwoDecimals(M);
    const roundedTotalPayment = roundToTwoDecimals(totalPayment);

    // Send response
    res.json({
        monthlyPayment: roundedMonthlyPayment,
        totalPayment: roundedTotalPayment
    });
};
  
  // Other calculator methods...
  