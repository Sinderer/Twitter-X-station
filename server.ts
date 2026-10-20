import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Gemini SDK with server-side API key
const apiKey = process.env.GEMINI_API_KEY || '';
let genAI: GoogleGenAI | null = null;
if (apiKey) {
  genAI = new GoogleGenAI({ apiKey });
}

// In-memory cache for market data
let cachedMarketData: any = null;
let lastMarketFetch = 0;

// Market Data Endpoint - fetches real-time prediction market & crypto data for posts
app.get('/api/market-data', async (_req, res) => {
  const now = Date.now();
  if (cachedMarketData && now - lastMarketFetch < 60000) {
    return res.json(cachedMarketData);
  }

  try {
    let binanceTickers: any[] = [];
    try {
      const bRes = await fetch(
        'https://api.binance.com/api/v3/ticker/24hr?symbols=["BTCUSDT","ETHUSDT","SOLUSDT","DOGEUSDT","BNBUSDT"]'
      );
      if (bRes.ok) {
        const raw = await bRes.json();
        binanceTickers = raw.map((item: any) => ({
          symbol: item.symbol.replace('USDT', ''),
          price: parseFloat(item.lastPrice),
          change24h: parseFloat(item.priceChangePercent),
          high24h: parseFloat(item.highPrice),
          low24h: parseFloat(item.lowPrice),
          volumeUSD: parseFloat(item.quoteVolume),
        }));
      }
    } catch (err) {
      console.warn('Binance fetch warning:', err);
    }

    let polymarketEvents: any[] = [];
    try {
      const pRes = await fetch(
        'https://gamma-api.polymarket.com/events?closed=false&active=true&archived=false&order=volume24hr&ascending=false&limit=8',
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36',
          },
        }
      );
      if (pRes.ok) {
        const events = await pRes.json();
        polymarketEvents = (events || []).map((ev: any) => {
          const firstMarket = ev.markets?.[0] || {};
          let outcomePrices: any = {};
          try {
            if (firstMarket.outcomePrices) {
              const prices = JSON.parse(firstMarket.outcomePrices);
              const outcomes = JSON.parse(firstMarket.outcomes || '["Yes","No"]');
              outcomes.forEach((o: string, idx: number) => {
                outcomePrices[o] = Math.round(parseFloat(prices[idx] || '0') * 100);
              });
            }
          } catch {}

          return {
            title: ev.title,
            slug: ev.slug,
            volume24hr: ev.volume24hr ? Math.round(parseFloat(ev.volume24hr)) : 0,
            volumeTotal: ev.volume ? Math.round(parseFloat(ev.volume)) : 0,
            outcomePrices,
            category: ev.tags?.[0]?.label || 'General',
          };
        });
      }
    } catch (err) {
      console.warn('Polymarket fetch warning:', err);
    }

    if (binanceTickers.length === 0) {
      binanceTickers = [
        { symbol: 'BTC', price: 92450.2, change24h: 3.42, high24h: 93800, low24h: 89600, volumeUSD: 2450000000 },
        { symbol: 'ETH', price: 2740.8, change24h: -1.15, high24h: 2810, low24h: 2690, volumeUSD: 1120000000 },
        { symbol: 'SOL', price: 184.6, change24h: 5.82, high24h: 188.5, low24h: 172.0, volumeUSD: 850000000 },
        { symbol: 'DOGE', price: 0.214, change24h: 2.11, high24h: 0.225, low24h: 0.205, volumeUSD: 410000000 },
      ];
    }

    if (polymarketEvents.length === 0) {
      polymarketEvents = [
        {
          title: 'Снижение ставки ФРС в 2026',
          slug: 'fed-rates-2026',
          volume24hr: 1250000,
          outcomePrices: { Yes: 68, No: 32 },
          category: 'Экономика',
        },
        {
          title: 'Новая AI модель достигает рубежа AGI',
          slug: 'ai-agi-benchmark',
          volume24hr: 820000,
          outcomePrices: { Yes: 42, No: 58 },
          category: 'Технологии',
        },
        {
          title: 'Bitcoin превысит $100k до конца года',
          slug: 'btc-100k',
          volume24hr: 2400000,
          outcomePrices: { Yes: 74, No: 26 },
          category: 'Криптовалюты',
        },
      ];
    }

    cachedMarketData = {
      timestamp: new Date().toISOString(),
      crypto: binanceTickers,
      predictions: polymarketEvents,
    };
    lastMarketFetch = now;
    return res.json(cachedMarketData);
  } catch (error: any) {
    console.error('Market data error:', error);
    return res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// AI Generation Endpoint using Gemini 3.8 Flash (adapted for Twitter Premium, Russian Language & Human Writing Skill)
app.post('/api/generate', async (req, res) => {
  if (!genAI) {
    return res.status(500).json({
      error:
        'GEMINI_API_KEY не настроен на сервере. Пожалуйста, убедитесь, что секрет передан в окружение.',
    });
  }

  const {
    skill,
    topic,
    originalText,
    targetPost,
    hookFormula,
    persona,
    marketDataContext,
    format,
    customInstructions,
    partsCount,
    postLengthMode, // 'standard' (<=280) or 'premium_long' (note_tweet)
    mode, // 'human' or 'crypto'
  } = req.body;

  try {
    const lang = persona?.language || 'Русский';
    const isCrypto = mode === 'crypto' || persona?.enableCryptoMode;

    let humanWritingRules = `
=== HUMAN WRITING SKILL & ZERO-AI-SLOP RULES (СТРОГО СОБЛЮДАТЬ) ===
Цель: писать так, как пишет живой реальный человек, убирая все шаблоны, делающие текст искусственным, шаблонным, рекламным или вылизанным до скрипа.
1. БЕЗ ШАБЛОННЫХ КОНТРАСТОВ:
   - КАТЕГОРИЧЕСКИ ИЗБЕГАТЬ: «не X, а Y», «не просто X, а Y», «это не про X, это про Y», «от X к Y».
2. БЕЗ БЕЗЛИКОГО МАРКЕТИНГОВОГО ЯЗЫКА:
   - СТРОГО ЗАПРЕЩЕНЫ: «меняет расклад», «новая эра», «сильное комьюнити», «проверенный фундамент», «уникальная возможность», «часть экосистемы», «движемся дальше», «строим будущее», «долгосрочная перспектива», «системный подход», «реальный билдинг», «пустой хайп», «огромный потенциал», «следующий уровень», «game changer».
   - Заменяй их на конкретные факты, цифры и наблюдения.
3. БЕЗ ИСКУССТВЕННЫХ МЕТАФОР:
   - ЗАПРЕЩЕНЫ: «билет в первый ряд», «прикоснуться к экосистеме», «открыть новую страницу», «поставить точку», «начать новую главу», «быть частью чего-то большего».
4. БЕЗ ПУСТЫХ УСИЛИТЕЛЕЙ:
   - ЗАПРЕЩЕНЫ: «на самом деле», «очевидно», «безусловно», «главное», «действительно», «именно».
5. БЕЗ ВЫМУЧЕННЫХ ПРИЛАГАТЕЛЬНЫХ:
   - Убирай лишние: сильный, живой, настоящий, уникальный, мощный, большой, проверенный, долгосрочный, масштабный.
6. БЕЗ ИСКУССТВЕННОЙ ИДЕАЛЬНОЙ СТРУКТУРЫ (Хук -> Проблема -> Инсайт -> Вывод -> CTA):
   - Живой твит может быть просто честным наблюдением и мыслью.
   - НЕ добавляй мотивационных концовок, призывов подписаться и морализаторства.
7. ЕСТЕСТВЕННАЯ НЕИДЕАЛЬНОСТЬ:
   - Это НЕ значит делать ошибки в словах или портить пунктуацию. Это значит писать прямо, лаконично и без пафоса.
`;

    if (isCrypto) {
      humanWritingRules += `
=== CRYPTO X MODE (РЕЖИМ АКТИВНОГО УЧАСТНИКА CRYPTO TWITTER / CT) ===
- Пиши как активный участник крипто-твиттера, а не как PR-отдел Web3 фонда.
- Приоритет: личное наблюдение, короткие прямые фразы, детали проекта, естественный сленг (билдить, фармить, ончейн, тестнет, рект без наигранности), сдержанное мнение, легкая неуверенность.
- Избегай: корпоративного пафоса, призывов «строим будущее», восторгов о «сильном комьюнити» и искусственного хайпа.
`;
    }

    let systemPrompt = `Ты — мастер создания контента для Twitter/X и Twitter Premium, строго следующий плейбукам AICB Content Skills и Human Writing Skill.
Язык: ${lang} (пиши на естественном, остроумном, живом русском языке без канцелярита).

${humanWritingRules}

ГЛАВНЫЕ ЗАКОНЫ ПЛЕЙБУКОВ AICB:
1. ХУК В ПЕРВОЙ СТРОКЕ: Первая строка решает всё. Никаких прелюдий («В сегодняшнем мире», «Я тут подумал», «🧵», «Осознайте это», «Согласны?», «Тред ниже»).
2. КОНКРЕТИКА: Всегда приводи хотя бы одну точную цифру, дату, замер или сценарий («мы попробовали X и получили Y»). Без абстрактной философии.
3. ТОЧКА ЗРЕНИЯ: Позиция, с которой можно аргументированно поспорить. Бесспорные банальности не читают.
4. СПЕЦИФИКА TWITTER PREMIUM:
   ${
     postLengthMode === 'premium_long'
       ? '- Для длинных постов Premium (note_tweet): первые 280 символов обязаны быть ультра-цепляющим хуком, мотивирующим нажать «Показать еще» (Show more). После кат-оффа раскрывается глубина, шаги, цифры и логика.'
       : '- Стандартный твит или часть треда: строго укладываться в лимит 280 символов.'
   }
5. ССЫЛКИ: Ссылка никогда не ставится в основной твит (это режет охваты алгоритма), только в первый ответ (first reply).
`;

    // Persona rules from NOTES.md
    if (persona) {
      systemPrompt += `\nПРОФИЛЬ АВТОРА (NOTES.md):
- Имя и хэндл: ${persona.displayName || 'Автор'} (@${persona.username || 'creator'})
- Миссия / Био: ${persona.bio || 'Инженер и фаундер'}
- Целевая аудитория: ${persona.audience || 'Разработчики, фаундеры, крипто-операторы'}
- Стиль голоса: ${persona.voiceRules || 'Прямой, основанный на цифрах, без воды'}
- ЗАПРЕЩЕННЫЕ СЛОВА И КЛИШЕ: ${persona.bannedWords || 'Согласны?, Осознайте это, 🧵, #followme'}
${persona.examples ? `- Образцы постов автора для подражания ритму:\n${persona.examples}` : ''}
`;
    }

    let userPrompt = '';

    if (skill === 'human-rewrite') {
      const isCryptoMode = mode === 'crypto';
      userPrompt = `Скилл: Human Writing Skill ${isCryptoMode ? '(Crypto X Mode)' : ''}
Задача: Перепиши предоставленный текст так, чтобы он звучал максимально естественно, живо и без грамма искусственного AI-буллшита, строго соблюдая все правила Human Writing Skill.

Исходный текст:
"""
${originalText || topic}
"""

Специальные пожелания: "${customInstructions || ''}"

ИНСТРУКЦИИ ПО ПЕРЕПИСЫВАНИЮ:
1. Сохрани исходный смысл, факты, цифры и намерение автора.
2. Не выдумывай отсебятины и несуществующего личного опыта.
3. Вычисти все формульные противопоставления («не X, а Y», «не просто X»), маркетинговые штампы («меняет расклад», «сильное комьюнити»), пустые усилители («на самом деле», «очевидно»), искусственные метафоры.
4. Сделай структуру живой, предложения разной длины, убирай идеальную шаблонность.
${isCryptoMode ? '5. Режим Crypto X: пиши лаконично, как реальный участник CT, без корпоративного пафоса и восторгов.' : ''}

Верни валидный JSON:
{
  "originalText": ${JSON.stringify(originalText || topic)},
  "rewrittenText": "переписанный естественный текст на русском языке",
  "mode": "${mode || 'human'}",
  "removedPatterns": [
    "название удаленного шаблона или штампа (например: удален штамп 'не X, а Y')",
    "убрана искусственная метафора"
  ],
  "humanScoreBefore": 45,
  "humanScoreAfter": 98,
  "breakdown": "краткое объяснение, что именно было очищено от AI-налета"
}`;
    } else if (skill === 'social-post') {
      userPrompt = `Скилл: social-post
Задача: Напиши 3 РАЗЛИЧНЫХ варианта твита для Twitter/X на русском языке с соблюдением Human Writing Skill.
Тема: "${topic}"
Выбранная формула хука: ${hookFormula || 'Цифра / Контраст'}
Формат: ${format || 'Смешанный: 1 горячий тейк, 1 мини-список, 1 история в 4 строки'}
Режим длины: ${postLengthMode === 'premium_long' ? 'Twitter Premium Longpost (до 800 знаков, с мощным хуком в первых 280)' : 'Стандартный твит (строго до 280 знаков)'}
${marketDataContext ? `Реальные рыночные данные для заземления:\n${marketDataContext}` : ''}
${customInstructions ? `Специальные инструкции: ${customInstructions}` : ''}

ТРЕБОВАНИЯ:
- 3 законченных варианта на русском языке, готовых к публикации.
- Первая строка КАЖДОГО варианта обязана содержать мощный хук.
- Подсчитай точное количество символов (charCount).
- Объясни кратко (breakdown) на русском, почему хук цепляет психологически.
- Предложи визуальное сопровождение (рекомендованный скриншот терминала, метрика или график).

Верни валидный JSON:
{
  "variants": [
    {
      "type": "горячий тейк | мини-список | история в 4 строки | до/после",
      "hookFormula": "название формулы хука",
      "text": "полный текст твита на русском",
      "charCount": 210,
      "breakdown": "почему этот вариант работает и привлекает охваты"
    }
  ],
  "recommendedMedia": "описание визуального материала для прикрепления (терминал, скриншот, диаграмма)"
}`;
    } else if (skill === 'social-thread') {
      const parts = partsCount || 5;
      userPrompt = `Скилл: social-thread
Задача: Напиши виральный тред для Twitter/X из ${parts} частей на русском языке с соблюдением Human Writing Skill.
Тема: "${topic}"
Формат: ${format || 'История / Баг-репорт / Разбор цифр'}
${marketDataContext ? `Рыночные данные:\n${marketDataContext}` : ''}
${customInstructions ? `Инструкции: ${customInstructions}` : ''}

ЖЕСТКИЕ ПРАВИЛА AICB ДЛЯ ТРЕДА:
1. Часть 1 ОБЯЗАНА выживать сама по себе в общей ленте. В ней содержится главный результат или смелое утверждение. НИКАКИХ «Тред 🧵», «Сейчас объясню», «1/».
2. Части с 2 по ${parts - 1}: Каждая часть несет РОВНО ОДНУ конкретную мысль с цифрой/доказательством/поворотом.
3. Финальная часть ${parts}: Закрывает тред сильнейшей мыслью, выводом или вопросом читателю, мотивирующим ретвитнуть и сохранить в закладки. Без мотивационных лозунгов.
4. Лимит символов: строго до 280 знаков на КАЖДУЮ часть.

Верни валидный JSON:
{
  "threadTitle": "Заголовок треда",
  "totalParts": ${parts},
  "parts": [
    {
      "partNumber": 1,
      "role": "Хук / Самостоятельное утверждение",
      "text": "текст твита части 1 на русском",
      "charCount": 210,
      "mediaSuggestion": "идея для скриншота/графика, если уместно"
    }
  ],
  "bookmarkIncentive": "Почему читатели нажмут 'Сохранить в закладки'"
}`;
    } else if (skill === 'social-reply') {
      userPrompt = `Скилл: social-reply
Задача: Напиши 3 умных ответа под чужим постом в Twitter/X для органического привлечения подписчиков.
Автор исходного твита: "${targetPost?.author || '@автор'}"
Текст исходного твита: "${targetPost?.text || topic}"
Цель ответа: "${customInstructions || 'Добавить точную цифру, контр-пример или скрытый нюанс'}"

ПРАВИЛА AICB ДЛЯ ОТВЕТОВ:
1. Кратко: строго 1–3 предложения на русском языке.
2. Отвечает ТОЧНО в точку исходного тезиса.
3. Добавляет ОДНУ ценную деталь: цифру, исключение из правил, скрытый компромисс.
4. НИКАКИХ «Отличный пост!», «Полностью согласен!», «Супер мысль!». Никакого подхалимажа.

Верни валидный JSON:
{
  "replies": [
    {
      "angle": "Ответ с цифрой | Скрытый нюанс | Контр-пример",
      "text": "текст ответа (1-3 предложения, до 280 знаков)",
      "charCount": 140,
      "whyItEarnsFollowers": "почему этот ответ привлекает качественную аудиторию"
    }
  ]
}`;
    } else if (skill === 'social-quote') {
      userPrompt = `Скилл: social-quote
Задача: Напиши 3 стратегических комментария для цитирования твита (Quote Tweet / QRT) на русском языке.
Автор цитируемого твита: "${targetPost?.author || '@автор'}"
Цитируемый твит: "${targetPost?.text || topic}"
Контекст: "${customInstructions || ''}"

ПРАВИЛА AICB ДЛЯ ЦИТАТ:
1. Один из 5 ходов:
   - Исправление факта (ошибка в посте, вежливая корректная цифра)
   - Контекст за кулисами (что скрыто за кадром)
   - Практический пример (реальная боевая проверка)
   - Шаг дальше (что наступает сразу после этого)
   - Тонкий юмор (для своих, без оскорбления автора)
2. 1–3 предложения. Исходный твит и так виден в карточке — не пересказывай его.
3. Первые слова несут саму суть.

Верни валидный JSON:
{
  "quotes": [
    {
      "move": "Контекст | Шаг дальше | Исправление факта | Пример | Юмор",
      "text": "комментарий к цитате на русском",
      "charCount": 160,
      "strategicPurpose": "какую ценность этот твит несет вашей аудитории"
    }
  ]
}`;
    } else if (skill === 'x-article') {
      userPrompt = `Скилл: x-article
Задача: Создай структуру и текст статьи для нативного редактора X Articles (формат Premium+) на русском языке с соблюдением Human Writing Skill.
Тема: "${topic}"
Контекст: "${customInstructions || 'Опыт инженера/оператора с реальными цифрами и боевыми граблями'}"

ПРАВИЛА AICB ДЛЯ X ARTICLE:
1. Заголовок по формуле: Контраст/Деньги или Провокационный вопрос.
2. Холодный хук (первые два абзаца сразу отдают главный инсайт).
3. Ранние конкретные цифры и замеры.
4. Подзаголовки H2 в форме вопросов читателя.
5. Цитата-блок (blockquote) для ретвитов.
6. Пошаговые действия.
7. Честная оговорка (где подход сломается).
8. Announce Post — твит-анонс (до 280 знаков с хуком и плейсхолдером ссылки).

Верни валидный JSON:
{
  "title": "Заголовок статьи",
  "announcePost": "Твит до 280 знаков для анонса статьи в ленте",
  "coverIdea": "Идея для обложки статьи",
  "estimatedReadingTime": "4 мин чтения",
  "markdown": "# Полный текст статьи в Markdown на русском языке с H2 вопросами, блоками кода, цитатами..."
}`;
    }

    const response = await genAI.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    let parsed = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { raw: text };
    }

    res.json(parsed);
  } catch (error: any) {
    console.error('Gemini generation error:', error);
    res.status(500).json({ error: error.message || 'Ошибка генерации' });
  }
});

// Vite or Static handling
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer();
