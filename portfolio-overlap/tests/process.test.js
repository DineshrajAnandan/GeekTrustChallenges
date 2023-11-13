const { processInput } = require('../src/process');
const { MESSAGES } = require('../src/constants');
const { stocksService, portfolioService } = require('../src/services');
const { overlapHelper } = require('../src/helpers');
const { getMockStocksData } = require('./mocks/stocks');
const { ValidationError } = require('../src/exceptions');

describe('process input - invalid tests', () => {
  test.each([
    {
      inputLine: 'INVALID_COMMAND TEST',
      command: 'INVALID_COMMAND',
    },
    {
      inputLine: 'INVALID_COMMAND_TEST',
      command: 'INVALID_COMMAND_TEST',
    },
  ])('invalid command prints to console', ({ inputLine, command }) => {
    // arrange
    const logSpy = jest.spyOn(global.console, 'log');

    // act
    processInput(inputLine);

    // assert
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(MESSAGES.COMMAND_NOT_FOUND, command);

    logSpy.mockRestore();
  });
});

describe('process input - current portfolio', () => {
  beforeAll(() => {
    stocksService.setStocksData(getMockStocksData());
  });

  test.each([
    {
      inputLine:
        'CURRENT_PORTFOLIO AXIS_BLUECHIP ICICI_PRU_BLUECHIP UTI_NIFTY_INDEX',
      serviceArgs: ['AXIS_BLUECHIP', 'ICICI_PRU_BLUECHIP', 'UTI_NIFTY_INDEX'],
    },
    {
      inputLine: 'CURRENT_PORTFOLIO',
      serviceArgs: [],
    },
    {
      inputLine: 'CURRENT_PORTFOLIO AXIS_BLUECHIP',
      serviceArgs: ['AXIS_BLUECHIP'],
    },
  ])(
    'calls setCurrentPortfolio with expected input',
    ({ inputLine, serviceArgs }) => {
      // arrange
      const setCurrentPortfolioSpy = jest
        .spyOn(portfolioService, 'setCurrentPortfolio')
        .mockImplementation(jest.fn());

      // act
      processInput(inputLine);

      // assert
      expect(setCurrentPortfolioSpy).toHaveBeenCalled();
      expect(setCurrentPortfolioSpy).toHaveBeenCalledTimes(1);
      expect(setCurrentPortfolioSpy).toHaveBeenCalledWith(serviceArgs);

      setCurrentPortfolioSpy.mockRestore();
    }
  );
});

describe('process input - calculate overlap', () => {
  beforeAll(() => {
    stocksService.setStocksData(getMockStocksData());
  });

  test.each([
    {
      inputLine: 'CALCULATE_OVERLAP MIRAE_ASSET_EMERGING_BLUECHIP',
      fundName: 'MIRAE_ASSET_EMERGING_BLUECHIP',
      overlaps: [
        {
          fundName: 'fund1',
          percentage: '100',
        },
      ],
    },
    {
      inputLine: 'CALCULATE_OVERLAP FUND_X',
      fundName: 'FUND_X',
      overlaps: [
        {
          fundName: 'fund1',
          percentage: '100',
        },
        {
          fundName: 'fund2',
          percentage: '10',
        },
      ],
    },
    {
      inputLine: 'CALCULATE_OVERLAP FUND_Y ',
      fundName: 'FUND_Y',
      overlaps: [],
    },
  ])(
    'calls getFundOverlaps with expected input',
    ({ inputLine, fundName, overlaps }) => {
      // arrange
      const getFundOverlapsSpy = jest
        .spyOn(portfolioService, 'getFundOverlaps')
        .mockImplementation(jest.fn(() => overlaps));
      const printOverlapsSpy = jest
        .spyOn(overlapHelper, 'printOverlaps')
        .mockImplementation(jest.fn());

      // act
      processInput(inputLine);

      // assert
      expect(getFundOverlapsSpy).toHaveBeenCalled();
      expect(getFundOverlapsSpy).toHaveBeenCalledTimes(1);
      expect(getFundOverlapsSpy).toHaveBeenCalledWith(fundName);

      expect(printOverlapsSpy).toHaveBeenCalled();
      expect(printOverlapsSpy).toHaveBeenCalledTimes(1);
      expect(printOverlapsSpy).toHaveBeenCalledWith(fundName, overlaps);

      getFundOverlapsSpy.mockRestore();
      printOverlapsSpy.mockRestore();
    }
  );

  test.each([
    {
      inputLine: 'CALCULATE_OVERLAP MIRAE_ASSET_EMERGING_BLUECHIP',
      fundName: 'MIRAE_ASSET_EMERGING_BLUECHIP',
      errorMessage: 'test message 1',
    },
    {
      inputLine: 'CALCULATE_OVERLAP',
      fundName: '',
      errorMessage: 'test message 2',
    },
  ])('logs validation errors', ({ inputLine, fundName, errorMessage }) => {
    // arrange
    const getFundOverlapsSpy = jest
      .spyOn(portfolioService, 'getFundOverlaps')
      .mockImplementation(
        jest.fn(() => {
          throw new ValidationError(errorMessage);
        })
      );
    const printOverlapsSpy = jest
      .spyOn(overlapHelper, 'printOverlaps')
      .mockImplementation(jest.fn());
    const logSpy = jest.spyOn(global.console, 'log');

    // act
    processInput(inputLine);

    // assert
    expect(getFundOverlapsSpy).toHaveBeenCalled();
    expect(getFundOverlapsSpy).toHaveBeenCalledTimes(1);
    expect(getFundOverlapsSpy).toHaveBeenCalledWith(fundName);

    expect(printOverlapsSpy).toHaveBeenCalledTimes(0);

    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(errorMessage);

    getFundOverlapsSpy.mockRestore();
    printOverlapsSpy.mockRestore();
    logSpy.mockRestore();
  });

  test('throws non validation errors', () => {
    // arrange
    const getFundOverlapsSpy = jest
      .spyOn(portfolioService, 'getFundOverlaps')
      .mockImplementation(
        jest.fn(() => {
          throw new Error('errorMessage');
        })
      );
    const printOverlapsSpy = jest
      .spyOn(overlapHelper, 'printOverlaps')
      .mockImplementation(jest.fn());
    const logSpy = jest.spyOn(global.console, 'log');
    let thrownError;

    // act
    try {
      processInput('CALCULATE_OVERLAP MIRAE_ASSET_EMERGING_BLUECHIP');
    } catch (error) {
      thrownError = error;
    }

    // assert
    expect(getFundOverlapsSpy).toHaveBeenCalled();
    expect(getFundOverlapsSpy).toHaveBeenCalledTimes(1);
    expect(getFundOverlapsSpy).toHaveBeenCalledWith(
      'MIRAE_ASSET_EMERGING_BLUECHIP'
    );

    expect(printOverlapsSpy).toHaveBeenCalledTimes(0);

    expect(logSpy).toHaveBeenCalledTimes(0);

    expect(thrownError.name).toEqual('Error');
    expect(thrownError.message).toEqual('errorMessage');

    getFundOverlapsSpy.mockRestore();
    printOverlapsSpy.mockRestore();
    logSpy.mockRestore();
  });
});

