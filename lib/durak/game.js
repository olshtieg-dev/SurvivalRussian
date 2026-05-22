const { INVALID_MOVE } = require('boardgame.io/core');

const GAME_NAME = 'durak';
const DEFAULT_SEED = 'durak-v1';
const CARD_SUITS = ['spades', 'hearts', 'diamonds', 'clubs'];
const CARD_RANKS = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const RULE_MODES = {
  Standard: { handLimit: 6, label: 'Стандарт' },
  Professional: { handLimit: 3, label: 'Профессионал' },
};
const DEFAULT_RULE_MODE = 'Standard';
const DEFAULT_SEAT_NAMES = ['Борис', 'Саша', 'Иван', 'Анна', 'Олег', 'Мария'];
const SUIT_SYMBOLS = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
};
const SUIT_ART = {
  spades: ['  /\\  ', ' /  \\ ', ' \\  / ', '  \\/  '],
  hearts: [' _  _ ', '( \\/ )', ' \\  / ', '  \\/  '],
  diamonds: ['  /\\  ', ' /  \\ ', ' \\  / ', '  \\/  '],
  clubs: ['  _   ', ' ( )  ', '/| |\\ ', '  |   '],
};
const RANK_VALUE = CARD_RANKS.reduce((acc, rank, index) => {
  acc[rank] = index + 6;
  return acc;
}, {});

function normalizeRuleMode(ruleMode) {
  return RULE_MODES[ruleMode] ? ruleMode : DEFAULT_RULE_MODE;
}

function getRuleModeConfig(ruleMode) {
  return RULE_MODES[normalizeRuleMode(ruleMode)];
}

function createCard(suit, rank) {
  return {
    id: `${suit}-${rank}`,
    suit,
    rank,
    value: RANK_VALUE[rank],
    symbol: SUIT_SYMBOLS[suit],
    label: `${rank}${SUIT_SYMBOLS[suit]}`,
  };
}

function createDeck() {
  return CARD_SUITS.flatMap((suit) => CARD_RANKS.map((rank) => createCard(suit, rank)));
}

function cardLabel(card) {
  if (!card) return '';
  return `${card.rank}${SUIT_SYMBOLS[card.suit]}`;
}

function getSuitArt(suit) {
  return SUIT_ART[suit] || ['  ??  ', '  ??  ', '  ??  ', '  ??  '];
}

function getNextPlayerID(ctx, playerID) {
  const playOrder = ctx.playOrder || [];

  if (!playOrder.length) return String(playerID || '0');

  const currentIndex = playOrder.indexOf(String(playerID));
  if (currentIndex === -1) return playOrder[0];

  return playOrder[(currentIndex + 1) % playOrder.length];
}

function getFirstCardInHand(hand, cardId) {
  const index = hand.findIndex((card) => card.id === cardId);
  if (index === -1) return null;
  return { index, card: hand[index] };
}

function isCardBeatingAttack(defenseCard, attackCard, trumpSuit) {
  if (!defenseCard || !attackCard) return false;

  const defenseIsTrump = defenseCard.suit === trumpSuit;
  const attackIsTrump = attackCard.suit === trumpSuit;

  if (defenseCard.suit === attackCard.suit) {
    return defenseCard.value > attackCard.value;
  }

  if (defenseIsTrump && !attackIsTrump) {
    return true;
  }

  return false;
}

function removeCardFromHand(hand, cardId) {
  const located = getFirstCardInHand(hand, cardId);
  if (!located) return null;

  hand.splice(located.index, 1);
  return located.card;
}

function refillHands(G, ctx, startPlayerID) {
  if (G.deck.length === 0) return;

  const playOrder = ctx.playOrder || [];
  if (!playOrder.length) return;

  const startingIndex = playOrder.indexOf(String(startPlayerID));
  const orderedPlayers =
    startingIndex === -1
      ? playOrder
      : [...playOrder.slice(startingIndex), ...playOrder.slice(0, startingIndex)];

  for (const playerID of orderedPlayers) {
    while (G.hands[playerID].length < G.handLimit && G.deck.length > 0) {
      G.hands[playerID].push(G.deck.shift());
    }
  }
}

