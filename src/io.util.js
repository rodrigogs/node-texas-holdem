const readline = require('readline');
const os = require('os');

const { stdin, stdout } = process;

const io = readline.createInterface({
  input: stdin,
  output: stdout,
});

/**
 * @param {String} phrase Phrase to be spoken.
 */
const talk = (phrase) => {
  if (!phrase) return;
  stdout.write(`${phrase}${os.EOL}`);
};

/**
 * @return {Promise<String>}
 */
const hear = () => new Promise((resolve) => {
  io.once('line', resolve);
});

/**
 * @param {String} phrase Question phrase.
 * @param {Boolean} [allowNoAnswer = false] Allow an empty answer.
 * @return {Promise<String>}
 */
const prompt = async (phrase, allowNoAnswer = false) => {
  talk(phrase);

  const answer = (await hear()).trim();
  if (!answer && !allowNoAnswer) {
    await prompt(`${phrase}`);
  }

  return answer;
};

/**
 * @param {String} phrase Question phrase.
 * @return {Promise<Boolean>}
 */
const promptYN = async (phrase) => {
  const answer = await prompt(`${phrase} (Y/n)`, true);

  if (['Y', 'N'].indexOf(answer.toUpperCase()) === -1) {
    talk(`Invalid answer "${answer}"`);
    return promptYN(phrase);
  }

  return answer.toUpperCase() === 'Y';
};

module.exports = {
  talk,
  prompt,
  promptYN,
};
