'use client';

// Passage Reader — a long-form typing surface for whole paragraphs, book
// passages, and Russian Orthodox prayers. Unlike the single-phrase TypingEngine
// on the main page, this shows a lot of text at once with an interlinear gloss
// (English under each Russian word) so the reader sees the meaning as they go.
//
// Input is captured with a self-contained positional keydown listener (mirrors
// useKeyboard's alphabet.json resolution) rather than the useKeyboard hook,
// because this panel lives inside FeatureDock, which sets a body-level
// keyboardLock while any overlay is open. Punctuation the JCUKEN map can't type
// (;, :, «», …) auto-advances so long passages stay typeable — the learner only
// types letters and spaces.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Gauge, RotateCcw, ScrollText } from 'lucide-react';
import alphabetData from '../data/alphabet.json';
import vocabularyData from '../data/vocabulary.json';

// --- Vocabulary lookup (mirrors normalizeVocabularyKey in page.js) ----------

function normalizeVocabularyKey(text) {
  if (typeof text !== 'string') return '';
  return text
    .normalize('NFC')
    .toLowerCase()
    .replace(/[\p{P}\p{S}]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const vocabularyLookup = new Map(
  Object.keys(vocabularyData).map((key) => [normalizeVocabularyKey(key), key])
);

function lookupGloss(surface) {
  const norm = normalizeVocabularyKey(surface);
  if (!norm) return '';
  const key = vocabularyLookup.get(norm);
  const entry = key ? vocabularyData[key] : null;
  if (!entry) return '';
  // First sense of a multi-gloss literal keeps the interlinear line compact.
  const raw = entry.literal || entry.natural || '';
  return String(raw).split(/[;,/]/)[0].trim();
}

// --- Positional key resolution (mirrors useKeyboard) ------------------------

const codeToKeyMap = {
  Semicolon: 'Semicolon', Quote: 'Quote', Comma: 'Comma',
  Period: 'Period', Slash: 'Slash', Minus: 'Minus',
  BracketLeft: 'BracketLeft', BracketRight: 'BracketRight',
  Backquote: 'Backquote',
  Digit1: 'Digit1', Digit2: 'Digit2', Digit3: 'Digit3',
  Digit4: 'Digit4', Digit5: 'Digit5', Digit6: 'Digit6', Digit7: 'Digit7',
};

function resolveChar(event) {
  const { code, shiftKey } = event;
  if (code === 'Space') return ' ';
  const lookupKey = code.startsWith('Key')
    ? code.replace('Key', '').toLowerCase()
    : codeToKeyMap[code];
  const mapped = alphabetData[lookupKey];
  if (mapped) {
    return shiftKey ? mapped.shifted || mapped.cyrillic.toUpperCase() : mapped.cyrillic;
  }
  if (event.key?.length === 1) return event.key;
  return null;
}

// --- Typing helpers ---------------------------------------------------------

const IS_LETTER = /\p{L}/u;

// The set of letters the JCUKEN keyboard can actually produce. Anything outside
// it — punctuation plus any archaic Church Slavonic glyphs (ѡ, ѧ, combining
// accents…) — auto-advances so the learner only types modern Russian letters.
//
// SLAVONIC ENTRY CONVENTION: transcribe Church Slavonic passages in "phonetic
// Slavonic" — the way modern prayer books render it — so every letter is
// typeable on the standard keyboard. Specifically, yat ѣ → е and decimal і/І →
// и/И (both civil-script glyphs the JCUKEN map can't produce). Keep Slavonic
// word forms and the ъ hard-sign endings (those ARE typeable). Do the same for
// any future Slavonic passage added to PASSAGES.
const TYPEABLE_LETTERS = new Set(
  Object.values(alphabetData)
    .map((entry) => entry?.cyrillic)
    .filter((ch) => typeof ch === 'string' && IS_LETTER.test(ch))
    .map((ch) => ch.toLowerCase())
);

const isTypeable = (ch) => ch === ' ' || TYPEABLE_LETTERS.has(ch.toLowerCase());
const normalizeChar = (value) =>
  typeof value === 'string' ? value.toLocaleLowerCase() : value;

// Advance the caret over any character the keyboard can't type (punctuation and
// archaic glyphs) starting at i.
function skipPunctuation(text, i) {
  let next = i;
  while (next < text.length && !isTypeable(text[next])) next += 1;
  return next;
}

// --- Built-in library -------------------------------------------------------

const PASSAGES = [
  {
    id: 'otche-nash-cs',
    label: 'Отче наш (ц.-сл.)',
    category: 'Prayer',
    text:
      'Отче нашъ, иже еси на небесехъ, да святится имя Твое, да приидетъ Царствие Твое, да будетъ воля Твоя, яко на небеси и на земли. Хлебъ нашъ насущный даждь намъ днесь, и остави намъ долги наша, якоже и мы оставляемъ должникомъ нашымъ, и не введи насъ во искушение, но избави насъ от лукаваго.',
  },
  {
    id: 'otche-nash',
    label: 'Отче наш (рус.)',
    category: 'Prayer',
    text:
      'Отче наш, сущий на небесах! Да святится имя Твоё; да приидет Царствие Твоё; да будет воля Твоя и на земле, как на небе. Хлеб наш насущный дай нам на сей день; и прости нам долги наши, как и мы прощаем должникам нашим; и не введи нас в искушение, но избавь нас от лукавого.',
  },
  {
    id: 'psalom-50-cs',
    label: 'Псалом 50 (ц.-сл.)',
    category: 'Psalter',
    text:
      'Помилуй мя, Боже, по велицей милости Твоей, и по множеству щедротъ Твоихъ очисти беззаконие мое. Наипаче омый мя от беззакония моего, и от греха моего очисти мя. Яко беззаконие мое азъ знаю, и грехъ мой предо мною есть выну. Тебе Единому согрешихъ и лукавое предъ Тобою сотворихъ, яко да оправдишися во словесехъ Твоихъ, и победиши, внегда судити Ти. Се бо, въ беззакониихъ зачатъ есмь, и во гресехъ роди мя мати моя. Се бо, истину возлюбилъ еси; безвестная и тайная премудрости Твоея явилъ ми еси. Окропиши мя иссопомъ, и очищуся; омыеши мя, и паче снега убелюся. Слуху моему даси радость и веселие; возрадуются кости смиренныя. Отврати лице Твое от грехъ моихъ и вся беззакония моя очисти. Сердце чисто созижди во мне, Боже, и духъ правъ обнови во утробе моей. Не отвержи мене от лица Твоего и Духа Твоего Святаго не отыми от мене. Воздаждь ми радость спасения Твоего и Духомъ Владычнимъ утверди мя. Научу беззаконныя путемъ Твоимъ, и нечестивии къ Тебе обратятся. Избави мя от кровей, Боже, Боже спасения моего; возрадуется языкъ мой правде Твоей. Господи, устне мои отверзеши, и уста моя возвестятъ хвалу Твою. Яко аще бы восхотелъ еси жертвы, далъ быхъ убо: всесожжения не благоволиши. Жертва Богу духъ сокрушенъ; сердце сокрушенно и смиренно Богъ не уничижитъ. Ублажи, Господи, благоволениемъ Твоимъ Сиона, и да созиждутся стены Иерусалимския. Тогда благоволиши жертву правды, возношение и всесожигаемая; тогда возложатъ на олтарь Твой тельцы.',
  },
  {
    id: 'psalom-50-ru',
    label: 'Псалом 50 (рус.)',
    category: 'Psalter',
    text:
      'Помилуй меня, Боже, по великой милости Твоей, и по множеству щедрот Твоих изгладь беззакония мои. Многократно омой меня от беззакония моего, и от греха моего очисти меня, ибо беззакония мои я сознаю, и грех мой всегда предо мною. Тебе, Тебе единому согрешил я и лукавое пред очами Твоими сделал, так что Ты праведен в приговоре Твоём и чист в суде Твоём. Вот, я в беззаконии зачат, и во грехе родила меня мать моя. Вот, Ты возлюбил истину в сердце и внутрь меня явил мне мудрость. Окропи меня иссопом, и буду чист; омой меня, и буду белее снега. Дай мне услышать радость и веселие, и возрадуются кости, Тобою сокрушённые. Отврати лице Твоё от грехов моих и изгладь все беззакония мои. Сердце чистое сотвори во мне, Боже, и дух правый обнови внутри меня. Не отвергни меня от лица Твоего и Духа Твоего Святого не отними от меня. Возврати мне радость спасения Твоего и Духом владычественным утверди меня. Научу беззаконных путям Твоим, и нечестивые к Тебе обратятся. Избавь меня от кровей, Боже, Боже спасения моего, и язык мой восхвалит правду Твою. Господи! отверзи уста мои, и уста мои возвестят хвалу Твою. Ибо жертвы Ты не желаешь, — я дал бы её; к всесожжению не благоволишь. Жертва Богу — дух сокрушённый; сердца сокрушённого и смиренного Ты не презришь, Боже. Облагодетельствуй по благоволению Твоему Сион; воздвигни стены Иерусалима, тогда благоугодны будут Тебе жертвы правды, возношение и всесожжение; тогда возложат на алтарь Твой тельцов.',
  },
  {
    id: 'psalom-22-cs',
    label: 'Псалом 22 (ц.-сл.)',
    category: 'Psalter',
    text:
      'Господь пасетъ мя, и ничтоже мя лишитъ. На месте злачне, тамо всели мя, на воде покойне воспита мя. Душу мою обрати, настави мя на стези правды, имене ради Своего. Аще бо и пойду посреде сени смертныя, не убоюся зла, яко Ты со мною еси: жезлъ Твой и палица Твоя, та мя утешиста. Уготовалъ еси предо мною трапезу сопротивъ стужающымъ мне; умастилъ еси елеомъ главу мою, и чаша Твоя упоявающи мя, яко державна. И милость Твоя поженетъ мя вся дни живота моего, и еже вселитися ми въ домъ Господень въ долготу дний.',
  },
  {
    id: 'psalom-22-ru',
    label: 'Псалом 22 (рус.)',
    category: 'Psalter',
    text:
      'Господь — Пастырь мой; я ни в чём не буду нуждаться: Он покоит меня на злачных пажитях и водит меня к водам тихим, подкрепляет душу мою, направляет меня на стези правды ради имени Своего. Если я пойду и долиною смертной тени, не убоюсь зла, потому что Ты со мной; Твой жезл и Твой посох — они успокаивают меня. Ты приготовил предо мною трапезу в виду врагов моих; умастил елеем голову мою; чаша моя преисполнена. Так, благость и милость да сопровождают меня во все дни жизни моей, и я пребуду в доме Господнем многие дни.',
  },
  {
    id: 'psalom-23-cs',
    label: 'Псалом 23 (ц.-сл.)',
    category: 'Psalter',
    text:
      'Господня земля, и исполнение ея, вселенная и вси живущии на ней. Той на моряхъ основалъ ю есть и на рекахъ уготовалъ ю есть. Кто взыдетъ на гору Господню? Или кто станетъ на месте святемъ Его? Неповиненъ рукама и чистъ сердцемъ, иже не прият всуе душу свою и не клятся лестию искреннему своему. Сей приимет благословение отъ Господа и милостыню отъ Бога Спаса своего. Сей родъ ищущихъ Господа, ищущихъ лице Бога Иаковля. Возмите врата, князи, ваша, и возмитеся, врата вечная, и внидетъ Царь славы. Кто есть сей Царь славы? Господь крепокъ и силенъ, Господь силенъ въ брани. Возмите врата, князи, ваша, и возмитеся, врата вечная, и внидетъ Царь славы. Кто есть сей Царь славы? Господь силъ, Той есть Царь славы.',
  },
  {
    id: 'psalom-23-ru',
    label: 'Псалом 23 (рус.)',
    category: 'Psalter',
    text:
      'Господня — земля и что наполняет её, вселенная и всё живущее в ней, ибо Он основал её на морях и на реках утвердил её. Кто взойдёт на гору Господню, или кто станет на святом месте Его? Тот, у которого руки неповинны и сердце чисто, кто не клялся душою своею напрасно и не божился ложно, — тот получит благословение от Господа и милость от Бога, Спасителя своего. Таков род ищущих Его, ищущих лица Твоего, Боже Иакова! Поднимите, врата, верхи ваши, и поднимитесь, двери вечные, и войдёт Царь славы! Кто сей Царь славы? Господь крепкий и сильный, Господь, сильный в брани. Поднимите, врата, верхи ваши, и поднимитесь, двери вечные, и войдёт Царь славы! Кто сей Царь славы? Господь сил, Он — Царь славы.',
  },
  {
    id: 'psalom-115-cs',
    label: 'Псалом 115 (ц.-сл.)',
    category: 'Psalter',
    text:
      'Веровахъ, темже возглаголахъ: азъ же смирихся зело. Азъ же рехъ во изступлении моемъ: всякъ человекъ ложъ. Что воздамъ Господеви о всехъ, яже воздаде ми? Чашу спасения прииму и имя Господне призову. Молитвы моя Господеви воздамъ предъ всеми людьми Его. Честна предъ Господемъ смерть преподобныхъ Его. О, Господи, азъ рабъ Твой, азъ рабъ Твой и сынъ рабыни Твоея: растерзалъ еси узы моя. Тебе пожру жертву хвалы, и во имя Господне призову. Молитвы моя Господеви воздамъ предъ всеми людьми Его, во дворехъ дому Господня, посреде тебе, Иерусалиме.',
  },
  {
    id: 'psalom-115-ru',
    label: 'Псалом 115 (рус.)',
    category: 'Psalter',
    text:
      'Я веровал, и потому говорил: я сильно сокрушён. Я сказал в опрометчивости моей: всякий человек ложь. Что воздам Господу за все благодеяния Его ко мне? Чашу спасения приму и имя Господне призову. Обеты мои воздам Господу пред всем народом Его. Дорога в очах Господних смерть святых Его! О, Господи! я раб Твой, я раб Твой и сын рабы Твоей; Ты разрешил узы мои. Тебе принесу жертву хвалы, и имя Господне призову. Обеты мои воздам Господу пред всем народом Его, во дворах дома Господня, посреди тебя, Иерусалим!',
  },
  {
    id: 'jesus-prayer',
    label: 'Иисусова молитва',
    category: 'Prayer',
    text: 'Господи Иисусе Христе, Сыне Божий, помилуй мя грешного.',
  },
  {
    id: 'pre-communion-chrysostom-cs',
    label: 'Молитва пред причащением (ц.-сл.)',
    category: 'Prayer',
    text:
      'Верую, Господи, и исповедую, яко Ты еси воистинну Христосъ, Сынъ Бога живаго, пришедый в миръ грешныя спасти, от нихже первый есмь азъ. Еще верую, яко сие есть самое пречистое Тело Твое, и сия есть самая честная Кровь Твоя. Молюся убо Тебе: помилуй мя и прости ми прегрешения моя, вольная и невольная, яже словомъ, яже деломъ, яже ведениемъ и неведениемъ, и сподоби мя неосужденно причаститися пречистыхъ Твоихъ Таинствъ, во оставление греховъ и в жизнь вечную. Аминь.',
  },
  {
    id: 'vecheri-tvoeya-cs',
    label: 'Вечери Твоея тайныя (ц.-сл.)',
    category: 'Prayer',
    text:
      'Вечери Твоея тайныя днесь, Сыне Божий, причастника мя приими; не бо врагомъ Твоимъ тайну повемъ, ни лобзания Ти дамъ яко Иуда, но яко разбойникъ исповедаю Тя: помяни мя, Господи, во Царствии Твоемъ.',
  },
  {
    id: 'anna-karenina',
    label: 'Анна Каренина',
    category: 'Literature',
    text:
      'Все счастливые семьи похожи друг на друга, каждая несчастливая семья несчастлива по-своему. Всё смешалось в доме Облонских.',
  },
  {
    id: 'pushkin',
    label: 'Пушкин',
    category: 'Literature',
    text:
      'Я помню чудное мгновенье: передо мной явилась ты, как мимолётное виденье, как гений чистой красоты.',
  },
];

// Passages grouped by category (first-appearance order) for the picker headings.
const PASSAGE_GROUPS = PASSAGES.reduce((groups, item) => {
  let group = groups.find((g) => g.category === item.category);
  if (!group) {
    group = { category: item.category, items: [] };
    groups.push(group);
  }
  group.items.push(item);
  return groups;
}, []);

// --- Interlinear rendering --------------------------------------------------

// Split the passage into word tokens (word + trailing punctuation) with their
// global start offsets, so we can colour each character by typed state and hang
// the English gloss beneath each word.
function tokenize(text) {
  const tokens = [];
  const regex = /\S+/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    tokens.push({ text: match[0], start: match.index });
  }
  return tokens;
}

function CharSpan({ char, index, caret, errorIndex }) {
  const isTyped = index < caret;
  const isCurrent = index === caret;
  const isError = index === errorIndex;

  return (
    <span className="relative inline-block">
      <span
        className={
          isTyped
            ? 'text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.65)]'
            : isError
              ? 'text-red-500 bg-red-500/10'
              : 'text-slate-200'
        }
      >
        {char}
      </span>
      {isCurrent && (
        <span className="absolute -bottom-0.5 left-0 w-full h-[2px] bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)] animate-pulse" />
      )}
    </span>
  );
}

function WordUnit({ token, caret, errorIndex }) {
  const surface = token.text.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, '');
  const gloss = useMemo(() => lookupGloss(surface), [surface]);

  return (
    <span className="inline-flex flex-col items-center align-top mx-[0.35rem] mb-3">
      <span className="text-2xl font-mono tracking-wide leading-tight">
        {token.text.split('').map((char, i) => (
          <CharSpan
            key={i}
            char={char}
            index={token.start + i}
            caret={caret}
            errorIndex={errorIndex}
          />
        ))}
      </span>
      <span className="mt-1 text-[10px] leading-tight text-slate-500 max-w-[10rem] text-center">
        {gloss || ' '}
      </span>
    </span>
  );
}

