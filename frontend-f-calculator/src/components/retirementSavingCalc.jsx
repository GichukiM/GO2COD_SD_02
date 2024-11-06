import { useState, useEffect } from "react";
import { calculateRetirementSaving } from "../utils/api";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const RetirementCalculator = () => {
  // State variables
  const [desiredAmount, setDesiredAmount] = useState(1000000); // Default amount
  const [currentSavings, setCurrentSavings] = useState(200000); // Default savings
  const [currentAge, setCurrentAge] = useState(30); // Default current age
  const [retirementAge, setRetirementAge] = useState(65);
  const [monthlySavings, setMonthlySavings] = useState(null);

  // Derived value for years until retirement
  const yearsUntilRetirement = retirementAge - currentAge;

  // Effect to calculate the savings required as the user changes any input
  useEffect(() => {
    const formData = {
      desiredAmount: parseFloat(desiredAmount),
      currentSavings: parseFloat(currentSavings),
      yearsUntilRetirement: parseInt(yearsUntilRetirement),
    };

    const fetchCalculation = async () => {
      try {
        const response = await calculateRetirementSaving(formData);
        setMonthlySavings(response.data.monthlySavings);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchCalculation();
  }, [desiredAmount, currentSavings, currentAge, retirementAge]);

  // Doughnut chart data for comparison between desired amount and current savings
  const chartData = {
    labels: ["Current Savings", "Desired Retirement Amount"],
    datasets: [
      {
        label: "Retirement Savings vs Goal",
        data: [currentSavings, desiredAmount],
        backgroundColor: ["#28a745", "#1d3f72"],
        borderWidth: 1,
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  return (
    <div className="flex flex-col m-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Retirement Savings Calculator
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Form Inputs */}
        <div className="bg-white p-6">
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Desired Retirement Amount:
            </label>
            <input
              type="number"
              placeholder="e.g. 1000000"
              value={desiredAmount}
              onChange={(e) => setDesiredAmount(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Savings:
            </label>
            <input
              type="number"
              placeholder="e.g. 200000"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Age:
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="15"
                max="60"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full"
              />
              <input
                type="number"
                min="15"
                max="60"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="ml-3 border border-gray-300 rounded-lg p-2 w-24 focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retirement Age:
            </label>
            <div className="flex items-center">
              <input
                type="range"
                min="20"
                max="70"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="w-full"
              />
              <input
                type="number"
                min="20"
                max="70"
                value={retirementAge}
                onChange={(e) => setRetirementAge(Number(e.target.value))}
                className="ml-3 border border-gray-300 rounded-lg p-2 w-24 focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Results Display */}
        <div className="bg-white p-6 flex flex-col items-center">
          {/* Doughnut Chart */}
          <div className="mb-4 w-full">
            <Doughnut data={chartData} />
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
                    Desired Retirement Amount
                  </th>
                  <td className="px-6 py-4">{desiredAmount} KES</td>
                </tr>
                <tr className="bg-white border-b">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    Current Savings
                  </th>
                  <td className="px-6 py-4">{currentSavings} KES</td>
                </tr>
                <tr className="bg-white border-b">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    Years Until Retirement
                  </th>
                  <td className="px-6 py-4">{yearsUntilRetirement}</td>
                </tr>
                {monthlySavings !== null && (
                  <tr className="bg-white border-b">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      Monthly Savings Required
                    </th>
                    <td className="px-6 py-4">{monthlySavings} KES</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6">
  <div className="p-10">
    {/* What is Retirement Planning? */}
    <section className="mb-10">
      <h2 className="text-black font-bold text-2xl mb-4">
        What is Retirement Planning?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Retirement planning is the process of setting financial goals for your post-retirement years and building a strategy to reach those goals. It typically involves determining your desired retirement fund, estimating post-retirement expenses, and planning how much to save or invest. Effective retirement planning can help mitigate inflation and provide a clear path to achieving financial security in retirement.
      </p>
    </section>

    {/* How Does the Retirement Savings Calculator Work? */}
    <section className="mb-10">
      <h2 className="text-black font-bold text-2xl mb-4">
        How Does the Retirement Savings Calculator Work?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        This calculator estimates how much you need to save each month to reach your retirement fund goal. It considers your desired retirement amount, current savings, and the number of years until retirement. Since this calculation does not factor in interest or investment growth, it provides a straightforward monthly savings estimate to help you reach your target amount. Here’s how it works:
      </p>

      <div className="bg-gray-100 p-6 rounded-lg my-4">
        <p className="text-gray-800 text-xl font-semibold">
          <span className="text-blue-600">Monthly Savings</span> = Goal Amount / Total Months Until Retirement
        </p>
        <p className="text-gray-600 mt-4 text-base">Where:</p>
        <ul className="ml-5 mt-3 text-gray-600 text-base list-disc list-inside leading-relaxed">
          <li>
            <strong>Goal Amount</strong>: The difference between your desired retirement amount and your current savings.
          </li>
          <li>
            <strong>Total Months Until Retirement</strong>: The years remaining until retirement multiplied by 12.
          </li>
          <li>
            <strong>Monthly Savings</strong>: The estimated amount you would need to save each month, assuming no interest or investment growth.
          </li>
        </ul>
      </div>

      <p className="text-gray-700 text-lg leading-relaxed">
        For example, if your retirement goal is 1,000,000 KES, you already have 200,000 KES saved, and you plan to retire in 20 years:
      </p>
      <div className="bg-gray-100 p-6 rounded-lg my-4">
        <ul className="text-gray-600 text-base leading-relaxed list-inside">
          <li>Goal Amount = 1,000,000 KES - 200,000 KES = 800,000 KES</li>
          <li>Total Months Until Retirement = 20 × 12 = 240 months</li>
          <li>Monthly Savings = 800,000 KES / 240 months = 3,333.33 KES</li>
        </ul>
      </div>
      <p className="text-gray-700 text-lg leading-relaxed">
        In this example, you would need to save approximately 3,333.33 KES per month to reach your retirement goal.
      </p>

      <p className="text-gray-700 text-lg leading-relaxed mt-4">
        <strong>Note:</strong> Since this calculation doesn’t account for compound interest, investment growth, or inflation, it’s a basic estimate. Over time, returns on your savings or investments, changes in your income, or other factors may mean that you won’t need to maintain this exact monthly contribution. This calculator provides a snapshot to help you approximate your savings needs.
      </p>
    </section>

    {/* Purpose of a Retirement Savings Calculator */}
    <section className="mb-10">
      <h2 className="text-black font-bold text-2xl mb-4">
        Why Use a Retirement Savings Calculator?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Planning for retirement can be overwhelming, and a retirement calculator simplifies this process by offering an easy-to-understand projection of your future financial needs. The goal is to give you a clear starting point, helping you make informed decisions about your savings and investments. While it provides a rough guide, it’s recommended to periodically review your retirement plan to account for growth, inflation, and changes in income.
      </p>
    </section>

    {/* Why Should You Make Investments Towards Retirement? */}
    <section className="mb-10">
      <h2 className="text-black font-bold text-2xl mb-4">
        Why Should You Make Investments Towards Retirement?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Investing for retirement is essential to ensure your funds grow at a rate that keeps up with or outpaces inflation. While simply saving may fall short due to inflation, investments can provide a significant boost to your retirement funds through compound returns. This means that, with wise investments, you might achieve your goals sooner or require smaller monthly contributions than this calculator suggests.
      </p>
    </section>

    {/* Final Advice on Retirement Planning */}
    <section className="mb-10">
      <h2 className="text-black font-bold text-2xl mb-4">
        Final Advice on Retirement Planning
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Begin saving early to maximize the growth potential of your investments and revisit your retirement plan periodically. With regular adjustments, you’ll account for income changes, expenses, and personal goals. Remember that this calculator offers a basic estimate; working with a financial advisor can provide a more precise strategy that considers investment growth and inflation for a secure retirement.
      </p>
    </section>
  </div>
</div>

    </div>
  );
};

export default RetirementCalculator;
