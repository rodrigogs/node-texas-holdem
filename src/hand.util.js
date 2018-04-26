const { getUniqueCombinations } = require('./array.util');
const {
  isSameFace,
  isAce,
  isAllSameSuit,
  isAllSameFace,
} = require('./card.util');

const compareStraightFlush = (straightFlush1, straightFlush2) => {
  const isAceHigh1 = isAce(straightFlush1.cards[straightFlush1.cards.length - 1]);
  const isAceHigh2 = isAce(straightFlush2.cards[straightFlush2.cards.length - 1]);
  const val1 = straightFlush1.cards.reduce((acc, curr) => acc + curr.face.value, isAceHigh1 ? 1 : 0);
  const val2 = straightFlush2.cards.reduce((acc, curr) => acc + curr.face.value, isAceHigh2 ? 1 : 0);

  if (val1 === val2) return 0;
  return (val1 > val2) ? 1 : -1;
};

const compareFourOfAKind = (fourOfAKind1, fourOfAKind2) => {
  const kicker1 = fourOfAKind1.kickers[0].face.value;
  const kicker2 = fourOfAKind1.kickers[0].face.value;
  let val1 = fourOfAKind2.cards.reduce((acc, curr) => acc + curr.face.value, 0);
  let val2 = fourOfAKind2.cards.reduce((acc, curr) => acc + curr.face.value, 0);

  if (val1 === val2) {
    val1 += kicker1;
    val2 += kicker2;
  }

  if (val1 === val2) return 0;
  return (val1 > val2) ? 1 : -1;
};

const compareFullHouse = (fullHouse1, fullHouse2) => {
  let higher1 = fullHouse1.cards
    .reduce((acc, curr) => {
      return (acc.face.value > curr.face.value) ? acc : curr;
    }, { face: { value: 0 } }).face.value;

  let higher2 = fullHouse1.cards
    .reduce((acc, curr) => {
      return (acc.face.value > curr.face.value) ? acc : curr;
    }, { face: { value: 0 } }).face.value;

  const lower1 = fullHouse1.cards
    .reduce((acc, curr) => {
      return (acc.face.value < curr.face.value) ? acc : curr;
    }, { face: { value: Number.MAX_VALUE } }).face.value;

  const lower2 = fullHouse2.cards
    .reduce((acc, curr) => {
      return (acc.face.value < curr.face.value) ? acc : curr;
    }, { face: { value: Number.MAX_VALUE } }).face.value;

  if (higher1 === higher2) {
    higher1 += lower1;
    higher2 += lower2;
  }

  if (higher1 === higher2) return 0;
  return (higher1 > higher2) ? 1 : -1;
};

const compareFlush = (flush1, flush2) => {
  const reverse1 = [...flush1.cards].reverse();
  const reverse2 = [...flush2.cards].reverse();

  let result = 0;
  for (let i = 0, len = 5; i < len; i += 1) {
    const val1 = reverse1[i].face.value;
    const val2 = reverse2[i].face.value;

    if (val1 > val2) {
      result = 1;
      break;
    } else if (val1 < val2) {
      result = -1;
      break;
    }
  }

  return result;
};

const compareStraight = (straight1, straight2) => {
  const isAceHigh1 = isAce(straight1.cards[straight1.cards.length - 1]);
  const isAceHigh2 = isAce(straight2.cards[straight2.cards.length - 1]);
  const val1 = straight1.cards.reduce((acc, curr) => acc + curr.face.value, isAceHigh1 ? 1 : 0);
  const val2 = straight2.cards.reduce((acc, curr) => acc + curr.face.value, isAceHigh2 ? 1 : 0);

  if (val1 === val2) return 0;
  return (val1 > val2) ? 1 : -1;
};

