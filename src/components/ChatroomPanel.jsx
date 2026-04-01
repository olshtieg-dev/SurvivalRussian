'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Languages, MessageSquare, Reply, Send, Users, Wifi, WifiOff } from 'lucide-react';

const MAX_LENGTH = 512;
const PASTE_MAX = 100;
const START_TAG = '[PASTED]';
const END_TAG = '[/PASTED]';
const RECONNECT_DELAY_MS = 1500;

const RU_LAYOUT_MAP = {
  Backquote: { base: '\u0451', shift: '\u0401' },
  Digit1: { base: '1', shift: '!' },
  Digit2: { base: '2', shift: '"' },
  Digit3: { base: '3', shift: '\u2116' },
  Digit4: { base: '4', shift: ';' },
  Digit5: { base: '5', shift: '%' },
  Digit6: { base: '6', shift: ':' },
  Digit7: { base: '7', shift: '?' },
  Digit8: { base: '8', shift: '*' },
  Digit9: { base: '9', shift: '(' },
  Digit0: { base: '0', shift: ')' },
  Minus: { base: '-', shift: '_' },
  Equal: { base: '=', shift: '+' },
  KeyQ: { base: '\u0439', shift: '\u0419' },
  KeyW: { base: '\u0446', shift: '\u0426' },
  KeyE: { base: '\u0443', shift: '\u0423' },
  KeyR: { base: '\u043a', shift: '\u041a' },
  KeyT: { base: '\u0435', shift: '\u0415' },
  KeyY: { base: '\u043d', shift: '\u041d' },
  KeyU: { base: '\u0433', shift: '\u0413' },
  KeyI: { base: '\u0448', shift: '\u0428' },
  KeyO: { base: '\u0449', shift: '\u0429' },
  KeyP: { base: '\u0437', shift: '\u0417' },
  BracketLeft: { base: '\u0445', shift: '\u0425' },
  BracketRight: { base: '\u044a', shift: '\u042a' },
  Backslash: { base: '\\', shift: '/' },
  KeyA: { base: '\u0444', shift: '\u0424' },
  KeyS: { base: '\u044b', shift: '\u042b' },
  KeyD: { base: '\u0432', shift: '\u0412' },
  KeyF: { base: '\u0430', shift: '\u0410' },
  KeyG: { base: '\u043f', shift: '\u041f' },
  KeyH: { base: '\u0440', shift: '\u0420' },
  KeyJ: { base: '\u043e', shift: '\u041e' },
  KeyK: { base: '\u043b', shift: '\u041b' },
  KeyL: { base: '\u0434', shift: '\u0414' },
  Semicolon: { base: '\u0436', shift: '\u0416' },
  Quote: { base: '\u044d', shift: '\u042d' },
  KeyZ: { base: '\u044f', shift: '\u042f' },
  KeyX: { base: '\u0447', shift: '\u0427' },
  KeyC: { base: '\u0441', shift: '\u0421' },
  KeyV: { base: '\u043c', shift: '\u041c' },
  KeyB: { base: '\u0438', shift: '\u0418' },
  KeyN: { base: '\u0442', shift: '\u0422' },
  KeyM: { base: '\u044c', shift: '\u042c' },
  Comma: { base: '\u0431', shift: '\u0411' },
  Period: { base: '\u044e', shift: '\u042e' },
  Slash: { base: '.', shift: ',' },
};

function getSocketUrl() {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const isLoopbackHost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '::1' ||
    window.location.hostname === '[::1]';
  const host = isLoopbackHost
    ? `127.0.0.1${window.location.port ? `:${window.location.port}` : ''}`
    : window.location.host;
  const chatPort = process.env.NEXT_PUBLIC_CHAT_WS_PORT;

  if (chatPort) {
    const socketHost = isLoopbackHost
      ? `127.0.0.1:${chatPort}`
      : `${window.location.hostname}:${chatPort}`;

    return `${protocol}//${socketHost}/ws/chat`;
  }

  return `${protocol}//${host}/ws/chat`;
}

function splitTaggedText(text) {
  const parts = [];
  const regex = /\[PASTED\](.*?)\[\/PASTED\]/gs;
  let lastIndex = 0;

  for (const match of text.matchAll(regex)) {
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, matchIndex) });
    }

    parts.push({ type: 'pasted', value: match[1] || '' });
    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }

  return parts.length ? parts : [{ type: 'text', value: text }];
}