function settleRoundIfNeeded(G, ctx) {
  if (G.roundResult) return;
  if (G.deck.length > 0) return;

  const playersWithCards = ctx.playOrder.filter((playerID) => G.hands[playerID].length > 0);
  if (playersWithCards.length > 1) return;

  const durakPlayerID = playersWithCards[0] ?? null;
  const winnerIDs = ctx.playOrder.filter((playerID) => playerID !== durakPlayerID);

  for (const playerID of winnerIDs) {
    G.tokens[playerID] = (G.tokens[playerID] || 0) + 1;
  }

  if (durakPlayerID !== null) {
    G.tokens[durakPlayerID] = (G.tokens[durakPlayerID] || 0) - winnerIDs.length;
  }

  G.roundResult = {
    durakPlayerID,
    winnerIDs,
    settledAt: Date.now(),
  };
  G.turnState.mode = 'roundOver';
  G.turnState.attackerID = null;
  G.turnState.defenderID = null;
}

function advanceTurnState(G, ctx, currentPlayerID) {
  const nextAttackerID = getNextPlayerID(ctx, currentPlayerID);
  G.turnState.mode = 'attack';
  G.turnState.attackerID = nextAttackerID;
  G.turnState.defenderID = getNextPlayerID(ctx, nextAttackerID);
}

function createTurnState(ctx) {
  const attackerID = ctx.playOrder[0] ?? '0';
  const defenderID = getNextPlayerID(ctx, attackerID);

  return {
    mode: 'attack',
    attackerID,
    defenderID,
    lastAction: 'start',
  };
}

function createPlayerTokens(numPlayers) {
  return Array.from({ length: numPlayers }).reduce((acc, _, index) => {
    acc[String(index)] = 0;
    return acc;
  }, {});
}

