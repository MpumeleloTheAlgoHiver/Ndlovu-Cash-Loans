const DEFAULT_MONTHLY_SERVICE_FEE = 60;
const DEFAULT_INITIATION_FEE_RATE = 0.15;
const DEFAULT_DAYS_PER_MONTH = 30;

function toNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export function normalizeAnnualRate(rate) {
  const normalized = toNumber(rate, 0);
  return normalized > 1 ? normalized / 100 : normalized;
}

export function getTierAnnualRate(historyCount = 0) {
  return Number(historyCount) < 3 ? 0.30 : 0.28;
}

/**
 * Initiation fee applies to every loan (15% of principal).
 */
export function getInitiationFeeRate() {
  return DEFAULT_INITIATION_FEE_RATE;
}

function getMonthlyServiceFeesTotal(termMonths, monthlyServiceFee, firstPeriodDays, daysPerMonth) {
  const months = Math.max(1, Math.round(toNumber(termMonths, 1)));
  const feePerMonth = Math.max(0, toNumber(monthlyServiceFee, DEFAULT_MONTHLY_SERVICE_FEE));
  const monthDays = Math.max(1, Math.round(toNumber(daysPerMonth, DEFAULT_DAYS_PER_MONTH)));

  if (!Number.isFinite(firstPeriodDays) || firstPeriodDays <= 0) {
    return feePerMonth * months;
  }

  const proratedDays = Math.min(Math.max(1, Math.round(firstPeriodDays)), monthDays);
  const firstMonthFee = (feePerMonth / monthDays) * proratedDays;
  const remainingMonthsFees = months > 1 ? feePerMonth * (months - 1) : 0;
  return firstMonthFee + remainingMonthsFees;
}

export function calculateAmortizedMonthlyPayment(principal = 0, annualRate = 0, termMonths = 0) {
  const amount = Math.max(0, toNumber(principal, 0));
  const months = Math.max(0, Math.round(toNumber(termMonths, 0)));
  if (!amount || !months) {
    return 0;
  }

  const rate = normalizeAnnualRate(annualRate);
  const monthlyRate = rate / 12;
  if (!monthlyRate) {
    return amount / months;
  }

  const factor = Math.pow(1 + monthlyRate, months);
  return (amount * monthlyRate * factor) / (factor - 1);
}

export function calculateLoanRepaymentBreakdown({
  principal = 0,
  annualRate = 0,
  termMonths = 1,
  monthlyServiceFee = DEFAULT_MONTHLY_SERVICE_FEE,
  initiationFeeRate = DEFAULT_INITIATION_FEE_RATE,
  firstPeriodDays = null,
  daysPerMonth = DEFAULT_DAYS_PER_MONTH,
  totalCreditLife = 0
} = {}) {
  const amount = Math.max(0, toNumber(principal, 0));
  const months = Math.max(1, Math.round(toNumber(termMonths, 1)));
  const normalizedAnnualRate = normalizeAnnualRate(annualRate);
  const normalizedInitiationRate = Math.max(0, toNumber(initiationFeeRate, DEFAULT_INITIATION_FEE_RATE));
  const interestAnnualRate = normalizedAnnualRate; // Interest rate is the full annual rate; initiation is a separate fee

  const amortizedMonthly = calculateAmortizedMonthlyPayment(amount, interestAnnualRate, months);
  const amortizedTotal = amortizedMonthly * months;
  const totalInterest = Math.max(amortizedTotal - amount, 0);

  const totalMonthlyFees = getMonthlyServiceFeesTotal(months, monthlyServiceFee, firstPeriodDays, daysPerMonth);
  const totalInitiationFees = amount * normalizedInitiationRate;
  const safeCreditLife = Math.max(0, toNumber(totalCreditLife, 0));

  const totalRepayment = amount + totalInterest + totalMonthlyFees + totalInitiationFees + safeCreditLife;
  const monthlyPayment = totalRepayment / months;

  return {
    principal: amount,
    termMonths: months,
    annualRate: normalizedAnnualRate,
    interestAnnualRate,
    initiationFeeRate: normalizedInitiationRate,
    monthlyServiceFee: Math.max(0, toNumber(monthlyServiceFee, DEFAULT_MONTHLY_SERVICE_FEE)),
    totalInterest,
    totalMonthlyFees,
    totalInitiationFees,
    totalCreditLife: safeCreditLife,
    totalRepayment,
    monthlyPayment,
    amortizedMonthly
  };
}

export function calculateMaxPrincipalFromAffordablePayment({
  maxMonthlyPayment = 0,
  annualRate = 0,
  termMonths = 1,
  monthlyServiceFee = DEFAULT_MONTHLY_SERVICE_FEE,
  initiationFeeRate = DEFAULT_INITIATION_FEE_RATE,
  firstPeriodDays = null,
  daysPerMonth = DEFAULT_DAYS_PER_MONTH,
  totalCreditLife = 0
} = {}) {
  const paymentCap = Math.max(0, toNumber(maxMonthlyPayment, 0));
  const months = Math.max(1, Math.round(toNumber(termMonths, 1)));
  if (!paymentCap) {
    return 0;
  }

  const normalizedAnnualRate = normalizeAnnualRate(annualRate);
  const normalizedInitiationRate = Math.max(0, toNumber(initiationFeeRate, DEFAULT_INITIATION_FEE_RATE));
  const interestAnnualRate = normalizedAnnualRate; // Interest rate is the full annual rate

  const perRandMonthly = calculateAmortizedMonthlyPayment(1, interestAnnualRate, months);
  const monthlyServiceFees = getMonthlyServiceFeesTotal(months, monthlyServiceFee, firstPeriodDays, daysPerMonth) / months;
  const monthlyCreditLife = Math.max(0, toNumber(totalCreditLife, 0)) / months;
  const availableForPrincipal = paymentCap - monthlyServiceFees - monthlyCreditLife;
  if (availableForPrincipal <= 0) {
    return 0;
  }

  const principalCoefficient = perRandMonthly + (normalizedInitiationRate / months);
  if (!principalCoefficient) {
    return 0;
  }

  return availableForPrincipal / principalCoefficient;
}

export {
  DEFAULT_MONTHLY_SERVICE_FEE,
  DEFAULT_INITIATION_FEE_RATE,
  DEFAULT_DAYS_PER_MONTH
};