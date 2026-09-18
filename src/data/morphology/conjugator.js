// Rule-based Russian verb conjugation engine for the Morphology Lab.
//
// The companion to decliner.js. Russian verb morphology is messier than noun
// declension — mobile stress, a mutating present-tense stem, aspect, and a long
// tail of irregulars — so this engine is deliberately a rule engine PLUS a
// hand-verified curated bank: the regular machinery assembles present/future,
// past, and imperative forms from stems + a stress code, and any irregularity
// (stem mutations, suppletive pasts, defective verbs) is stored explicitly in an
// `overrides` block, exactly the way decliner.js handles irregular plurals.
//
// Stress is a combining acute (U+0301) in the DISPLAY forms only. Stems are
// stored WITH the acute on their stem-stressed vowel (like the noun bank), so a
// stem-stressed form is the marked stem + a bare ending, and an ending-stressed
// form is the bare stem + a marked ending.
//
// Aspect drives which tense the conjugated set represents:
//   • imperfective — the conjugated set is the PRESENT tense; the future is the
//     compound «буду / будешь / … + infinitive».
//   • perfective   — there is no present tense; the conjugated set IS the (simple)
//     future.

const ACUTE = '́';
const VOWELS = 'аеёиоуыэюяАЕЁИОУЫЭЮЯ';
const HUSHERS = 'жшщч';

const isVowel = (ch) => VOWELS.includes(ch);
const stripAcute = (s) => s.replace(/́/g, '');
const countVowels = (s) => [...stripAcute(s)].filter(isVowel).length;

function markLastVowel(stem) {
  const s = stripAcute(stem);
  for (let i = s.length - 1; i >= 0; i -= 1) {
    if (isVowel(s[i])) return `${s.slice(0, i + 1)}${ACUTE}${s.slice(i + 1)}`;
  }
  return s;
}

function markFirstVowel(ending) {
  for (let i = 0; i < ending.length; i += 1) {
    if (ending[i] === 'ё' || ending[i] === 'Ё') return ending; // ё is inherently stressed
    if (isVowel(ending[i])) return `${ending.slice(0, i + 1)}${ACUTE}${ending.slice(i + 1)}`;
  }
  return ending;
}

// Russian never marks stress on a monosyllable — drop the acute if the assembled
// form has fewer than two vowels (был, дал, знай).
const demoteMonosyllable = (form) => (countVowels(form) < 2 ? stripAcute(form) : form);

// Append the reflexive postfix: -сь after a vowel (бою́сь, боя́лась), -ся after a
// consonant / й / ь (боя́ться, бои́тся, бо́йся). Compound-future forms already
// carry the reflexive infinitive, so they pass through untouched.
function reflexivize(form) {
  if (!form || form.includes(' ')) return form;
  const last = stripAcute(form).slice(-1);
  return `${form}${isVowel(last) ? 'сь' : 'ся'}`;
}

const PERSONS = ['sg1', 'sg2', 'sg3', 'pl1', 'pl2', 'pl3'];

// The two productive present-tense ending sets. `e` marks the theme vowel that
// becomes ё when the ending is stressed in a first-conjugation verb.
const PRESENT_ENDINGS = {
  '1': { sg2: 'ешь', sg3: 'ет', pl1: 'ем', pl2: 'ете' }, // sg1 / pl3 chosen by iotation
  '2': { sg2: 'ишь', sg3: 'ит', pl1: 'им', pl2: 'ите' },
};

// Pick the -у/-ю (1sg) and -ут/-ют | -ат/-ят (3pl) endings from the stem's final
// sound. Vowel stems and the `soft` flag take the iotated set; husher stems and
// hard stems take the plain set.
function iotated(bareStem, soft) {
  const c = bareStem.slice(-1);
  if (isVowel(c)) return true;
  if (HUSHERS.includes(c)) return false;
  return !!soft;
}

