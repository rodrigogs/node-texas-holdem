/* eslint-disable padded-blocks */

const os = require('os');
const { stdout } = require('test-console');
const chai = require('chai');
const stdin = require('mock-stdin').stdin();

const delay = millis => new Promise((resolve) => {
  setTimeout(resolve, millis);
});

const program = require('./src');

before(() => {
  chai.should();
});

describe('node-texas-holdem', () => {

  it('should inform 3 players and get results', async () => {
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

    await delay(50);

    inspect.restore();

    inspect.output.should.be.an('array').to.have.lengthOf(11);
    inspect.output[0].should.be.a('string').equals(`Insert community cards:${os.EOL}`);
    inspect.output[1].should.be.a('string').equals(`Insert hand for player 1:${os.EOL}`);
    inspect.output[2].should.be.a('string').equals(`Insert hand for player 2:${os.EOL}`);
    inspect.output[3].should.be.a('string').equals(`Insert hand for player 3:${os.EOL}`);
    inspect.output[4].should.be.a('string').equals(`Do you want to add another player? (Y/n)${os.EOL}`);
    inspect.output[5].should.be.a('string').equals(`Insert hand for player 4:${os.EOL}`);
    inspect.output[6].should.be.a('string').equals(`Do you want to add another player? (Y/n)${os.EOL}`);
    inspect.output[7].should.be.a('string').equals(`1: Sam Two Pairs Ace of Clubs, King of Hearts, 3 of Hearts${os.EOL}`);
    inspect.output[8].should.be.a('string').equals(`2: Rodrigo Two Pairs Ace of Spades, King of Clubs, 3 of Hearts${os.EOL}`);
    inspect.output[9].should.be.a('string').equals(`3: John Pair King of Spades, 10 of Diamonds, 9 of Hearts${os.EOL}`);
    inspect.output[10].should.be.a('string').equals(`4: Becky High Card ${os.EOL}`);
  });

});