// One dropdown per category — scales better than a flat button wall as the
// prayer/literature library grows. Custom (not native <select>) so it matches
// the dark theme; closes on outside click.
function CategoryMenu({ group, activePassageId, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const active = group.items.find((item) => item.id === activePassageId);

  useEffect(() => {
    if (!open) return undefined;
    const onDocMouseDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-2.5 text-left transition-all ${
          active
            ? 'border-blue-500/50 bg-blue-600/15 text-blue-200'
            : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
        }`}
      >
        <span className="flex min-w-0 flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
            {group.category}
          </span>
          <span className="truncate text-sm font-semibold">
            {active ? active.label : 'Choose a passage…'}
          </span>
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="absolute z-20 mt-2 max-h-[40vh] w-full overflow-y-auto custom-scrollbar rounded-xl border border-slate-800 bg-slate-950/95 shadow-xl backdrop-blur">
          {group.items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelect(item);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2.5 text-left text-sm transition-colors ${
                item.id === activePassageId
                  ? 'bg-blue-600/20 text-blue-200'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PassageReader() {
  const [customText, setCustomText] = useState('');
  const [passage, setPassage] = useState(PASSAGES[0]);
  const [caret, setCaret] = useState(() => skipPunctuation(PASSAGES[0].text, 0));
  const [errorIndex, setErrorIndex] = useState(null);

  // Timing for WPM. startTime is stamped on the first correct keystroke;
  // endTime on completion; `now` ticks while typing so the live figure updates.
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [now, setNow] = useState(0);
  const startCaretRef = useRef(0);

  const text = passage?.text || '';
  const tokens = useMemo(() => tokenize(text), [text]);
  const isComplete = caret >= text.length && text.length > 0;
  const progress = text.length ? Math.round((caret / text.length) * 100) : 0;

  // WPM = (chars typed / 5) / minutes elapsed, standard-word convention.
  const clock = endTime ?? Math.max(now, startTime ?? 0);
  const elapsedMs = startTime == null ? 0 : Math.max(0, clock - startTime);
  const charsTyped = Math.max(0, caret - startCaretRef.current);
  const wpm = elapsedMs > 0 ? Math.round(charsTyped / 5 / (elapsedMs / 60000)) : 0;

  const resetTiming = useCallback(() => {
    setStartTime(null);
    setEndTime(null);
    setNow(0);
    startCaretRef.current = 0;
  }, []);

  const loadPassage = useCallback((next) => {
    setPassage(next);
    setCaret(skipPunctuation(next.text, 0));
    setErrorIndex(null);
    resetTiming();
  }, [resetTiming]);

  const restart = useCallback(() => {
    setCaret(skipPunctuation(text, 0));
    setErrorIndex(null);
    resetTiming();
  }, [text, resetTiming]);

  // Tick the live clock only while a run is in progress.
  useEffect(() => {
    if (startTime == null || endTime != null) return undefined;
    const id = setInterval(() => setNow(performance.now()), 250);
    return () => clearInterval(id);
  }, [startTime, endTime]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target;
      // Let the custom-passage textarea receive normal input.
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (!text || caret >= text.length) return;

      if (event.code === 'Backspace') {
        event.preventDefault();
        setErrorIndex(null);
        setCaret((prev) => {
          let p = prev;
          while (p > 0 && !isTypeable(text[p - 1])) p -= 1; // step back over auto-advanced punctuation
          if (p > 0) p -= 1; // remove one typeable char
          return p;
        });
        return;
      }

      const char = resolveChar(event);
      if (char == null) return;
      event.preventDefault();

      const expected = text[caret];
      const matches =
        char === ' '
          ? expected === ' '
          : IS_LETTER.test(expected) && normalizeChar(char) === normalizeChar(expected);

      if (matches) {
        setErrorIndex(null);
        if (startTime == null) {
          startCaretRef.current = caret;
          setStartTime(performance.now());
        }
        const nextCaret = skipPunctuation(text, caret + 1);
        if (nextCaret >= text.length) setEndTime(performance.now());
        setCaret(nextCaret);
      } else {
        setErrorIndex(caret);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [text, caret, startTime]);

  return (
    <div className="p-6 space-y-6">
      {/* Passage picker — one dropdown per category */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PASSAGE_GROUPS.map((group) => (
          <CategoryMenu
            key={group.category}
            group={group}
            activePassageId={passage?.id}
            onSelect={loadPassage}
          />
        ))}
      </div>

      {/* Progress + restart */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-green-400 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] font-mono text-slate-500 tabular-nums">{progress}%</span>
        <div
          title={isComplete ? 'Gross words per minute for the run' : 'Current words per minute'}
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 tabular-nums transition-colors ${
            isComplete
              ? 'border-green-500/40 bg-green-500/10 text-green-400'
              : 'border-slate-800 bg-slate-900/60 text-slate-400'
          }`}
        >
          <Gauge size={12} />
          <span className="text-[11px] font-mono font-bold">{wpm}</span>
          <span className="text-[9px] font-black uppercase tracking-[0.15em] opacity-70">
            {isComplete ? 'wpm gross' : 'wpm'}
          </span>
        </div>
        <button
          type="button"
          onClick={restart}
          title="Restart passage"
          aria-label="Restart passage"
          className="rounded-lg border border-slate-800 p-2 text-slate-400 transition-colors hover:text-white"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Interlinear typing surface */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 min-h-[220px] max-h-[45vh] overflow-y-auto custom-scrollbar leading-loose">
        {tokens.map((token) => (
          <WordUnit
            key={token.start}
            token={token}
            caret={caret}
            errorIndex={errorIndex}
          />
        ))}
      </div>

      {isComplete && (
        <div className="flex items-center justify-center gap-3 text-green-400">
          <ScrollText size={14} />
          <span className="text-[11px] font-black uppercase tracking-[0.3em]">
            Passage complete
          </span>
        </div>
      )}

      {/* Custom passage */}
      <div className="space-y-3 border-t border-slate-800 pt-5">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          Paste your own
        </p>
        <textarea
          value={customText}
          onChange={(event) => setCustomText(event.target.value)}
          placeholder="Paste a paragraph, book passage, or prayer in Russian…"
          rows={3}
          className="w-full rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50 focus:outline-none"
        />
        <button
          type="button"
          disabled={!customText.trim()}
          onClick={() =>
            loadPassage({ id: 'custom', label: 'Custom', category: 'Yours', text: customText.trim() })
          }
          className="rounded-xl border border-blue-500/30 bg-blue-600/15 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-blue-200 transition-all hover:bg-blue-600/25 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Load passage
        </button>
      </div>
    </div>
  );
}
