jest.mock('node-fetch', () => jest.fn());

const fetch = require('node-fetch');

const {
  getFundsMapData,
  getStocksData,
  setStocksData,
  addStock,
  callGetStocksData,
} = require('../../../src/services/stock');
const {
  getMockFundsMapData,
  getMockStocksData,
} = require('../../mocks/stocks');
const { MESSAGES } = require('../../../src/constants');

describe('get and set stocks data', () => {
  beforeEach(() => {
    setStocksData({});
  });

  afterAll(() => {
    setStocksData({});
  });

  test.each([{ input: getMockStocksData() }, { input: { funds: [] } }])(
    'sets correct value to service variable',
    ({ input }) => {
      // act
      setStocksData(input);
      const stocksData = getStocksData();

      // assert
      expect(stocksData == input).toBe(false);
      expect(stocksData).toEqual(input);
      expect(stocksData.funds.length).toEqual(input.funds.length);
    }
  );

  test('throws error for invalid input', () => {
    // arrange
    let thrownError;

    // act
    try {
      setStocksData(null);
    } catch (error) {
      thrownError = error;
    }
    const stocksData = getStocksData();

    // assert
    expect(stocksData).toEqual({});
    expect(thrownError.name).toBe('ValidationError');
    expect(thrownError.message).toBe(MESSAGES.INVALID_STOCKS_INPUT);
  });
});

describe('get funds map data', () => {
  test.each([
    {
      stocksData: {
        funds: [],
      },
      output: {},
    },
    {
      stocksData: getMockStocksData(),
      output: getMockFundsMapData(),
    },
  ])('produces correct output', ({ stocksData, output }) => {
    // arrange
    setStocksData(stocksData);

    // act
    const result = getFundsMapData();

    // assert
    expect(result).toEqual(output);
  });
});

describe('add stock', () => {
  beforeEach(() => {
    setStocksData({
      funds: [
        { name: 'fund1', stocks: ['stock'] },
        { name: 'fund2', stocks: [] },
      ],
    });
  });

  test.each([
    {
      stockName: 'stock1',
      fundName: 'fund1',
      expected: {
        funds: [
          { name: 'fund1', stocks: ['stock', 'stock1'] },
          { name: 'fund2', stocks: [] },
        ],
      },
    },
    {
      stockName: 'stock2',
      fundName: 'fund2',
      expected: {
        funds: [
          { name: 'fund1', stocks: ['stock'] },
          { name: 'fund2', stocks: ['stock2'] },
        ],
      },
    },
    {
      stockName: 'stock',
      fundName: 'fund1',
      expected: {
        funds: [
          { name: 'fund1', stocks: ['stock'] },
          { name: 'fund2', stocks: [] },
        ],
      },
    },
    {
      stockName: '',
      fundName: 'fund1',
      expected: {
        funds: [
          { name: 'fund1', stocks: ['stock'] },
          { name: 'fund2', stocks: [] },
        ],
      },
    },
    {
      stockName: null,
      fundName: null,
      expected: {
        funds: [
          { name: 'fund1', stocks: ['stock'] },
          { name: 'fund2', stocks: [] },
        ],
      },
    },
  ])('produces correct behaviour', ({ stockName, fundName, expected }) => {
    // arrange

    // act
    addStock(fundName, stockName);
    const stocksData = getStocksData();

    // assert
    expect(stocksData).toEqual(expected);
  });

  test.each([{ fundName: 'INVALID_FUND_NAME' }, { fundName: null }])(
    'throws error for invalid data',
    ({ fundName }) => {
      // arrange
      setStocksData(getStocksData());
      let thrownError;

      // act
      try {
        addStock(fundName, 'stockName');
      } catch (error) {
        thrownError = error;
      }

      // assert
      expect(thrownError.name).toEqual('ValidationError');
      expect(thrownError.message).toEqual(MESSAGES.FUND_NOT_FOUND);
    }
  );
});

describe('call get stocks data', () => {
  test('produces response from api call', async () => {
    // arrange
    const expectedData = getMockStocksData();
    const response = Promise.resolve({
      ok: true,
      status: 200,
      json: () => {
        return expectedData;
      },
    });
    fetch.mockImplementation(() => response);

    // act
    const data = await callGetStocksData();

    // assert
    expect(data).toEqual(expectedData);
  });

  test('produces error if fetch fails', async () => {
    // arrange
    const expectedErrorMessage = 'FETCH FAILED';
    fetch.mockImplementation(() => {
      throw new Error(expectedErrorMessage);
    });
    let thrownError;

    // act
    try {
      const data = await callGetStocksData();
    } catch (error) {
      thrownError = error;
    }

    // assert
    expect(thrownError.name).toEqual('Error');
    expect(thrownError.message).toEqual(expectedErrorMessage);
  });
});