const compareThreeOfaKind = (threeOfaKind1, threeOfaKind2) => {
  const kickers1 = threeOfaKind1.kickers.sort((a, b) => b.face.value - a.face.value);
  const kickers2 = threeOfaKind2.kickers.sort((a, b) => b.face.value - a.face.value);
  let val1 = threeOfaKind1.cards.reduce((acc, curr) => acc + curr.face.value, 0);
  let val2 = threeOfaKind2.cards.reduce((acc, curr) => acc + curr.face.value, 0);

  if (val1 === val2) {
    val1 += kickers1.reduce((acc, curr) => acc + curr.face.value, 0);
    val2 += kickers2.reduce((acc, curr) => acc + curr.face.value, 0);
  }

  if (val1 === val2) return 0;
  return (val1 > val2) ? 1 : -1;
};

const compareTwoPairs = (pairs1, pairs2) => {
  const kicker1 = pairs1.kickers[0];
  const kicker2 = pairs2.kickers[0];
  let val1 = pairs1.cards.reduce((acc, curr) => acc + curr
    .reduce((acc, curr) => acc + curr.face.value, 0), 0);
  let val2 = pairs2.cards.reduce((acc, curr) => acc + curr
    .reduce((acc, curr) => acc + curr.face.value, 0), 0);

  if (val1 === val2) {
    val1 += kicker1.face.value;
    val2 += kicker2.face.value;
  }

  if (val1 === val2) return 0;
  return (val1 > val2) ? 1 : -1;
};

const comparePair = (pair1, pair2) => {
  const kickers1 = pair1.kickers.sort((a, b) => b.face.value - a.face.value);
  const kickers2 = pair2.kickers.sort((a, b) => b.face.value - a.face.value);
  let val1 = pair1.cards[1].face.value;
  let val2 = pair2.cards[1].face.value;

  if (val1 === val2 && kickers2[0]) {
    val1 += kickers1[0].face.value;
    val2 += kickers2[0].face.value;
  }

  if (val1 === val2 && kickers2[1]) {
    val1 += kickers1[1].face.value;
    val2 += kickers2[1].face.value;
  }

  if (val1 === val2 && kickers2[2]) {
    val1 += kickers1[2].face.value;
    val2 += kickers2[2].face.value;
  }

  if (val1 === val2) return 0;
  return (val1 > val2) ? 1 : -1;
};

const compareHighCard = (highCard1, highCard2) => {
  const val1 = highCard1.cards.reduce((acc, curr) => acc + curr.face.value, 0);
  const val2 = highCard2.cards.reduce((acc, curr) => acc + curr.face.value, 0);

  if (val1 === val2) return 0;
  return (val1 > val2) ? 1 : -1;
};

const compareHands = (hand1, hand2) => {
  if (hand1.description !== hand2.description) throw new Error('Invalid comparation');

  if (hand1.description === 'Straight Flush') {
    return compareStraightFlush(hand1, hand2);
  }
  if (hand1.description === 'Four of a Kind') {
    return compareFourOfAKind(hand1, hand2);
  }
  if (hand1.description === 'Full House') {
    return compareFullHouse(hand1, hand2);
  }
  if (hand1.description === 'Flush') {
    return compareFlush(hand1, hand2);
  }
  if (hand1.description === 'Straight') {
    return compareStraight(hand1, hand2);
  }
  if (hand1.description === 'Three of a Kind') {
    return compareThreeOfaKind(hand1, hand2);
  }
  if (hand1.description === 'Two Pairs') {
    return compareTwoPairs(hand1, hand2);
  }
  if (hand1.description === 'Pair') {
    return comparePair(hand1, hand2);
  }
  if (hand1.description === 'High Card') {
    return compareHighCard(hand1, hand2);
  }
};

/**
 * Five cards of the same suit in sequence - such as clubJ-club10-club9-club8-club7. Between two straight flushes,
 * the one containing the higher top card is higher. An ace can be counted as low,
 * so heart5-heart4-heart3-heart2-heartA is a straight flush, but its top card is the five, not the ace,
 * so it is the lowest type of straight flush. The cards cannot
 * "turn the corner": diamond4-diamond3-diamond2-diamondA-diamondK is not valid.
 */
