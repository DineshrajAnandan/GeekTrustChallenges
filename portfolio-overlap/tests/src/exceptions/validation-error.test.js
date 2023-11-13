const { ValidationError } = require('../../../src/exceptions');

test('custom error has proper name', () => {
  // arrange
  const message = 'test message';
  let thrownError;

  // act
  try {
    throw new ValidationError(message);
  } catch (error) {
    thrownError = error;
  }

  // assert
  expect(thrownError.name).toEqual('ValidationError');
  expect(thrownError.message).toEqual(message);
});
