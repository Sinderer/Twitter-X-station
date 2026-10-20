export interface RuleWarning {
  severity: 'error' | 'warning' | 'tip';
  message: string;
  fixSuggestion?: string;
  category?: 'ai-pattern' | 'length' | 'cliche' | 'format';
}

export interface AIPatternDetection {
  type: string;
  matched: string;
  advice: string;
}

export function detectAIPatterns(text: string): AIPatternDetection[] {
  if (!text) return [];
  const detected: AIPatternDetection[] = [];

  // 1. Шаблонные противопоставления (Formulaic contrasts)
  const contrastPatterns = [
    { regex: /не просто\s+[^,.]+,\s*а\b/gi, name: 'Шаблон «не просто X, а Y»', advice: 'Используйте прямое утверждение без искусственного контраста.' },
    { regex: /это не про\s+[^,.]+,\s*это про\b/gi, name: 'Шаблон «это не про X, это про Y»', advice: 'Уберите штамп инфобизнеса, сформулируйте суть сразу.' },
    { regex: /\bне\s+[\wа-яА-ЯёЁ\s]{3,20},\s*а\s+[\wа-яА-ЯёЁ\s]{3,20}\b/gi, name: 'Контраст «не X, а Y»', advice: 'Оставьте только утвердительную часть, если противопоставление не критично.' },
    { regex: /\bот\s+[\wа-яА-ЯёЁ\s]{3,15}\s+к\s+[\wа-яА-ЯёЁ\s]{3,15}\b/gi, name: 'Конструкция «от X к Y»', advice: 'Замените на конкретное описание процесса.' },
  ];

  for (const p of contrastPatterns) {
    const match = text.match(p.regex);
    if (match) {
      detected.push({ type: 'Шаблонный контраст', matched: match[0], advice: p.advice });
    }
  }

  // 2. Безликий маркетинговый буллшит (Generic marketing language)
  const marketingPhrases = [
    'меняет расклад',
    'новая эра',
    'сильное комьюнити',
    'проверенный фундамент',
    'уникальная возможность',
    'часть экосистемы',
    'движемся дальше',
    'строим будущее',
    'долгосрочная перспектива',
    'системный подход',
    'реальный билдинг',
    'пустой хайп',
    'огромный потенциал',
    'следующий уровень',
    'game changer',
    'next level',
  ];

  for (const phrase of marketingPhrases) {
    const reg = new RegExp(`\\b${phrase}\\b`, 'gi');
    if (reg.test(text)) {
      detected.push({
        type: 'Маркетинговый штамп',
        matched: `«${phrase}»`,
        advice: 'Замените на конкретный факт, замер или наблюдение.',
      });
    }
  }

  // 3. Искусственные метафоры (Forced metaphors)
  const forcedMetaphors = [
    'билет в первый ряд',
    'прикоснуться к экосистеме',
    'открыть новую страницу',
    'поставить точку',
    'начать новую главу',
    'быть частью чего-то большего',
    'front-row seat',
  ];

  for (const metaphor of forcedMetaphors) {
    const reg = new RegExp(`\\b${metaphor}\\b`, 'gi');
    if (reg.test(text)) {
      detected.push({
        type: 'Искусственная метафора',
        matched: `«${metaphor}»`,
        advice: 'Люди не говорят так в Твиттере. Опишите действие напрямую.',
      });
    }
  }

  // 4. Пустые усилители (Empty intensifiers)
  const intensifiers = [
    'на самом деле',
    'очевидно',
    'безусловно',
    'действительно',
  ];

  for (const int of intensifiers) {
    const reg = new RegExp(`\\b${int}\\b`, 'gi');
    if (reg.test(text)) {
      detected.push({
        type: 'Пустой усилитель',
        matched: `«${int}»`,
        advice: 'Слово не несет информации, его удаление сделает фразу сильнее.',
      });
    }
  }

  return detected;
}

export function calculateHumanScore(text: string): number {
  if (!text || text.trim().length === 0) return 100;
  const patterns = detectAIPatterns(text);
  const penalty = patterns.length * 15;
  const score = Math.max(20, 100 - penalty);
  return score;
}

