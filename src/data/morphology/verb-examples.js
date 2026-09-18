// Example sentences for the Verb Conjugation explorer, one small set per verb,
// each illustrating a distinct form. Rendered with an interlinear gloss sourced
// from vocabulary.json (see gloss.js). Sentences are natural unstressed text so
// their tokens resolve against the (bare) vocabulary keys. `target` is the verb
// form to highlight. Authored 2026-09-18.

export const VERB_EXAMPLES = {
  "читать": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я читаю книгу по вечерам.",
      "en": "I read a book in the evenings.",
      "target": "читаю"
    },
    {
      "formKey": "sg2",
      "formLabel": "present · ты",
      "ru": "Ты читаешь очень быстро.",
      "en": "You read very quickly.",
      "target": "читаешь"
    },
    {
      "formKey": "past-f",
      "formLabel": "past · feminine",
      "ru": "Она читала письмо весь вечер.",
      "en": "She was reading the letter all evening.",
      "target": "читала"
    },
    {
      "formKey": "imp",
      "formLabel": "imperative",
      "ru": "Читай эту книгу внимательно.",
      "en": "Read this book carefully.",
      "target": "Читай"
    }
  ],
  "думать": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я думаю о тебе каждый день.",
      "en": "I think about you every day.",
      "target": "думаю"
    },
    {
      "formKey": "sg3",
      "formLabel": "present · он",
      "ru": "Он думает только о работе.",
      "en": "He thinks only about work.",
      "target": "думает"
    },
    {
      "formKey": "past-m",
      "formLabel": "past · masculine",
      "ru": "Я долго думал над этим.",
      "en": "I thought about this for a long time.",
      "target": "думал"
    },
    {
      "formKey": "imp",
      "formLabel": "imperative",
      "ru": "Думай прежде чем говорить.",
      "en": "Think before you speak.",
      "target": "Думай"
    }
  ],
  "работать": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я работаю в большом городе.",
      "en": "I work in a big city.",
      "target": "работаю"
    },
    {
      "formKey": "pl3",
      "formLabel": "present · они",
      "ru": "Они работают с утра до вечера.",
      "en": "They work from morning till evening.",
      "target": "работают"
    },
    {
      "formKey": "past-f",
      "formLabel": "past · feminine",
      "ru": "Мама работала в школе.",
      "en": "Mom worked at a school.",
      "target": "работала"
    },
    {
      "formKey": "imp",
      "formLabel": "imperative",
      "ru": "Работай спокойно и не спеши.",
      "en": "Work calmly and do not rush.",
      "target": "Работай"
    }
  ],
  "знать": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я знаю этот город хорошо.",
      "en": "I know this city well.",
      "target": "знаю"
    },
    {
      "formKey": "sg2",
      "formLabel": "present · ты",
      "ru": "Ты знаешь его имя?",
      "en": "Do you know his name?",
      "target": "знаешь"
    },
    {
      "formKey": "past-pl",
      "formLabel": "past · plural",
      "ru": "Мы не знали об этом.",
      "en": "We did not know about this.",
      "target": "знали"
    },
    {
      "formKey": "imp",
      "formLabel": "imperative",
      "ru": "Знай своё место здесь.",
      "en": "Know your place here.",
      "target": "Знай"
    }
  ],
  "писать": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я пишу письмо старому другу.",
      "en": "I am writing a letter to an old friend.",
      "target": "пишу"
    },
    {
      "formKey": "sg3",
      "formLabel": "present · она",
      "ru": "Она пишет очень красиво.",
      "en": "She writes very beautifully.",
      "target": "пишет"
    },
    {
      "formKey": "past-m",
      "formLabel": "past · masculine",
      "ru": "Он писал стихи по ночам.",
      "en": "He wrote poems at night.",
      "target": "писал"
    },
    {
      "formKey": "imp",
      "formLabel": "imperative",
      "ru": "Пиши мне почаще, пожалуйста.",
      "en": "Write to me more often, please.",
      "target": "Пиши"
    }
  ],
  "сказать": [
    {
      "formKey": "fut-sg1",
      "formLabel": "future · я",
      "ru": "Я скажу тебе всю правду.",
      "en": "I will tell you the whole truth.",
      "target": "скажу"
    },
    {
      "formKey": "fut-sg3",
      "formLabel": "future · он",
      "ru": "Он скажет об этом завтра.",
      "en": "He will say about this tomorrow.",
      "target": "скажет"
    },
    {
      "formKey": "past-f",
      "formLabel": "past · feminine",
      "ru": "Она сказала мне очень тихо.",
      "en": "She said to me very quietly.",
      "target": "сказала"
    },
    {
      "formKey": "imp",
      "formLabel": "imperative",
      "ru": "Скажи мне правду прямо сейчас.",
      "en": "Tell me the truth right now.",
      "target": "Скажи"
    }
  ],
  "жить": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я живу в маленькой квартире.",
      "en": "I live in a small apartment.",
      "target": "живу"
    },
    {
      "formKey": "sg2",
      "formLabel": "present · ты",
      "ru": "Ты живёшь далеко отсюда?",
      "en": "Do you live far from here?",
      "target": "живёшь"
    },
    {
      "formKey": "past-pl",
      "formLabel": "past · plural",
      "ru": "Они жили в этом доме.",
      "en": "They lived in this house.",
      "target": "жили"
    },
    {
      "formKey": "imp",
      "formLabel": "imperative",
      "ru": "Живи честно и просто.",
      "en": "Live honestly and simply.",
      "target": "Живи"
    }
  ],
  "идти": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я иду домой после работы.",
      "en": "I am going home after work.",
      "target": "иду"
    },
    {
      "formKey": "pl1",
      "formLabel": "present · мы",
      "ru": "Мы идём в парк вместе.",
      "en": "We are going to the park together.",
      "target": "идём"
    },
    {
      "formKey": "past-m",
      "formLabel": "past · masculine",
      "ru": "Он шёл по улице медленно.",
      "en": "He was walking down the street slowly.",
      "target": "шёл"
    },
    {
      "formKey": "imp",
      "formLabel": "imperative",
      "ru": "Иди сюда, я жду тебя.",
      "en": "Come here, I am waiting for you.",
      "target": "Иди"
    }
  ],
  "мочь": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я могу помочь тебе завтра.",
      "en": "I can help you tomorrow.",
      "target": "могу"
    },
    {
      "formKey": "sg2",
      "formLabel": "present · ты",
      "ru": "Ты можешь открыть окно?",
      "en": "Can you open the window?",
      "target": "можешь"
    },
    {
      "formKey": "pl3",
      "formLabel": "present · они",
      "ru": "Они могут прийти вечером.",
      "en": "They can come in the evening.",
      "target": "могут"
    },
    {
      "formKey": "pastF",
      "formLabel": "past · она",
      "ru": "Она не могла найти ключи.",
      "en": "She couldn't find the keys.",
      "target": "могла"
    }
  ],
  "говорить": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я говорю по-русски немного.",
      "en": "I speak Russian a little.",
      "target": "говорю"
    },
    {
      "formKey": "sg3",
      "formLabel": "present · он",
      "ru": "Он говорит очень быстро.",
      "en": "He talks very fast.",
      "target": "говорит"
    },
    {
      "formKey": "pastM",
      "formLabel": "past · он",
      "ru": "Вчера я говорил с врачом.",
      "en": "Yesterday I spoke with the doctor.",
      "target": "говорил"
    },
    {
      "formKey": "imp",
      "formLabel": "imperative",
      "ru": "Говори громче, пожалуйста.",
      "en": "Speak louder, please.",
      "target": "Говори"
    }
  ],
  "любить": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я люблю пить чай утром.",
      "en": "I love drinking tea in the morning.",
      "target": "люблю"
    },
    {
      "formKey": "sg2",
      "formLabel": "present · ты",
      "ru": "Ты любишь читать книги?",
      "en": "Do you like reading books?",
      "target": "любишь"
    },
    {
      "formKey": "pl3",
      "formLabel": "present · они",
      "ru": "Дети любят сладкое.",
      "en": "Children love sweets.",
      "target": "любят"
    },
    {
      "formKey": "imp",
      "formLabel": "imperative",
      "ru": "Люби свою работу!",
      "en": "Love your work!",
      "target": "Люби"
    }
  ],
  "видеть": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я вижу большой дом впереди.",
      "en": "I see a big house ahead.",
      "target": "вижу"
    },
    {
      "formKey": "sg2",
      "formLabel": "present · ты",
      "ru": "Ты видишь эту птицу?",
      "en": "Do you see this bird?",
      "target": "видишь"
    },
    {
      "formKey": "pl1",
      "formLabel": "present · мы",
      "ru": "Мы видим горы вдалеке.",
      "en": "We see mountains in the distance.",
      "target": "видим"
    },
    {
      "formKey": "pastF",
      "formLabel": "past · она",
      "ru": "Она видела тебя вчера.",
      "en": "She saw you yesterday.",
      "target": "видела"
    }
  ],
  "смотреть": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я смотрю новый фильм.",
      "en": "I am watching a new film.",
      "target": "смотрю"
    },
    {
      "formKey": "sg3",
      "formLabel": "present · он",
      "ru": "Он смотрит в окно.",
      "en": "He is looking out the window.",
      "target": "смотрит"
    },
    {
      "formKey": "pastM",
      "formLabel": "past · он",
      "ru": "Вчера я смотрел футбол.",
      "en": "Yesterday I watched football.",
      "target": "смотрел"
    },
    {
      "formKey": "imp",
      "formLabel": "imperative",
      "ru": "Смотри на дорогу!",
      "en": "Watch the road!",
      "target": "Смотри"
    }
  ],
  "слышать": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я слышу музыку из окна.",
      "en": "I hear music from the window.",
      "target": "слышу"
    },
    {
      "formKey": "sg2",
      "formLabel": "present · ты",
      "ru": "Ты слышишь этот шум?",
      "en": "Do you hear that noise?",
      "target": "слышишь"
    },
    {
      "formKey": "pl3",
      "formLabel": "present · они",
      "ru": "Они плохо слышат меня.",
      "en": "They can barely hear me.",
      "target": "слышат"
    },
    {
      "formKey": "pastM",
      "formLabel": "past · он",
      "ru": "Я слышал эту песню раньше.",
      "en": "I heard this song before.",
      "target": "слышал"
    }
  ],
  "держать": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я держу твою руку крепко.",
      "en": "I am holding your hand tightly.",
      "target": "держу"
    },
    {
      "formKey": "sg3",
      "formLabel": "present · он",
      "ru": "Он держит ребёнка на руках.",
      "en": "He is holding the child in his arms.",
      "target": "держит"
    },
    {
      "formKey": "pastF",
      "formLabel": "past · она",
      "ru": "Она держала книгу в руках.",
      "en": "She was holding a book in her hands.",
      "target": "держала"
    },
    {
      "formKey": "imp",
      "formLabel": "imperative",
      "ru": "Держи чашку двумя руками!",
      "en": "Hold the cup with both hands!",
      "target": "Держи"
    }
  ],
  "просить": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я прошу тебя о помощи.",
      "en": "I am asking you for help.",
      "target": "прошу"
    },
    {
      "formKey": "sg2",
      "formLabel": "present · ты",
      "ru": "Ты просишь слишком много.",
      "en": "You are asking for too much.",
      "target": "просишь"
    },
    {
      "formKey": "pl3",
      "formLabel": "present · они",
      "ru": "Они просят воды и хлеба.",
      "en": "They are asking for water and bread.",
      "target": "просят"
    },
    {
      "formKey": "imp",
      "formLabel": "imperative",
      "ru": "Проси помощь у друзей.",
      "en": "Ask your friends for help.",
      "target": "Проси"
    }
  ],
  "строить": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я строю дом за городом.",
      "en": "I am building a house outside the city.",
      "target": "строю"
    },
    {
      "formKey": "sg3",
      "formLabel": "present · он",
      "ru": "Отец строит новый гараж.",
      "en": "Father is building a new garage.",
      "target": "строит"
    },
    {
      "formKey": "past-m",
      "formLabel": "past · он",
      "ru": "Дед строил этот мост сам.",
      "en": "Grandfather built this bridge himself.",
      "target": "строил"
    },
    {
      "formKey": "imperative",
      "formLabel": "imperative · ты",
      "ru": "Строй планы на будущее заранее.",
      "en": "Make plans for the future in advance.",
      "target": "Строй"
    }
  ],
  "купить": [
    {
      "formKey": "fut-sg1",
      "formLabel": "future · я",
      "ru": "Завтра я куплю новую машину.",
      "en": "Tomorrow I will buy a new car.",
      "target": "куплю"
    },
    {
      "formKey": "fut-sg3",
      "formLabel": "future · он",
      "ru": "Он купит хлеб в магазине.",
      "en": "He will buy bread at the store.",
      "target": "купит"
    },
    {
      "formKey": "past-f",
      "formLabel": "past · она",
      "ru": "Мама купила красивые цветы.",
      "en": "Mom bought beautiful flowers.",
      "target": "купила"
    },
    {
      "formKey": "imperative",
      "formLabel": "imperative · ты",
      "ru": "Купи молока и яиц, пожалуйста.",
      "en": "Buy some milk and eggs, please.",
      "target": "Купи"
    }
  ],
  "быть": [
    {
      "formKey": "fut-sg1",
      "formLabel": "future · я",
      "ru": "Завтра я буду дома весь день.",
      "en": "Tomorrow I will be home all day.",
      "target": "буду"
    },
    {
      "formKey": "fut-sg3",
      "formLabel": "future · он",
      "ru": "Он будет рад видеть тебя.",
      "en": "He will be glad to see you.",
      "target": "будет"
    },
    {
      "formKey": "past-f",
      "formLabel": "past · она",
      "ru": "Она была очень рада.",
      "en": "She was very glad.",
      "target": "была"
    },
    {
      "formKey": "imperative",
      "formLabel": "imperative · ты",
      "ru": "Будь осторожен на дороге!",
      "en": "Be careful on the road!",
      "target": "Будь"
    }
  ],
  "хотеть": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я хочу чаю с сахаром.",
      "en": "I want some tea with sugar.",
      "target": "хочу"
    },
    {
      "formKey": "sg2",
      "formLabel": "present · ты",
      "ru": "Ты хочешь пойти в кино?",
      "en": "Do you want to go to the movies?",
      "target": "хочешь"
    },
    {
      "formKey": "pl3",
      "formLabel": "present · они",
      "ru": "Дети хотят спать сейчас.",
      "en": "The children want to sleep now.",
      "target": "хотят"
    },
    {
      "formKey": "past-m",
      "formLabel": "past · он",
      "ru": "Он хотел позвонить другу.",
      "en": "He wanted to call a friend.",
      "target": "хотел"
    }
  ],
  "дать": [
    {
      "formKey": "fut-sg1",
      "formLabel": "future · я",
      "ru": "Я дам тебе свою книгу.",
      "en": "I will give you my book.",
      "target": "дам"
    },
    {
      "formKey": "fut-sg3",
      "formLabel": "future · он",
      "ru": "Учитель даст нам задание.",
      "en": "The teacher will give us an assignment.",
      "target": "даст"
    },
    {
      "formKey": "past-f",
      "formLabel": "past · она",
      "ru": "Она дала мне свой номер.",
      "en": "She gave me her number.",
      "target": "дала"
    },
    {
      "formKey": "imperative",
      "formLabel": "imperative · ты",
      "ru": "Дай мне немного воды.",
      "en": "Give me a little water.",
      "target": "Дай"
    }
  ],
  "есть": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я ем суп на обед.",
      "en": "I am eating soup for lunch.",
      "target": "ем"
    },
    {
      "formKey": "pl1",
      "formLabel": "present · мы",
      "ru": "Мы едим кашу по утрам.",
      "en": "We eat porridge in the mornings.",
      "target": "едим"
    },
    {
      "formKey": "past-m",
      "formLabel": "past · он",
      "ru": "Он ел яблоко в саду.",
      "en": "He was eating an apple in the garden.",
      "target": "ел"
    },
    {
      "formKey": "imperative",
      "formLabel": "imperative · ты",
      "ru": "Ешь овощи каждый день!",
      "en": "Eat vegetables every day!",
      "target": "Ешь"
    }
  ],
  "помогать": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я помогаю маме на кухне.",
      "en": "I help mom in the kitchen.",
      "target": "помогаю"
    },
    {
      "formKey": "sg3",
      "formLabel": "present · он",
      "ru": "Брат помогает мне с уроками.",
      "en": "My brother helps me with lessons.",
      "target": "помогает"
    },
    {
      "formKey": "past-f",
      "formLabel": "past · она",
      "ru": "Она помогала бабушке в саду.",
      "en": "She helped grandma in the garden.",
      "target": "помогала"
    },
    {
      "formKey": "imperative",
      "formLabel": "imperative · ты",
      "ru": "Помогай друзьям в трудную минуту.",
      "en": "Help your friends in a difficult moment.",
      "target": "Помогай"
    }
  ],
  "верить": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я верю тебе полностью.",
      "en": "I trust you completely.",
      "target": "верю"
    },
    {
      "formKey": "sg2",
      "formLabel": "present · ты",
      "ru": "Ты веришь этому человеку?",
      "en": "Do you believe this person?",
      "target": "веришь"
    },
    {
      "formKey": "past-m",
      "formLabel": "past · он",
      "ru": "Он верил своему другу.",
      "en": "He trusted his friend.",
      "target": "верил"
    },
    {
      "formKey": "imperative",
      "formLabel": "imperative · ты",
      "ru": "Верь в свои силы!",
      "en": "Believe in your own strength!",
      "target": "Верь"
    }
  ],
  "ждать": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я жду автобуса на остановке.",
      "en": "I am waiting for the bus at the stop.",
      "target": "жду"
    },
    {
      "formKey": "sg3",
      "formLabel": "present · он/она",
      "ru": "Мама ждёт письма от сына.",
      "en": "Mom is waiting for a letter from her son.",
      "target": "ждёт"
    },
    {
      "formKey": "past-f",
      "formLabel": "past · она",
      "ru": "Она долго ждала подругу у входа.",
      "en": "She waited a long time for her friend at the entrance.",
      "target": "ждала"
    },
    {
      "formKey": "imperative",
      "formLabel": "imperative · ты",
      "ru": "Жди меня возле школы.",
      "en": "Wait for me near the school.",
      "target": "жди"
    }
  ],
  "бояться": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я боюсь темноты в лесу.",
      "en": "I am afraid of the dark in the forest.",
      "target": "боюсь"
    },
    {
      "formKey": "sg3",
      "formLabel": "present · он/она",
      "ru": "Ребёнок боится большой собаки.",
      "en": "The child is afraid of the big dog.",
      "target": "боится"
    },
    {
      "formKey": "past-m",
      "formLabel": "past · он",
      "ru": "Он боялся этого экзамена.",
      "en": "He was afraid of this exam.",
      "target": "боялся"
    },
    {
      "formKey": "imperative",
      "formLabel": "imperative · ты",
      "ru": "Не бойся холодной воды!",
      "en": "Don't be afraid of the cold water!",
      "target": "бойся"
    }
  ],
  "гордиться": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я горжусь своей семьёй.",
      "en": "I am proud of my family.",
      "target": "горжусь"
    },
    {
      "formKey": "pl3",
      "formLabel": "present · они",
      "ru": "Родители гордятся своими детьми.",
      "en": "The parents are proud of their children.",
      "target": "гордятся"
    },
    {
      "formKey": "past-f",
      "formLabel": "past · она",
      "ru": "Она гордилась новой работой.",
      "en": "She was proud of her new job.",
      "target": "гордилась"
    },
    {
      "formKey": "imperative",
      "formLabel": "imperative · ты",
      "ru": "Гордись своими успехами!",
      "en": "Be proud of your successes!",
      "target": "гордись"
    }
  ],
  "интересоваться": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я интересуюсь русской историей.",
      "en": "I am interested in Russian history.",
      "target": "интересуюсь"
    },
    {
      "formKey": "sg3",
      "formLabel": "present · он/она",
      "ru": "Мой брат интересуется музыкой.",
      "en": "My brother is interested in music.",
      "target": "интересуется"
    },
    {
      "formKey": "past-m",
      "formLabel": "past · он",
      "ru": "Он всегда интересовался спортом.",
      "en": "He was always interested in sports.",
      "target": "интересовался"
    },
    {
      "formKey": "imperative",
      "formLabel": "imperative · ты",
      "ru": "Интересуйся новыми книгами!",
      "en": "Take an interest in new books!",
      "target": "интересуйся"
    }
  ],
  "давать": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я даю брату свою книгу.",
      "en": "I give my brother my book.",
      "target": "даю"
    },
    {
      "formKey": "sg3",
      "formLabel": "present · он/она",
      "ru": "Учитель даёт детям задание.",
      "en": "The teacher gives the children a task.",
      "target": "даёт"
    },
    {
      "formKey": "past-f",
      "formLabel": "past · она",
      "ru": "Она давала мне полезные советы.",
      "en": "She used to give me useful advice.",
      "target": "давала"
    },
    {
      "formKey": "imperative",
      "formLabel": "imperative · ты",
      "ru": "Давай мне руку скорее!",
      "en": "Give me your hand quickly!",
      "target": "давай"
    }
  ],
  "рассказывать": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я рассказываю детям о море.",
      "en": "I tell the children about the sea.",
      "target": "рассказываю"
    },
    {
      "formKey": "pl3",
      "formLabel": "present · они",
      "ru": "Они рассказывают нам о поездке.",
      "en": "They tell us about the trip.",
      "target": "рассказывают"
    },
    {
      "formKey": "past-m",
      "formLabel": "past · он",
      "ru": "Он рассказывал другу о работе.",
      "en": "He was telling his friend about work.",
      "target": "рассказывал"
    },
    {
      "formKey": "imperative",
      "formLabel": "imperative · ты",
      "ru": "Рассказывай мне о своём дне.",
      "en": "Tell me about your day.",
      "target": "рассказывай"
    }
  ],
  "спрашивать": [
    {
      "formKey": "sg1",
      "formLabel": "present · я",
      "ru": "Я спрашиваю соседа о погоде.",
      "en": "I ask the neighbor about the weather.",
      "target": "спрашиваю"
    },
    {
      "formKey": "sg3",
      "formLabel": "present · он/она",
      "ru": "Она спрашивает меня о работе.",
      "en": "She asks me about work.",
      "target": "спрашивает"
    },
    {
      "formKey": "past-f",
      "formLabel": "past · она",
      "ru": "Она спрашивала врача о лекарстве.",
      "en": "She asked the doctor about the medicine.",
      "target": "спрашивала"
    },
    {
      "formKey": "imperative",
      "formLabel": "imperative · ты",
      "ru": "Спрашивай учителя о задании.",
      "en": "Ask the teacher about the assignment.",
      "target": "спрашивай"
    }
  ]
};
