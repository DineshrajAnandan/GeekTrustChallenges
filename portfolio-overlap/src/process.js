const { stocksService, portfolioService } = require('./services');
const { COMMANDS, MESSAGES } = require('./constants');
const { overlapHelper } = require('./helpers');
const { ValidationError } = require('./exceptions');

/**
 * processCommandCurrentPortfolio
 * @param {string} commandParams
 */
const processCommandCurrentPortfolio = (commandParams) => {
  const portfolioList =
    commandParams && commandParams.trim() ? commandParams.split(' ') : [];
  portfolioService.setCurrentPortfolio(portfolioList);
};

/**
 * processCommandCalculateOverlap
 * @param {string} commandParams
 */
const processCommandCalculateOverlap = (commandParams) => {
  const fundName = commandParams.trim();
  try {
    const overlaps = portfolioService.getFundOverlaps(fundName);
    overlapHelper.printOverlaps(fundName, overlaps);
  } catch (error) {
    if (error instanceof ValidationError) console.log(error.message);
    else throw error;
  }
};

/**
 * processCommandAddStock
 * @param {string} commandParams
 */
const processCommandAddStock = (commandParams) => {
  const fundName = commandParams.slice(0, commandParams.indexOf(' '));
  const stockName = commandParams.slice(commandParams.indexOf(' ') + 1);
  try {
    stocksService.addStock(fundName, stockName);
  } catch (error) {
    if (error instanceof ValidationError) console.log(error.message);
    else throw error;
  }
};

/**
 * process the input line
 * @param {string} inputLine
 */
const processInput = (inputLine) => {
  const firstGapIndex = inputLine.indexOf(' ');
  const command = inputLine.slice(
    0,
    firstGapIndex == -1 ? inputLine.length : firstGapIndex
  );
  const commandParams = inputLine.replace(command, '').trim();

  switch (command) {
    case COMMANDS.CURRENT_PORTFOLIO:
      processCommandCurrentPortfolio(commandParams);
      break;
    case COMMANDS.CALCULATE_OVERLAP:
      processCommandCalculateOverlap(commandParams);
      break;
    case COMMANDS.ADD_STOCK:
      processCommandAddStock(commandParams);
      break;
    default:
      console.log(MESSAGES.COMMAND_NOT_FOUND, command);
      break;
  }
};

async function arrangeStocksData() {
  const stocksData = await stocksService.callGetStocksData();
  stocksService.setStocksData(stocksData);
}

module.exports = { processInput, arrangeStocksData };
