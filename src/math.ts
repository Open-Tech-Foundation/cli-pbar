function percentage(val: number, total: number): number {
  return Math.floor((val / total) * 100);
}

function percentageOf(percentage: number, total: number): number {
  return Math.floor((percentage / 100) * total);
}

export { percentage, percentageOf };
