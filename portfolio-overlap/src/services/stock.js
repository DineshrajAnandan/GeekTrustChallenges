const { MESSAGES } = require('../constants');
const fetch = require('node-fetch');
const { ValidationError } = require('../exceptions');

/**
 * stores the stocks data
 * @type {Stocks}
 */
let stocksData = {};

const callGetStocksData = async () => {
  const response = await fetch(
    'https://geektrust.s3.ap-southeast-1.amazonaws.com/portfolio-overlap/stock_data.json'
  );
  const data = await response.json();
  return data;
};

/**
 * get stocks data
 * @returns {Stocks}
 */
const getStocksData = () => {
  return stocksData;
};

/**
 * get stocks data
 * @returns {Object.<string, Fund>}
 */
const getFundsMapData = () => {
  var result = stocksData.funds.reduce((map, obj) => {
    map[obj.name] = obj;
    return map;
  }, {});
  return result;
};

/**
 * set stocks data
 * @param {Stocks} data
 */
const setStocksData = (data) => {
  if (!data) throw new ValidationError(MESSAGES.INVALID_STOCKS_INPUT);
  stocksData = { ...data };
};

/**
 * adds stock to the fund
 * @param {string} fundName
 * @param {string} stockName
 */
const addStock = (fundName, stockName) => {
  if (!stockName) return;

  const fund = stocksData.funds.find((fund) => fund.name === fundName);
  if (!fund) throw new ValidationError(MESSAGES.FUND_NOT_FOUND);

  const stockPresent = fund.stocks.includes(stockName);
  if (stockPresent) return;

  fund.stocks.push(stockName);
};

module.exports = {
  getStocksData,
  callGetStocksData,
  setStocksData,
  addStock,
  getFundsMapData,
};