// Is the present-tense stem stressed for this person under the stress code?
//   a = stem throughout · b = ending throughout · c = ending in 1sg, stem elsewhere
function presentStemStressed(stress, person) {
  if (stress === 'a') return true;
  if (stress === 'b') return false;
  if (stress === 'c') return person !== 'sg1';
  return true;
}

// Assemble one present/simple-future form from a marked stem + a bare ending.
function assemblePresent(markedStem, ending, stemStressed, isClass1) {
  const bare = stripAcute(markedStem);
  let form;
  if (stemStressed) {
    form = `${markedStem}${ending}`;
  } else if (isClass1 && ending[0] === 'е') {
    form = `${bare}ё${ending.slice(1)}`; // theme vowel е → ё when stressed
  } else {
    form = `${bare}${markFirstVowel(ending)}`;
  }
  return demoteMonosyllable(form);
}

const PAST_ENDINGS = { m: 'л', f: 'ла', n: 'ло', pl: 'ли' };

// Past: masc / neut / pl are stem-stressed for every verb; only the `f` code
// (был/была́, жил/жила́) pulls the feminine onto the ending.
function assemblePast(markedStem, key, pastStress) {
  const bare = stripAcute(markedStem);
  const ending = PAST_ENDINGS[key];
  const endStressed = pastStress === 'f' && key === 'f';
  const form = endStressed
    ? `${bare}${markFirstVowel(ending)}`
    : `${markedStem}${ending}`;
  return demoteMonosyllable(form);
}

const FUTURE_AUX = ['бу́ду', 'бу́дешь', 'бу́дет', 'бу́дем', 'бу́дете', 'бу́дут'];

// Imperative from the present stem: ending-stressed verbs take -и́ (пиши́,
// говори́); stem-stressed verbs take -й after a vowel (чита́й) or -ь after a
// single consonant (будь). Anything irregular is supplied via overrides.
function computeImperative(markedPresentStem, stress) {
  const bare = stripAcute(markedPresentStem);
  const last = bare.slice(-1);
  if (stress === 'b' || stress === 'c') {
    return { sg: demoteMonosyllable(`${bare}и́`), pl: `${bare}и́те` };
  }
  if (isVowel(last)) {
    return { sg: demoteMonosyllable(`${markedPresentStem}й`), pl: `${markedPresentStem}йте` };
  }
  return { sg: demoteMonosyllable(`${markedPresentStem}ь`), pl: `${markedPresentStem}ьте` };
}

/**
 * Conjugate a fully specified verb.
 * spec = {
 *   key, infinitive, gloss, aspect ('impf'|'perf'), partner?,
 *   type ('1'|'2'), group,
 *   presentStem,   // marked stem for sg2..pl3 (and sg1 unless sg1Stem given)
 *   sg1Stem?,      // marked stem for the 1sg only (mutations: люблю́, ви́жу)
 *   soft?,         // pick the iotated -ю/-ят endings on paired consonants
 *   stress,        // present-tense stress: 'a' | 'b' | 'c'
 *   pastStem,      // marked stem for the past (+ л/ла/ло/ли)
 *   pastStress?,   // 'a' (default) | 'f' (feminine ending-stressed)
 *   noPresent?,    // defective present (быть)
 *   noImperative?, // no natural imperative (хотеть, видеть)
 *   overrides?,    // { present:{...}, future:{...}, past:{...}, imperative:{sg,pl} }
 *   note,
 * }
 */