const getStraightFlush = (cards) => {
  if (!isAllSameSuit(cards)) return null;

  const ordered = cards.sort((a, b) => a.face.value - b.face.value);
  const straigthFlush = [];

  const hasAce = isAce(ordered[ordered.length - 1]);
  const hasTwo = ordered[0].face.value === 2;

  for (let i = 0, len = ordered.length; i < len; i += 1) {
    const isFirstCard = i === 0;
    const currentCard = ordered[i];
    const nextCard = ordered[i + 1];

    if (nextCard && (currentCard.face.value + 1 !== nextCard.face.value)) {
      break;
    }

    if (isFirstCard && hasTwo && hasAce) { // in this condition two has to be the current card
      straigthFlush.push(ordered[ordered.length - 1]);
    }

    straigthFlush.push(currentCard);
  }

  if (straigthFlush.length < 5) return null;
  return {
    cards: straigthFlush,
    kickers: [],
  };
};

/**
 * Four cards of the same rank - such as four queens. The fifth card can be anything. This combination is
 * sometimes known as "quads", and in some parts of Europe it is called a "poker", though this term for it is
 * unknown in English. Between two fours of a kind, the one with the higher set of four cards is
 * higher - so 3-3-3-3-A is beaten by 4-4-4-4-2. It can't happen in standard poker, but if in some other game you
 * need to compare two fours of a kind where the sets of four cards are of the same rank,
 * then the one with the higher fifth card is better.
 */
const getFourOfAKind = (cards) => {
  const fourOfAKind = cards
    .map((card, index) => {
      const sameFaces = cards.filter((candidate, cIndex) => {
        const isSameCard = card === candidate;
        const isDuplicated = cIndex < index;
        return !isSameCard && !isDuplicated && isSameFace(card, candidate);
      });
      return [card, ...sameFaces];
    })
    .filter(fourOfAKind => fourOfAKind.length === 4);

  if (fourOfAKind.length !== 1) return null;
  return {
    cards: fourOfAKind,
    kickers: cards.filter(card => fourOfAKind.indexOf(card) === -1),
  };
};

/**
 * This consists of three cards of one rank and two cards of another rank - for example
 * three sevens and two tens (colloquially known as "sevens full" or more specifically "sevens on tens").
 * When comparing full houses, the rank of the three cards determines which is higher.
 * For example 9-9-9-4-4 beats 8-8-8-A-A. If the threes of a kind were equal, the rank of the pairs would decide.
 */
const getFullHouse = (cards) => {
  if (isAllSameFace(cards)) return null;

  const ordered = cards.sort((a, b) => a.face.value - b.face.value);
  const fullHouse = {
    three: null,
    two: null,
  };

  for (let i = 0, len = ordered.length; i < len; i += 1) {
    const currentCard = ordered[i];
    const temp = [];

    for (let j = 0, l = ordered.length; j < l; j += 1) {
      const comparationCard = ordered[j];
      if (isSameFace(currentCard, comparationCard)) temp.push(currentCard);
    }

    if (temp.length === 3 && !fullHouse.three) fullHouse.three = temp;
    if (temp.length === 2 && !fullHouse.two) fullHouse.two = temp;
  }

  if (!fullHouse.three || !fullHouse.two) return null;
  return {
    cards: fullHouse,
    kickers: [],
  };
};

/**
 * Five cards of the same suit. When comparing two flushes, the highest card determines which is higher.
 * If the highest cards are equal then the second highest card is compared; if those are equal too,
 * then the third highest card, and so on. For example spadeK-spadeJ-spade9-spade3-spade2 beats
 * diamondK-diamondJ-diamond7-diamond6-diamond5 because the nine beats the seven.
 */
