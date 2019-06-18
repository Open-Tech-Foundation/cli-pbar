exports.percentage = (current, total) => {
  return Math.floor((current * 100) / (total === 0 ? 1 : total));
};

exports.percentageVal = (total, percent) => {
  return Math.floor((total / 100) * percent);
};
