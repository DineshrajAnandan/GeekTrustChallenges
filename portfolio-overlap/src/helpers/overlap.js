const { COMMON } = require('../constants');

/**
 * calculate overlap
 * @param {Fund} fundOne
 * @param {Fund} fundTwo
 * @returns {string}
 */
const calculateOverlap = (fundOne, fundTwo) => {
  //     Overlap (A,B) =
  // 2*(No of common stocks in A & B)/ (No of stocks in A + No of stocks in B) * 100

  const noOfCommonStocks = fundOne.stocks.filter((stock) =>
    fundTwo.stocks.includes(stock)
  ).length;

  const overlap =
    ((COMMON.multiplyingFactorForOverlapCalculation * noOfCommonStocks) /
      (fundOne.stocks.length + fundTwo.stocks.length)) *
    COMMON.hundredPercent;

  return overlap.toFixed(2);
};

/**
 * print overlaps
 * @param {string} fundName
 * @param {Overlap[]} overlaps
 */
const printOverlaps = (fundName, overlaps) => {
  for (const overlap of overlaps) {
    console.log(fundName, overlap.fundName, `${overlap.percentage}%`);
  }
};

module.exports = { calculateOverlap, printOverlaps };
