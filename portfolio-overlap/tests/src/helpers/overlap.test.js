const { getMockFundsMapData, MOCK_FUND } = require('../../mocks/stocks');
const { overlapHelper } = require('../../../src/helpers');

describe('calculate overlap', () => {
  const mockFundsMap = getMockFundsMapData();
  it.each([
    {
      fundOne: mockFundsMap[MOCK_FUND.AXIS_BLUECHIP],
      fundTwo: mockFundsMap[MOCK_FUND.AXIS_MIDCAP],
      expected: '22.22',
    },
    {
      fundOne: mockFundsMap[MOCK_FUND.ICICI_PRU_BLUECHIP],
      fundTwo: mockFundsMap[MOCK_FUND.ICICI_PRU_NIFTY_NEXT_50_INDEX],
      expected: '25.42',
    },
    {
      fundOne: mockFundsMap[MOCK_FUND.MIRAE_ASSET_EMERGING_BLUECHIP],
      fundTwo: mockFundsMap[MOCK_FUND.MIRAE_ASSET_LARGE_CAP],
      expected: '62.30',
    },
    {
      fundOne: mockFundsMap[MOCK_FUND.PARAG_PARIKH_FLEXI_CAP],
      fundTwo: mockFundsMap[MOCK_FUND.UTI_NIFTY_INDEX],
      expected: '25.29',
    },
    {
      fundOne: mockFundsMap[MOCK_FUND.PARAG_PARIKH_FLEXI_CAP],
      fundTwo: { name: 'DUMMY_STOCK', stocks: [] },
      expected: '0.00',
    },
    {
      fundOne: mockFundsMap[MOCK_FUND.PARAG_PARIKH_FLEXI_CAP],
      fundTwo: mockFundsMap[MOCK_FUND.PARAG_PARIKH_FLEXI_CAP],
      expected: '100.00',
    },
  ])(
    "result is as expected for the input funds, '$fundOne.name' & '$fundTwo.name'",
    ({ fundOne, fundTwo, expected }) => {
      // act
      const result = overlapHelper.calculateOverlap(fundOne, fundTwo);
      // assert
      expect(result).toBe(expected);
    }
  );

  it.each([
    {
      fundOne: mockFundsMap[MOCK_FUND.AXIS_BLUECHIP],
      fundTwo: null,
    },
    {
      fundOne: null,
      fundTwo: mockFundsMap[MOCK_FUND.AXIS_BLUECHIP],
    },
    {
      fundOne: null,
      fundTwo: null,
    },
  ])('throws error for invalid fund', ({ fundOne, fundTwo }) => {
    let thrownError;

    // act
    try {
      overlapHelper.calculateOverlap(fundOne, fundTwo);
    } catch (error) {
      thrownError = error;
    }

    // assert
    expect(thrownError.name).toEqual('TypeError');
    expect(thrownError.message).toEqual(
      "Cannot read properties of null (reading 'stocks')"
    );
  });
});

describe('print overlaps', () => {
  test.each([
    {
      fundName: 'fund1',
      overlaps: [{ fundName: 'fund2', percentage: '10' }],
    },
    {
      fundName: 'fund1',
      overlaps: [
        { fundName: 'fund2', percentage: '30' },
        { fundName: 'fund3', percentage: '10' },
      ],
    },
  ])('Console log should have been called', ({ fundName, overlaps }) => {
    // arrange
    const logSpy = jest.spyOn(global.console, 'log');

    // act
    overlapHelper.printOverlaps(fundName, overlaps);

    // assert
    expect(logSpy).toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledTimes(overlaps.length);
    overlaps.forEach((overlap) => {
      expect(logSpy).toHaveBeenCalledWith(
        fundName,
        overlap.fundName,
        `${overlap.percentage}%`
      );
      expect(logSpy.mock.calls).toContainEqual([
        fundName,
        overlap.fundName,
        `${overlap.percentage}%`,
      ]);
    });

    logSpy.mockRestore();
  });

  test.each([
    {
      overlaps: null,
      errorMessage: 'overlaps is not iterable',
      consoleCall: 0,
    },
    {
      overlaps: [null, { fundName: 'fund2', percentage: '10' }],
      errorMessage: 'Cannot read properties of null',
      consoleCall: 0,
    },
    {
      overlaps: [{ fundName: 'fund2', percentage: '10' }, null],
      errorMessage: 'Cannot read properties of null',
      consoleCall: 1,
    },
  ])(
    'Console log should not be called for invalid input',
    ({ overlaps, errorMessage, consoleCall }) => {
      // arrange
      const logSpy = jest.spyOn(global.console, 'log');

      let thrownError;

      // act
      try {
        overlapHelper.printOverlaps('fundName', overlaps);
      } catch (error) {
        thrownError = error;
      }

      // assert
      expect(thrownError.name).toEqual('TypeError');
      expect(thrownError.message).toContain(errorMessage);
      expect(logSpy).toHaveBeenCalledTimes(consoleCall);

      logSpy.mockRestore();
    }
  );
});
