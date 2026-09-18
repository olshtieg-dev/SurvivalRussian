// Per-trigger example sentences for the Case Meanings "Learn" view. Clicking a
// trigger word swaps the card's example to one built around that preposition, so
// the learner sees the case in the concrete context each trigger creates.
// `focus` is the case-bearing word to highlight (bare, as it appears in `ru`).

export const CASE_TRIGGER_EXAMPLES = {
  gen: {
    'у': { ru: 'У брата есть большая собака.', en: 'The brother has a big dog.', focus: 'брата' },
    'нет': { ru: 'Сегодня здесь нет воды.', en: 'There is no water here today.', focus: 'воды' },
    'от': { ru: 'Я иду от врача домой.', en: 'I am walking home from the doctor.', focus: 'врача' },
    'до': { ru: 'Мы едем до самого города.', en: 'We are going all the way to the city.', focus: 'города' },
    'из': { ru: 'Он вышел из старого дома.', en: 'He came out of the old house.', focus: 'дома' },
    'без': { ru: 'Я пью кофе без сахара.', en: 'I drink coffee without sugar.', focus: 'сахара' },
    'для': { ru: 'Это подарок для моей мамы.', en: 'This is a gift for my mom.', focus: 'мамы' },
    'около': { ru: 'Мы живём около большого парка.', en: 'We live near a big park.', focus: 'парка' },
  },
  dat: {
    'к': { ru: 'Я иду к другу в гости.', en: 'I am going to visit a friend.', focus: 'другу' },
    'по': { ru: 'Мы гуляем по тихому городу.', en: 'We are strolling around the quiet city.', focus: 'городу' },
  },
  acc: {
    'в': { ru: 'Каждое утро я иду в школу.', en: 'Every morning I go to school.', focus: 'школу' },
    'на': { ru: 'Он смотрит на синее небо.', en: 'He is looking at the blue sky.', focus: 'небо' },
    'через': { ru: 'Мы идём через старый мост.', en: 'We are walking across the old bridge.', focus: 'мост' },
    'про': { ru: 'Это книга про большую войну.', en: 'This is a book about a great war.', focus: 'войну' },
  },
  ins: {
    'с': { ru: 'Я говорю с добрым другом.', en: 'I am talking with a kind friend.', focus: 'другом' },
    'за': { ru: 'Сад находится за нашим домом.', en: 'The garden is behind our house.', focus: 'домом' },
    'под': { ru: 'Кот спит под старым столом.', en: 'The cat is sleeping under the old table.', focus: 'столом' },
    'над': { ru: 'Лампа висит над большим столом.', en: 'The lamp hangs above the big table.', focus: 'столом' },
    'перед': { ru: 'Машина стоит перед новым домом.', en: 'The car is parked in front of the new house.', focus: 'домом' },
    'между': { ru: 'Дом стоит между рекой и лесом.', en: 'The house stands between the river and the forest.', focus: 'рекой' },
  },
  pre: {
    'в': { ru: 'Я живу в большом городе.', en: 'I live in a big city.', focus: 'городе' },
    'на': { ru: 'Книга лежит на моём столе.', en: 'The book is lying on my table.', focus: 'столе' },
    'о': { ru: 'Мы часто говорим о книге.', en: 'We often talk about the book.', focus: 'книге' },
    'при': { ru: 'Красивый сад при нашем доме.', en: 'A beautiful garden by our house.', focus: 'доме' },
  },
};
