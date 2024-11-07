const express = require("express");
const router = express.Router();
const {
  simpleInterest,
  compoundInterest,
  loanPayment,
//   investmentGrowth,
  retirementPlanning,
//   debtRepayment,
  convertCurrency,
  basicCalculator
} = require("../controllers/calculatorController");

router.post("/simple-interest", simpleInterest);
router.post("/compound-interest", compoundInterest);
router.post("/loan-payment", loanPayment);
router.post("/retirement-planning", retirementPlanning);
// router.post("/investment-growth", investmentGrowth);
// router.post("/retirement-savings", retirementSavings);
// router.post("/debt-repayment", debtRepayment);
router.post("/currency-conversion", convertCurrency);
router.post("/basic-calculator", basicCalculator);

module.exports = router;