const getFlush = (cards) => {
  if (!isAllSameSuit(cards)) return null;

  cards.sort((a, b) => a.face.value - b.face.value);

  return {
    cards,
    kickers: [],
  };
};

/**
 * Five cards of mixed suits in sequence - for example spadeQ-diamondJ-heart10-spade9-clubs8.
 * When comparing two sequences, the one with the higher ranking top card is better. Ace can count high or
 * low in a straight, but not both at once, so A-K-Q-J-10 and 5-4-3-2-A are valid straights,
 * but 2-A-K-Q-J is not. 5-4-3-2-A is the lowest kind of straight, the top card being the five.
 */
const getStraight = (cards) => {
  if (isAllSameSuit(cards)) return null;

  const ordered = cards.sort((a, b) => a.face.value - b.face.value);
  const straigth = [];

  const hasAce = isAce(ordered[ordered.length - 1]);
  const hasTwo = ordered[0].face.value === 2;

  for (let i = 0, len = ordered.length; i < len; i += 1) {
    const isFirstCard = i === 0;
    const currentCard = ordered[i];
    const nextCard = ordered[i + 1];

    if (nextCard && (currentCard.face.value + 1 !== nextCard.face.value)) {
      break;
    }

    if (isFirstCard && hasTwo && hasAce) { // in this condition two has to be the current card
      straigth.push(ordered[ordered.length - 1]);
    }

    straigth.push(currentCard);
  }

  if (straigth.length < 5) return null;
  return {
    cards: straigth,
    kickers: [],
  };
};

/**
 * Three cards of the same rank plus two other cards. This combination is also known as Triplets or Trips.
 * When comparing two threes of a kind the hand in which the three equal cards are of higher rank is better.
 * So for example 5-5-5-3-2 beats 4-4-4-K-Q. If you have to compare two threes of a kind where the sets of
 * three are of equal rank, then the higher of the two remaining cards in each hand are compared,
 * and if those are equal, the lower odd card is compared.
 */
const getThreeOfaKind = (cards) => {
  const threeOfaKind = cards
    .map((card, index) => {
      const sameFaces = cards.filter((candidate, cIndex) => {
        const isSameCard = card === candidate;
        const isDuplicated = cIndex < index;
        return !isSameCard && !isDuplicated && isSameFace(card, candidate);
      });
      return [card, ...sameFaces];
    })
    .filter(threeOfaKind => threeOfaKind.length === 3);

  if (threeOfaKind.length !== 1) return null;
  return {
    cards: threeOfaKind,
    kickers: cards.filter(card => threeOfaKind.indexOf(card) === -1),
  };
};

/**
 * A pair is two cards of equal rank. In a hand with two pairs, the two pairs are of different ranks
 * (otherwise you would have four of a kind), and there is an odd card to make the hand up to five cards.
 * When comparing hands with two pairs, the hand with the highest pair wins, irrespective of the rank of the
 * other cards - so J-J-2-2-4 beats 10-10-9-9-8 because the jacks beat the tens. If the higher pairs are equal,
 * the lower pairs are compared, so that for example 8-8-6-6-3 beats 8-8-5-5-K. Finally, if both pairs are the same,
 * the odd cards are compared, so Q-Q-5-5-8 beats Q-Q-5-5-4.
 */
const getTwoPairs = (cards) => {
  let pairs = cards
    .map((card, index) => {
      const sameFaces = cards.filter((candidate, cIndex) => {
        const isSameCard = card === candidate;
        const isDuplicated = cIndex < index;
        return !isSameCard && !isDuplicated && isSameFace(card, candidate);
      });
      return [card, ...sameFaces];
    });

  if (pairs.filter(pair => pair.length === 2).length !== 2) return null;
  if (pairs.find(pair => pair.length > 2)) return null;

  pairs = pairs.filter(pair => pair.length === 2);

  return {
    cards: pairs,
    kickers: cards.filter(card => !pairs.filter(pair => pair.indexOf(card) === 1).length),
  };
};

