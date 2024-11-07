import { useState, useEffect } from "react";
import { convertCurrency } from "../utils/api";  // Import the convertCurrency function
import  currencyNames  from "../utils/currencyNames";  // Import the currencyNames data

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("KES");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch exchange rate whenever fromCurrency, toCurrency, or amount changes
  useEffect(() => {
    const fetchExchangeRate = async () => {
      setLoading(true);
      setError(null);  // Reset error on new fetch

      try {
        // Use the convertCurrency utility function
        const response = await convertCurrency({ amount, fromCurrency, toCurrency });

        // Set the exchange rate and converted amount from the response
        setExchangeRate(response.data.exchangeRate);
        setConvertedAmount(response.data.convertedAmount);  
      } catch (err) {
        setError("An error occurred while fetching the exchange rates.");
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (fromCurrency && toCurrency) {
      fetchExchangeRate();
    }
  }, [fromCurrency, toCurrency, amount]); // Dependency array includes amount

  return (
    <div className="flex flex-col m-4 md:m-8 lg:m-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Currency Converter</h2>
      
      <div className="bg-white p-6">
        {/* Input Amount */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Input Amount</label>
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>
          
          {/* From Currency Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Currency</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 transition duration-200"
            >
              {Object.entries(currencyNames).map(([code, name]) => (
                <option key={code} value={code}>
                  {name} ({code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Output Amount */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exchanged Amount</label>
            <input
              type="number"
              placeholder="Exchanged Amount"
              value={convertedAmount ?? ""}
              disabled
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 transition duration-200"
            />
          </div>

          {/* To Currency Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Currency</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:ring-2 focus:ring-blue-400 transition duration-200"
            >
              {Object.entries(currencyNames).map(([code, name]) => (
                <option key={code} value={code}>
                  {name} ({code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && <p>Loading...</p>}

        {/* Error Message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Optional: Display the exchange rate */}
        {exchangeRate && (
          <div className="mt-4">
            <p>Exchange Rate: 1 {fromCurrency} = {exchangeRate} {toCurrency}</p>
          </div>
        )}
      </div>

      {/* Informational Sections */}
      <div className="mt-6 p-10">
        <section className="mb-10">
          <h2 className="text-black font-bold text-2xl mb-4">What is Currency Conversion?</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Currency conversion is the process of changing one currency into another at a certain exchange rate.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-black font-bold text-2xl mb-4">How Does the Currency Converter Work?</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            This currency converter calculates how much of a target currency you will receive for a given amount.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-black font-bold text-2xl mb-4">Why Use a Currency Converter?</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Currency converters are helpful tools for anyone who deals with foreign exchange regularly.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CurrencyConverter;
