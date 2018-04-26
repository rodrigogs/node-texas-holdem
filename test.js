/* eslint-disable padded-blocks,no-restricted-syntax */

const os = require('os');
const { stdout } = require('test-console');
const chai = require('chai');
const stdin = require('mock-stdin').stdin();

// For some strange reason the stdin is mixing with stdout when using mock-stdin with test-console.
const normalizeLines = (lines) => {
  const output = [];
  for (const line of lines) {
    if (line.length === 1) continue;
    if (line === os.EOL) continue;

    output.push(line);
  }

  return output;
};

const delay = millis => new Promise((resolve) => {
  setTimeout(resolve, millis);
});

const program = require('./src');

before(() => {
  chai.should();
});

describe('node-texas-holdem', () => {

  it('should inform 4 players and get results', async () => {
    const inspect = stdout.inspect();

    program();

    process.nextTick(() => stdin.send(`KS AD 3H 7C TD${os.EOL}`));

    await delay(50);

    process.nextTick(() => stdin.send(`John 9H 7S${os.EOL}`));

    await delay(50);

    process.nextTick(() => stdin.send(`Sam AC KH${os.EOL}`));

    await delay(50);

    process.nextTick(() => stdin.send(`Becky JD QC${os.EOL}`));

    await delay(50);

    process.nextTick(() => stdin.send(`Y${os.EOL}`));

    await delay(50);

    process.nextTick(() => stdin.send(`Rodrigo AS KC${os.EOL}`));

    await delay(50);

    process.nextTick(() => stdin.send(`n${os.EOL}`));

    await delay(200);

    inspect.restore();

    const output = normalizeLines(inspect.output);

    console.log(output);

    output.should.be.an('array').to.have.lengthOf(11);
    output[0].should.be.a('string').equals(`Insert community cards:${os.EOL}`);
    output[1].should.be.a('string').equals(`Insert hand for player 1:${os.EOL}`);
    output[2].should.be.a('string').equals(`Insert hand for player 2:${os.EOL}`);
    output[3].should.be.a('string').equals(`Insert hand for player 3:${os.EOL}`);
    output[4].should.be.a('string').equals(`Do you want to add another player? (Y/n)${os.EOL}`);
    output[5].should.be.a('string').equals(`Insert hand for player 4:${os.EOL}`);
    output[6].should.be.a('string').equals(`Do you want to add another player? (Y/n)${os.EOL}`);
    output[7].should.be.a('string').equals(`1: Sam Two Pairs Ace of Clubs, King of Hearts, 3 of Hearts${os.EOL}`);
    output[8].should.be.a('string').equals(`2: Rodrigo Two Pairs Ace of Spades, King of Clubs, 3 of Hearts${os.EOL}`);
    output[9].should.be.a('string').equals(`3: John Pair King of Spades, 10 of Diamonds, 9 of Hearts${os.EOL}`);
    output[10].should.be.a('string').equals(`4: Becky High Card ${os.EOL}`);
  });

});
