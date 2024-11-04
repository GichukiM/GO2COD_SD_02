// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SimpleInterestCalculator from "./components/simpleInterestCalc"
import CompoundInterestCalculator from './components/compoundInterestCalc';
import LoanPaymentCalculator from './components/loadPaymentCalc';

function App() {
  

  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/simple-interest-calculator" element={<SimpleInterestCalculator />} />
        <Route path="/compound-interest-calculator" element={<CompoundInterestCalculator />} />
        <Route path="/loan-payment-calculator" element={<LoanPaymentCalculator />} />
      </Routes>
    </Router>
  )
}

export default App
