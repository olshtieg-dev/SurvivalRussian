'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Client } from 'boardgame.io/react';
import { Local, SocketIO } from 'boardgame.io/multiplayer';
import { MCTSBot, RandomBot } from 'boardgame.io/ai';
import {
  AlertCircle,
  BadgeInfo,
  CirclePlay,
  Clock3,
  Crown,
  Shuffle,
  Users,
  Wifi,
  WifiOff,
} from 'lucide-react';

const {
  DEFAULT_RULE_MODE,
  PROFESSIONAL_MATCH_ID,
  STANDARD_MATCH_ID,
  SUIT_SYMBOLS,
  cardLabel,
  durakGame,
} = require('../../lib/durak/game');

const DURAK_SERVER = 'localhost:4001';
const STORAGE_KEY = 'survival-russian-durak-ui-v1';
const SEAT_NAMES = ['Alice', 'Bob', 'Charlie'];
const DIFFICULTIES = ['Easy', 'Normal', 'Hard'];
const DIFFICULTY_DELAYS = {
  Easy: 2800,
  Normal: 2000,
  Hard: 1400,
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function seatLabelFromID(seatID) {
  return SEAT_NAMES[Number(seatID)] || `Player ${Number(seatID) + 1}`;
}

function suitColorClass(suit) {
  return suit === 'hearts' || suit === 'diamonds' ? 'text-rose-600' : 'text-slate-900';
}

function suitAccentClass(suit) {
  return suit === 'hearts' || suit === 'diamonds'
    ? 'border-rose-300 bg-rose-50'
    : 'border-slate-300 bg-slate-50';
}

function PracticeBotClass(difficulty) {
  const delay = DIFFICULTY_DELAYS[difficulty] ?? DIFFICULTY_DELAYS.Normal;

  switch (difficulty) {
    case 'Easy':
      return class EasyBot extends RandomBot {
        async play(state, playerID) {
          await sleep(delay);
          return super.play(state, playerID);
        }
      };
    case 'Hard':
      return class HardBot extends MCTSBot {
        constructor(opts) {
          super({ ...opts, iterations: 600, playoutDepth: 30 });
        }

        async play(state, playerID) {
          await sleep(delay);
          return super.play(state, playerID);
        }
      };
    case 'Normal':
    default:
      return class NormalBot extends MCTSBot {
        constructor(opts) {
          super({ ...opts, iterations: 180, playoutDepth: 20 });
        }

        async play(state, playerID) {
          await sleep(delay);
          return super.play(state, playerID);
        }
      };
  }
}

function createPracticeBots(humanSeat, difficulty) {
  const Bot = PracticeBotClass(difficulty);
  return SEAT_NAMES.reduce((bots, _, index) => {
    const seat = String(index);
    if (seat !== String(humanSeat)) {
      bots[seat] = Bot;
    }
    return bots;
  }, {});
}

function createPracticeTransport(humanSeat, difficulty) {
  return Local({
    bots: createPracticeBots(humanSeat, difficulty),
    persist: true,
    storageKey: `durak-practice-${difficulty.toLowerCase()}-${humanSeat}`,
  });
}

function createOnlineTransport() {
  return SocketIO({ server: DURAK_SERVER });
}

function CardFace({ card, selected = false, onClick, interactive = false, compact = false }) {
  const cardClasses = [
    'relative overflow-hidden rounded-[1.25rem] border shadow-lg transition-transform duration-200',
    compact ? 'w-16 h-24 sm:w-20 sm:h-28' : 'w-20 h-28 sm:w-24 sm:h-32',
    suitAccentClass(card.suit),
    interactive ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl' : '',
    selected ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type="button" onClick={onClick} disabled={!interactive} className={cardClasses}>
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-slate-100" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),rgba(255,255,255,0.45)_55%,rgba(226,232,240,0.9))] opacity-70" />
      <span className={`absolute left-2 top-2 text-[10px] font-black ${suitColorClass(card.suit)}`}>
        {cardLabel(card)}
      </span>
      <span className="absolute bottom-2 right-2 rotate-180 text-[10px] font-black text-slate-900">
        {cardLabel(card)}
      </span>
      <div className="absolute inset-0 flex items-center justify-center px-1">
        <div className="flex flex-col items-center justify-center">
          <div className={`text-4xl leading-none sm:text-5xl ${suitColorClass(card.suit)} opacity-25`}>
            {SUIT_SYMBOLS[card.suit]}
          </div>
          <div className={`mt-1 text-xl leading-none sm:text-2xl ${suitColorClass(card.suit)}`}>
            {SUIT_SYMBOLS[card.suit]}
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent" />
      {selected && <div className="absolute inset-0 rounded-[1.15rem] border-2 border-emerald-400/80" />}
    </button>
  );
}

function CardBack({ label, count }) {
  return (
    <div className="relative flex h-28 w-20 items-center justify-center overflow-hidden rounded-[1.25rem] border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-lg sm:h-32 sm:w-24">
      <div className="absolute inset-2 rounded-[1rem] border border-dashed border-emerald-500/25" />
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-black text-emerald-300">{count}</p>
      </div>
    </div>
  );
}

function TableCardPair({ pair }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
          {seatLabelFromID(pair.attackBy)}
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">Table</div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <CardFace card={pair.attackCard} compact />
        {pair.defendCard ? (
          <>
            <span className="text-slate-600">→</span>
            <CardFace card={pair.defendCard} compact />
          </>
        ) : (
          <div className="flex h-24 w-20 items-center justify-center rounded-[1.25rem] border border-dashed border-slate-700 bg-slate-900/40 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500 sm:h-28 sm:w-24">
            Waiting
          </div>
        )}
      </div>
    </div>
  );
}

