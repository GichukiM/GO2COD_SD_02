import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { defaults } from "chart.js/auto";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState(1000);
  const [rate, setRate] = useState("5");
  const [compoundFrequency, setCompoundFrequency] = useState("annually");
  const [periodValue, setPeriodValue] = useState("3");
  const [periodUnit, setPeriodUnit] = useState("years"); // New state for period unit
  const [currency, setCurrency] = useState("USD");
  const [result, setResult] = useState({ interest: 0, amount: 0 });

  // Helper function to round to two decimals
  const roundToTwoDecimals = (num) => {
    return Math.ceil(num * 100) / 100; // Rounds up to the nearest cent
  };

  useEffect(() => {
    const calculateCompoundInterest = () => {
      const P = Number(principal);
      const r = Number(rate) / 100; // Convert percentage to decimal
      let t;

      // Convert periodValue to years based on the selected unit
      switch (periodUnit) {
        case 'days':
          t = Number(periodValue) / 365; // Convert days to years
          break;
        case 'weeks':
          t = Number(periodValue) / 52; // Convert weeks to years
          break;
        case 'months':
          t = Number(periodValue) / 12; // Convert months to years
          break;
        case 'years':
          t = Number(periodValue); // Use as is for years
          break;
        default:
          return;
      }

      // Calculate times compounded based on frequency
      let n;
      switch (compoundFrequency) {
        case 'daily':
          n = 365;
          break;
        case 'weekly':
          n = 52;
          break;
        case 'monthly':
          n = 12;
          break;
        case 'quarterly':
          n = 4;
          break;
        case 'semi-annually':
          n = 2;
          break;
        case 'annually':
          n = 1;
          break;
        default:
          return;
      }

      // Compound interest formula: A = P(1 + r/n)^(nt)
      const amount = P * Math.pow(1 + r / n, n * t);
      const interest = amount - P;

      setResult({
        amount: roundToTwoDecimals(amount),
        interest: roundToTwoDecimals(interest),
      });
    };

    calculateCompoundInterest();
  }, [principal, rate, compoundFrequency, periodValue, periodUnit]);

  return (
    <>
    <div className="flex flex-col m-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Compound Interest Calculator
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Form Inputs */}
        <div className="bg-white p-6">
          {/* Principal Amount and Currency */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Principal Amount:
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
                placeholder="Principal Amount"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="border border-gray-300 rounded-lg p-3 flex-grow focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
            </div>
          </div>

          {/* Annual Rate */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700">
              Annual Rate (%):
            </label>
            <input
              type="number"
              placeholder="Rate"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>

          <div className="mb-5">
                <div className="flex-grow mr-3">
              <label className="block text-sm font-medium text-gray-700 ">
                Unit:
              </label>
              <select
                value={periodUnit}
                onChange={(e) => setPeriodUnit(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 transition duration-200"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
              </div>
            </div>

          {/* Compound Frequency */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700">
              Compound Frequency:
            </label>
            <select
              value={compoundFrequency}
              onChange={(e) => setCompoundFrequency(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 transition duration-200"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="semi-annually">Semi-Annually</option>
              <option value="annually">Annually</option>
            </select>
          </div>

          {/* Period Value and Unit */}
          <div className="mb-5">
            <div className="flex-grow mr-3">
              <label className="block text-sm font-medium text-gray-700">
                Period Value:
              </label>
              <input
                type="number"
                placeholder="Value"
                value={periodValue}
                onChange={(e) => setPeriodValue(Number(e.target.value))}
                className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
            </div>
            </div>

          </div>

        {/* Right Side: Results Display */}
        <div className="bg-white p-6 flex flex-col items-center">
          <div className="mb-4 w-full">
            <Doughnut
              data={{
                labels: ["Principal", "Interest"],
                datasets: [
                  {
                    label: "Compound Interest Chart",
                    data: [principal, result.interest],
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
                    Principal Amount
                  </th>
                  <td className="px-6 py-4">
                    {principal} {currency}
                  </td>
                </tr>
                <tr className="bg-white border-b">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    Interest Earned
                  </th>
                  <td className="px-6 py-4">
                    {result.interest} {currency}
                  </td>
                </tr>
                <tr className="bg-white">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    Total Value
                  </th>
                  <td className="px-6 py-4">
                    {result.amount} {currency}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      
      </div>

      <div className="mt-6">
        <div className="bg-white p-8">
          {/* What is Compound Interest? */}
          <p className="text-gray-700 text-lg mb-6">
            <span className="text-black font-bold text-xl block mb-2">
              What is Compound Interest?
            </span>
            Compound Interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods. The formula used is:
            <strong> A = P(1 + r/n)^(nt)</strong>, where:
            <ul className="ml-5 mt-3 text-gray-600 text-base list-disc list-inside leading-relaxed">
              <li>
                <strong>A</strong> is the total amount of money after interest is applied.
              </li>
              <li>
                <strong>P</strong> represents the principal amount.
              </li>
              <li>
                <strong>r</strong> is the annual interest rate (as a decimal).
              </li>
              <li>
                <strong>n</strong> is the number of times that interest is compounded per year.
              </li>
              <li>
                <strong>t</strong> is the number of years the money is invested or borrowed.
              </li>
            </ul>
            Compound interest allows investments to grow at a faster rate than simple interest, which only considers the principal amount.
          </p>

          {/* How Does the Compound Interest Calculator Work? */}
          <p className="text-gray-700 text-lg mb-6">
            <span className="text-black font-bold text-xl block mb-2">
              How Does the Compound Interest Calculator Work?
            </span>
            The calculator uses the compound interest formula to determine the total amount and interest earned over a specified period. Here’s how it works:
            <ul className="ml-5 mt-3 text-gray-600 text-base list-disc list-inside leading-relaxed">
              <li>
                Enter the principal amount (P) – the initial sum of money.
              </li>
              <li>
                Input the annual interest rate (r) as a percentage.
              </li>
              <li>
                Specify the number of times interest is compounded per year (n).
              </li>
              <li>
                Indicate the time period (t) in years.
              </li>
              <li>
                The calculator applies the formula{" "}
                <strong>A = P(1 + r/n)^(nt)</strong> to compute the total amount (A) and the interest earned.
              </li>
            </ul>
            This method provides a clear view of how your investments grow over time.
          </p>

          {/* How to Use the Compound Interest Calculator? */}
          <p className="text-gray-700 text-lg mb-6">
            <span className="text-black font-bold text-xl block mb-2">
              How to Use the Compound Interest Calculator?
            </span>
            Using the calculator is simple:
            <ol className="ml-5 mt-3 text-gray-600 text-base list-decimal list-inside leading-relaxed">
              <li>
                <strong>Enter Principal (P):</strong> Type in the initial amount you’re investing.
              </li>
              <li>
                <strong>Input Interest Rate (r):</strong> Provide the annual interest rate as a percentage.
              </li>
              <li>
                <strong>Specify Compounding Frequency (n):</strong> Indicate how many times interest is compounded each year.
              </li>
              <li>
                <strong>Indicate Time (t):</strong> Specify how long the investment is held, in years.
              </li>
            </ol>
            The calculator will then display the total amount and interest earned, giving you insights into your financial growth.
          </p>

          {/* Benefits of Compound Interest Calculator */}
          <p className="text-gray-700 text-lg">
            <span className="text-black font-bold text-xl block mb-2">
              Benefits of Compound Interest Calculator:
            </span>
            A Compound Interest Calculator simplifies the process of calculating how much money will grow over time, especially for investments:
            <ul className="ml-5 mt-3 text-gray-600 text-base list-disc list-inside leading-relaxed">
              <li>
                <strong>Time-Saving:</strong> Instant results without manual calculations.
              </li>
              <li>
                <strong>Accurate:</strong> Minimizes errors in complex calculations.
              </li>
              <li>
                <strong>Financial Planning:</strong> Helps in assessing future investment growth.
              </li>
              <li>
                <strong>Scenario Testing:</strong> Allows testing different interest rates and time periods for better planning.
              </li>
            </ul>
            This tool is essential for anyone looking to grow their wealth efficiently.
          </p>
        </div>
      </div>
      </div>
      </>
  );
};

export default CompoundInterestCalculator;
