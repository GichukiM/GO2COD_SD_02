import { useState, useEffect } from "react";

const LoanPaymentCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(10000);
  const [annualInterestRate, setAnnualInterestRate] = useState(5);
  const [numberOfPayments, setNumberOfPayments] = useState(60);
  const [currency, setCurrency] = useState("USD");
  const [result, setResult] = useState({ monthlyPayment: 0, totalPayment: 0 });

  // Helper function to round to two decimals
  const roundToTwoDecimals = (num) => {
    return Math.ceil(num * 100) / 100; // Rounds up to the nearest cent
  };

  useEffect(() => {
    const calculatePayments = () => {
      const P = Number(loanAmount);
      const r = Number(annualInterestRate) / 100 / 12; // Monthly interest rate
      const n = Number(numberOfPayments);

      // Calculate monthly payment using the formula
      const M = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const total = M * n;

      // Round the results to 2 decimal places
      const roundedData = {
        monthlyPayment: roundToTwoDecimals(M),
        totalPayment: roundToTwoDecimals(total),
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
          {/* Currency and Loan Amount in One Row */}
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

          {/* Annual Interest Rate */}
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

          {/* Number of Payments */}
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Results</h3>
          <div className="relative overflow-x-auto w-full">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Description</th>
                  <th scope="col" className="px-6 py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    Monthly Payment
                  </th>
                  <td className="px-6 py-4">
                    {result.monthlyPayment} {currency}
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
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
          {/* What is Loan Payment? */}
          <p className="text-gray-700 text-lg mb-6">
            <span className="text-black font-bold text-xl block mb-2">
              What is a Loan Payment?
            </span>
            A loan payment is the amount of money that a borrower must pay to a lender at specified intervals, which can include both principal and interest. This calculator helps you determine how much your monthly payment will be based on your loan amount, interest rate, and payment period.
          </p>

          {/* How Does the Loan Payment Calculator Work? */}
          <p className="text-gray-700 text-lg mb-6">
            <span className="text-black font-bold text-xl block mb-2">
              How Does the Loan Payment Calculator Work?
            </span>
            This calculator uses the formula for calculating the monthly payment on a loan:
            <strong>
              M = P[r(1 + r)^n] / [(1 + r)^n - 1]
            </strong>
            where:
            <ul className="ml-5 mt-3 text-gray-600 text-base list-disc list-inside leading-relaxed">
              <li>
                <strong>M</strong> is the total monthly payment.
              </li>
              <li>
                <strong>P</strong> is the principal loan amount.
              </li>
              <li>
                <strong>r</strong> is the monthly interest rate (annual rate divided by 12).
              </li>
              <li>
                <strong>n</strong> is the number of payments (loan term in months).
              </li>
            </ul>
            The result will give you the monthly payment amount, allowing you to understand your loan obligations better.
          </p>

          {/* How to Use the Loan Payment Calculator? */}
          <p className="text-gray-700 text-lg mb-6">
            <span className="text-black font-bold text-xl block mb-2">
              How to Use the Loan Payment Calculator?
            </span>
            Using the calculator is straightforward:
            <ol className="ml-5 mt-3 text-gray-600 text-base list-decimal list-inside leading-relaxed">
              <li>
                <strong>Enter Loan Amount:</strong> Type in the total amount you plan to borrow.
              </li>
              <li>
                <strong>Input Interest Rate:</strong> Provide the annual interest rate.
              </li>
              <li>
                <strong>Specify Number of Payments:</strong> Indicate the total number of payments you will make.
              </li>
            </ol>
            After entering these values, the calculator will display your estimated monthly payment and total payment over the life of the loan.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoanPaymentCalculator;
