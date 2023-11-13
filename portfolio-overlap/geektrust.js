const fs = require('fs');
const { processInput, arrangeStocksData } = require('./src/process');

const filename = process.argv[2];

fs.readFile(filename, 'utf8', (err, data) => {
  arrangeStocksData().then(() => {
    if (err) throw err;
    var inputLines = data.toString().split('\n');
    for (const inputLine of inputLines) {
      const commandLine = inputLine.replace(/[\r\n]/g, '');
      processInput(commandLine);
    }
  });
});
