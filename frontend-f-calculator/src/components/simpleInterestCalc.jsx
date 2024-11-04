import { useState, useEffect } from "react";
import { calculateSimpleInterest } from "../utils/api";
import { Doughnut } from "react-chartjs-2";
import { defaults } from "chart.js/auto";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

const SimpleInterestCalculator = () => {
  const [principal, setPrincipal] = useState(1000);
  const [rate, setRate] = useState("10");
  const [time, setTime] = useState("2");
  const [unit, setUnit] = useState("years");
  const [currency, setCurrency] = useState("USD");
  const [result, setResult] = useState({ interest: 0, amount: 0 });

  // Helper function to round to two decimals
  const roundToTwoDecimals = (num) => {
    return Math.ceil(num * 100) / 100; // Rounds up to the nearest cent
  };

  useEffect(() => {
    const calculateInterest = async () => {
      try {
        const { data } = await calculateSimpleInterest({
          principal,
          rate,
          time,
          unit,
        });

        // Round the results to 2 decimal places
        const roundedData = {
          amount: roundToTwoDecimals(data.amount),
          interest: roundToTwoDecimals(data.interest),
        };
        
        setResult(roundedData);
      } catch (error) {
        console.error("Error calculating simple interest", error);
      }
    };

    calculateInterest();
  }, [principal, rate, time, unit]);


  return (
    <div className="flex flex-col m-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Simple Interest Calculator
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Form Inputs */}
        <div className="bg-white p-6">
          {/* Currency and Principal Amount in One Row */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Principal Amount:
            </label>
            <div className="flex items-center">
              {/* Currency Selector */}
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

              {/* Principal Amount Input */}
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

          {/* Period Unit */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700">
              Period Unit:
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 transition duration-200"
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
              <option value="years">Years</option>
            </select>
          </div>

          {/* Period Value */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700">
              Period Value:
            </label>
            <input
              type="number"
              placeholder="Period Value"
              value={time}
              onChange={(e) => setTime(Number(e.target.value))}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
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
                    label: "Simple Interest Chart",
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

      {/* Explanations Section */}
      <div className="mt-6">
        <div className="bg-white p-8">
          {/* What is Simple Interest? */}
          <p className="text-gray-700 text-lg mb-6">
            <span className="text-black font-bold text-xl block mb-2">
              What is Simple Interest?
            </span>
            Simple Interest is a straightforward method to calculate the
            interest on a loan or investment based on the initial principal
            amount. The formula used is:
            <strong> A = P(1 + rt)</strong>, where:
            <ul className="ml-5 mt-3 text-gray-600 text-base list-disc list-inside leading-relaxed">
              <li>
                <strong>A</strong> is the total amount of money after the
                interest is added (final amount).
              </li>
              <li>
                <strong>P</strong> represents the principal, or the initial
                amount of money invested or loaned.
              </li>
              <li>
                <strong>r</strong> is the interest rate (expressed as a decimal)
                applied over the time period.
              </li>
              <li>
                <strong>t</strong> is the time duration for which the interest
                is calculated (usually in years).
              </li>
            </ul>
            Simple Interest remains constant over time because it only considers
            the principal and not any accumulated interest, making it ideal for
            short-term loans or simple investments.
          </p>

          {/* How Does the Simple Interest Calculator Work? */}
          <p className="text-gray-700 text-lg mb-6">
            <span className="text-black font-bold text-xl block mb-2">
              How Does the Simple Interest Calculator Work?
            </span>
            The calculator uses the formula for Simple Interest to determine
            both the interest accrued and the total amount at the end of a
            specified period. Here’s how it works step-by-step:
            <ul className="ml-5 mt-3 text-gray-600 text-base list-disc list-inside leading-relaxed">
              <li>
                First, you enter the principal amount (P) – the initial sum of
                money.
              </li>
              <li>
                Next, you input the interest rate (r) as a percentage or
                decimal.
              </li>
              <li>
                Then, you specify the time period (t) for which the interest
                should be calculated, typically in years.
              </li>
              <li>
                The calculator applies the formula{" "}
                <strong>A = P(1 + rt)</strong> to compute the total amount (A),
                where <strong>A - P</strong> gives the interest earned over that
                period.
              </li>
            </ul>
            This method makes it quick and easy to see how much interest you’ll
            gain or owe, ideal for personal finance planning.
          </p>

          {/* How to Use the Simple Interest Calculator? */}
          <p className="text-gray-700 text-lg mb-6">
            <span className="text-black font-bold text-xl block mb-2">
              How to Use the Simple Interest Calculator?
            </span>
            Using the calculator is simple and involves three basic steps:
            <ol className="ml-5 mt-3 text-gray-600 text-base list-decimal list-inside leading-relaxed">
              <li>
                <strong>Enter Principal (P):</strong> Type in the initial amount
                of money you’re investing or borrowing.
              </li>
              <li>
                <strong>Input Interest Rate (r):</strong> Provide the annual
                interest rate as a percentage. For example, for 5%, enter 5 or
                0.05 if the calculator asks for a decimal.
              </li>
              <li>
                <strong>Specify Time (t):</strong> Indicate how long you’ll hold
                the investment or loan, typically in years.
              </li>
            </ol>
            After entering these values, the calculator will display the
            interest earned and the total amount (principal + interest). This
            provides an instant view of how your money grows or what you’ll owe.
          </p>

          {/* Benefits of Simple Interest Calculator */}
          <p className="text-gray-700 text-lg">
            <span className="text-black font-bold text-xl block mb-2">
              Benefits of Simple Interest Calculator:
            </span>
            A Simple Interest Calculator offers numerous advantages,
            particularly for anyone who wants quick answers on interest
            calculations without manual math:
            <ul className="ml-5 mt-3 text-gray-600 text-base list-disc list-inside leading-relaxed">
              <li>
                <strong>Time-Saving:</strong> Calculating interest by hand can
                be tedious and error-prone. This calculator provides instant
                results.
              </li>
              <li>
                <strong>Accuracy:</strong> It reduces the risk of mistakes in
                calculations, ensuring you have precise information for
                decision-making.
              </li>
              <li>
                <strong>Financial Planning:</strong> It helps you see how much
                interest you’ll earn or owe, making it easier to budget for
                loans, savings, or investments.
              </li>
              <li>
                <strong>Accessibility:</strong> By allowing you to adjust
                variables (like rate or time), you can test different scenarios
                and plan accordingly.
              </li>
            </ul>
            This tool simplifies the process, making it ideal for students,
            investors, or anyone managing personal finances.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimpleInterestCalculator;
