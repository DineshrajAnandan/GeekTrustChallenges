jest.doMock('../../../src/services/stock', () => ({
  getFundsMapData: jest.fn(() => getMockFundsMapData()),
}));
const {
  setCurrentPortfolio,
  getCurrentPortfolio,
  getFundOverlaps,
} = require('../../../src/services/portfolio');
const { getMockFundsMapData, MOCK_FUND } = require('../../mocks/stocks');
const overlapHelper = require('../../../src/helpers/overlap');
const { MESSAGES } = require('../../../src/constants');

afterAll(() => {
  jest.clearAllMocks();
});

describe('set and get current portfolio', () => {
  beforeEach(() => {
    setCurrentPortfolio([]);
  });

  afterAll(() => {
    setCurrentPortfolio([]);
  });

  test.each([{ input: ['fund1'] }, { input: ['fund1', 'fund2'] }])(
    'sets correct value to service variable',
    ({ input }) => {
      // act
      setCurrentPortfolio(input);
      const portfolio = getCurrentPortfolio();

      // assert
      expect(portfolio == input).toBe(false);
      expect(portfolio).toEqual(input);
      expect(portfolio.length).toEqual(input.length);
    }
  );

  test('throws error for invalid input', () => {
    // arrange
    let thrownError;

    // act
    try {
      setCurrentPortfolio(null);
    } catch (error) {
      thrownError = error;
    }
    const portfolio = getCurrentPortfolio();

    // assert
    expect(portfolio).toEqual([]);
    expect(thrownError.name).toBe('ValidationError');
    expect(thrownError.message).toBe(MESSAGES.INVALID_USER_PORTFOLIO_INPUT);
  });
});

describe('get fund overlaps', () => {
  beforeAll(() => {});

  test.each([
    {
      currentPortfolio: [MOCK_FUND.AXIS_BLUECHIP, MOCK_FUND.AXIS_MIDCAP],
      fundName: MOCK_FUND.ICICI_PRU_BLUECHIP,
      overlaps: [
        {
          fundName: MOCK_FUND.AXIS_BLUECHIP,
          percentage: '44.00',
        },
        {
          fundName: MOCK_FUND.AXIS_MIDCAP,
          percentage: '14.52',
        },
      ],
    },
    {
      currentPortfolio: [
        MOCK_FUND.AXIS_BLUECHIP,
        MOCK_FUND.AXIS_MIDCAP,
        MOCK_FUND.UTI_NIFTY_INDEX,
      ],
      fundName: MOCK_FUND.ICICI_PRU_BLUECHIP,
      overlaps: [
        {
          fundName: MOCK_FUND.AXIS_BLUECHIP,
          percentage: '44.00',
        },
        {
          fundName: MOCK_FUND.AXIS_MIDCAP,
          percentage: '14.52',
        },
        {
          fundName: MOCK_FUND.UTI_NIFTY_INDEX,
          percentage: '46.77',
        },
      ],
    },
    {
      currentPortfolio: [],
      fundName: MOCK_FUND.ICICI_PRU_BLUECHIP,
      overlaps: [],
    },
  ])('returns correct overlaps', ({ currentPortfolio, fundName, overlaps }) => {
    // arrange
    const mockcalculateOverlap = jest.spyOn(overlapHelper, 'calculateOverlap');
    setCurrentPortfolio(currentPortfolio);

    // act
    const result = getFundOverlaps(fundName);

    // assert
    expect(mockcalculateOverlap).toHaveBeenCalledTimes(currentPortfolio.length);
    expect(result.length).toEqual(overlaps.length);
    expect(result).toEqual(overlaps);

    mockcalculateOverlap.mockRestore();
  });

  test.each([null, 'INVALID_FUND_NAME'])(
    'throws error for invalid fund name',
    (fundName) => {
      // arrange
      const mockcalculateOverlap = jest.spyOn(
        overlapHelper,
        'calculateOverlap'
      );

      // act
      let thrownError;
      try {
        getFundOverlaps(fundName);
      } catch (error) {
        thrownError = error;
      }

      // assert
      expect(mockcalculateOverlap).toHaveBeenCalledTimes(0);
      expect(thrownError.name).toEqual('ValidationError');
      expect(thrownError.message).toEqual(MESSAGES.FUND_NOT_FOUND);

      mockcalculateOverlap.mockRestore();
    }
  );

  test.each([
    { currentPortfolio: ['INVALID_FUND_NAME', 'INVALID_FUND_NAME2'] },
    { currentPortfolio: [null] },
  ])(
    'throws error for invalid fund name in portfolio',
    ({ currentPortfolio }) => {
      // arrange
      const mockcalculateOverlap = jest.spyOn(
        overlapHelper,
        'calculateOverlap'
      );
      setCurrentPortfolio(currentPortfolio);

      // act
      let thrownError;
      try {
        getFundOverlaps(MOCK_FUND.ICICI_PRU_BLUECHIP);
      } catch (error) {
        thrownError = error;
      }

      // assert
      expect(mockcalculateOverlap).toHaveBeenCalledTimes(1);
      expect(thrownError.name).toEqual('TypeError');

      mockcalculateOverlap.mockRestore();
    }
  );
});
