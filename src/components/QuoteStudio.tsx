import React, { useState } from 'react';
import {
  Repeat,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  BookmarkPlus,
  CheckCircle2,
} from 'lucide-react';
import { PersonaNotes, QuoteResult } from '../types';
import { QUOTE_MOVES, validateTweetText } from '../utils/rulesValidator';
import { saveDraft, openTwitterComposer } from '../utils/storage';

interface Props {
  persona: PersonaNotes;
  onPostSaved?: () => void;
}

export const QuoteStudio: React.FC<Props> = ({ persona, onPostSaved }) => {
  const [targetAuthor, setTargetAuthor] = useState('');
  const [targetText, setTargetText] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [selectedMove, setSelectedMove] = useState(QUOTE_MOVES[0].name);
  const [customAngle, setCustomAngle] = useState('');
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState<QuoteResult[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [editedText, setEditedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGenerate = async () => {
    if (!targetText.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: 'social-quote',
          topic: targetText,
          targetPost: {
            author: targetAuthor || '@автор',
            text: targetText,
            url: targetUrl,
          },
          persona,
          customInstructions: `Выбранный ход: ${selectedMove}. ${customAngle}`,
        }),
      });

      const data = await res.json();
      if (data.quotes && data.quotes.length > 0) {
        setQuotes(data.quotes);
        setSelectedIdx(0);
        setEditedText(data.quotes[0].text);
      } else {
        setErrorMessage('Не удалось сгенерировать цитаты. Уточните исходный твит.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Ошибка: ' + (err.message || 'Сбой сети'));
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (idx: number) => {
    setSelectedIdx(idx);
    setEditedText(quotes[idx].text);
  };

  const handleCopy = () => {
    if (!editedText) return;
    navigator.clipboard.writeText(editedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!editedText) return;
    saveDraft({
      type: 'quote',
      title: `Цитата @${targetAuthor || 'твита'}: ${editedText.slice(0, 30)}...`,
      content: { targetAuthor, targetText, targetUrl, quoteText: editedText },
      status: 'draft',
      tags: ['social-quote', selectedMove.toLowerCase()],
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
    if (onPostSaved) onPostSaved();
  };

  const validation = validateTweetText(editedText, persona.isPremium);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Левая колонка: Исходный твит и выбор хода */}
      <div className="lg:col-span-5 space-y-5">
        <div className="glass-panel rounded-2xl p-5 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Repeat className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                social-quote Студия (QRT)
              </h3>
              <p className="text-[11px] text-zinc-400">
                1–3 предложения комментария поверх цитируемого твита по 5 ходам AICB
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Автор цитируемого твита и ссылка
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={targetAuthor}
                onChange={(e) => setTargetAuthor(e.target.value)}
                placeholder="Автор (напр. @sama)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition font-mono"
              />
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="URL ссылка (опционально)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Текст цитируемого твита
            </label>
            <textarea
              rows={3}
              value={targetText}
              onChange={(e) => setTargetText(e.target.value)}
              placeholder="Вставьте твит, который хотите прокомментировать в своей ленте..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              5 стратегических ходов цитирования
            </label>
            <div className="space-y-1.5">
              {QUOTE_MOVES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMove(m.name)}
                  className={`w-full text-left p-2.5 rounded-xl border transition text-xs flex flex-col ${
                    selectedMove === m.name
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                      : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span className="font-semibold text-zinc-200">{m.name}</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">{m.description}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Конкретная деталь или мысль (Опционально)
            </label>
            <input
              type="text"
              value={customAngle}
              onChange={(e) => setCustomAngle(e.target.value)}
              placeholder="например: указать, что в AWS дефолты равны 30 секундам..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !targetText.trim()}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Формируем варианты цитирования...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Сгенерировать 3 цитаты
              </>
            )}
          </button>
        </div>

        {/* Заповеди цитирования */}
        <div className="glass-panel rounded-2xl p-4 border border-zinc-800/80 text-xs text-zinc-400 space-y-2">
          <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Заповеди цитирования твитов:
          </div>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-400">
            <li>
              <strong>Первые слова несут суть:</strong> В ленте ваш комментарий читается еще до того, как загрузится карточка цитируемого поста.
            </li>
            <li>
              <strong>Никогда не начинайте с:</strong> «Этот пост...», «Чистая правда», «Отличная мысль». Цитируемый пост и так уже на экране.
            </li>
            <li>
              <strong>Спорьте с тезисом, а не с человеком.</strong>
            </li>
          </ul>
        </div>
      </div>

      {/* Правая колонка: Варианты и превью цитаты */}
      <div className="lg:col-span-7 space-y-5">
        {quotes.length > 0 ? (
          <div className="space-y-4">
            {/* Вкладки ходов */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {quotes.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition flex items-center gap-2 ${
                    selectedIdx === i
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                      : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center font-mono">
                    {i + 1}
                  </span>
                  <span>{q.move}</span>
                </button>
              ))}
            </div>

            {/* Стратегическая польза для аудитории */}
            {quotes[selectedIdx]?.strategicPurpose && (
              <div className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                <strong>Ценность для ваших подписчиков:</strong> {quotes[selectedIdx].strategicPurpose}
              </div>
            )}

            {/* Редактор цитаты и сдвоенная симуляция */}
            <div className="glass-panel-glow rounded-2xl p-5 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Ваш комментарий к цитате
                </span>

                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    validation.isValidLength
                      ? 'text-zinc-400 bg-zinc-900'
                      : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                  }`}
                >
                  {validation.charCount} / 280
                </span>
              </div>

              <textarea
                rows={3}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none leading-relaxed"
              />

              {/* Карточка цитируемого твита */}
              <div className="border border-zinc-800 rounded-xl p-3.5 bg-zinc-950/80 text-xs space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-zinc-400">
                  <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">
                    𝕏
                  </div>
                  <span>{targetAuthor || '@автор'}</span>
                </div>
                <p className="text-zinc-300 text-xs line-clamp-3 leading-relaxed">{targetText}</p>
              </div>

              {/* Действия */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-700/60 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Скопировано!' : 'Скопировать'}</span>
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-700/60 transition"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                    <span>{savedSuccess ? 'В черновиках!' : 'В черновики'}</span>
                  </button>
                </div>

                <button
                  onClick={() => openTwitterComposer(`${editedText} ${targetUrl}`)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition shadow-lg shadow-amber-500/20"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Открыть в 𝕏</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-12 border border-zinc-800 text-center flex flex-col items-center justify-center min-h-[420px] text-zinc-400 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <Repeat className="w-7 h-7 text-amber-400" />
            </div>
            <div className="max-w-md">
              <h4 className="text-base font-bold text-white mb-1">
                Студия цитирования твитов
              </h4>
              <p className="text-xs text-zinc-400">
                Превратите любой трендовый твит в авторитетный контент для своей ленты с помощью ходов: Исправление, Контекст, Боевой пример, Шаг дальше или Тонкий юмор.
              </p>
            </div>
            <button
              onClick={() => {
                setTargetAuthor('@techguru');
                setTargetText(
                  'Будущее программирования на 100% на естественном языке. Через 1 год ни один человек не будет писать синтаксис или отлаживать код.'
                );
                setSelectedMove('Шаг дальше');
                setCustomAngle(
                  'Когда генерация кода становится бесплатной, главным узким горлышком становится архитектура и ревью граничных кейсов.'
                );
              }}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-800 transition"
            >
              Пример: Тейк «AI полностью заменит программистов»
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
