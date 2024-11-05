const express = require("express");
const router = express.Router();
const {
  simpleInterest,
  compoundInterest,
  loanPayment
//   investmentGrowth,
//   retirementSavings,
//   debtRepayment,
  // currencyConversion
} = require("../controllers/calculatorController");

router.post("/simple-interest", simpleInterest);
router.post("/compound-interest", compoundInterest);
router.post("/loan-payment", loanPayment);
// router.post("/investment-growth", investmentGrowth);
// router.post("/retirement-savings", retirementSavings);
// router.post("/debt-repayment", debtRepayment);
// router.post("/currency-conversion", currencyConversion);

module.exports = router;
