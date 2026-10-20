import React, { useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SkillDoc {
  id: string;
  name: string;
  description: string;
  rules: string[];
  examples: string[];
  recommendedHook?: string;
}

interface Props {
  onSelectSkill: (skillId: string) => void;
}

export const SkillsLibrary: React.FC<Props> = ({ onSelectSkill }) => {
  const [selectedSkill, setSelectedSkill] = useState<string>('social-post');

  const skills: SkillDoc[] = [
    {
      id: 'social-post',
      name: 'social-post',
      description:
        'Создает одиночный пост для X в вашем голосе — хук в первой строке, одна законченная мысль, конкретная цифра или факт, четкая точка зрения с адаптацией под Twitter Premium (лимит 280 зн. или лонгпост).',
      rules: [
        'Строка 1 — это весь пост для 90% листающих ленту. Начинайте сразу с хука без вводных слов.',
        'Всегда приводите хотя бы одну реальную цифру, дату или измеренное время («с $900 до $140»).',
        'Точка зрения, с которой можно аргументированно поспорить. Банальности не вызывают отклика.',
        'Никаких дешевых клише: строго запрещены «🧵», «Осознайте это», «Согласны?».',
        'Внешние ссылки всегда отправляются в первый ответ (first reply), чтобы алгоритм X не резал охват.',
      ],
      examples: [
        '48 часов. Муравьи прошли лабиринт. Три фикса; первый был опечаткой в конфиге.',
        'Хватит мерять показатель отказов. Он никогда не коррелировал с выручкой.',
        'Мы выкатили фичу за неделю. И удалили её за один день.',
      ],
      recommendedHook: 'Цифра / Контраст, Смелое утверждение, Напряжение',
    },
    {
      id: 'social-thread',
      name: 'social-thread',
      description:
        'Цепочка из 3–8 связанных постов, где Часть 1 обязана быть самодостаточным твитом с сильным результатом или интригой, а каждая следующая часть развивает одну мысль.',
      rules: [
        'Часть 1 ОБЯЗАНА выживать сама по себе в ленте. Если Часть 1 не готовы запостить отдельно — тред не готов к публикации.',
        'Части 2..n-1: каждая часть содержит ровно одну мысль в логическом порядке.',
        'Разделение идет по смыслу, а не по количеству символов.',
        'Финальная часть закрывает тред сильнейшей строкой, выводом или вопросом, стимулирующим сохранить в закладки.',
      ],
      examples: [
        'Часть 1: Мы срезали счет за серверы с $900 до $140 в месяц. Всего три изменения; первое — опечатка.',
        'Часть 2: Шаг 1: Неиндексированный JOIN в таблице логов вызывал 92% пиков CPU...',
      ],
      recommendedHook: 'История, Лог разработки, Цена ошибок',
    },
    {
      id: 'social-reply',
      name: 'social-reply',
      description:
        'Экспертный ответ под чужим постом, который привлекает внимание и подписчиков — строго 1–3 предложения, добавляющие точную цифру, контр-пример или скрытый нюанс.',
      rules: [
        'Отвечает прямо в суть тезиса исходного поста его же языком.',
        'Добавляет ровно ОДНУ ценность: цифру, исключение из правил, подводный камень.',
        'Кратко: строго 1–3 предложения. Никаких лекций на пол-экрана.',
        'Никакого подхалимажа: запрещены «Отличный тред!», «Полностью согласен!».',
      ],
      examples: [
        'Там 12%, а не 40% — сорок было в исследовании 2019 года. В 2026 сменилась методология.',
        'Насчет бесплатного тарифа: есть один платеж, который скрывают до 14 дня.',
      ],
      recommendedHook: 'Ответ с цифрой, Скрытый нюанс',
    },
    {
      id: 'social-quote',
      name: 'social-quote',
      description:
        'Цитирование чужого твита (Quote Tweet / QRT) с вашим комментарием по 5 каноническим ходам AICB: исправление, контекст, пример, развитие, юмор.',
      rules: [
        '5 ходов: Исправление факта, Контекст за кадром, Боевой пример, Шаг дальше, Тонкий юмор.',
        'Первые слова несут суть, так как комментарий читается до загрузки карточки твита.',
        'Никогда не начинайте со слов «Этот пост...», «Чистая правда».',
        'Критикуйте аргумент, но никогда не нападайте на автора лично.',
      ],
      examples: [
        'Это происходит, когда дефолтный таймаут вендора 30 сек и никто не читал конфиг.',
        'И главное, о чем молчат: как только вы это автоматизируете, узким горлышком станет ручной апрув.',
      ],
      recommendedHook: 'Контекст за кулисами, Шаг дальше',
    },
    {
      id: 'x-article',
      name: 'x-article',
      description:
        'Лонгрид для нативного редактора x.com/i/article (Twitter Premium+) в инженерном стиле от первого лица с конкретными цифрами, H2 вопросами и твитом-анонсом.',
      rules: [
        'Заголовок: формула Контраст/Деньги или Провокационный вопрос.',
        'Холодный хук: первые 2 абзаца сразу отдают читателю главный вывод.',
        'Точные цифры и бенчмарки в самом начале.',
        'Разделы оформлены как вопросы читателя.',
        'Честная оговорка (Caveat): где и для кого этот рецепт не сработает.',
      ],
      examples: [
        'С $3,400 до $450/мес: как мы переписали конвейер видео с нуля',
        'Почему 90% бенчмарков векторных баз данных врут про боевую нагрузку',
      ],
      recommendedHook: 'Движок Контраст / Деньги',
    },
    {
      id: 'market-data',
      name: 'market-data',
      description:
        'Рецепты подключения к публичным REST и WebSocket API рынков прогнозов (Polymarket CLOB/Gamma) и крипты (Binance, CoinGecko) без платных ключей.',
      rules: [
        '«То, что реально, остается реальным»: используйте только реальные цифры и метки времени.',
        'Неожиданная реальная деталь делает контент виральным и вызывает доверие.',
      ],
      examples: [
        'Вероятность на Polymarket сместилась на 24% за 3 часа: вот объемы крупных китов.',
      ],
    },
    {
      id: 'human-writing',
      name: 'human-writing',
      description:
        'Очеловечивание и очистка текста от ИИ-клише: удаление шаблонных контрастов («не X, а Y»), маркетингового буллшита, вымученных метафор и превращение текста в живую мысль живого автора.',
      rules: [
        'Сохраняйте смысл, факты, цифры и намерение автора без добавления выдуманных историй.',
        'Никаких шаблонных контрастов: строго избегать «не X, а Y», «не просто X», «это не про X, это про Y».',
        'Удалять маркетинговый пафос: «меняет расклад», «новая эра», «сильное комьюнити», «проверенный фундамент», «пустой хайп».',
        'Без искусственных метафор: «билет в первый ряд», «прикоснуться к экосистеме», «начать новую главу».',
        'Разная длина предложений, живая речь без вылизанной до скрипа структуры HOOK → PROBLEM → CTA.',
        'Crypto X Mode: писать как реальный участник крипто-твиттера, а не пиар-отдел Web3-стартапа.',
      ],
      examples: [
        'Вместо: «Это не просто инструмент, это новая эра для комьюнити» → «Сделал утилиту для себя, в итоге пользуется вся команда».',
        'Вместо: «Мы стоим на пороге великих свершений в экосистеме» → «Вчера задеплоили смарт-контракт в тестнет, газ обошелся в 14 центов».',
      ],
      recommendedHook: 'Честный факт, Живое наблюдение, Неожиданная цифра',
    },
    {
      id: 'code-animation',
      name: 'code-animation',
      description:
        'Создание визуальных материалов: карточки кода, терминальные снимки с кнопками окна macOS, графики метрик для максимального удержания взгляда в ленте.',
      rules: [
        'Контрастные темные темы оформления для ленты 𝕏.',
        'Акцент на ключевой строке кода или метрике без визуального шума.',
      ],
      examples: ['Retina 2x скриншоты терминала с подсветкой синтаксиса.'],
    },
  ];

  const current = skills.find((s) => s.id === selectedSkill) || skills[0];

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-5 border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              База знаний плейбуков AICB Content Skills
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                12 навыков
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Рабочие правила создания контента для быстрорастущих инженерных и авторских аккаунтов в X.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Список скиллов */}
        <div className="lg:col-span-4 space-y-2">
          {skills.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSkill(s.id)}
              className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between group cursor-pointer ${
                selectedSkill === s.id
                  ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                  : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
              }`}
            >
              <div>
                <div className="font-semibold text-xs text-zinc-200 group-hover:text-white flex items-center gap-2">
                  <span className="font-mono text-sky-400">/{s.name}</span>
                </div>
                <div className="text-[11px] text-zinc-500 truncate max-w-[220px] mt-0.5">
                  {s.description}
                </div>
              </div>
              <ChevronRight
                className={`w-4 h-4 transition ${
                  selectedSkill === s.id ? 'text-sky-400 translate-x-1' : 'text-zinc-600'
                }`}
              />
            </button>
          ))}
        </div>

        {/* Детальное описание выбранного скилла */}
        <div className="lg:col-span-8 space-y-5">
          <div className="glass-panel-glow rounded-2xl p-6 border border-zinc-800 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 font-mono">
                  скилл: {current.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-1">{current.description}</p>
              </div>

              {['social-post', 'social-thread', 'social-reply', 'social-quote', 'x-article'].includes(
                current.id
              ) && (
                <button
                  onClick={() => onSelectSkill(current.id.replace('social-', ''))}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs transition shadow-md shadow-sky-500/20 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Открыть в студии</span>
                </button>
              )}
            </div>

            {/* Жесткие правила */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Законы плейбука и блокирующие правила
              </h4>
              <ul className="space-y-2">
                {current.rules.map((r, i) => (
                  <li
                    key={i}
                    className="text-xs text-zinc-300 bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Примеры */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Боевые примеры из практики
              </h4>
              <div className="space-y-2">
                {current.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="text-xs text-zinc-300 bg-zinc-900/60 p-3 rounded-xl border border-zinc-800 font-mono leading-relaxed"
                  >
                    {ex}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
