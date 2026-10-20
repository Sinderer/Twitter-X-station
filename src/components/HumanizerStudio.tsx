import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Share2,
  BookmarkPlus,
  AlertTriangle,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
  Zap,
  UserCheck,
  Coins,
  ArrowRight,
  TrendingUp,
  FileCheck2,
} from 'lucide-react';
import { PersonaNotes, HumanRewriteResult } from '../types';
import { validateTweetText, detectAIPatterns, calculateHumanScore } from '../utils/rulesValidator';
import { saveDraft, openTwitterComposer } from '../utils/storage';

interface Props {
  persona: PersonaNotes;
  onSendToPost?: (text: string) => void;
  onPostSaved?: () => void;
}

export const HumanizerStudio: React.FC<Props> = ({
  persona,
  onSendToPost,
  onPostSaved,
}) => {
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState<'human' | 'crypto'>('human');
  const [customInstructions, setCustomInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<HumanRewriteResult | null>(null);
  const [editedText, setEditedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Анализ исходного текста в реальном времени
  const inputAIPatterns = detectAIPatterns(inputText);
  const inputHumanScore = calculateHumanScore(inputText);

  const handleRewrite = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: 'human-rewrite',
          originalText: inputText,
          mode,
          persona,
          customInstructions,
        }),
      });

      const data = await res.json();
      if (data.rewrittenText) {
        setResult(data);
        setEditedText(data.rewrittenText);
      } else {
        setErrorMessage('Не удалось очеловечить текст. Попробуйте еще раз.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Ошибка очеловечивания: ' + (err.message || 'Сбой сети'));
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!editedText) return;
    navigator.clipboard.writeText(editedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDraft = () => {
    if (!editedText) return;
    saveDraft({
      type: 'humanized',
      title: editedText.slice(0, 40) + '...',
      content: { originalText: inputText, rewrittenText: editedText, mode },
      status: 'draft',
      tags: ['human-writing', mode],
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
    if (onPostSaved) onPostSaved();
  };

  const validation = validateTweetText(editedText, persona.isPremium);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Левая колонка: Исходный текст и детектор AI-паттернов */}
      <div className="lg:col-span-5 space-y-5">
        <div className="glass-panel rounded-2xl p-5 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <UserCheck className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Human Writing Studio
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Очистка от AI-штампов, формульных контрастов и маркетингового пафоса
                </p>
              </div>
            </div>
          </div>

          {/* Переключатель режимов */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Режим очеловечивания
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('human')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-left flex flex-col cursor-pointer ${
                  mode === 'human'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="flex items-center gap-1.5 font-bold">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Живой человек
                </span>
                <span className="text-[10px] text-zinc-500 mt-0.5">
                  Без "не X, а Y", усилителей и шаблонности
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMode('crypto')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-left flex flex-col cursor-pointer ${
                  mode === 'crypto'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="flex items-center gap-1.5 font-bold">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  Crypto X Mode
                </span>
                <span className="text-[10px] text-zinc-500 mt-0.5">
                  Стиль участника CT, без Web3 PR-воды
                </span>
              </button>
            </div>
          </div>

          {/* Поле ввода исходного текста */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Исходный текст (AI-черновик или заметка)
              </label>
              {inputText.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="text-zinc-500">Живость:</span>
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded text-[11px] ${
                      inputHumanScore >= 80
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : inputHumanScore >= 50
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {inputHumanScore}%
                  </span>
                </div>
              )}
            </div>
            <textarea
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Вставьте текст, сгенерированный AI или кажущийся слишком вылизанным, рекламным или шаблонным..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition leading-relaxed"
            />
          </div>

          {/* Найденные AI-паттерны в исходном тексте */}
          {inputAIPatterns.length > 0 && (
            <div className="space-y-1.5 bg-rose-500/5 p-3 rounded-xl border border-rose-500/20">
              <div className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Найдено AI-шаблонов ({inputAIPatterns.length}):
              </div>
              <div className="space-y-1">
                {inputAIPatterns.map((p, idx) => (
                  <div key={idx} className="text-[11px] text-zinc-300 flex items-start gap-1.5">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>
                      <strong className="text-rose-300">{p.type}</strong>: {p.matched}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Дополнительные пожелания */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Особые пожелания (Опционально)
            </label>
            <input
              type="text"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="например: сделать короче, добавить каплю сарказма, убрать пафос..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            onClick={handleRewrite}
            disabled={loading || !inputText.trim()}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Очищаем от AI-налета по чек-листу...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Очеловечить текст
              </>
            )}
          </button>
        </div>

        {/* Сводка принципов Human Writing */}
        <div className="glass-panel rounded-2xl p-4 border border-zinc-800/80 text-xs text-zinc-400 space-y-2">
          <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-emerald-400" />
            Принципы Human Writing Skill:
          </div>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-400">
            <li>
              <strong>Без контрастов:</strong> Избегать «не X, а Y», «не просто X, а Y», «это не про X».
            </li>
            <li>
              <strong>Без штампов:</strong> Запрещены «меняет расклад», «сильное комьюнити», «новая эра», «пустой хайп».
            </li>
            <li>
              <strong>Без вымученных метафор:</strong> «Билет в первый ряд», «начать новую главу» — люди так не пишут.
            </li>
            <li>
              <strong>Без мотивационных концовок:</strong> Твит не обязан заканчиваться призывом или лозунгом.
            </li>
          </ul>
        </div>
      </div>

      {/* Правая колонка: Очеловеченный результат и сравнение */}
      <div className="lg:col-span-7 space-y-5">
        {result ? (
          <div className="space-y-4">
            {/* Оценка живости текста До / После */}
            <div className="glass-panel rounded-2xl p-4 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-zinc-950/60">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Текст очеловечен</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {mode === 'crypto' ? 'Crypto X Mode' : 'Natural Human'}
                    </span>
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    Устранены шаблонные конструкции и приторная полировка
                  </p>
                </div>
              </div>

              {/* Метрики живости */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="text-right">
                  <span className="text-zinc-500 block text-[10px]">Было</span>
                  <span className="text-rose-400 font-bold">{result.humanScoreBefore || inputHumanScore}%</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600" />
                <div className="text-left">
                  <span className="text-zinc-500 block text-[10px]">Стало</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {result.humanScoreAfter || 98}%
                  </span>
                </div>
              </div>
            </div>

            {/* Удаленные шаблоны */}
            {result.removedPatterns && result.removedPatterns.length > 0 && (
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-300 space-y-1.5">
                <div className="text-[11px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  Что было очищено от искусственного налета:
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {result.removedPatterns.map((pat, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-zinc-950 text-zinc-300 border border-zinc-800"
                    >
                      ✓ {pat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Редактор очеловеченного текста */}
            <div className="glass-panel-glow rounded-2xl p-5 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Готовый живой текст
                </span>

                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    validation.isValidLength
                      ? 'text-zinc-400 bg-zinc-900'
                      : 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                  }`}
                >
                  {validation.charCount} / {validation.maxChars} зн.
                </span>
              </div>

              <textarea
                rows={5}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none leading-relaxed font-sans"
              />

              {/* Действия */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-700/60 transition cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Скопировано!' : 'Скопировать'}</span>
                  </button>

                  <button
                    onClick={handleSaveDraft}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-700/60 transition cursor-pointer"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{savedSuccess ? 'В черновиках!' : 'В черновики'}</span>
                  </button>

                  {onSendToPost && (
                    <button
                      onClick={() => onSendToPost(editedText)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-sky-400 text-xs font-semibold border border-zinc-700/60 transition cursor-pointer"
                    >
                      <span>В Студию постов →</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => openTwitterComposer(editedText)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Опубликовать в 𝕏</span>
                </button>
              </div>
            </div>

            {/* Сравнение До и После */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Сравнение с исходником:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-zinc-950/80 border border-zinc-800 p-3.5 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-rose-400 uppercase">
                    Было (AI-паттерны):
                  </div>
                  <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap">
                    {inputText}
                  </p>
                </div>
                <div className="bg-emerald-950/20 border border-emerald-500/20 p-3.5 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-emerald-400 uppercase">
                    Стало (Живой человек):
                  </div>
                  <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap">
                    {editedText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-12 border border-zinc-800 text-center flex flex-col items-center justify-center min-h-[420px] text-zinc-400 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <UserCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="max-w-md">
              <h4 className="text-base font-bold text-white mb-1">
                Human Writing & Crypto X Studio
              </h4>
              <p className="text-xs text-zinc-400">
                Вставьте любой черновик, чтобы избавить его от навязчивых формул («не X, а Y», «билет в первый ряд», «меняет расклад») и придать ему естественный голос живого человека или участника Crypto Twitter.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setInputText(
                    'Это не просто проект, это новая эра для всего комьюнити. Мы меняем расклад сил на рынке и открываем новую страницу в развитии экосистемы. На самом деле, наше решение действительно строит будущее для долгосрочной перспективы.'
                  );
                  setMode('human');
                }}
                className="text-[11px] px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-zinc-800 transition cursor-pointer"
              >
                Пример: Очистить типичный AI-пост от штампов
              </button>
              <button
                onClick={() => {
                  setInputText(
                    'Мы невероятно рады объявить о запуске нашей революционной Web3 платформы! Наше сильное комьюнити получает билет в первый ряд к уникальной возможности. Вместе мы движемся дальше и меняем правила игры!'
                  );
                  setMode('crypto');
                }}
                className="text-[11px] px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-zinc-800 transition cursor-pointer"
              >
                Пример: Переписать Web3 PR в Crypto X
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
