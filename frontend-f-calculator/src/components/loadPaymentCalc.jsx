import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { defaults } from "chart.js/auto";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const LoanPaymentCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(10000);
  const [annualInterestRate, setAnnualInterestRate] = useState(5);
  const [numberOfPayments, setNumberOfPayments] = useState(60);
  const [currency, setCurrency] = useState("USD");
  const [result, setResult] = useState({
    monthlyPayment: 0,
    totalPayment: 0,
    principal: 0,
    interest: 0,
  });

  const roundToTwoDecimals = (num) => Math.round(num * 100) / 100; // Rounded to nearest cent

useEffect(() => {
  const calculatePayments = () => {
    const P = Number(loanAmount);
    const r = Number(annualInterestRate) / 100 / 12; // Monthly interest rate
    const n = Number(numberOfPayments);

    let M;
    if (r === 0) {
      M = P / n; // For zero interest, just divide principal by number of payments
    } else {
      // Calculate monthly payment using the formula
      M = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const total = M * n;
    const totalInterestPaid = total - P; // Total interest over the loan life
    const interestPayment = roundToTwoDecimals(P * r); // First month's interest payment
    const principalPayment = roundToTwoDecimals(M - interestPayment); // Principal portion of the first month's payment

    const roundedData = {
      monthlyPayment: roundToTwoDecimals(M),
      totalPayment: roundToTwoDecimals(total),
      principal: principalPayment,
      interest: interestPayment,
      totalInterestPaid: roundToTwoDecimals(totalInterestPaid),
    };

    setResult(roundedData);
  };

  calculatePayments();
}, [loanAmount, annualInterestRate, numberOfPayments]);

  return (
    <div className="flex flex-col m-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Loan Payment Calculator
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Form Inputs */}
        <div className="bg-white p-6">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Amount:
            </label>
            <div className="flex items-center">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 mr-2 focus:ring-2 focus:ring-blue-400 transition duration-200"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="NGN">NGN</option>
                <option value="ZAR">ZAR</option>
              </select>
              <input
                type="number"
                placeholder="Loan Amount"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="border border-gray-300 rounded-lg p-3 flex-grow focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700">
              Annual Interest Rate (%):
            </label>
            <input
              type="number"
              placeholder="Rate"
              value={annualInterestRate}
              onChange={(e) => setAnnualInterestRate(Number(e.target.value))}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700">
              Number of Payments:
            </label>
            <input
              type="number"
              placeholder="Number of Payments"
              value={numberOfPayments}
              onChange={(e) => setNumberOfPayments(Number(e.target.value))}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
        </div>

        {/* Right Side: Results Display */}
        <div className="bg-white p-6 flex flex-col items-center">
          {/* Doughnut Chart showing principal vs interest */}
          <div className="mb-4 w-full">
            <Doughnut
              data={{
                labels: ["Loan", "Interest"],
                datasets: [
                  {
                    label: "Loan Payment Breakdown",
                    data: [loanAmount, result.totalInterestPaid],
                    backgroundColor: ["#28a745", "#1d3f72"],
                    borderWidth: 1,
                    circumference: 180,
                    rotation: 270,
                  },
                ],
              }}
              options={{
                plugins: {
                  tooltip: {
                    enabled: true,
                  },
                },
              }}
            />
          </div>

          {/* Results Table */}
          <div className="relative overflow-x-auto w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Results
            </h3>
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    Loan Amount
                  </th>
                  <td className="px-6 py-4">
                    {loanAmount} {currency}
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    Monthly Payment
                  </th>
                  <td className="px-6 py-4">
                    {result.monthlyPayment} {currency}
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    Total Interest
                  </th>
                  <td className="px-6 py-4">
                    {result.totalInterestPaid} {currency}
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    Total Payment
                  </th>
                  <td className="px-6 py-4">
                    {result.totalPayment} {currency}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Explanations Section */}
      <div className="mt-6">
        <div className="bg-white p-8">
          {/* What is a Loan Payment? */}
          <p className="text-gray-700 text-lg mb-6">
            <span className="text-black font-bold text-xl block mb-2">
              What is a Loan Payment?
            </span>
            A loan payment is the amount of money you pay to a lender on a regular basis, which includes both principal (the amount you borrowed) and interest (the cost of borrowing). This calculator helps you estimate your monthly payment based on the loan amount, interest rate, and loan term (number of payments).
          </p>

          {/* How Does the Loan Payment Calculator Work? */}
          <p className="text-gray-700 text-lg mb-6">
            <span className="text-black font-bold text-xl block mb-2">
              How Does the Loan Payment Calculator Work?
            </span>
            This calculator uses a standard formula for amortizing loans to calculate the monthly payment:
            <strong>
              M = P[r(1 + r)^n] / [(1 + r)^n - 1]
            </strong>
            Where:
            <ul className="ml-5 mt-3 text-gray-600 text-base list-disc list-inside leading-relaxed">
              <li>
                <strong>M</strong> is the monthly payment amount.
              </li>
              <li>
                <strong>P</strong> is the principal loan amount (the amount you borrow).
              </li>
              <li>
                <strong>r</strong> is the monthly interest rate (annual rate divided by 12).
              </li>
              <li>
                <strong>n</strong> is the number of payments (loan term in months).
              </li>
            </ul>
            This formula ensures that each payment covers part of the principal as well as the interest on the remaining loan balance.
          </p>

          {/* How to Use the Loan Payment Calculator? */}
          <p className="text-gray-700 text-lg mb-6">
            <span className="text-black font-bold text-xl block mb-2">
              How to Use the Loan Payment Calculator?
            </span>
            Using the loan payment calculator is simple:
            <ol className="ml-5 mt-3 text-gray-600 text-base list-decimal list-inside leading-relaxed">
              <li>
                <strong>Enter the Loan Amount:</strong> Specify the total amount you intend to borrow.
              </li>
              <li>
                <strong>Input the Annual Interest Rate:</strong> Enter the annual interest rate (as a percentage).
              </li>
              <li>
                <strong>Specify the Loan Term:</strong> Indicate the total number of payments you will make (e.g., 60 months for a 5-year loan).
              </li>
            </ol>
            Once you enter these details, the calculator will show your estimated monthly payment, the total interest paid over the life of the loan, and the total amount you will pay by the end of the loan term.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoanPaymentCalculator;
