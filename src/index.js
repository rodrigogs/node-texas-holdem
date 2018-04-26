require('./polifill');

const { RULES } = require('./constants.json');
const { prompt, promptYN, talk } = require('./io.util');
const { getCard } = require('./card.util');
const { compareHands, findBestHand } = require('./hand.util');

const createError = (message) => {
  throw new Error(message);
};

const getCommunityCards = async () => {
  const input = await prompt('Insert community cards:');

  try {
    const cards = input.trim().split(' ');

    if (cards.length !== RULES.COMMUNITY_CARDS) {
      createError(`Community cards are ${RULES.COMMUNITY_CARDS}, you entered ${cards.length}`);
    }

    return cards.map(getCard);
  } catch (err) {
    talk(err.message);
    return getCommunityCards();
  }
};

const getPlayer = async (n) => {
  const input = await prompt(`Insert hand for player ${n}:`);

  try {
    const playerParts = input.split(' ');
    const player = {
      name: playerParts[0],
      cards: playerParts.slice(1).map(getCard),
    };

    if (player.cards.length !== RULES.HAND_CARDS) {
      createError(`Each player must receive ${RULES.HAND_CARDS} cards, you gave ${player.cards.length}`);
    }

    return player;
  } catch (err) {
    talk(err.message);
    return getPlayer(n);
  }
};

const getPlayers = async (players = []) => {
  if (players.length < RULES.MAX_PLAYERS) {
    if (players.length > RULES.MIN_PLAYERS) {
      if (!await promptYN('Do you want to add another player?')) {
        return players;
      }
    }

    players.push(await getPlayer(players.length + 1));
    return getPlayers(players);
  }

  return players;
};

const program = async () => {
  const communityCards = await getCommunityCards();
  const players = await getPlayers();

  players.forEach((player) => {
    player.bestGame = findBestHand(communityCards, player.cards);
  });

  const ranking = [...players].sort((a, b) => {
    return b.bestGame.rank - a.bestGame.rank;
  }).sort((a, b) => {
    if (b.bestGame.rank === a.bestGame.rank) return compareHands(b.bestGame.hand, a.bestGame.hand);
    return b.bestGame.rank - a.bestGame.rank;
  });

  ranking.forEach((player, index) => {
    const kickers = `${player.bestGame.hand.kickers.map(k => `${k.face.label} of ${k.suit}`).join(', ')}`;
    talk(`${index + 1}: ${player.name} ${player.bestGame.hand.description} ${kickers}`);
  });
};

module.exports = program;
