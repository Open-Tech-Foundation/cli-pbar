function percentage(current, total) {
  return Math.floor((current * 100) / total);
}

function percentageVal(total, percent) {
  return Math.floor((total / 100) * percent);
}

module.exports = {
  percentage,
  percentageVal,
};
