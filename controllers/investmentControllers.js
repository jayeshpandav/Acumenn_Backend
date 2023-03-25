// Controller function for handling SIP calculation requests
exports.reqSip = (req, res) => {
  // Retrieve input values from request body
  const targetValue = parseFloat(req.body.target_value);
  const annualRateOfReturn = parseFloat(req.body.annual_rate_of_return) / 100; // Convert percentage to decimal
  const years = parseFloat(req.body.years);
  const months = years * 12;
  const monthlyRateOfReturn = annualRateOfReturn / 12;

  // Calculate required SIP
  const requiredSip =
    (targetValue /
      (((1 + monthlyRateOfReturn) ** months - 1) / monthlyRateOfReturn)) *
    (1 + monthlyRateOfReturn);

  // Return required SIP as JSON response
  res.json({
    annual_rate_of_return: req.body.annual_rate_of_return,
    required_sip: requiredSip.toFixed(2),
    target_value: targetValue,
    years: years,
  });
};

// Controller function for handling SWP withdrawal requests
exports.swpWithdrawal = (req, res) => {
  // Retrieve input values from request body
  const initialInvestment = parseFloat(req.body.initial_investment);
  const withdrawalAmount = parseFloat(req.body.withdrawal_amount);
  const withdrawalFrequency = req.body.withdrawal_frequency;
  const numWithdrawals = parseInt(req.body.num_withdrawals);
  const inflationRate = parseFloat(req.body.inflation_rate);
  const roi = parseFloat(req.body.roi);

  // Calculate number of withdrawals per year based on withdrawal frequency
  let withdrawalsPerYear = 0;
  if (withdrawalFrequency === "monthly") {
    withdrawalsPerYear = 12;
  } else if (withdrawalFrequency === "quarterly") {
    withdrawalsPerYear = 4;
  } else if (withdrawalFrequency === "annually") {
    withdrawalsPerYear = 1;
  } else {
    return res.status(500).json({ message: "Invalid withdrawal frequency" });
  }

  // Initialize variables
  let currentInvestment = initialInvestment;
  let withdrawals = [];

  // Calculate withdrawals and investment growth for each period
  for (let i = 0; i < numWithdrawals; i++) {
    // Calculate investment growth
    const investmentGrowth = (currentInvestment * roi) / withdrawalsPerYear;
    currentInvestment += investmentGrowth;

    // Calculate withdrawal adjusted for inflation
    const withdrawalAdjustedForInflation =
      withdrawalAmount * (1 + inflationRate / withdrawalsPerYear) ** i;

    // Check if there's enough money in the investment for the withdrawal
    if (currentInvestment >= withdrawalAdjustedForInflation) {
      withdrawals.push({
        current_investment: currentInvestment.toFixed(2),
        investment_growth: investmentGrowth.toFixed(2),
        withdrawal: withdrawalAdjustedForInflation.toFixed(2),
        withdrawal_per_period: withdrawalAmount.toFixed(2),
      });
      currentInvestment -= withdrawalAdjustedForInflation;
    } else {
      withdrawals.push({
        current_investment: currentInvestment.toFixed(2),
        investment_growth: investmentGrowth.toFixed(2),
        withdrawal: currentInvestment.toFixed(2),
        withdrawal_per_period: (
          currentInvestment /
          (1 + inflationRate / withdrawalsPerYear) ** i
        ).toFixed(2),
      });
      currentInvestment = 0;
    }
  }

  // Return list of withdrawals as JSON response
  res.json({
    inflation_rate: inflationRate,
    initial_investment: initialInvestment,
    number_of_withdrawals: numWithdrawals,
    results: withdrawals,
    roi: roi,
    withdrawal_amount: withdrawalAmount,
    withdrawal_frequency: withdrawalFrequency,
  });
};
