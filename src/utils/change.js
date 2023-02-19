export const getChangeValue = (
  change,
  parenthesis = false,
  multiplier = 100
) => {
  const changeColor =
    change > 0
      ? 'var(--undervaluedColor)'
      : change < 0
      ? 'var(--tradeLoss)'
      : 'goldenrod';
  const plus = change > 0 ? '+' : '';
  const changeValue = change
    ? `${plus}${(change * multiplier).toFixed(2)}%`
    : '=0%';
  const changeText = parenthesis ? `(${changeValue})` : changeValue;

  return {
    changeColor,
    changeText,
  };
};