function StatusPill({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-slate-300">
      <Icon size={12} className="text-emerald-300" />
      <span>{label}</span>
      <span className="text-slate-500">{value}</span>
    </div>
  );
}

function DurakArena(props) {
  const {
    G,
    ctx,
    moves,
    playerID,
    isConnected,
    practiceMode,
    humanSeat,
    aiDelay,
  } = props;
  const [selectedCardId, setSelectedCardId] = useState(null);
  const myHand = G?.hands?.[playerID] || [];
  const selectedCard = myHand.find((card) => card.id === selectedCardId) || null;
  const isMyTurn = String(ctx?.currentPlayer) === String(playerID);
  const isAIThinking = Boolean(
    practiceMode && !G?.roundResult && String(ctx?.currentPlayer) !== String(humanSeat)
  );
  const turnMode = G?.turnState?.mode || 'attack';
  const canAttack = Boolean(isMyTurn && turnMode === 'attack' && !G?.roundResult);
  const canDefend = Boolean(isMyTurn && turnMode === 'defend' && !G?.roundResult);
  const roundComplete = Boolean(G?.roundResult);
  const discardTail = G?.discard?.slice(-1)?.[0] || null;

  const trumpCard = G?.trumpCard || null;
  const tablePairs = G?.table || [];
  const discardCount = G?.discard?.length || 0;
  const tokens = G?.tokens || {};
  const activeSeatLabel = seatLabelFromID(ctx?.currentPlayer || playerID || '0');
  const ruleModeLabel = G?.ruleMode || DEFAULT_RULE_MODE;
  const lastActionLabel = G?.turnState?.lastAction || 'start';

  const doAttack = () => {
    if (!selectedCard) return;
    moves.attack(selectedCard.id);
    setSelectedCardId(null);
  };

  const doDefend = () => {
    if (!selectedCard) return;
    moves.defend(selectedCard.id);
    setSelectedCardId(null);
  };

  const doPass = () => {
    moves.pass();
    setSelectedCardId(null);
  };

  const doTake = () => {
    moves.take();
    setSelectedCardId(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto pr-2 pb-8 [scrollbar-gutter:stable]">
      <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-4 shadow-2xl shadow-slate-950/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-emerald-300">Durak</p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-[0.18em] text-white">
              {roundComplete ? 'Round complete' : `Turn: ${activeSeatLabel}`}
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">
              {roundComplete
                ? `Durak: ${seatLabelFromID(G.roundResult?.durakPlayerID ?? '0')}. Token balances have been updated for all players.`
                : `Mode ${ruleModeLabel}. The table syncs through either websocket play or local AI practice.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusPill icon={isConnected ? Wifi : WifiOff} label="Network" value={isConnected ? 'Online' : 'Offline'} />
            <StatusPill icon={CirclePlay} label="Role" value={isMyTurn ? 'Your turn' : 'Waiting'} />
            <StatusPill icon={Crown} label="Trump" value={G?.trump ? SUIT_SYMBOLS[G.trump] : '—'} />
            {isAIThinking ? (
              <StatusPill
                icon={CirclePlay}
                label="AI"
                value={`Thinking ${Math.round((aiDelay || 0) / 100) / 10}s`}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid min-h-0 gap-4 xl:grid-cols-[1.1fr_1.6fr_1fr]">
        <section className="rounded-[1.75rem] border border-slate-800 bg-slate-950/85 p-4 shadow-xl shadow-slate-950/30">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            <Shuffle size={12} className="text-emerald-300" />
            Deck and Trump
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <CardBack label="Deck" count={G?.deck?.length || 0} />
            {trumpCard ? (
              <div className="space-y-2">
                <CardFace card={trumpCard} compact />
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">Trump</p>
              </div>
            ) : (
              <div className="rounded-[1.25rem] border border-dashed border-slate-700 px-5 py-7 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
                Trump hidden
              </div>
            )}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-slate-800 bg-slate-900/60 p-4">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              <Users size={12} className="text-emerald-300" />
              Token balance
            </div>
            <div className="mt-4 space-y-3">
              {SEAT_NAMES.slice(0, G?.hands?.length || 0).map((name, index) => {
                const id = String(index);
                return (
                  <div key={id} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{name}</p>
                      <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                        Cards: {G?.hands?.[id]?.length || 0}
                      </p>
                    </div>
                    <div className="text-lg font-black text-emerald-300">{tokens[id] ?? 0}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-800 bg-slate-950/85 p-4 shadow-xl shadow-slate-950/30">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            <BadgeInfo size={12} className="text-emerald-300" />
            Table
          </div>

          <div className="mt-4 space-y-3">
            {tablePairs.length ? (
              tablePairs.map((pair, index) => <TableCardPair key={`${pair.attackCard.id}-${index}`} pair={pair} />)
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-700 bg-slate-900/40 px-5 py-12 text-center">
                <p className="text-lg font-black uppercase tracking-[0.2em] text-white">Empty table</p>
                <p className="mt-3 text-sm text-slate-500">
                  Once a player attacks, the card will appear here as part of the synced match state.
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 rounded-[1.25rem] border border-slate-800 bg-slate-900/50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Discard
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {discardCount
                    ? `${discardCount} card${discardCount === 1 ? '' : 's'} in the pile.`
                    : 'The discard pile is empty.'}
                </p>
              </div>
              <div className="rounded-full border border-slate-800 bg-slate-950/80 px-3 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
                {discardTail ? `Latest: ${cardLabel(discardTail)}` : 'Hidden'}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-slate-800 bg-slate-950/85 p-4 shadow-xl shadow-slate-950/30">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            <AlertCircle size={12} className="text-emerald-300" />
            Actions
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">Selected</p>
            {selectedCard ? (
              <div className="mt-4">
                <CardFace card={selectedCard} compact />
                <p className="mt-3 text-sm font-semibold text-white">{cardLabel(selectedCard)}</p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Pick a card from your hand to play.</p>
            )}
          </div>

          {isAIThinking ? (
            <div className="mt-4 rounded-[1.5rem] border border-amber-500/30 bg-amber-500/10 p-4 shadow-lg shadow-amber-950/20">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.28em] text-amber-200">
                <Clock3 size={12} className="text-amber-300" />
                AI timeout phase
              </div>
              <p className="mt-3 text-sm leading-relaxed text-amber-50/85">
                The table is paused for about {Math.max(1, Math.ceil((aiDelay || 0) / 1000))} seconds so
                you can watch the move resolve before the next player acts.
              </p>
            </div>
          ) : null}

          <div className="mt-4 grid gap-3">
            <button
              type="button"
              onClick={doAttack}
              disabled={!canAttack || !selectedCard}
              className="rounded-2xl border border-blue-500/30 bg-blue-600/10 px-4 py-3 text-sm font-black uppercase tracking-[0.24em] text-blue-200 transition-all hover:bg-blue-600/20 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Attack
            </button>
            <button
              type="button"
              onClick={doDefend}
              disabled={!canDefend || !selectedCard}
              className="rounded-2xl border border-emerald-500/30 bg-emerald-600/10 px-4 py-3 text-sm font-black uppercase tracking-[0.24em] text-emerald-200 transition-all hover:bg-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Defend
            </button>
            <button
              type="button"
              onClick={doPass}
              disabled={!canAttack}
              className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-black uppercase tracking-[0.24em] text-slate-200 transition-all hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Pass
            </button>
            <button
              type="button"
              onClick={doTake}
              disabled={!canDefend}
              className="rounded-2xl border border-amber-500/30 bg-amber-600/10 px-4 py-3 text-sm font-black uppercase tracking-[0.24em] text-amber-200 transition-all hover:bg-amber-600/20 disabled:cursor-not-allowed disabled:opacity-30"
            >
              Take
            </button>
          </div>

          <div className="mt-4 rounded-[1.5rem] border border-dashed border-slate-700 bg-slate-900/40 p-4 text-sm text-slate-400">
            <p className="mb-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Last action: {lastActionLabel}
            </p>
            {roundComplete ? (
              <p>
                This round is closed. Token balances have already been updated. Change the mode or
                start a new practice table if you want a fresh game.
              </p>
            ) : (
              <p>
                {turnMode === 'attack'
                  ? 'Attack turn: you can play a card or pass.'
                  : 'Defense turn: you can beat the attack or take the table.'}
              </p>
            )}
          </div>
        </section>

        <section className="xl:col-span-3 rounded-[1.75rem] border border-slate-800 bg-slate-950/85 p-4 shadow-xl shadow-slate-950/30">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            <Users size={12} className="text-emerald-300" />
            Hand
          </div>

          <div className="mt-4 overflow-x-auto pb-2">
            <div className="flex min-w-max gap-3">
              {myHand.length ? (
                myHand.map((card) => (
                  <CardFace
                    key={card.id}
                    card={card}
                    selected={selectedCardId === card.id}
                    interactive={isMyTurn && !roundComplete}
                    onClick={() =>
                      setSelectedCardId((current) => (current === card.id ? null : card.id))
                    }
                  />
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-slate-700 bg-slate-900/40 px-5 py-8 text-sm text-slate-500">
                  No cards in hand.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function buildGameClient(multiplayer) {
  return Client({
    game: durakGame,
    board: DurakArena,
    multiplayer,
    numPlayers: 3,
    debug: false,
    loading: () => (
      <div className="flex h-full items-center justify-center rounded-[1.75rem] border border-slate-800 bg-slate-950/85 p-8 text-sm text-slate-400">
        Connecting to the Durak table...
      </div>
    ),
  });
}

export default function DurakBoardClient() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState('practice');
  const [ruleMode, setRuleMode] = useState(DEFAULT_RULE_MODE);
  const [playerSeat, setPlayerSeat] = useState('0');
  const [difficulty, setDifficulty] = useState('Normal');
  const [started, setStarted] = useState(false);
  const [practiceSession, setPracticeSession] = useState(1);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const rawState = window.localStorage.getItem(STORAGE_KEY);
      if (rawState) {
        const parsed = JSON.parse(rawState);
        if (parsed && typeof parsed === 'object') {
          if (parsed.mode === 'online' || parsed.mode === 'practice') {
            setMode(parsed.mode);
          }
          if (parsed.ruleMode === 'Professional' || parsed.ruleMode === 'Standard') {
            setRuleMode(parsed.ruleMode);
          }
          if (['0', '1', '2'].includes(parsed.playerSeat)) {
            setPlayerSeat(parsed.playerSeat);
          }
          if (DIFFICULTIES.includes(parsed.difficulty)) {
            setDifficulty(parsed.difficulty);
          }
        }
      }
    } catch (error) {
      // Ignore storage problems and keep defaults.
    } finally {
      setMounted(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          mode,
          ruleMode,
          playerSeat,
          difficulty,
        })
      );
    } catch (error) {
      // Keep the UI usable even if storage is blocked.
    }
  }, [mounted, mode, ruleMode, playerSeat, difficulty]);

  useEffect(() => {
    setStarted(false);
  }, [mode, ruleMode, playerSeat, difficulty]);

  const matchID =
    mode === 'online'
      ? ruleMode === 'Professional'
        ? PROFESSIONAL_MATCH_ID
        : STANDARD_MATCH_ID
      : `practice-${ruleMode.toLowerCase()}-${difficulty.toLowerCase()}-${playerSeat}-${practiceSession}`;

  const multiplayer = useMemo(() => {
    if (mode === 'online') {
      return createOnlineTransport();
    }
    return createPracticeTransport(playerSeat, difficulty);
  }, [mode, playerSeat, difficulty]);

  const GameClient = useMemo(() => buildGameClient(multiplayer), [multiplayer]);
  const practiceDelay = DIFFICULTY_DELAYS[difficulty] ?? DIFFICULTY_DELAYS.Normal;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="rounded-[1.75rem] border border-slate-800 bg-slate-950/90 p-4 shadow-2xl shadow-slate-950/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.35em] text-blue-300">
              Durak Table Setup
            </p>
            <h3 className="mt-2 text-2xl font-black uppercase tracking-[0.18em] text-white">
              Join an online table or play against AI
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              Online play uses the websocket server. Practice mode runs locally with AI bots so
              you always have a playable fallback.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-slate-400">
            <Wifi size={12} className="text-emerald-300" />
            {mode === 'online' ? DURAK_SERVER : `Practice ${difficulty}`}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('practice')}
            className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] transition-all ${
              mode === 'practice'
                ? 'border-emerald-500/40 bg-emerald-600/15 text-emerald-200'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Play vs AI
          </button>
          <button
            type="button"
            onClick={() => setMode('online')}
            className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] transition-all ${
              mode === 'online'
                ? 'border-blue-500/40 bg-blue-600/15 text-blue-200'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Join Online Table
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setRuleMode('Standard')}
            className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] transition-all ${
              ruleMode === 'Standard'
                ? 'border-blue-500/40 bg-blue-600/15 text-blue-200'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Standard
          </button>
          <button
            type="button"
            onClick={() => setRuleMode('Professional')}
            className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] transition-all ${
              ruleMode === 'Professional'
                ? 'border-emerald-500/40 bg-emerald-600/15 text-emerald-200'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Professional
          </button>
        </div>

        {mode === 'practice' && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {DIFFICULTIES.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setDifficulty(level)}
                className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] transition-all ${
                  difficulty === level
                    ? 'border-amber-500/40 bg-amber-600/15 text-amber-200'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {SEAT_NAMES.map((name, index) => (
            <button
              key={name}
              type="button"
              onClick={() => setPlayerSeat(String(index))}
              className={`rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] transition-all ${
                playerSeat === String(index)
                  ? 'border-emerald-500/40 bg-emerald-600/15 text-emerald-200'
                  : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (mode === 'practice') {
                setPracticeSession((current) => current + 1);
              }
              setStarted(true);
            }}
            className="rounded-2xl border border-emerald-500/30 bg-emerald-600/15 px-4 py-3 text-sm font-black uppercase tracking-[0.24em] text-emerald-200 transition-all hover:bg-emerald-600/25"
          >
            {mode === 'online' ? 'Join Table' : 'Shuffle & Deal'}
          </button>
          {started && (
            <button
              type="button"
              onClick={() => setStarted(false)}
              className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-black uppercase tracking-[0.24em] text-slate-200 transition-all hover:bg-slate-800"
            >
              Leave Table
            </button>
          )}
          <p className="text-xs text-slate-500">
            Seat: {seatLabelFromID(playerSeat)}. Mode: {mode === 'online' ? 'online' : 'practice'}.
            {mode === 'practice' ? ' Each start creates a fresh shuffled deck.' : ''}
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950/80 p-4 shadow-2xl shadow-slate-950/40">
        {mounted && started ? (
          <GameClient
            key={`${mode}-${matchID}-${playerSeat}-${difficulty}`}
            matchID={matchID}
            playerID={playerSeat}
            credentials=""
            debug={false}
            practiceMode={mode === 'practice'}
            humanSeat={playerSeat}
            aiDelay={practiceDelay}
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-[1.5rem] border border-dashed border-slate-700 bg-slate-900/40 p-8 text-sm text-slate-400">
            {mode === 'online'
              ? 'Click Join Table to connect to the websocket game.'
              : 'Click Shuffle & Deal to start a fresh local AI table.'}
          </div>
        )}
      </div>
      <div className="h-6 shrink-0" aria-hidden="true" />
    </div>
  );
}