export function conjugateSpec(spec) {
  const {
    type,
    presentStem,
    sg1Stem,
    soft = false,
    stress = 'a',
    pastStem,
    pastStress = 'a',
    aspect,
    infinitive,
    reflexive = false,
    noPresent = false,
    noImperative = false,
    overrides = {},
  } = spec;

  const isClass1 = type === '1';

  // --- Conjugated set (present for impf, simple future for perf) --------------
  const conjugated = {};
  const stem1 = sg1Stem || presentStem;
  const bare1 = stripAcute(stem1);
  const bareRest = stripAcute(presentStem);

  // 1sg
  conjugated.sg1 = assemblePresent(
    stem1,
    iotated(bare1, soft) ? 'ю' : 'у',
    presentStemStressed(stress, 'sg1'),
    isClass1
  );
  // 3pl
  const pl3Iot = iotated(bareRest, soft);
  const pl3Ending = isClass1 ? (pl3Iot ? 'ют' : 'ут') : (pl3Iot ? 'ят' : 'ат');
  conjugated.pl3 = assemblePresent(
    presentStem,
    pl3Ending,
    presentStemStressed(stress, 'pl3'),
    isClass1
  );
  // sg2, sg3, pl1, pl2
  ['sg2', 'sg3', 'pl1', 'pl2'].forEach((p) => {
    conjugated[p] = assemblePresent(
      presentStem,
      PRESENT_ENDINGS[type][p],
      presentStemStressed(stress, p),
      isClass1
    );
  });

  if (reflexive) PERSONS.forEach((p) => { conjugated[p] = reflexivize(conjugated[p]); });

  const applyOv = (base, ov) => (ov ? { ...base, ...ov } : base);
  // present/future split by aspect
  let present = null;
  let future = null;
  let futureCompound = false;
  if (aspect === 'perf') {
    // A perfective verb has no present; its conjugated set is the simple future.
    future = applyOv(conjugated, overrides.future || overrides.present);
    futureCompound = false;
  } else {
    present = noPresent ? null : applyOv(conjugated, overrides.present);
    if (overrides.future) {
      future = overrides.future;
      futureCompound = false;
    } else {
      future = PERSONS.reduce((acc, p, i) => {
        acc[p] = `${FUTURE_AUX[i]} ${infinitive}`;
        return acc;
      }, {});
      futureCompound = true;
    }
  }
  // The simple conjugated set actually shown (present for impf, future for perf).
  const conjugatedFinal = aspect === 'perf' ? future : (present || null);

  // --- Past -------------------------------------------------------------------
  let past;
  if (overrides.past) {
    past = overrides.past;
  } else {
    past = {
      m: assemblePast(pastStem, 'm', pastStress),
      f: assemblePast(pastStem, 'f', pastStress),
      n: assemblePast(pastStem, 'n', pastStress),
      pl: assemblePast(pastStem, 'pl', pastStress),
    };
    if (reflexive) Object.keys(past).forEach((k) => { past[k] = reflexivize(past[k]); });
  }

  // --- Imperative -------------------------------------------------------------
  let imperative = null;
  if (overrides.imperative) {
    imperative = overrides.imperative;
  } else if (!noImperative) {
    imperative = computeImperative(presentStem, stress);
    if (reflexive) imperative = { sg: reflexivize(imperative.sg), pl: reflexivize(imperative.pl) };
  }

  return {
    present,
    future,
    futureCompound,
    past,
    imperative,
    // The conjugated set regardless of tense label, handy for the drill.
    conjugated: conjugatedFinal,
  };
}

// --- Curated verb bank -------------------------------------------------------
// Stems carry the acute on their stem-stressed vowel. Irregular / mutated forms
// live in `overrides` and are hand-verified by the self-test.