function formatUserLabel(messageId, clientId) {
  return messageId === clientId ? 'You' : `User ${messageId}`;
}

function formatSystemMessage(message, clientId) {
  const actor = message.id ? formatUserLabel(message.id, clientId) : 'Room';

  if (message.systemType === 'join') {
    return `${actor} entered the room.`;
  }

  if (message.systemType === 'leave') {
    return `${actor} left the room.`;
  }

  return 'Room update.';
}

function buildMessage(entry) {
  if (!entry || typeof entry !== 'object') return null;

  if (entry.type === 'commit') {
    return {
      kind: 'commit',
      key: entry.key || `commit-${entry.id || 'anon'}-${entry.sentAt || Date.now()}`,
      id: entry.id || '',
      text: typeof entry.text === 'string' ? entry.text : '',
      sentAt: entry.sentAt || Date.now(),
    };
  }

  if (entry.type === 'system') {
    return {
      kind: 'system',
      key: entry.key || `system-${entry.systemType || 'note'}-${entry.sentAt || Date.now()}`,
      id: entry.id || '',
      systemType: entry.systemType || 'note',
      sentAt: entry.sentAt || Date.now(),
    };
  }

  return null;
}

function mapPhysicalKeyToRussian(event) {
  if (event.ctrlKey || event.metaKey || event.altKey) return '';

  const mapping = RU_LAYOUT_MAP[event.code];
  if (!mapping) return '';

  return event.shiftKey ? mapping.shift || mapping.base : mapping.base;
}

