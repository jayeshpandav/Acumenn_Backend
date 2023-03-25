// This function calculates the number of withdrawals until the initial investment is depleted.
exports.numUntilDepleted = (req, res) => {
  // Retrieve input values from request body
  const initialInvestment = parseFloat(req.body.initial_investment);
  const withdrawalAmount = parseFloat(req.body.withdrawal_amount);
  const withdrawalFrequency = req.body.withdrawal_frequency;
  const inflationRate = parseFloat(req.body.inflation_rate);
  const roi = parseFloat(req.body.roi);

  // Calculate number of withdrawals until depleted
  let currentInvestment = initialInvestment;
  let numWithdrawals = 0;
  while (currentInvestment > 0) {
    numWithdrawals++;
    const withdrawal = withdrawalAmount * (1 + inflationRate) ** numWithdrawals;
    const investmentGrowth = currentInvestment * roi;
    currentInvestment += investmentGrowth - withdrawal;
  }
  const numWithdrawalsUntilDepleted = numWithdrawals - 1;

  // Return number of withdrawals until depleted
  res.json({
    inflation_rate: inflationRate,
    initial_investment: initialInvestment,
    num_withdrawals_until_depleted: numWithdrawalsUntilDepleted,
    roi: roi,
    withdrawal_amount: withdrawalAmount,
    withdrawal_frequency: withdrawalFrequency,
  });
};

// This function calculates the total amount withdrawn based on the input values.
exports.totalWithdrawan = (req, res) => {
  // Retrieve input values from request body
  const initial_investment = parseFloat(req.body.initial_investment);
  const withdrawal_amount = parseFloat(req.body.withdrawal_amount);
  const withdrawal_frequency = req.body.withdrawal_frequency;
  const inflation_rate = parseFloat(req.body.inflation_rate);
  const roi = parseFloat(req.body.roi);

  // Calculate number of withdrawals per year based on withdrawal frequency
  let withdrawalsPerYear = 0;
  if (withdrawal_frequency === "monthly") {
    withdrawalsPerYear = 12;
  } else if (withdrawal_frequency === "quarterly") {
    withdrawalsPerYear = 4;
  } else if (withdrawal_frequency === "annually") {
    withdrawalsPerYear = 1;
  } else {
    return res.status(500).json({ message: "Invalid withdrawal frequency" });
  }

  // Calculate total amount withdrawn
  let totalAmountWithdrawn = 0;
  let numWithdrawals = 0;
  let currentBalance = initial_investment;

  while (currentBalance > 0) {
    currentBalance *= 1 + roi / withdrawalsPerYear;
    const withdrawalAdjustedForInflation =
      withdrawal_amount *
      (1 + inflation_rate / withdrawalsPerYear) ** numWithdrawals;
    if (currentBalance >= withdrawalAdjustedForInflation) {
      currentBalance -= withdrawalAdjustedForInflation;
      totalAmountWithdrawn += withdrawalAdjustedForInflation;
      numWithdrawals++;
    } else {
      totalAmountWithdrawn += currentBalance;
      currentBalance = 0;
      numWithdrawals++;
    }
  }

  // Construct and return response object
  const responseObject = {
    inflation_rate: inflation_rate,
    initial_investment: initial_investment,
    num_withdrawals: numWithdrawals,
    roi: roi,
    total_amount_withdrawn: totalAmountWithdrawn.toFixed(2),
    withdrawal_amount: withdrawal_amount,
    withdrawal_frequency: withdrawal_frequency,
    withdrawals_per_year: withdrawalsPerYear,
  };
  res.json(responseObject);
};
