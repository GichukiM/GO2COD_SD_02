// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SimpleInterestCalculator from "./components/simpleInterestCalc"
import CompoundInterestCalculator from './components/compoundInterestCalc';
import LoanPaymentCalculator from './components/loadPaymentCalc';
import RetirementSavingCalculator from './components/retirementSavingCalc';

function App() {
  

  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/simple-interest-calculator" element={<SimpleInterestCalculator />} />
        <Route path="/compound-interest-calculator" element={<CompoundInterestCalculator />} />
        <Route path="/loan-payment-calculator" element={<LoanPaymentCalculator />} />
        <Route path="/retirement-saving-calculator" element={<RetirementSavingCalculator />} />
      </Routes>
    </Router>
  )
}

export default App