export default function ChatroomPanel() {
  const [clientId, setClientId] = useState('');
  const [connectionState, setConnectionState] = useState('connecting');
  const [connectionError, setConnectionError] = useState('');
  const [draftValue, setDraftValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [presenceCount, setPresenceCount] = useState(0);
  const [layoutMode, setLayoutMode] = useState('system');
  const [retryNonce, setRetryNonce] = useState(0);

  const socketRef = useRef(null);
  const clientIdRef = useRef('');
  const feedRef = useRef(null);
  const inputRef = useRef(null);
  const titleRef = useRef('');
  const unreadCountRef = useRef(0);
  const documentVisibleRef = useRef(true);
  const reconnectTimerRef = useRef(null);

  const orderedDrafts = useMemo(
    () =>
      Object.entries(drafts)
        .filter(([messageId, text]) => text && messageId !== clientId)
        .sort((a, b) => a[0].localeCompare(b[0])),
    [clientId, drafts]
  );

  const commitCount = useMemo(
    () => messages.filter((message) => message.kind === 'commit').length,
    [messages]
  );

  const sendPayload = useCallback((payload) => {
    if (socketRef.current?.readyState === 1) {
      socketRef.current.send(JSON.stringify(payload));
    }
  }, []);

  const applyDraftValue = useCallback(
    (nextValue) => {
      const clamped = nextValue.slice(0, MAX_LENGTH);
      setDraftValue(clamped);
      sendPayload({ type: 'draft', text: clamped });
    },
    [sendPayload]
  );

  const restoreTitle = useCallback(() => {
    if (typeof document === 'undefined') return;
    unreadCountRef.current = 0;
    document.title = titleRef.current;
  }, []);

  const queueCursorAt = useCallback((position) => {
    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      const cursor = Math.min(position, inputRef.current?.value.length ?? position);
      inputRef.current?.setSelectionRange(cursor, cursor);
    });
  }, []);

  const replaceSelection = useCallback(
    ({ insertText = '', deleteBackward = false }) => {
      const selectionStart = inputRef.current?.selectionStart ?? draftValue.length;
      const selectionEnd = inputRef.current?.selectionEnd ?? draftValue.length;
      const start =
        deleteBackward && selectionStart === selectionEnd
          ? Math.max(0, selectionStart - 1)
          : selectionStart;
      const nextValue =
        draftValue.slice(0, start) + insertText + draftValue.slice(selectionEnd);
      const clamped = nextValue.slice(0, MAX_LENGTH);
      const nextCursor = Math.min(start + insertText.length, clamped.length);

      applyDraftValue(clamped);
      queueCursorAt(nextCursor);
    },
    [applyDraftValue, draftValue, queueCursorAt]
  );

  const commitMessage = useCallback(() => {
    const text = draftValue.trim();

    if (!text) return;

    sendPayload({ type: 'commit', text: draftValue });
    setDraftValue('');
    sendPayload({ type: 'draft', text: '' });
  }, [draftValue, sendPayload]);

  const insertReplyTag = useCallback(
    (messageId) => {
      const nextValue = `${draftValue}${draftValue && !/\s$/.test(draftValue) ? ' ' : ''}>>${messageId} `;
      applyDraftValue(nextValue);
      queueCursorAt(nextValue.length);
    },
    [applyDraftValue, draftValue, queueCursorAt]
  );

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    titleRef.current = document.title;
    documentVisibleRef.current = document.visibilityState === 'visible';

    let isCurrent = true;

    const handleVisibilityChange = () => {
      documentVisibleRef.current = document.visibilityState === 'visible';

      if (documentVisibleRef.current) {
        restoreTitle();
      }
    };

    const scheduleReconnect = () => {
      if (!isCurrent) return;

      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = window.setTimeout(() => {
        if (isCurrent) {
          setConnectionState('connecting');
          setConnectionError('');
          setRetryNonce((value) => value + 1);
        }
      }, RECONNECT_DELAY_MS);
    };

    const socket = new WebSocket(getSocketUrl());
    socketRef.current = socket;

    const handleOpen = () => {
      if (!isCurrent || socketRef.current !== socket) return;
      setConnectionState('online');
      setConnectionError('');
    };

    const handleError = () => {
      if (!isCurrent || socketRef.current !== socket) return;
      setConnectionState('offline');
      setConnectionError('Chat socket unavailable right now. Retrying...');
      scheduleReconnect();
    };

    const handleClose = () => {
      if (!isCurrent || socketRef.current !== socket) return;
      setConnectionState('offline');
      setConnectionError((current) => current || 'Chat socket unavailable right now. Retrying...');
      scheduleReconnect();
    };

    const handleMessage = (event) => {
      if (!isCurrent || socketRef.current !== socket) return;

      let payload;

      try {
        payload = JSON.parse(event.data);
      } catch (error) {
        return;
      }

      if (payload.type === 'hello') {
        clientIdRef.current = payload.id;
        setClientId(payload.id);
        setPresenceCount(payload.presenceCount || 0);
        setDrafts({});
        setMessages((payload.history || []).map(buildMessage).filter(Boolean));
        setConnectionState('online');
        setConnectionError('');
        return;
      }

      if (payload.type === 'presence') {
        setPresenceCount(payload.count || 0);
        return;
      }

      if (payload.type === 'draft') {
        setDrafts((currentDrafts) => {
          const nextDrafts = { ...currentDrafts };

          if (payload.text) {
            nextDrafts[payload.id] = payload.text;
          } else {
            delete nextDrafts[payload.id];
          }

          return nextDrafts;
        });
        return;
      }

      if (payload.type === 'leave') {
        setDrafts((currentDrafts) => {
          const nextDrafts = { ...currentDrafts };
          delete nextDrafts[payload.id];
          return nextDrafts;
        });
        return;
      }

      if (payload.type === 'system') {
        const nextMessage = buildMessage(payload);
        if (nextMessage) {
          setMessages((currentMessages) => [...currentMessages, nextMessage]);
        }
        return;
      }

      if (payload.type === 'commit') {
        setDrafts((currentDrafts) => {
          const nextDrafts = { ...currentDrafts };
          delete nextDrafts[payload.id];
          return nextDrafts;
        });

        const nextMessage = buildMessage(payload);
        if (nextMessage) {
          setMessages((currentMessages) => [...currentMessages, nextMessage]);
        }

        if (payload.id !== clientIdRef.current && !documentVisibleRef.current) {
          unreadCountRef.current += 1;
          document.title = `(${unreadCountRef.current}) Survival Russian Chat`;
        }
        return;
      }

      if (payload.type === 'error') {
        setConnectionError(payload.message || 'Socket error.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    socket.addEventListener('open', handleOpen);
    socket.addEventListener('error', handleError);
    socket.addEventListener('close', handleClose);
    socket.addEventListener('message', handleMessage);

    return () => {
      isCurrent = false;
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      socket.removeEventListener('open', handleOpen);
      socket.removeEventListener('error', handleError);
      socket.removeEventListener('close', handleClose);
      socket.removeEventListener('message', handleMessage);
      restoreTitle();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }

      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    };
  }, [restoreTitle, retryNonce]);

  useEffect(() => {
    feedRef.current?.scrollTo({
      top: feedRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, orderedDrafts]);

  return (
    <div className="grid gap-6 p-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <div className="space-y-4">
        <div className="rounded-[1.5rem] border border-amber-500/20 bg-amber-500/10 p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-slate-950/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">
              <MessageSquare size={12} />
              Live Room
            </div>
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] ${
                connectionState === 'online'
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                  : connectionState === 'connecting'
                    ? 'border-blue-500/20 bg-blue-500/10 text-blue-300'
                    : 'border-red-500/20 bg-red-500/10 text-red-300'
              }`}
            >
              {connectionState === 'online' ? <Wifi size={12} /> : <WifiOff size={12} />}
              {connectionState}
            </div>
          </div>

          <h3 className="mt-4 text-lg font-black uppercase tracking-[0.18em] text-white">
            Live Study Room
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Shared drafts, reply tags, presence count, room history, and a local RU key helper so people can jump in without leaving the app.
          </p>

          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm leading-relaxed text-slate-300">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
                Local Handle
              </span>
              <span className="font-mono text-xs text-white">
                {clientId ? `User ${clientId}` : 'Awaiting hello'}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2">
              <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
                <Users size={12} />
                Presence
              </span>
              <span className="text-sm font-semibold text-white">{presenceCount} live</span>
            </div>
            {connectionError && (
              <p className="mt-3 text-xs leading-relaxed text-red-300">{connectionError}</p>
            )}
            {connectionState !== 'online' && (
              <button
                type="button"
                onClick={() => {
                  window.clearTimeout(reconnectTimerRef.current);
                  reconnectTimerRef.current = null;
                  setConnectionState('connecting');
                  setConnectionError('');
                  setRetryNonce((value) => value + 1);
                }}
                className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-amber-300 transition-all hover:bg-amber-500/20"
              >
                Reconnect
              </button>
            )}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
            Room Tools
          </p>
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
              New arrivals inherit a short room history instead of landing in a blank void.
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
              Join and leave events post into the feed so the room actually feels inhabited.
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3">
              RU helper mode maps physical US keys directly into Russian characters right inside the composer.
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-800 bg-slate-950/90">
        <div className="border-b border-slate-800 bg-slate-900/80 px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black uppercase tracking-[0.24em] text-white">
                Shared Feed
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                Global room for practice, questions, and mutual rescue.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
              <span>{presenceCount} live</span>
              <span className="text-slate-700">/</span>
              <span>{commitCount} commits</span>
            </div>
          </div>
        </div>

        <div
          ref={feedRef}
          className="max-h-[52vh] min-h-[24rem] space-y-3 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.06),transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.98))] px-5 py-5 custom-scrollbar"
        >
          {!messages.length && !orderedDrafts.length && (
            <div className="flex min-h-[18rem] items-center justify-center">
              <div className="max-w-sm rounded-[1.5rem] border border-slate-800 bg-slate-950/70 px-5 py-5 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-300">
                  Room Idle
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  Open another tab and the room should now stay connected, show presence, and replay the recent commits to late arrivals.
                </p>
              </div>
            </div>
          )}

          {messages.map((message) =>
            message.kind === 'system' ? (
              <div key={message.key} className="flex justify-center">
                <div className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold text-blue-200">
                  {formatSystemMessage(message, clientId)}
                </div>
              </div>
            ) : (
              <div
                key={message.key}
                className="rounded-[1.25rem] border border-slate-800 bg-slate-900/70 px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => insertReplyTag(message.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-amber-300 transition-all hover:bg-amber-500/20"
                >
                  <Reply size={11} />
                  {formatUserLabel(message.id, clientId)}
                </button>

                <div className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-100">
                  {splitTaggedText(message.text).map((part, index) =>
                    part.type === 'pasted' ? (
                      <span
                        key={`${message.key}-part-${index}`}
                        className="rounded-md bg-amber-300 px-1.5 py-0.5 font-semibold text-slate-950"
                      >
                        {part.value}
                      </span>
                    ) : (
                      <span key={`${message.key}-part-${index}`}>{part.value}</span>
                    )
                  )}
                </div>
              </div>
            )
          )}

          {orderedDrafts.map(([messageId, text]) => (
            <div
              key={`draft-${messageId}`}
              className="rounded-[1.25rem] border border-dashed border-blue-500/30 bg-blue-500/10 px-4 py-3"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-slate-950/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-blue-300">
                <MessageSquare size={11} />
                {formatUserLabel(messageId, clientId)} typing
              </div>
              <div className="mt-3 whitespace-pre-wrap break-words text-sm italic leading-relaxed text-slate-300">
                {text}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 bg-slate-900/85 px-5 py-4">
          <div className="rounded-[1.25rem] border border-slate-800 bg-slate-950/80 p-3">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
                  Composer Mode
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  System keeps your OS layout. RU helper maps your physical US keys into Russian locally.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLayoutMode((current) => (current === 'system' ? 'ru' : 'system'))}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] transition-all ${
                  layoutMode === 'ru'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                    : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500'
                }`}
              >
                <Languages size={13} />
                {layoutMode === 'ru' ? 'RU Helper On' : 'System Layout'}
              </button>
            </div>

            {layoutMode === 'ru' && (
              <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-300">
                {['Q \u2192 \u0439', 'W \u2192 \u0446', 'E \u2192 \u0443', 'F \u2192 \u0430', 'V \u2192 \u043c'].map((hint) => (
                  <span
                    key={hint}
                    className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1"
                  >
                    {hint}
                  </span>
                ))}
              </div>
            )}

            <textarea
              ref={inputRef}
              value={draftValue}
              onChange={(event) => applyDraftValue(event.target.value)}
              onPaste={(event) => {
                event.preventDefault();

                const pasted = (event.clipboardData || window.clipboardData).getData('text');
                const selectionStart = inputRef.current?.selectionStart ?? draftValue.length;
                const selectionEnd = inputRef.current?.selectionEnd ?? draftValue.length;
                const available =
                  MAX_LENGTH -
                  (draftValue.length - (selectionEnd - selectionStart)) -
                  START_TAG.length -
                  END_TAG.length;

                if (available <= 0) return;

                const trimmed = pasted.slice(0, Math.min(PASTE_MAX, available));
                const flagged = `${START_TAG}${trimmed}${END_TAG}`;
                const nextValue =
                  draftValue.slice(0, selectionStart) +
                  flagged +
                  draftValue.slice(selectionEnd);

                applyDraftValue(nextValue);
                queueCursorAt(selectionStart + flagged.length);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  commitMessage();
                  return;
                }

                if (layoutMode !== 'ru') return;

                if (event.key === 'Backspace') {
                  event.preventDefault();
                  replaceSelection({ deleteBackward: true });
                  return;
                }

                const mappedCharacter = mapPhysicalKeyToRussian(event);
                if (!mappedCharacter) return;

                event.preventDefault();
                replaceSelection({ insertText: mappedCharacter });
              }}
              placeholder="Drop a live message here..."
              className="min-h-[5.5rem] w-full resize-none bg-transparent text-sm leading-relaxed text-slate-100 outline-none placeholder:text-slate-500"
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-3">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                <span className="rounded-full border border-slate-800 bg-slate-900 px-2.5 py-1">
                  {draftValue.length}/{MAX_LENGTH}
                </span>
                <span className="rounded-full border border-slate-800 bg-slate-900 px-2.5 py-1">
                  Paste gets tagged
                </span>
                <span className="rounded-full border border-slate-800 bg-slate-900 px-2.5 py-1">
                  {layoutMode === 'ru' ? 'RU helper active' : 'System layout active'}
                </span>
              </div>

              <button
                type="button"
                onClick={commitMessage}
                disabled={!draftValue.trim() || connectionState !== 'online'}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-amber-300 transition-all hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={13} />
                Commit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
