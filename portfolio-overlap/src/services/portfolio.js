const { MESSAGES } = require('../constants');
const { overlapHelper } = require('../helpers');
const { getFundsMapData } = require('./stock');
const { ValidationError } = require('../exceptions');

/**
 * stores current portfolio of user
 * @type {Portfolio}
 */
let portfolio = [];

/**
 * set the current portfolio for the user
 * @param {string[]} funds
 */
const setCurrentPortfolio = (funds) => {
  if (!funds) throw new ValidationError(MESSAGES.INVALID_USER_PORTFOLIO_INPUT);
  portfolio = [...funds];
};

/**
 * get the current portfolio of the user
 * @returns {string[]}
 */
const getCurrentPortfolio = () => {
  return !!portfolio ? [...portfolio] : [];
};

/**
 * get fund overlaps
 * @param {string} fundName
 * @returns {Overlap[]}
 */
const getFundOverlaps = (fundName) => {
  /**
   * @type {Overlap[]}
   */
  const overlaps = [];
  const fundsMap = getFundsMapData();
  const fund = fundsMap[fundName];
  if (!fund) throw new ValidationError(MESSAGES.FUND_NOT_FOUND);
  for (const portfolioFundName of portfolio) {
    const portfolioFund = fundsMap[portfolioFundName];
    const overlapPercent = overlapHelper.calculateOverlap(fund, portfolioFund);
    const overlap = {
      fundName: portfolioFundName,
      percentage: overlapPercent,
    };
    overlaps.push(overlap);
  }

  return overlaps;
};

module.exports = { setCurrentPortfolio, getFundOverlaps, getCurrentPortfolio };
