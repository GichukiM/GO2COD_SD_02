import { useState, useEffect } from 'react';
import { basicCalculator } from '../utils/api'; // Import API function for backend interaction

const BasicCalculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [memory, setMemory] = useState([]);

  // Load previous calculations from localStorage on initial load
  useEffect(() => {
    const savedMemory = JSON.parse(localStorage.getItem('calcHistory')) || [];
    setMemory(savedMemory);
  }, []);

  // Handle expression input
  const handleInputChange = (e) => {
    setExpression(e.target.value);
  };

  // Clear the expression and result
  const handleClear = () => {
    setExpression('');
    setResult(null);
  };

  // Handle calculating the expression
  const handleCalculate = async () => {
    if (!expression) return;

    try {
      const response = await basicCalculator({ expression });
      const calculationResult = response.data.result;
      setResult(calculationResult);

      // Save to history
      const newCalculation = { expression, result: calculationResult };
      const updatedMemory = [newCalculation, ...memory]; // Add new calc to history
      setMemory(updatedMemory);
      localStorage.setItem('calcHistory', JSON.stringify(updatedMemory));

      // Clear the input after calculation
      setExpression('');
    } catch (error) {
      console.error("Error calculating:", error);
    }
  };

  // Handle button presses
  const handleButtonPress = (value) => {
    if (value === '1/x') {
      // If the user clicks "1/x", wrap the current expression inside a reciprocal (1/())
      if (expression) {
        setExpression('1/(' + expression + ')');  // Wrap the expression in parentheses and add '1/'.
      } else {
        setExpression('1/');  // If no expression, start with '1/'.
      }
    } else {
      // Otherwise, append the pressed value (for numbers, operations, etc.)
      setExpression((prev) => prev + value);
    }
  };

  // Handle backspace (delete last character)
  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1)); // Remove the last character
  };

  // Handle deleting an item from memory
  const handleDeleteMemory = (index) => {
    const updatedMemory = memory.filter((_, i) => i !== index);
    setMemory(updatedMemory);
    localStorage.setItem('calcHistory', JSON.stringify(updatedMemory));
  };

  // Handle keyboard events for calculator input
  const handleKeyDown = (event) => {
    const key = event.key;

    // Handle operations based on key press
    if ('0123456789'.includes(key)) {
      handleButtonPress(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
      handleButtonPress(key);
    } else if (key === 'Enter') {
      handleCalculate();
    } else if (key === '.') {
      handleButtonPress('.');
    } else if (key === 'Backspace') {
      handleBackspace();
    } else if (key === 'C' || key === 'c') {
      handleClear();
    } else if (key === '%') {
      handleButtonPress('%');
    } else if (key === '(') {
      handleButtonPress('(');
    } else if (key === ')') {
      handleButtonPress(')');
    }
  };

  // Set up keydown event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <div className="calculator-container flex flex-col md:flex-row max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-6 mt-12">
      {/* Left side: Calculator input and buttons */}
      <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
        {/* Display of Input and Result */}
        <div className="mb-6">
          <input
            type="text"
            value={expression}
            onChange={handleInputChange}
            placeholder="Enter your calculation"
            className="w-full p-4 text-3xl font-bold text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 mb-6"
            disabled
          />
          <div className="text-3xl font-bold text-gray-900">
            {result !== null ? `= ${result}` : 'Enter an expression to calculate'}
          </div>
        </div>

        {/* Calculator Buttons */}
        <div className="grid grid-cols-4 gap-6">
          {/* Row 1 */}
          <button onClick={() => handleButtonPress('sqrt(')} className="p-4 text-xl font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600">
            √
          </button>
          <button onClick={() => handleButtonPress('1/x')} className="p-4 text-xl font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600">
            1/x
          </button>
          <button onClick={() => handleButtonPress('**2')} className="p-4 text-xl font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600">
            x²
          </button>
          <button onClick={handleBackspace} className="p-4 text-xl font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600">
            ⬅
          </button>

          {/* Row 2 */}
          <button onClick={() => handleButtonPress('(')} className="p-4 text-xl font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600">
            (
          </button>
          <button onClick={() => handleButtonPress(')')} className="p-4 text-xl font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600">
            )
          </button>
          <button onClick={() => handleButtonPress('*')} className="p-4 text-xl font-semibold text-white bg-blue-500 border border-blue-500 rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600">
            *
          </button>
          <button onClick={() => handleButtonPress('/')} className="p-4 text-xl font-semibold text-white bg-blue-500 border border-blue-500 rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600">
            /
          </button>

          {/* Row 3 */}
          <button onClick={() => handleButtonPress('7')} className="p-4 text-xl font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600">
            7
          </button>
          <button onClick={() => handleButtonPress('8')} className="p-4 text-xl font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600">
            8
          </button>
          <button onClick={() => handleButtonPress('9')} className="p-4 text-xl font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600">
            9
          </button>
          <button onClick={() => handleButtonPress('-')} className="p-4 text-xl font-semibold text-white bg-blue-500 border border-blue-500 rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600">
            -
          </button>

          {/* Row 4 */}
          <button onClick={() => handleButtonPress('4')} className="p-4 text-xl font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600">
            4
          </button>
          <button onClick={() => handleButtonPress('5')} className="p-4 text-xl font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600">
            5
          </button>
          <button onClick={() => handleButtonPress('6')} className="p-4 text-xl font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600">
            6
          </button>
          <button onClick={() => handleButtonPress('+')} className="p-4 text-xl font-semibold text-white bg-blue-500 border border-blue-500 rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600">
            +
          </button>

          {/* Row 5 */}
          <button onClick={() => handleButtonPress('1')} className="p-4 text-xl font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600">
            1
          </button>
          <button onClick={() => handleButtonPress('2')} className="p-4 text-xl font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600">
            2
          </button>
          <button onClick={() => handleButtonPress('3')} className="p-4 text-xl font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600">
            3
          </button>
          <button onClick={() => handleButtonPress('.')} className="p-4 text-xl font-semibold text-white bg-blue-500 border border-blue-500 rounded-lg hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600">
            .
          </button>

          {/* Row 6 */}
          <button onClick={() => handleButtonPress('%')} className="p-4 text-xl font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600">
            %
          </button>
          <button onClick={() => handleButtonPress('0')} className="p-4 text-xl font-semibold text-gray-700 bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-300 active:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600">
            0
          </button>
          <button onClick={() => handleClear('c')} className="p-4 text-xl font-semibold text-gray-700 bg-red-600 border border-red-600 rounded-lg hover:bg-red-500 active:bg-red-500 focus:outline-none focus:ring-2 focus:ring-blue-600">
            c
          </button>
          <button onClick={handleCalculate} className="p-4 text-xl font-semibold text-white bg-green-400 border border-green-400 rounded-lg hover:bg-green-600 active:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-600">
            =
          </button>
        </div>
      </div>

      {/* Right side: Calculation History */}
      <div className="w-full md:w-1/3 p-6 overflow-y-auto max-h-96">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">History</h3>
        <div>
          {memory.length > 0 ? (
            memory.map((entry, index) => (
              <div key={index} className="mb-4">
                <div className="font-semibold text-xl">{entry.expression}</div>
                <div className="text-gray-500">= {entry.result}</div>
                <button
                  className="text-sm text-red-500"
                  onClick={() => handleDeleteMemory(index)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div>No history yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicCalculator;
