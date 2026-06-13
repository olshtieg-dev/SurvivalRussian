// Quiz registry — knowledge-test bank, one quiz per curriculum chunk (chunkId matches a
// lesson family/group id, or a topical chunk). Auto-maintained: one import + array entry
// per quiz JSON in this folder.

import adjectivesColors from './adjectives-colors.json';
import adjectivesDescriptive from './adjectives-descriptive.json';
import adverbsDegree from './adverbs-degree.json';
import adverbsManner from './adverbs-manner.json';
import adverbsPlace from './adverbs-place.json';
import adverbsPredicative from './adverbs-predicative.json';
import adverbsQuantity from './adverbs-quantity.json';
import adverbsTime from './adverbs-time.json';
import binaryAdjectives from './binary-adjectives.json';
import comparatives from './comparatives.json';
import conditional from './conditional.json';
import diminutives from './diminutives.json';
import gerunds from './gerunds.json';
import motionVerbs from './motion-verbs.json';
import nounsAbstractEvent from './nouns-abstract-event.json';
import nounsAbstractMind from './nouns-abstract-mind.json';
import nounsAbstractStructure from './nouns-abstract-structure.json';
import nounsAbstract from './nouns-abstract.json';
import nounsAnimals from './nouns-animals.json';
import nounsBodyPerson from './nouns-body-person.json';
import nounsCommunicationMedia from './nouns-communication-media.json';
import nounsEducationScience from './nouns-education-science.json';
import nounsEmotionsStates from './nouns-emotions-states.json';
import nounsFamily from './nouns-family.json';
import nounsFoodDrink from './nouns-food-drink.json';
import nounsHousehold from './nouns-household.json';
import nounsMotionLocation from './nouns-motion-location.json';
import nounsNatureWeather from './nouns-nature-weather.json';
import nounsPeopleRoles from './nouns-people-roles.json';
import nounsSocietyState from './nouns-society-state.json';
import nounsTimeUnits from './nouns-time-units.json';
import nounsTransport from './nouns-transport.json';
import nounsWorkMoney from './nouns-work-money.json';
import numerals from './numerals.json';
import participles from './participles.json';
import passiveVoice from './passive-voice.json';
import possessives from './possessives.json';
import verbsFirstConjugation from './verbs-first-conjugation.json';
import verbsIrregular from './verbs-irregular.json';
import verbsMixedConjugation from './verbs-mixed-conjugation.json';
import verbsSecondConjugation from './verbs-second-conjugation.json';

export const quizzes = [
  adjectivesColors,
  adjectivesDescriptive,
  adverbsDegree,
  adverbsManner,
  adverbsPlace,
  adverbsPredicative,
  adverbsQuantity,
  adverbsTime,
  binaryAdjectives,
  comparatives,
  conditional,
  diminutives,
  gerunds,
  motionVerbs,
  nounsAbstractEvent,
  nounsAbstractMind,
  nounsAbstractStructure,
  nounsAbstract,
  nounsAnimals,
  nounsBodyPerson,
  nounsCommunicationMedia,
  nounsEducationScience,
  nounsEmotionsStates,
  nounsFamily,
  nounsFoodDrink,
  nounsHousehold,
  nounsMotionLocation,
  nounsNatureWeather,
  nounsPeopleRoles,
  nounsSocietyState,
  nounsTimeUnits,
  nounsTransport,
  nounsWorkMoney,
  numerals,
  participles,
  passiveVoice,
  possessives,
  verbsFirstConjugation,
  verbsIrregular,
  verbsMixedConjugation,
  verbsSecondConjugation,
];

export const quizByChunkId = Object.fromEntries(quizzes.map((q) => [q.chunkId, q]));

export function getQuiz(chunkId) {
  return quizByChunkId[chunkId] || null;
}