/**
 * A pair is a hand with two cards of equal rank and three other cards which do not match these or each other.
 * When comparing two such hands, the hand with the higher pair is better - so for example 6-6-4-3-2 beats 5-5-A-K-Q.
 * If the pairs are equal, compare the highest ranking odd cards from each hand;
 * if these are equal compare the second highest odd card, and if these are equal too compare the lowest odd cards.
 * So J-J-A-9-3 beats J-J-A-8-7 because the 9 beats the 8.
 */
const getPair = (cards) => {
  const pairs = cards
    .map((card, index) => {
      const sameFaces = cards.filter((candidate, cIndex) => {
        const isSameCard = card === candidate;
        const isDuplicated = cIndex < index;
        return !isSameCard && !isDuplicated && isSameFace(card, candidate);
      });
      return [card, ...sameFaces];
    })
    .filter(pair => pair.length === 2);

  if (pairs.length !== 1) return null;
  return {
    cards: pairs[0],
    kickers: cards.filter(card => pairs[0].indexOf(card) === -1),
  };
};

const findBestStraightFlush = (communityCards, cards) => {
  let bestSoFar;
  const combGen = getUniqueCombinations(cards, communityCards, 3, true);

  let done = false;
  do {
    const comb = combGen.next();
    if (comb.done) {
      done = true;
      continue;
    }

    comb.hand = getStraightFlush(comb.value);
    if (!comb.hand) continue;

    comb.hand.description = 'Straight Flush';
    comb.rank = 8;

    if (!bestSoFar || compareStraightFlush(comb.hand, bestSoFar.hand) === 1) {
      bestSoFar = comb;
    }
  } while (!done);

  return bestSoFar;
};

const findBestFourOfAKind = (communityCards, cards) => {
  let bestSoFar;
  const combGen = getUniqueCombinations(cards, communityCards, 3, true);

  let done = false;
  do {
    const comb = combGen.next();
    if (comb.done) {
      done = true;
      continue;
    }

    comb.hand = getFourOfAKind(comb.value);
    if (!comb.hand) continue;

    comb.hand.description = 'Four of a Kind';
    comb.rank = 7;

    if (!bestSoFar || compareFourOfAKind(comb.hand, bestSoFar.hand) === 1) {
      bestSoFar = comb;
    }
  } while (!done);

  return bestSoFar;
};

const findBestFullHouse = (communityCards, cards) => {
  let bestSoFar;
  const combGen = getUniqueCombinations(cards, communityCards, 3, true);

  let done = false;
  do {
    const comb = combGen.next();
    if (comb.done) {
      done = true;
      continue;
    }

    comb.hand = getFullHouse(comb.value);
    if (!comb.hand) continue;

    comb.hand.description = 'Full House';
    comb.rank = 6;

    if (!bestSoFar || compareFullHouse(comb.hand, bestSoFar.hand) === 1) {
      bestSoFar = comb;
    }
  } while (!done);

  return bestSoFar;
};

const findBestFlush = (communityCards, cards) => {
  let bestSoFar;
  const combGen = getUniqueCombinations(cards, communityCards, 3, true);

  let done = false;
  do {
    const comb = combGen.next();
    if (comb.done) {
      done = true;
      continue;
    }

    comb.hand = getFlush(comb.value);
    if (!comb.hand) continue;

    comb.hand.description = 'Flush';
    comb.rank = 5;

    if (!bestSoFar || compareFlush(comb.hand, bestSoFar.hand) === 1) {
      bestSoFar = comb;
    }
  } while (!done);

  return bestSoFar;
};

