const getUndervaluedTextAndStyle = ({
  showValuation,
  price,
  deal_coefficient,
  average_coefficient,
}) => {
  const true_coefficient = deal_coefficient / average_coefficient;
  if (!showValuation || !price || !deal_coefficient || !average_coefficient) {
    return {
      valueCoefficientStyle: 'valueCoefficientFairlyvalued',
      valueCoefficientText: 'No Jungle Valuation Index(JVI) Available',
    };
  }

  if (true_coefficient < 0.25) {
    return {
      valueCoefficientStyle: 'valueCoefficientSevereUndervalued',
      valueCoefficientText: 'Best Value',
      trueCoefficient: true_coefficient,
    };
  }
  if (true_coefficient < 0.35) {
    return {
      valueCoefficientStyle: 'valueCoefficientUndervalued',
      valueCoefficientText: 'Undervalued',
      trueCoefficient: true_coefficient,
    };
  }
  if (true_coefficient < 0.45) {
    return {
      valueCoefficientStyle: 'valueCoefficientSlightlyUndervalued',
      valueCoefficientText: 'Slightly Undervalued',
      trueCoefficient: true_coefficient,
    };
  }
  if (true_coefficient > 0.55) {
    return {
      valueCoefficientStyle: 'valueCoefficientSlightlyOvervalued',
      valueCoefficientText: 'Slightly Overvalued',
      trueCoefficient: true_coefficient,
    };
  }
  if (true_coefficient > 0.65) {
    return {
      valueCoefficientStyle: 'valueCoefficientOvervalued',
      valueCoefficientText: 'Overvalued',
      trueCoefficient: true_coefficient,
    };
  }
  if (true_coefficient > 0.75) {
    return {
      valueCoefficientStyle: 'valueCoefficientSevereOvervalued',
      valueCoefficientText: 'Drastically Overvalued',
      trueCoefficient: true_coefficient,
    };
  }

  return {
    valueCoefficientStyle: 'valueCoefficientFairlyvalued',
    valueCoefficientText: 'Fairly Valued',
    trueCoefficient: true_coefficient,
  };
};

export { getUndervaluedTextAndStyle };