const durakGame = {
  name: GAME_NAME,
  seed: DEFAULT_SEED,
  minPlayers: 2,
  maxPlayers: 6,
  validateSetupData: (setupData) => {
    if (!setupData || typeof setupData !== 'object') return undefined;
    if (
      setupData.ruleMode !== undefined &&
      !RULE_MODES[setupData.ruleMode]
    ) {
      return 'Unknown Durak rule mode.';
    }
    return undefined;
  },
  setup: ({ ctx, random }, setupData = {}) => {
    const ruleMode = normalizeRuleMode(setupData.ruleMode);
    const { handLimit } = getRuleModeConfig(ruleMode);
    const shuffledDeck = random.Shuffle(createDeck());
    const trumpCard = shuffledDeck.pop() || null;
    const hands = Array.from({ length: ctx.numPlayers }, (_, index) => {
      const playerHand = [];
      for (let draw = 0; draw < handLimit; draw += 1) {
        const card = shuffledDeck.shift();
        if (!card) break;
        playerHand.push(card);
      }
      return playerHand;
    });

    return {
      ruleMode,
      handLimit,
      seatNames: Array.from({ length: ctx.numPlayers }, (_, index) =>
        DEFAULT_SEAT_NAMES[index] || `Игрок ${index + 1}`
      ),
      trump: trumpCard?.suit || null,
      trumpCard,
      deck: shuffledDeck,
      hands,
      table: [],
      discard: [],
      tokens: createPlayerTokens(ctx.numPlayers),
      roundNumber: 1,
      roundResult: null,
      turnState: createTurnState(ctx),
    };
  },
  moves: {
    attack({ G, ctx, playerID, events }, cardId) {
      if (G.roundResult) return INVALID_MOVE;
      if (G.turnState.mode !== 'attack') return INVALID_MOVE;
      if (String(playerID) !== String(G.turnState.attackerID)) return INVALID_MOVE;
      if (!cardId) return INVALID_MOVE;

      const attackCard = removeCardFromHand(G.hands[playerID], cardId);
      if (!attackCard) return INVALID_MOVE;

      G.table.push({
        attackBy: String(playerID),
        defendBy: null,
        attackCard,
        defendCard: null,
      });
      G.turnState.mode = 'defend';
      G.turnState.attackerID = String(playerID);
      G.turnState.defenderID = getNextPlayerID(ctx, playerID);
      G.turnState.lastAction = 'attack';

      events.endTurn({ next: G.turnState.defenderID });
    },
    defend({ G, ctx, playerID, events }, cardId) {
      if (G.roundResult) return INVALID_MOVE;
      if (G.turnState.mode !== 'defend') return INVALID_MOVE;
      if (String(playerID) !== String(G.turnState.defenderID)) return INVALID_MOVE;
      if (!cardId) return INVALID_MOVE;
      if (!G.table.length) return INVALID_MOVE;

      const pendingAttack = G.table.find((pair) => pair.defendCard === null);
      if (!pendingAttack) return INVALID_MOVE;

      const defenseCard = removeCardFromHand(G.hands[playerID], cardId);
      if (!defenseCard) return INVALID_MOVE;

      if (
        !isCardBeatingAttack(defenseCard, pendingAttack.attackCard, G.trump)
      ) {
        G.hands[playerID].push(defenseCard);
        return INVALID_MOVE;
      }

      pendingAttack.defendCard = defenseCard;
      pendingAttack.defendBy = String(playerID);
      G.discard.push(pendingAttack.attackCard, defenseCard);
      G.table = G.table.filter((pair) => pair !== pendingAttack);
      advanceTurnState(G, ctx, playerID);
      refillHands(G, ctx, G.turnState.attackerID);
      G.turnState.lastAction = 'defend';

      events.endTurn({ next: G.turnState.attackerID });
      settleRoundIfNeeded(G, ctx);
    },
    pass({ G, ctx, playerID, events }) {
      if (G.roundResult) return INVALID_MOVE;
      if (G.turnState.mode !== 'attack') return INVALID_MOVE;
      if (String(playerID) !== String(G.turnState.attackerID)) return INVALID_MOVE;

      advanceTurnState(G, ctx, playerID);
      refillHands(G, ctx, G.turnState.attackerID);
      G.turnState.lastAction = 'pass';

      events.endTurn({ next: G.turnState.attackerID });
      settleRoundIfNeeded(G, ctx);
    },
    take({ G, ctx, playerID, events }) {
      if (G.roundResult) return INVALID_MOVE;
      if (G.turnState.mode !== 'defend') return INVALID_MOVE;
      if (String(playerID) !== String(G.turnState.defenderID)) return INVALID_MOVE;
      if (!G.table.length) return INVALID_MOVE;

      const collectedCards = [];
      for (const pair of G.table) {
        if (pair.attackCard) collectedCards.push(pair.attackCard);
        if (pair.defendCard) collectedCards.push(pair.defendCard);
      }

      G.hands[playerID].push(...collectedCards);
      G.table = [];
      advanceTurnState(G, ctx, playerID);
      refillHands(G, ctx, G.turnState.attackerID);
      G.turnState.lastAction = 'take';

      events.endTurn({ next: G.turnState.attackerID });
      settleRoundIfNeeded(G, ctx);
    },
  },
};

module.exports = {
  GAME_NAME,
  DEFAULT_SEED,
  CARD_SUITS,
  CARD_RANKS,
  RULE_MODES,
  DEFAULT_RULE_MODE,
  DEFAULT_SEAT_NAMES,
  SUIT_SYMBOLS,
  SUIT_ART,
  durakGame,
  createCard,
  createDeck,
  cardLabel,
  getSuitArt,
  getRuleModeConfig,
  getNextPlayerID,
  isCardBeatingAttack,
};
