export function formatNumber(number: number): string {
  if (number >= 1000 && number < 100000) {
    const roundedNumber = Math.floor(number / 100) / 10;
    return roundedNumber.toFixed(1) + "K";
  } else if (number >= 100000) {
    return Math.floor(number / 1000) + "K";
  } else {
    return number.toString();
  }
}