describe('process input - add stock', () => {
  test.each([
    {
      inputLine: 'ADD_STOCK AXIS_BLUECHIP TCS',
      fundName: 'AXIS_BLUECHIP',
      stockName: 'TCS',
    },
    {
      inputLine: 'ADD_STOCK FUND_X TCS XXX',
      fundName: 'FUND_X',
      stockName: 'TCS XXX',
    },
  ])(
    'calls addStock with expected input',
    ({ inputLine, fundName, stockName }) => {
      // arrange
      const addStockSpy = jest
        .spyOn(stocksService, 'addStock')
        .mockImplementation(jest.fn());

      // act
      processInput(inputLine);

      // assert
      expect(addStockSpy).toHaveBeenCalled();
      expect(addStockSpy).toHaveBeenCalledTimes(1);
      expect(addStockSpy).toHaveBeenCalledWith(fundName, stockName);

      addStockSpy.mockRestore();
    }
  );

  test.each([
    {
      inputLine: 'ADD_STOCK AXIS_BLUECHIP TCS',
      fundName: 'AXIS_BLUECHIP',
      stockName: 'TCS',
      errorMessage: 'test message 1',
    },
    {
      inputLine: 'ADD_STOCK FUND_X TCS XXX',
      fundName: 'FUND_X',
      stockName: 'TCS XXX',
      errorMessage: 'test message 2',
    },
  ])(
    'logs validation errors',
    ({ inputLine, fundName, stockName, errorMessage }) => {
      // arrange
      const addStockSpy = jest
        .spyOn(stocksService, 'addStock')
        .mockImplementation(
          jest.fn(() => {
            throw new ValidationError(errorMessage);
          })
        );
      const logSpy = jest.spyOn(global.console, 'log');

      // act
      processInput(inputLine);

      // assert
      expect(addStockSpy).toHaveBeenCalled();
      expect(addStockSpy).toHaveBeenCalledTimes(1);
      expect(addStockSpy).toHaveBeenCalledWith(fundName, stockName);

      expect(logSpy).toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(errorMessage);

      addStockSpy.mockRestore();
      logSpy.mockRestore();
    }
  );

  test('throws non validation errors', () => {
    // arrange
    const addStockSpy = jest
      .spyOn(stocksService, 'addStock')
      .mockImplementation(
        jest.fn(() => {
          throw new Error('errorMessage');
        })
      );
    const logSpy = jest.spyOn(global.console, 'log');
    let thrownError;

    // act
    try {
      processInput('ADD_STOCK FUND_X TCS XXX');
    } catch (error) {
      thrownError = error;
    }

    // assert
    expect(addStockSpy).toHaveBeenCalled();
    expect(addStockSpy).toHaveBeenCalledTimes(1);
    expect(addStockSpy).toHaveBeenCalledWith('FUND_X', 'TCS XXX');

    expect(logSpy).toHaveBeenCalledTimes(0);

    expect(thrownError.name).toEqual('Error');
    expect(thrownError.message).toEqual('errorMessage');

    addStockSpy.mockRestore();
    logSpy.mockRestore();
  });
});
