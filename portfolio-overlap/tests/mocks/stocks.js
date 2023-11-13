var fs = require('fs');
var path = require('path');
var stocksData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'stocks.json'), 'utf8')
);

/**
 * get stocks data
 * @returns {Stocks}
 */
const getMockStocksData = () => {
  return stocksData;
};

/**
 * get stocks data
 * @returns {Object.<string, Fund>}
 */
const getMockFundsMapData = () => {
  var result = stocksData.funds.reduce((map, obj) => {
    map[obj.name] = obj;
    return map;
  }, {});
  return result;
};

const MOCK_FUND = {
  ICICI_PRU_NIFTY_NEXT_50_INDEX: 'ICICI_PRU_NIFTY_NEXT_50_INDEX',
  PARAG_PARIKH_CONSERVATIVE_HYBRID: 'PARAG_PARIKH_CONSERVATIVE_HYBRID',
  UTI_NIFTY_INDEX: 'UTI_NIFTY_INDEX',
  AXIS_MIDCAP: 'AXIS_MIDCAP',
  MIRAE_ASSET_EMERGING_BLUECHIP: 'MIRAE_ASSET_EMERGING_BLUECHIP',
  PARAG_PARIKH_FLEXI_CAP: 'PARAG_PARIKH_FLEXI_CAP',
  MIRAE_ASSET_LARGE_CAP: 'MIRAE_ASSET_LARGE_CAP',
  AXIS_BLUECHIP: 'AXIS_BLUECHIP',
  ICICI_PRU_BLUECHIP: 'ICICI_PRU_BLUECHIP',
};

module.exports = { getMockStocksData, getMockFundsMapData, MOCK_FUND };
