// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import SimpleInterestCalculator from "./components/simpleInterestCalc"
import CompoundInterestCalculator from './components/compoundInterestCalc';
import LoanPaymentCalculator from './components/loanPaymentCalc';
import RetirementSavingCalculator from './components/retirementSavingCalc';
import CurrencyConverter from './components/currencyConversion';
import Navbar from './components/navbar';
import BasicCalculator from './components/basicCalculator';

function App() {
  

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route path="/simple-interest-calculator" element={<SimpleInterestCalculator />} />
        <Route path="/compound-interest-calculator" element={<CompoundInterestCalculator />} />
        <Route path="/loan-payment-calculator" element={<LoanPaymentCalculator />} />
        <Route path="/retirement-saving-calculator" element={<RetirementSavingCalculator />} />
        <Route path="/currency-converter" element={<CurrencyConverter />} />
        <Route path="/" element={<BasicCalculator />} />
      </Routes>
    </Router>
  )
}

export default App