export function validateTweetText(text: string, isPremium: boolean = true): {
  charCount: number;
  maxChars: number;
  isValidLength: boolean;
  isLongPost: boolean;
  first280Chars: string;
  humanScore: number;
  aiPatterns: AIPatternDetection[];
  warnings: RuleWarning[];
} {
  const charCount = text ? text.length : 0;
  const maxChars = isPremium ? 25000 : 280;
  const isValidLength = charCount <= maxChars;
  const isLongPost = charCount > 280;
  const first280Chars = text ? text.slice(0, 280) : '';
  const warnings: RuleWarning[] = [];
  const aiPatterns = detectAIPatterns(text);
  const humanScore = calculateHumanScore(text);

  if (charCount === 0) {
    return {
      charCount,
      maxChars,
      isValidLength: true,
      isLongPost: false,
      first280Chars: '',
      humanScore: 100,
      aiPatterns: [],
      warnings,
    };
  }

  // 1. Проверка длины
  if (!isValidLength) {
    warnings.push({
      severity: 'error',
      category: 'length',
      message: `Превышен лимит символов на ${charCount - maxChars} (${charCount}/${maxChars}).`,
      fixSuggestion: 'Сократите текст или разбейте его на тред в «Конструкторе тредов».',
    });
  }

  // 2. Важнейшее правило Premium твитов: первые 280 символов до кнопки «Показать еще»
  if (isPremium && isLongPost) {
    const firstLine = text.split('\n')[0].trim();
    if (firstLine.length > 200) {
      warnings.push({
        severity: 'warning',
        category: 'format',
        message: 'Премиум-твит длиннее 280 символов: в ленте читатели увидят только первые 280 знаков до кнопки «Показать еще»!',
        fixSuggestion: 'Убедитесь, что хук и главная интрига умещаются в первые 280 знаков.',
      });
    } else {
      warnings.push({
        severity: 'tip',
        category: 'format',
        message: 'Лонгпост X Premium: хук должен мотивировать нажать «Показать еще» (Show more).',
      });
    }
  }

  // 3. AI-паттерны из Human Writing Skill
  if (aiPatterns.length > 0) {
    aiPatterns.forEach((p) => {
      warnings.push({
        severity: 'warning',
        category: 'ai-pattern',
        message: `Обнаружен AI-паттерн: ${p.type} (${p.matched}).`,
        fixSuggestion: p.advice,
      });
    });
  }

  // 4. Анти-клише правила из плейбука AICB
  const cliches = [
    { pattern: /🧵/, name: 'Эмодзи треда (🧵)' },
    { pattern: /let that sink in/i, name: '«Let that sink in»' },
    { pattern: /осознайте это/i, name: '«Осознайте это»' },
    { pattern: /прочитайте это еще раз/i, name: '«Прочитайте это еще раз»' },
    { pattern: /read that again/i, name: '«Read that again»' },
    { pattern: /agree\s*\?/i, name: '«Agree?» (байт на комменты)' },
    { pattern: /согласны\s*\?/i, name: '«Согласны?» (дешевый байт)' },
    { pattern: /в сегодняшнем мире/i, name: '«В сегодняшнем мире...» (вода во вступлении)' },
    { pattern: /in today's world/i, name: '«In today\'s world» (вода)' },
    { pattern: /я тут подумал/i, name: '«Я тут подумал...» (слабый старт)' },
    { pattern: /i've been thinking/i, name: '«I\'ve been thinking» (слабый старт)' },
    { pattern: /тред ниже/i, name: '«Тред ниже»' },
    { pattern: /thread below/i, name: '«Thread below»' },
    { pattern: /тред\s*:/i, name: '«Тред:» (клише)' },
    { pattern: /a thread\s*:/i, name: '«A thread:» (клише)' },
  ];

  for (const c of cliches) {
    if (c.pattern.test(text)) {
      warnings.push({
        severity: 'warning',
        category: 'cliche',
        message: `Обнаружено шаблонное клише: ${c.name}. Плейбук AICB требует удалить его.`,
        fixSuggestion: 'Начинайте сразу с утверждения, парадокса или цифры без мета-вступлений.',
      });
    }
  }

  // 5. Проверка стены хештегов
  const hashtags = text.match(/#[a-zA-Zа-яА-Я0-9_]+/g) || [];
  if (hashtags.length > 2) {
    warnings.push({
      severity: 'warning',
      category: 'format',
      message: `Слишком много хештегов (${hashtags.length}). Правило AICB: 0 хештегов, максимум 1 по теме.`,
      fixSuggestion: 'Алгоритм X пессимизирует спам хештегами, пост выглядит как реклама.',
    });
  }

  // 6. Проверка ссылок в основном твите
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const links = text.match(urlRegex) || [];
  if (links.length > 0) {
    warnings.push({
      severity: 'tip',
      category: 'format',
      message: 'В основном твите обнаружена ссылка. Алгоритм X снижает охваты твитов со внешними ссылками.',
      fixSuggestion: 'Лучшая практика: напишите сильный твит, а ссылку опубликуйте в первом ответе.',
    });
  }

  // 7. Проверка конкретных цифр
  const hasNumber = /\b\d+(\.\d+)?(%|\$|k|m|h|тыс|млн|руб|x|мин|сек)?\b/i.test(text);
  if (!hasNumber && charCount > 100) {
    warnings.push({
      severity: 'tip',
      category: 'format',
      message: 'В тексте нет конкретных цифр или метрик. Цифры и контрасты удваивают вовлеченность.',
    });
  }

  return { charCount, maxChars, isValidLength, isLongPost, first280Chars, humanScore, aiPatterns, warnings };
}

export const HOOK_FORMULAS = [
  {
    id: 'number',
    name: 'Цифра / Контраст',
    description: 'Начните с сильной метрики или неожиданного контраста',
    example: '«48 часов. Муравьи прошли лабиринт.» / «$0.30 против $40.»',
    badge: 'Высокий охват',
  },
  {
    id: 'claim',
    name: 'Смелое утверждение',
    description: 'Острое заявление, с которым захотят поспорить',
    example: '«Большинство советов по архитектуре написаны теми, кто никогда не выкатывал прод.»',
    badge: 'Вирально',
  },
  {
    id: 'tension',
    name: 'Напряжение и разворот',
    description: 'Быстрый сетап и резкий неожиданный финал',
    example: '«Мы написали сервис за неделю. А потом удалили его за один день.»',
    badge: 'Интрига',
  },
  {
    id: 'scene',
    name: 'Сцена из жизни',
    description: 'Живая деталь, запах, время или атмосфера',
    example: '«3 часа ночи, рендер на 40%, и кулер сервера начинает подозрительно трещать.»',
    badge: 'Сторителлинг',
  },
  {
    id: 'contrarian',
    name: 'Вызов консенсусу',
    description: 'Опровержение общепринятого мнения в индустрии',
    example: '«Хватит оптимизировать микросекунды. Ваши пользователи страдают от неиндексированного SQL.»',
    badge: 'Авторитет',
  },
  {
    id: 'question',
    name: 'Вопрос читателя',
    description: 'Вопрос, который уже крутится у читателя в голове',
    example: '«Почему каждый бенчмарк AI моделей врет про скорость в реальном продакшене?»',
    badge: 'Вовлечение',
  },
  {
    id: 'confession',
    name: 'Признание ошибки',
    description: 'Честное признание провала и цифра, которая всё исправила',
    example: '«Я два года топил за микросервисы. Вот счет за AWS, который отрезвил меня навсегда.»',
    badge: 'Доверие',
  },
  {
    id: 'list-promise',
    name: 'Обещание списка',
    description: 'Четкое количество инсайтов перед их выдачей',
    example: '«Три вещи, которые упали при 100k онлайна, в порядке их падения:»',
    badge: 'Польза',
  },
];

export const QUOTE_MOVES = [
  {
    id: 'correction',
    name: 'Исправление факта',
    description: 'Пост содержит ошибку или устарел: вежливо назовите верную цифру без снобизма.',
    example: '«Цифра 40% — из опроса 2019 года. В исследовании 2026 года уже 12%, методология сменилась.»',
  },
  {
    id: 'context',
    name: 'Контекст за кулисами',
    description: 'Пост становится понятен, когда знаешь внутреннюю кухню.',
    example: '«Это происходит, когда дефолтный таймаут в конфиге 30 сек и никто не заглянул в доки.»',
  },
  {
    id: 'example',
    name: 'Практический пример',
    description: 'Автор назвал абстрактный принцип — вы даете реальный боевой кейс.',
    example: '«Мы проверили это на 10 млн эвентов. На 80% нагрузки задержка выросла в 4 раза.»',
  },
  {
    id: 'extension',
    name: 'Шаг дальше',
    description: 'Автор остановился на полпути — вы делаете следующий логический шаг.',
    example: '«И главное, о чем молчат: как только вы это автоматизируете, узким горлышком станет ручной апрув.»',
  },
  {
    id: 'joke',
    name: 'Тонкий юмор',
    description: 'Ироничный комментарий для своих без токсичности.',
    example: '«Мой счет за AWS воспринял этот твит как личное оскорбление.»',
  },
];
