import React, { useState } from 'react';
import {
  Sparkles,
  GitCommit,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
  Check,
  BookmarkPlus,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { PersonaNotes, ThreadPart, ThreadResult, MarketDataResponse } from '../types';
import { validateTweetText } from '../utils/rulesValidator';
import { saveDraft, openTwitterComposer } from '../utils/storage';

interface Props {
  persona: PersonaNotes;
  marketData: MarketDataResponse | null;
  onPostSaved?: () => void;
}

export const ThreadStudio: React.FC<Props> = ({ persona, marketData, onPostSaved }) => {
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('История (Цель → Что случилось → Цена → Вывод)');
  const [partsCount, setPartsCount] = useState<number>(5);
  const [customInstructions, setCustomInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [threadResult, setThreadResult] = useState<ThreadResult | null>(null);
  const [copiedPartIdx, setCopiedPartIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const threadFormats = [
    'История (Цель → Что случилось → Цена ошибки → Главный вывод)',
    'Лог разработки (Цель → Шаг 1..n → Замеры → Итог)',
    'Полезный список (Хук-утверждение → Пункты с цифрами → Главный №1)',
    'Анализ и разбор (Кейс → Что сделано круто → Где провал → Урок)',
    'Анализ цифр (Источник датасета → Находки 1..n → Неожиданный вывод)',
    'Цена ошибок (Неожиданный результат → Ошибки 1..n → Новое правило)',
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: 'social-thread',
          topic,
          format,
          partsCount,
          persona,
          customInstructions,
        }),
      });

      const data = await res.json();
      if (data.parts && data.parts.length > 0) {
        setThreadResult(data);
      } else {
        setErrorMessage('Не удалось сформировать тред. Проверьте формулировку темы.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Ошибка генерации: ' + (err.message || 'Сбой сети'));
    } finally {
      setLoading(false);
    }
  };

  const updatePartText = (idx: number, newText: string) => {
    if (!threadResult) return;
    const nextParts = [...threadResult.parts];
    nextParts[idx] = {
      ...nextParts[idx],
      text: newText,
      charCount: newText.length,
    };
    setThreadResult({
      ...threadResult,
      parts: nextParts,
    });
  };

  const movePart = (idx: number, direction: 'up' | 'down') => {
    if (!threadResult) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= threadResult.parts.length) return;

    const nextParts = [...threadResult.parts];
    const temp = nextParts[idx];
    nextParts[idx] = nextParts[targetIdx];
    nextParts[targetIdx] = temp;

    nextParts.forEach((p, i) => {
      p.partNumber = i + 1;
    });

    setThreadResult({ ...threadResult, parts: nextParts });
  };

  const addPart = (afterIdx: number) => {
    if (!threadResult) return;
    const nextParts = [...threadResult.parts];
    const newPart: ThreadPart = {
      partNumber: afterIdx + 2,
      role: 'Новая мысль',
      text: '',
      charCount: 0,
    };
    nextParts.splice(afterIdx + 1, 0, newPart);
    nextParts.forEach((p, i) => {
      p.partNumber = i + 1;
    });
    setThreadResult({ ...threadResult, totalParts: nextParts.length, parts: nextParts });
  };

  const removePart = (idx: number) => {
    if (!threadResult || threadResult.parts.length <= 3) {
      setErrorMessage('Правило AICB: тред должен состоять минимум из 3 частей (меньше — это единичный пост с абзацами).');
      return;
    }
    const nextParts = threadResult.parts.filter((_, i) => i !== idx);
    nextParts.forEach((p, i) => {
      p.partNumber = i + 1;
    });
    setThreadResult({ ...threadResult, totalParts: nextParts.length, parts: nextParts });
  };

  const copyPart = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPartIdx(idx);
    setTimeout(() => setCopiedPartIdx(null), 2000);
  };

  const copyAllParts = () => {
    if (!threadResult) return;
    const fullText = threadResult.parts.map((p) => p.text).join('\n\n---\n\n');
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleSaveDraft = () => {
    if (!threadResult) return;
    saveDraft({
      type: 'thread',
      title: threadResult.threadTitle || threadResult.parts[0]?.text.slice(0, 40) + '...',
      content: threadResult,
      status: 'draft',
      tags: ['thread', `${threadResult.parts.length}-parts`],
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
    if (onPostSaved) onPostSaved();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Колонка настроек */}
      <div className="lg:col-span-4 space-y-5">
        <div className="glass-panel rounded-2xl p-5 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <GitCommit className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                social-thread Конструктор
              </h3>
              <p className="text-[11px] text-zinc-400">
                Часть 1 выживает одна в ленте, 3-8 частей, высокая дочитываемость
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Тема треда или кейс
            </label>
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="например: как мы смигрировали 2 млн пользователей с Firebase на Postgres за 12 часов без простоя..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Архитектурная форма треда
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500 transition"
            >
              {threadFormats.map((tf) => (
                <option key={tf} value={tf}>
                  {tf}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
                Количество частей
              </label>
              <select
                value={partsCount}
                onChange={(e) => setPartsCount(parseInt(e.target.value, 10))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500 transition"
              >
                {[3, 4, 5, 6, 7, 8].map((n) => (
                  <option key={n} value={n}>
                    {n} частей {n === 5 ? '(Оптимально)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
                Лимит на твит
              </label>
              <div className="text-xs bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300 font-mono">
                280 зн. / часть
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Ключевые цифры и факты для включения
            </label>
            <input
              type="text"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="например: указать экономию $1,400/мес, упомянуть факап в части 3..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition"
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
            disabled={loading || !topic.trim()}
            className="w-full py-3 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-50 text-zinc-950 font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Строим тред по правилам AICB...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Сгенерировать тред из {partsCount} частей
              </>
            )}
          </button>
        </div>

        {/* Законы тредов AICB */}
        <div className="glass-panel rounded-2xl p-4 border border-zinc-800/80 text-xs text-zinc-400 space-y-2">
          <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-purple-400" />
            Законы создания тредов:
          </div>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-400">
            <li>
              <strong className="text-zinc-300">Часть 1 обязана жить сама:</strong> Она несет в себе результат или главный вывод. Если Часть 1 не готовы постить отдельно — тред не готов.
            </li>
            <li>
              <strong className="text-zinc-300">Никаких «🧵» или «Тред:»:</strong> Это мгновенно выдает шаблонность.
            </li>
            <li>
              <strong className="text-zinc-300">Одна мысль на твит:</strong> Разделение идет по смыслу и идеям, а не по количеству слов.
            </li>
            <li>
              <strong className="text-zinc-300">Финал:</strong> Закрывает тред сильнейшей мыслью или вопросом.
            </li>
          </ul>
        </div>
      </div>

      {/* Колонка редактора и таймлайна */}
      <div className="lg:col-span-8 space-y-5">
        {threadResult ? (
          <div className="space-y-4">
            {/* Тулбар треда */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800 px-4 py-3 rounded-2xl">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{threadResult.threadTitle || 'Структура треда'}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {threadResult.parts.length} частей
                  </span>
                </h4>
                {threadResult.bookmarkIncentive && (
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    🔖 Мотив для закладок: {threadResult.bookmarkIncentive}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyAllParts}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition border border-zinc-700"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAll ? 'Весь тред скопирован!' : 'Скопировать весь тред'}</span>
                </button>

                <button
                  onClick={handleSaveDraft}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition border border-zinc-700"
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-purple-400" />
                  <span>{savedSuccess ? 'Сохранено!' : 'В черновики'}</span>
                </button>
              </div>
            </div>

            {/* Таймлайн частей треда */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-3 before:top-4 before:bottom-4 before:w-0.5 before:bg-zinc-800">
              {threadResult.parts.map((part, idx) => {
                const validation = validateTweetText(part.text, false);
                const isPartOne = idx === 0;
                const isLastPart = idx === threadResult.parts.length - 1;

                return (
                  <div key={idx} className="relative group">
                    <div
                      className={`absolute -left-[27px] top-4 w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-bold z-10 ${
                        isPartOne
                          ? 'bg-purple-500 border-white text-zinc-950 shadow-md shadow-purple-500/50'
                          : isLastPart
                          ? 'bg-sky-500 border-zinc-900 text-zinc-950'
                          : 'bg-zinc-900 border-zinc-600 text-zinc-400'
                      }`}
                    >
                      {part.partNumber}
                    </div>

                    <div className="glass-panel rounded-2xl p-4 border border-zinc-800 hover:border-zinc-700 transition">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              isPartOne
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : isLastPart
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : 'bg-zinc-800 text-zinc-400'
                            }`}
                          >
                            Часть {part.partNumber} · {part.role}
                          </span>
                          {isPartOne && (
                            <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                              ⚡ Живет одна в ленте
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                              validation.isValidLength
                                ? 'text-zinc-400 bg-zinc-900'
                                : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                            }`}
                          >
                            {validation.charCount} / 280
                          </span>

                          <button
                            disabled={idx === 0}
                            onClick={() => movePart(idx, 'up')}
                            className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-20"
                            title="Вверх"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={idx === threadResult.parts.length - 1}
                            onClick={() => movePart(idx, 'down')}
                            className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-20"
                            title="Вниз"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => copyPart(part.text, idx)}
                            className="p-1 text-zinc-500 hover:text-zinc-200"
                            title="Скопировать эту часть"
                          >
                            {copiedPartIdx === idx ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => openTwitterComposer(part.text)}
                            className="p-1 text-zinc-500 hover:text-sky-400"
                            title="Открыть часть в композере 𝕏"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removePart(idx)}
                            className="p-1 text-zinc-500 hover:text-rose-400"
                            title="Удалить часть"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={3}
                        value={part.text}
                        onChange={(e) => updatePartText(idx, e.target.value)}
                        className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none leading-relaxed"
                      />

                      {validation.warnings.length > 0 && (
                        <div className="pt-2 border-t border-zinc-800/60 mt-2 text-[11px] text-amber-400 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{validation.warnings[0].message}</span>
                        </div>
                      )}

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => addPart(idx)}
                          className="opacity-0 group-hover:opacity-100 transition text-[10px] text-zinc-400 hover:text-purple-400 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Вставить часть ниже
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-12 border border-zinc-800 text-center flex flex-col items-center justify-center min-h-[420px] text-zinc-400 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <GitCommit className="w-7 h-7 text-purple-400" />
            </div>
            <div className="max-w-md">
              <h4 className="text-base font-bold text-white mb-1">
                Конструктор виральных тредов
              </h4>
              <p className="text-xs text-zinc-400">
                Создавайте цепочки из 3–8 постов, где Часть 1 привлекает внимание в общей ленте, а каждая следующая часть удерживает внимание читателя до финала.
              </p>
            </div>
            <button
              onClick={() => {
                setTopic(
                  'Мы снизили затраты на облако AI с $1,200/мес до $180/мес. Три конкретных архитектурных изменения, и первое было банальным фиксом ключа кэша.'
                );
                setPartsCount(5);
              }}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-purple-400 border border-zinc-800 transition"
            >
              Пример: Снижение затрат на AI сервер на 85%
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
