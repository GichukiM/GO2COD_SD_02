import { useState, useEffect, useCallback } from "react";
import { Doughnut } from "react-chartjs-2";
import { defaults } from "chart.js/auto";
import { calculateLoanPayment } from "../utils/api"; // Import the calculateLoanPayment function

defaults.maintainAspectRatio = false;
defaults.responsive = true; // Adjust import as necessary

const LoanPaymentCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(10000);
  const [annualInterestRate, setAnnualInterestRate] = useState(5);
  const [numberOfPayments, setNumberOfPayments] = useState(60);
  const [currency, setCurrency] = useState("USD");
  const [result, setResult] = useState({
    monthlyPayment: 0,
    totalPayment: 0,
    totalInterestPaid: 0,
  });

  // Memoize the fetchLoanPaymentData function using useCallback
  const fetchLoanPaymentData = useCallback(async () => {
    try {
      const response = await calculateLoanPayment({
        loanAmount,
        annualInterestRate,
        numberOfPayments,
      });
      setResult({
        monthlyPayment: response.data.monthlyPayment,
        totalPayment: response.data.totalPayment,
        totalInterestPaid: response.data.totalInterestPaid,
      });
    } catch (error) {
      console.error("Error fetching loan payment data:", error);
    }
  }, [loanAmount, annualInterestRate, numberOfPayments]); // Memoize based on dependencies

  // Trigger the API call when any of the dependencies change
  useEffect(() => {
    fetchLoanPaymentData();
  }, [fetchLoanPaymentData]);

  return (
    <div className="flex flex-col m-4 md:m-8 lg:m-12">
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
      <div className="mt-8">
        <div className="p-8">
          {/* What is Loan Payment Calculation? */}
          <div className="text-gray-700 text-lg mb-8">
            <span className="text-black font-semibold text-2xl mb-4 block">
              What is Loan Payment Calculation?
            </span>
            <p className="text-gray-600 leading-relaxed mb-4">
              Loan payment calculation determines the monthly installment
              required to repay a loan over a set period. This includes both the
              principal amount (original loan) and the interest. The formula
              used for calculating the monthly payment is:
              <strong> M = (P * r * (1 + r)^n) / ((1 + r)^n - 1)</strong>,
              where:
            </p>
            <ul className="ml-6 mt-3 text-gray-600 list-disc space-y-2 leading-relaxed">
              <li>
                <strong>M</strong> represents the monthly payment amount.
              </li>
              <li>
                <strong>P</strong> is the principal, or the initial loan amount.
              </li>
              <li>
                <strong>r</strong> is the monthly interest rate (annual interest
                rate divided by 12).
              </li>
              <li>
                <strong>n</strong> is the total number of payments (loan term in
                months).
              </li>
            </ul>
            <p className="text-gray-600 mt-4">
              This method is widely used in financial planning as it helps
              borrowers understand how much they’ll need to pay each month,
              including the impact of interest over time.
            </p>
          </div>

          {/* How Does the Loan Payment Calculator Work? */}
          <div className="text-gray-700 text-lg mb-8">
            <span className="text-black font-semibold text-2xl mb-4 block">
              How Does the Loan Payment Calculator Work?
            </span>
            <p className="text-gray-600 leading-relaxed mb-4">
              The calculator computes the monthly payment required to pay off a
              loan by considering both the principal and interest. Here’s a
              breakdown of how it works:
            </p>
            <ul className="ml-6 mt-3 text-gray-600 list-disc space-y-2 leading-relaxed">
              <li>
                First, you input the loan amount (P), the original sum borrowed.
              </li>
              <li>
                Next, provide the annual interest rate, which the calculator
                will divide by 12 to get a monthly rate (r).
              </li>
              <li>
                Finally, specify the loan term in months (n) for which you’ll
                repay the loan.
              </li>
              <li>
                Using these values, the calculator applies the formula to find
                the monthly payment (M), ensuring you know what to pay each
                month.
              </li>
            </ul>
            <p className="text-gray-600 mt-4">
              This gives you a clear idea of your monthly obligation, including
              both principal and interest.
            </p>
          </div>

          {/* How to Use the Loan Payment Calculator? */}
          <div className="text-gray-700 text-lg mb-8">
            <span className="text-black font-semibold text-2xl mb-4 block">
              How to Use the Loan Payment Calculator?
            </span>
            <p className="text-gray-600 leading-relaxed mb-4">
              Follow these simple steps to use the calculator:
            </p>
            <ol className="ml-6 mt-3 text-gray-600 list-decimal space-y-2 leading-relaxed">
              <li>
                <strong>Enter Loan Amount (P):</strong> Provide the principal or
                the total loan amount borrowed.
              </li>
              <li>
                <strong>Input Interest Rate:</strong> Enter the annual interest
                rate as a percentage. This rate will be divided by 12 to get the
                monthly rate.
              </li>
              <li>
                <strong>Specify Loan Term (n):</strong> Indicate the number of
                payments (in months) you plan to make to repay the loan.
              </li>
            </ol>
            <p className="text-gray-600 mt-4">
              After inputting these values, the calculator shows your monthly
              payment, total payment (principal + interest), and the total
              interest paid. This helps in planning your finances.
            </p>
          </div>

          {/* Benefits of the Loan Payment Calculator */}
          <div className="text-gray-700 text-lg">
            <span className="text-black font-semibold text-2xl mb-4 block">
              Benefits of the Loan Payment Calculator:
            </span>
            <p className="text-gray-600 leading-relaxed mb-4">
              This loan payment calculator offers multiple advantages,
              especially for anyone planning to take out a loan or manage their
              debt:
            </p>
            <ul className="ml-6 mt-3 text-gray-600 list-disc space-y-2 leading-relaxed">
              <li>
                <strong>Quick Calculations:</strong> Instantly computes monthly
                payments, making it easier to assess affordability.
              </li>
              <li>
                <strong>Detailed Breakdown:</strong> Shows total payment and
                interest, giving a complete overview of loan cost.
              </li>
              <li>
                <strong>Budgeting Tool:</strong> Helps in planning monthly
                budgets by knowing exact monthly dues.
              </li>
              <li>
                <strong>Scenario Testing:</strong> Allows testing different loan
                amounts or terms to find a payment plan that suits your
                finances.
              </li>
            </ul>
            <p className="text-gray-600 mt-4">
              This tool simplifies loan planning, aiding in decision-making for
              personal or business financing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanPaymentCalculator;