const RAW_VERBS = [
  // ---- First conjugation -------------------------------------------------
  { key: 'читать', infinitive: 'чита́ть', gloss: 'to read', aspect: 'impf', partner: 'прочитать', type: '1', group: 'First conjugation', presentStem: 'чита́', stress: 'a', pastStem: 'чита́', note: 'Regular -ать verb: the present stem чита- keeps a -й- (чита́ю, чита́ешь) and the stress never moves.' },
  { key: 'думать', infinitive: 'ду́мать', gloss: 'to think', aspect: 'impf', type: '1', group: 'First conjugation', presentStem: 'ду́ма', stress: 'a', pastStem: 'ду́ма', note: 'Model -ать verb with fixed stem stress throughout (ду́маю, ду́мал).' },
  { key: 'работать', infinitive: 'рабо́тать', gloss: 'to work', aspect: 'impf', type: '1', group: 'First conjugation', presentStem: 'рабо́та', stress: 'a', pastStem: 'рабо́та', note: 'Regular -ать verb, fixed stem stress (рабо́таю, рабо́тает).' },
  { key: 'знать', infinitive: 'знать', gloss: 'to know', aspect: 'impf', type: '1', group: 'First conjugation', presentStem: 'зна́', stress: 'a', pastStem: 'зна́', note: 'Short -ать verb; imperative знай, past знал.' },
  { key: 'писать', infinitive: 'писа́ть', gloss: 'to write', aspect: 'impf', partner: 'написать', type: '1', group: 'First conjugation', presentStem: 'пи́ш', sg1Stem: 'пиш', stress: 'c', pastStem: 'писа́', note: 'с → ш mutation runs through the whole present. Mobile stress: пишу́ but пи́шешь.' },
  { key: 'сказать', infinitive: 'сказа́ть', gloss: 'to say (once)', aspect: 'perf', partner: 'говорить', type: '1', group: 'First conjugation', presentStem: 'ска́ж', sg1Stem: 'скаж', stress: 'c', pastStem: 'сказа́', note: 'Perfective: з → ж mutation, so the conjugated set (скажу́, ска́жешь) is the FUTURE, not a present.' },
  { key: 'жить', infinitive: 'жить', gloss: 'to live', aspect: 'impf', type: '1', group: 'First conjugation', presentStem: 'жив', stress: 'b', pastStem: 'жи́', pastStress: 'f', note: 'Consonant stem жив- with fixed ending stress (живу́, живёшь) and a feminine-stressed past жила́.' },
  { key: 'идти', infinitive: 'идти́', gloss: 'to go (on foot)', aspect: 'impf', partner: 'пойти', type: '1', group: 'First conjugation', presentStem: 'ид', stress: 'b', pastStem: 'ш', overrides: { past: { m: 'шёл', f: 'шла', n: 'шло', pl: 'шли' } }, note: 'Ending-stressed present (иду́, идёшь) but a suppletive past шёл / шла / шло / шли.' },
  { key: 'мочь', infinitive: 'мочь', gloss: 'to be able to', aspect: 'impf', type: '1', group: 'First conjugation', presentStem: 'мо́ж', stress: 'c', pastStem: 'мог', noImperative: true, overrides: { present: { sg1: 'могу́', sg2: 'мо́жешь', sg3: 'мо́жет', pl1: 'мо́жем', pl2: 'мо́жете', pl3: 'мо́гут' }, past: { m: 'мог', f: 'могла́', n: 'могло́', pl: 'могли́' } }, note: 'Irregular г/ж alternation (могу́ but мо́жешь, мо́гут) and an ending-stressed past могла́, могло́.' },

  // ---- Second conjugation ------------------------------------------------
  { key: 'говорить', infinitive: 'говори́ть', gloss: 'to speak, talk', aspect: 'impf', partner: 'сказать', type: '2', group: 'Second conjugation', presentStem: 'говор', soft: true, stress: 'b', pastStem: 'говори́', note: 'Model -ить verb with fixed ending stress (говорю́, говори́шь, говоря́т).' },
  { key: 'любить', infinitive: 'люби́ть', gloss: 'to love, like', aspect: 'impf', type: '2', group: 'Second conjugation', presentStem: 'лю́б', sg1Stem: 'любл', soft: true, stress: 'c', pastStem: 'люби́', note: 'Labial + л appears only in the 1sg (люблю́), then the stress retracts: лю́бишь, лю́бят.' },
  { key: 'видеть', infinitive: 'ви́деть', gloss: 'to see', aspect: 'impf', partner: 'увидеть', type: '2', group: 'Second conjugation', presentStem: 'ви́д', sg1Stem: 'ви́ж', soft: true, stress: 'a', pastStem: 'ви́де', noImperative: true, note: 'д → ж in the 1sg only (ви́жу), fixed stem stress; -еть verb of the second conjugation.' },
  { key: 'смотреть', infinitive: 'смотре́ть', gloss: 'to watch, look', aspect: 'impf', partner: 'посмотреть', type: '2', group: 'Second conjugation', presentStem: 'смо́тр', sg1Stem: 'смотр', soft: true, stress: 'c', pastStem: 'смотре́', note: 'Second-conjugation -еть verb with mobile stress: смотрю́ but смо́тришь.' },
  { key: 'слышать', infinitive: 'слы́шать', gloss: 'to hear', aspect: 'impf', type: '2', group: 'Second conjugation', presentStem: 'слы́ш', stress: 'a', pastStem: 'слы́ша', noImperative: true, note: 'Husher stem: -ать spelling but a second-conjugation paradigm (слы́шу, слы́шишь, слы́шат).' },
  { key: 'держать', infinitive: 'держа́ть', gloss: 'to hold', aspect: 'impf', type: '2', group: 'Second conjugation', presentStem: 'де́рж', sg1Stem: 'держ', stress: 'c', pastStem: 'держа́', note: 'Husher stem, second conjugation, mobile stress: держу́ but де́ржишь, де́ржат.' },
  { key: 'просить', infinitive: 'проси́ть', gloss: 'to ask, request', aspect: 'impf', partner: 'попросить', type: '2', group: 'Second conjugation', presentStem: 'про́с', sg1Stem: 'прош', soft: true, stress: 'c', pastStem: 'проси́', note: 'с → ш in the 1sg only (прошу́), then про́сишь, про́сят with retracted stress.' },
  { key: 'строить', infinitive: 'стро́ить', gloss: 'to build', aspect: 'impf', partner: 'построить', type: '2', group: 'Second conjugation', presentStem: 'стро́', soft: true, stress: 'a', pastStem: 'стро́и', note: 'Vowel stem: the 1sg takes -ю (стро́ю) and the imperative is стро́й.' },
  { key: 'купить', infinitive: 'купи́ть', gloss: 'to buy', aspect: 'perf', partner: 'покупать', type: '2', group: 'Second conjugation', presentStem: 'ку́п', sg1Stem: 'купл', soft: true, stress: 'c', pastStem: 'купи́', note: 'Perfective: labial + л in the 1sg (куплю́) makes the FUTURE куплю́, ку́пишь.' },

  // ---- Irregular / mixed -------------------------------------------------
  { key: 'быть', infinitive: 'быть', gloss: 'to be', aspect: 'impf', type: '1', group: 'Irregular', presentStem: 'буд', stress: 'a', pastStem: 'бы́', pastStress: 'f', noPresent: true, overrides: { future: { sg1: 'бу́ду', sg2: 'бу́дешь', sg3: 'бу́дет', pl1: 'бу́дем', pl2: 'бу́дете', pl3: 'бу́дут' }, imperative: { sg: 'будь', pl: 'бу́дьте' } }, note: 'Defective present (only есть survives); its future is the simple бу́ду / бу́дешь, and the past был / была́ / бы́ло / бы́ли.' },
  { key: 'хотеть', infinitive: 'хоте́ть', gloss: 'to want', aspect: 'impf', type: '1', group: 'Irregular', presentStem: 'хот', stress: 'a', pastStem: 'хоте́', noImperative: true, overrides: { present: { sg1: 'хочу́', sg2: 'хо́чешь', sg3: 'хо́чет', pl1: 'хоти́м', pl2: 'хоти́те', pl3: 'хотя́т' } }, note: 'Mixed conjugation: singular goes first-conjugation with т → ч (хочу́, хо́чешь), plural goes second (хоти́м, хотя́т).' },
  { key: 'дать', infinitive: 'дать', gloss: 'to give', aspect: 'perf', partner: 'давать', type: '1', group: 'Irregular', presentStem: 'дад', stress: 'a', pastStem: 'да́', pastStress: 'f', overrides: { future: { sg1: 'дам', sg2: 'дашь', sg3: 'даст', pl1: 'дади́м', pl2: 'дади́те', pl3: 'даду́т' }, imperative: { sg: 'дай', pl: 'да́йте' } }, note: 'Athematic perfective: дам / дашь / даст … as its future, with a feminine-stressed past дала́.' },
  { key: 'есть', infinitive: 'есть', gloss: 'to eat', aspect: 'impf', partner: 'съесть', type: '1', group: 'Irregular', presentStem: 'ед', stress: 'a', pastStem: 'е́', overrides: { present: { sg1: 'ем', sg2: 'ешь', sg3: 'ест', pl1: 'еди́м', pl2: 'еди́те', pl3: 'едя́т' }, imperative: { sg: 'ешь', pl: 'е́шьте' } }, note: 'Athematic present ем / ешь / ест / еди́м / еди́те / едя́т; past е́л / е́ла.' },

  // ---- Government verbs (govern a non-accusative case) --------------------
  // `governs` names the case the verb forces on its object; used by the Verb
  // Government module. Accusative-governing verbs above (видеть, читать, любить)
  // also carry the tag added programmatically below.
  { key: 'помогать', infinitive: 'помога́ть', gloss: 'to help', aspect: 'impf', type: '1', group: 'First conjugation', presentStem: 'помога́', stress: 'a', pastStem: 'помога́', governs: { case: 'dat' }, note: 'Governs the DATIVE — you help TO someone: помога́ю бра́ту, not *бра́та.' },
  { key: 'верить', infinitive: 'ве́рить', gloss: 'to believe, trust', aspect: 'impf', type: '2', group: 'Second conjugation', presentStem: 'ве́р', soft: true, stress: 'a', pastStem: 'ве́ри', governs: { case: 'dat' }, note: 'Governs the DATIVE: ве́рю дру́гу — you give trust TO someone.' },
  { key: 'ждать', infinitive: 'ждать', gloss: 'to wait for', aspect: 'impf', type: '1', group: 'First conjugation', presentStem: 'жд', stress: 'b', pastStem: 'жда́', pastStress: 'f', governs: { case: 'gen' }, note: 'Governs the GENITIVE for a thing awaited: жду по́езда, жду отве́та. Feminine-stressed past ждала́.' },
  { key: 'бояться', infinitive: 'боя́ться', gloss: 'to fear, be afraid of', aspect: 'impf', type: '2', group: 'Second conjugation', presentStem: 'бо', soft: true, stress: 'b', reflexive: true, pastStem: 'боя́', governs: { case: 'gen' }, overrides: { imperative: { sg: 'бо́йся', pl: 'бо́йтесь' } }, note: 'Reflexive; governs the GENITIVE: бою́сь воды́, бою́сь но́чи — afraid OF something.' },
  { key: 'гордиться', infinitive: 'горди́ться', gloss: 'to be proud of', aspect: 'impf', type: '2', group: 'Second conjugation', presentStem: 'горд', sg1Stem: 'горж', soft: true, stress: 'b', reflexive: true, pastStem: 'горди́', governs: { case: 'ins' }, note: 'Reflexive with a д → ж 1sg (горжу́сь); governs the INSTRUMENTAL: горжу́сь бра́том.' },
  { key: 'интересоваться', infinitive: 'интересова́ться', gloss: 'to be interested in', aspect: 'impf', type: '1', group: 'First conjugation', presentStem: 'интересу́', stress: 'a', reflexive: true, pastStem: 'интересова́', governs: { case: 'ins' }, note: 'Reflexive -овать verb (present -у-: интересу́юсь); governs the INSTRUMENTAL: интересу́юсь кни́гой.' },

  // ---- Ditransitive verbs (govern TWO objects at once) -------------------
  // `frame` is an ordered pair of slots; the Verb Government module renders both
  // objects and highlights how one verb dictates two endings simultaneously.
  { key: 'давать', infinitive: 'дава́ть', gloss: 'to give', aspect: 'impf', partner: 'дать', type: '1', group: 'First conjugation', presentStem: 'да', stress: 'b', pastStem: 'дава́', frame: [{ case: 'dat' }, { case: 'acc' }], overrides: { imperative: { sg: 'дава́й', pl: 'дава́йте' } }, note: 'Ditransitive: gives a DATIVE recipient an ACCUSATIVE thing — даю́ бра́ту кни́гу. Present drops -ва- (даю́, даёшь).' },
  { key: 'рассказывать', infinitive: 'расска́зывать', gloss: 'to tell (about)', aspect: 'impf', partner: 'рассказать', type: '1', group: 'First conjugation', presentStem: 'расска́зыва', stress: 'a', pastStem: 'расска́зыва', frame: [{ case: 'dat' }, { case: 'pre', prep: 'о' }], note: 'Ditransitive: tells a DATIVE listener about a PREPOSITIONAL topic — расска́зываю бра́ту о кни́ге.' },
  { key: 'спрашивать', infinitive: 'спра́шивать', gloss: 'to ask (about)', aspect: 'impf', partner: 'спросить', type: '1', group: 'First conjugation', presentStem: 'спра́шива', stress: 'a', pastStem: 'спра́шива', frame: [{ case: 'acc' }, { case: 'pre', prep: 'о' }], note: 'Ditransitive: asks an ACCUSATIVE person about a PREPOSITIONAL topic — спра́шиваю бра́та о кни́ге.' },
];

