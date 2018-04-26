const { CARD_TYPES } = require('./constants.json');

const getCard = (card) => {
  const cardParts = card.split('');
  const facePart = cardParts[0];
  const suitPart = cardParts[1];

  const face = CARD_TYPES.FACES[facePart];
  const suit = CARD_TYPES.SUITS[suitPart];

  if (!face || !suit) {
    throw new Error(`Invalid card combination for face "${facePart}" and suit "${suitPart}"`);
  }

  return { face, suit };
};

const isSameFace = (card1, card2) => card1.face.value === card2.face.value;

const isSameSuit = (card1, card2) => card1.face === card2.face;

const isAce = card => card.face === CARD_TYPES.FACES.A;

const isAllSameSuit = (cards) => {
  return cards.reduce((acc, curr) => {
    if (!acc.value) return acc;
    if (!acc.last) {
      acc.last = curr; return acc;
    }
    if (!isSameSuit(acc.last, curr)) {
      acc.value = false;
    }
    return acc;
  }, { value: true, last: null }).value;
};

const isAllSameFace = (cards) => {
  return cards.reduce((acc, curr) => {
    if (!acc.value) return acc;
    if (!acc.last) {
      acc.last = curr; return acc;
    }
    if (!isSameFace(acc.last, curr)) {
      acc.value = false;
    }
    return acc;
  }, { value: true, last: null }).value;
};

module.exports = {
  getCard,
  isSameFace,
  isAllSameFace,
  isAllSameSuit,
  isAce,
};