const findBestStraight = (communityCards, cards) => {
  let bestSoFar;
  const combGen = getUniqueCombinations(cards, communityCards, 3, true);

  let done = false;
  do {
    const comb = combGen.next();
    if (comb.done) {
      done = true;
      continue;
    }

    comb.hand = getStraight(comb.value);
    if (!comb.hand) continue;

    comb.hand.description = 'Straight';
    comb.rank = 4;

    if (!bestSoFar || compareStraight(comb.hand, bestSoFar.hand) === 1) {
      bestSoFar = comb;
    }
  } while (!done);

  return bestSoFar;
};

const findBestThreeOfaKind = (communityCards, cards) => {
  let bestSoFar;
  const combGen = getUniqueCombinations(cards, communityCards, 3, true);

  let done = false;
  do {
    const comb = combGen.next();
    if (comb.done) {
      done = true;
      continue;
    }

    comb.hand = getThreeOfaKind(comb.value);
    if (!comb.hand) continue;

    comb.hand.description = 'Three of a Kind';
    comb.rank = 3;

    if (!bestSoFar || compareThreeOfaKind(comb.hand, bestSoFar.hand) === 1) {
      bestSoFar = comb;
    }
  } while (!done);

  return bestSoFar;
};

const findBestTwoPairs = (communityCards, cards) => {
  let bestSoFar;
  const combGen = getUniqueCombinations(cards, communityCards, 3, true);

  let done = false;
  do {
    const comb = combGen.next();
    if (comb.done) {
      done = true;
      continue;
    }

    comb.hand = getTwoPairs(comb.value);
    if (!comb.hand) continue;

    comb.hand.description = 'Two Pairs';
    comb.rank = 2;

    if (!bestSoFar || compareTwoPairs(comb.hand, bestSoFar.hand) === 1) {
      bestSoFar = comb;
    }
  } while (!done);

  return bestSoFar;
};

const findBestPair = (communityCards, cards) => {
  let bestSoFar;
  const combGen = getUniqueCombinations(cards, communityCards, 3);

  let done = false;
  do {
    const comb = combGen.next();
    if (comb.done) {
      done = true;
      continue;
    }

    comb.hand = getPair(comb.value);
    if (!comb.hand) continue;

    comb.hand.description = 'Pair';
    comb.rank = 1;

    if (!bestSoFar || comparePair(comb.hand, bestSoFar.hand) === 1) {
      bestSoFar = comb;
    }
  } while (!done);

  return bestSoFar;
};

const findBestHighCard = (cards, communityCards) => {
  let bestSoFar;
  const combGen = getUniqueCombinations(cards, communityCards, 3);

  let done = false;
  do {
    const comb = combGen.next();
    if (comb.done) {
      done = true;
      continue;
    }

    comb.hand = {
      cards: comb.value,
      kickers: [],
    };

    comb.hand.description = 'High Card';
    comb.rank = 0;

    if (!bestSoFar || compareHighCard(comb.hand, bestSoFar.hand) === 1) {
      bestSoFar = comb;
    }
  } while (!done);

  return bestSoFar;
};

const findBestHand = (communityCards, cards) => {
  const straightFlush = findBestStraightFlush(communityCards, cards);
  if (straightFlush) return straightFlush;

  const fourOfAKind = findBestFourOfAKind(communityCards, cards);
  if (fourOfAKind) return fourOfAKind;

  const fullHouse = findBestFullHouse(communityCards, cards);
  if (fullHouse) return fullHouse;

  const flush = findBestFlush(communityCards, cards);
  if (flush) return flush;

  const straight = findBestStraight(communityCards, cards);
  if (straight) return straight;

  const threeOfaKind = findBestThreeOfaKind(communityCards, cards);
  if (threeOfaKind) return threeOfaKind;

  const twoPairs = findBestTwoPairs(communityCards, cards);
  if (twoPairs) return twoPairs;

  const pair = findBestPair(communityCards, cards);
  if (pair) return pair;

  return findBestHighCard(communityCards, cards);
};

module.exports = {
  findBestHand,
  compareHands,
};