// Accusative government is the default for the plain transitive verbs already in
// the bank — tag them so the government module can contrast them with the rest.
const ACC_GOVERN = new Set(['читать', 'писать', 'видеть', 'любить', 'строить', 'купить']);
// Prepositional government (topic of thought / speech, with о).
const PRE_GOVERN = { думать: 'о', говорить: 'о' };

export const VERB_BANK = RAW_VERBS.map((entry) => {
  let governs = entry.governs;
  if (!governs && ACC_GOVERN.has(entry.key)) governs = { case: 'acc' };
  if (!governs && PRE_GOVERN[entry.key]) governs = { case: 'pre', prep: PRE_GOVERN[entry.key] };
  return { ...entry, governs, forms: conjugateSpec(entry) };
});

export const VERB_BANK_BY_KEY = VERB_BANK.reduce((acc, v) => {
  acc[v.key] = v;
  return acc;
}, {});

export const VERB_GROUPS = ['First conjugation', 'Second conjugation', 'Irregular'];

export const ASPECT_LABELS = { impf: 'imperfective', perf: 'perfective' };

export const CONJ_TYPE_LABELS = {
  '1': 'first conjugation',
  '2': 'second conjugation',
};

export const PERSON_ROWS = [
  { key: 'sg1', pronoun: 'я', label: '1 sg' },
  { key: 'sg2', pronoun: 'ты', label: '2 sg' },
  { key: 'sg3', pronoun: 'он / она', label: '3 sg' },
  { key: 'pl1', pronoun: 'мы', label: '1 pl' },
  { key: 'pl2', pronoun: 'вы', label: '2 pl' },
  { key: 'pl3', pronoun: 'они', label: '3 pl' },
];

export const PAST_ROWS = [
  { key: 'm', pronoun: 'он', label: 'masculine' },
  { key: 'f', pronoun: 'она', label: 'feminine' },
  { key: 'n', pronoun: 'оно', label: 'neuter' },
  { key: 'pl', pronoun: 'они', label: 'plural' },
];

export { stripAcute };
