import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Share2,
  BookmarkPlus,
  AlertTriangle,
  Lightbulb,
  TrendingUp,
  RotateCcw,
  Sliders,
  Send,
  Zap,
  CheckCircle2,
  Bold,
  Italic,
  Code,
  List,
  Scissors,
  UserCheck,
  Coins,
  Eye,
} from 'lucide-react';
import { PersonaNotes, PostVariant, MarketDataResponse } from '../types';
import { HOOK_FORMULAS, validateTweetText } from '../utils/rulesValidator';
import { saveDraft, openTwitterComposer } from '../utils/storage';

interface Props {
  persona: PersonaNotes;
  marketData: MarketDataResponse | null;
  onSelectForTerminal?: (text: string) => void;
  onPostSaved?: () => void;
}

export const PostStudio: React.FC<Props> = ({
  persona,
  marketData,
  onSelectForTerminal,
  onPostSaved,
}) => {
  const [topic, setTopic] = useState('');
  const [selectedHook, setSelectedHook] = useState(HOOK_FORMULAS[0].name);
  const [selectedFormat, setSelectedFormat] = useState('Горячий тейк');
  const [postLengthMode, setPostLengthMode] = useState<'standard' | 'premium_long'>('premium_long');
  const [includeMarketData, setIncludeMarketData] = useState(false);
  const [customNotes, setCustomNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<PostVariant[]>([]);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(0);
  const [editedText, setEditedText] = useState('');
  const [recommendedMedia, setRecommendedMedia] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showFullInFeed, setShowFullInFeed] = useState(false);
  const [isCryptoMode, setIsCryptoMode] = useState(persona.enableCryptoMode || false);
  const [humanizing, setHumanizing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleHumanizeDraft = async () => {
    if (!editedText.trim()) return;
    setHumanizing(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: 'human-rewrite',
          originalText: editedText,
          mode: isCryptoMode ? 'crypto' : 'human',
          persona,
        }),
      });
      const data = await res.json();
      if (data.rewrittenText) {
        setEditedText(data.rewrittenText);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Не удалось очеловечить: ' + (err.message || 'Сбой'));
    } finally {
      setHumanizing(false);
    }
  };

  const formats = [
    'Горячий тейк (Hot Take)',
    'Мини-список (3 пункта по одной строке)',
    'История в 4 строки (Сетап, Разворот, Результат, Инсайт)',
    'До / После (Контраст было/стало)',
    'Разбор процесса (Как мы сделали X с цифрами)',
    'Анализ ошибки (Teardown чужого или своего кейса)',
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setErrorMessage('');

    let marketContext = '';
    if (includeMarketData && marketData) {
      marketContext = `Текущие котировки: ${marketData.crypto
        ?.slice(0, 3)
        .map((c) => `${c.symbol} $${c.price} (${c.change24h > 0 ? '+' : ''}${c.change24h}%)`)
        .join(', ')}. Вероятность Polymarket: ${
        marketData.predictions?.[0]?.title
      } (${marketData.predictions?.[0]?.outcomePrices?.Yes || 50}% Да).`;
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: 'social-post',
          topic,
          hookFormula: selectedHook,
          format: selectedFormat,
          persona,
          marketDataContext: marketContext,
          customInstructions: customNotes,
          postLengthMode,
          mode: isCryptoMode ? 'crypto' : 'human',
        }),
      });

      const data = await res.json();
      if (data.variants && data.variants.length > 0) {
        setVariants(data.variants);
        setSelectedVariantIdx(0);
        setEditedText(data.variants[0].text);
        setRecommendedMedia(data.recommendedMedia || '');
      } else {
        setErrorMessage('Не удалось сгенерировать варианты. Пожалуйста, уточните тему.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Ошибка генерации поста: ' + (err.message || 'Сбой сети'));
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVariant = (idx: number) => {
    setSelectedVariantIdx(idx);
    setEditedText(variants[idx].text);
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('composer-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = editedText.substring(start, end) || 'текст';
    const replacement = `${prefix}${selected}${suffix}`;
    const nextText = editedText.substring(0, start) + replacement + editedText.substring(end);
    setEditedText(nextText);
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
      type: 'post',
      title: editedText.slice(0, 40) + '...',
      content: { text: editedText, hookFormula: selectedHook, format: selectedFormat },
      status: 'draft',
      tags: ['post', postLengthMode],
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
    if (onPostSaved) onPostSaved();
  };

  const validation = validateTweetText(editedText, persona.isPremium);

  // Для визуализации линии отсечения 280 символов ("Показать еще")
  const charLimitForFold = 280;
  const isOverFold = editedText.length > charLimitForFold;
  const aboveTheFoldText = isOverFold ? editedText.slice(0, charLimitForFold) : editedText;
  const belowTheFoldText = isOverFold ? editedText.slice(charLimitForFold) : '';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Левая колонка: Форма и настройки генерации */}
      <div className="lg:col-span-5 space-y-5">
        <div className="glass-panel rounded-2xl p-5 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
                <Zap className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  social-post Генератор
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Хук в первой строке, одна мысль, заземление цифрами
                </p>
              </div>
            </div>

            {persona.isPremium && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-sky-400" />
                Premium
              </span>
            )}
          </div>

          {/* Режим длины поста (Базовый 280 vs Премиум-лонгпост) */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Формат публикации в 𝕏
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPostLengthMode('premium_long')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-left flex flex-col ${
                  postLengthMode === 'premium_long'
                    ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="flex items-center gap-1">
                  Премиум-лонгпост
                  <CheckCircle2 className="w-3 h-3 text-sky-400" />
                </span>
                <span className="text-[10px] text-zinc-500 mt-0.5">До 25 000 зн. + хук до ката</span>
              </button>

              <button
                type="button"
                onClick={() => setPostLengthMode('standard')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-left flex flex-col ${
                  postLengthMode === 'standard'
                    ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>Стандартный твит</span>
                <span className="text-[10px] text-zinc-500 mt-0.5">Строго до 280 знаков</span>
              </button>
            </div>
          </div>

          {/* Поле ввода темы */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Тема твита или сырая мысль
            </label>
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="например: почему мы отказались от микросервисов обратно в монолит и сэкономили $600 в месяц на AWS..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          {/* Формулы хуков */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider flex items-center justify-between">
              <span>Формула хука (первая строка)</span>
              <span className="text-[10px] text-sky-400 font-mono">Плейбук AICB</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {HOOK_FORMULAS.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setSelectedHook(h.name)}
                  className={`text-left p-2.5 rounded-xl border transition text-xs flex flex-col justify-between ${
                    selectedHook === h.name
                      ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                      : 'bg-zinc-950 border-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                  }`}
                >
                  <span className="font-semibold text-zinc-200 text-xs">{h.name}</span>
                  <span className="text-[10px] text-zinc-500 truncate mt-1">
                    {h.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Формат подачи */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Формат структуры
            </label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-sky-500 transition"
            >
              {formats.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Чекбокс рыночных данных и Crypto Mode */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="crypto-mode-post"
                checked={isCryptoMode}
                onChange={(e) => setIsCryptoMode(e.target.checked)}
                className="rounded bg-zinc-900 border-zinc-700 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <label
                htmlFor="crypto-mode-post"
                className="text-xs text-zinc-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>Режим <strong>Crypto X (CT)</strong>: стиль участника CT без Web3 PR-воды</span>
              </label>
            </div>

            {marketData && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="mkt-ground-ru"
                  checked={includeMarketData}
                  onChange={(e) => setIncludeMarketData(e.target.checked)}
                  className="rounded bg-zinc-900 border-zinc-700 text-sky-500 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <label
                  htmlFor="mkt-ground-ru"
                  className="text-xs text-zinc-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Заземлить реальными котировками крипты и ставками Polymarket
                </label>
              </div>
            )}
          </div>

          {/* Дополнительный угол */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Особый фокус / Деталь (Опционально)
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="например: подчеркнуть потраченное время, добавить долю иронии..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition"
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
            className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-zinc-950 font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Создаем 3 варианта по канонам AICB...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Сгенерировать 3 варианта
              </>
            )}
          </button>
        </div>

        {/* Подсказки плейбука AICB */}
        <div className="glass-panel rounded-2xl p-4 border border-zinc-800/80 text-xs text-zinc-400 space-y-2">
          <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Правила плейбука social-post:
          </div>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-400">
            <li>
              <strong>Первая строка:</strong> Решает всё для 90% листающих ленту. Никаких «В сегодняшнем мире».
            </li>
            <li>
              <strong>Конкретика:</strong> Хотя бы одна точная цифра, сумма или измеренное время.
            </li>
            <li>
              <strong>Ссылки:</strong> Никогда не вставляйте ссылки в первый твит (это режет охваты X), только в первый реплай!
            </li>
            <li>
              <strong>Без клише:</strong> Забудьте про «🧵», «Осознайте это», «Согласны?».
            </li>
          </ul>
        </div>
      </div>

      {/* Правая колонка: Варианты, Редактор и Превью ленты */}
      <div className="lg:col-span-7 space-y-5">
        {variants.length > 0 ? (
          <>
            {/* Переключатель вариантов */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider shrink-0 mr-1">
                Варианты:
              </span>
              {variants.map((v, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectVariant(i)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-2 border ${
                    selectedVariantIdx === i
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm'
                      : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center font-mono">
                    {i + 1}
                  </span>
                  <span>{v.type}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {v.text.length} зн.
                  </span>
                </button>
              ))}
            </div>

            {/* Разбор психологического угла */}
            {variants[selectedVariantIdx]?.breakdown && (
              <div className="px-3.5 py-2.5 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2">
                <span className="text-sky-400 font-bold uppercase text-[10px] tracking-wider mt-0.5 shrink-0">
                  Психология хука:
                </span>
                <span>{variants[selectedVariantIdx].breakdown}</span>
              </div>
            )}

            {/* Интерактивный редактор поста */}
            <div className="glass-panel-glow rounded-2xl p-5 border border-zinc-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between border-b border-zinc-800/80 pb-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Редактор поста
                  </span>
                  {isOverFold && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 font-mono">
                      <Scissors className="w-3 h-3" />
                      Кат-офф ленты на 280 зн.
                    </span>
                  )}
                </div>

                {/* Тулбар форматирования Twitter Premium */}
                <div className="flex items-center gap-1 bg-zinc-950 px-2 py-1 rounded-lg border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**')}
                    className="p-1 text-zinc-400 hover:text-white rounded transition"
                    title="Жирный текст (Markdown)"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*')}
                    className="p-1 text-zinc-400 hover:text-white rounded transition"
                    title="Курсив"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('`', '`')}
                    className="p-1 text-zinc-400 hover:text-white rounded transition"
                    title="Код"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n- ')}
                    className="p-1 text-zinc-400 hover:text-white rounded transition"
                    title="Список"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>

                  <div className="w-[1px] h-4 bg-zinc-800 mx-1" />

                  {/* Кнопка 1-клик очеловечивания */}
                  <button
                    type="button"
                    onClick={handleHumanizeDraft}
                    disabled={humanizing || !editedText.trim()}
                    className="px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 transition bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 disabled:opacity-50 cursor-pointer"
                    title="Применить Human Writing Skill: убрать штампы, шаблонные контрасты и марк-пафос"
                  >
                    {humanizing ? (
                      <RotateCcw className="w-3 h-3 animate-spin" />
                    ) : (
                      <UserCheck className="w-3 h-3 text-emerald-400" />
                    )}
                    <span>{humanizing ? 'Очистка...' : 'Очеловечить'}</span>
                  </button>
                </div>

                {/* Счетчик символов и оценка живости */}
                <div className="flex items-center gap-2">
                  <div
                    className={`text-[11px] font-mono font-bold px-2 py-1 rounded-lg border flex items-center gap-1 ${
                      validation.humanScore >= 80
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                    title="Оценка естественности текста (Human Score)"
                  >
                    <span>Живость:</span>
                    <span>{validation.humanScore}%</span>
                  </div>

                  <div
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border ${
                      validation.isValidLength
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}
                  >
                    {validation.charCount} / {validation.maxChars} зн.
                  </div>
                </div>
              </div>

              {/* Текстовое поле композера */}
              <textarea
                id="composer-textarea"
                rows={6}
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full bg-transparent text-sm sm:text-base text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none leading-relaxed font-sans"
              />

              {/* Индикатор линии обреза ленты для лонгпостов Premium */}
              {isOverFold && (
                <div className="p-3 rounded-xl bg-zinc-950 border border-dashed border-amber-500/30 text-xs space-y-1">
                  <div className="flex items-center justify-between text-amber-400 font-bold text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Scissors className="w-3.5 h-3.5" />
                      Первые 280 символов (то, что увидят в ленте ДО нажатия «Показать еще»):
                    </span>
                    <span className="font-mono">{aboveTheFoldText.length} зн.</span>
                  </div>
                  <p className="text-zinc-300 font-mono text-[11px] bg-zinc-900/60 p-2 rounded border border-zinc-800">
                    {aboveTheFoldText}
                  </p>
                </div>
              )}

              {/* Предупреждения валидатора */}
              {validation.warnings.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-zinc-800/60">
                  {validation.warnings.map((w, idx) => (
                    <div
                      key={idx}
                      className={`text-xs p-2.5 rounded-xl flex items-start gap-2 ${
                        w.severity === 'error'
                          ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                          : w.severity === 'warning'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : 'bg-sky-500/10 text-sky-300 border border-sky-500/20'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">{w.message}</div>
                        {w.fixSuggestion && (
                          <div className="text-[11px] opacity-80 mt-0.5">
                            Совет: {w.fixSuggestion}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Рекомендованный визуал */}
              {recommendedMedia && (
                <div className="text-xs p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="text-sky-400 font-bold">Идея визуала:</span>
                    {recommendedMedia}
                  </span>
                  {onSelectForTerminal && (
                    <button
                      onClick={() => onSelectForTerminal(editedText)}
                      className="text-sky-400 hover:text-sky-300 font-medium text-[11px] transition shrink-0 ml-2"
                    >
                      В карточку кода →
                    </button>
                  )}
                </div>
              )}

              {/* Кнопки действий */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-700/60 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Скопировано!' : 'Скопировать'}</span>
                  </button>

                  <button
                    onClick={handleSaveDraft}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-700/60 transition"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5 text-sky-400" />
                    <span>{savedSuccess ? 'В черновиках!' : 'В черновики'}</span>
                  </button>
                </div>

                <button
                  onClick={() => openTwitterComposer(editedText)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs transition shadow-lg shadow-sky-500/20"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Открыть в композере 𝕏</span>
                </button>
              </div>
            </div>

            {/* Превью реальной ленты X (Twitter) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-sky-400" />
                  Превью в ленте читателя
                </span>
                {isOverFold && (
                  <button
                    onClick={() => setShowFullInFeed(!showFullInFeed)}
                    className="text-xs text-sky-400 hover:underline"
                  >
                    {showFullInFeed ? 'Свернуть до 280 знаков' : 'Симуляция клика «Показать еще»'}
                  </button>
                )}
              </div>

              <div className="bg-black border border-zinc-800 rounded-2xl p-4 sm:p-5 text-white max-w-xl shadow-2xl">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {persona.displayName ? persona.displayName.slice(0, 2).toUpperCase() : 'XC'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 leading-tight">
                      <span className="font-bold text-sm hover:underline cursor-pointer text-white">
                        {persona.displayName || 'Creator'}
                      </span>
                      {persona.isPremium && (
                        <CheckCircle2 className="w-4 h-4 text-sky-400 fill-sky-400/20" />
                      )}
                      <span className="text-zinc-500 text-xs">@{persona.username || 'builder'}</span>
                      <span className="text-zinc-600 text-xs">·</span>
                      <span className="text-zinc-500 text-xs">сейчас</span>
                    </div>

                    {/* Текст поста в ленте с учетом обреза */}
                    <div className="mt-2 text-sm text-zinc-100 whitespace-pre-wrap leading-relaxed">
                      {!isOverFold || showFullInFeed ? (
                        editedText
                      ) : (
                        <>
                          {aboveTheFoldText}
                          <span
                            onClick={() => setShowFullInFeed(true)}
                            className="text-sky-400 hover:underline cursor-pointer ml-1 font-medium"
                          >
                            Показать еще
                          </span>
                        </>
                      )}
                    </div>

                    {/* Панель метрик вовлечения */}
                    <div className="flex items-center justify-between text-zinc-500 mt-4 pt-3 border-t border-zinc-900 text-xs max-w-md">
                      <span className="hover:text-sky-400 cursor-pointer">💬 34</span>
                      <span className="hover:text-emerald-400 cursor-pointer">🔁 58</span>
                      <span className="hover:text-rose-400 cursor-pointer">❤️ 412</span>
                      <span className="hover:text-sky-400 cursor-pointer">🔖 168</span>
                      <span className="hover:text-sky-400 cursor-pointer">📊 24.5K</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="glass-panel rounded-2xl p-12 border border-zinc-800 text-center flex flex-col items-center justify-center min-h-[420px] text-zinc-400 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <Sparkles className="w-7 h-7 text-sky-400" />
            </div>
            <div className="max-w-md">
              <h4 className="text-base font-bold text-white mb-1">
                Генератор постов и лонгпостов для 𝕏
              </h4>
              <p className="text-xs text-zinc-400">
                Введите тему, выберите формулу хука по плейбукам AICB, и система создаст 3 готовых варианта с адаптацией под Twitter Premium.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setTopic(
                    'Мы удалили 4 000 строк микросервисного кода и вернулись в монолит. Сэкономили $600/месяц на серверах и сократили задержку ответов с 340мс до 42мс.'
                  );
                  setSelectedHook('Цифра / Контраст');
                }}
                className="text-[11px] px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-sky-400 border border-zinc-800 transition"
              >
                Пример: Монолит против микросервисов
              </button>
              <button
                onClick={() => {
                  setTopic(
                    'Почему 95% советов по промптам в твиттере — бесполезная теория от людей, которые никогда не деплоили модели в боевой прод.'
                  );
                  setSelectedHook('Смелое утверждение');
                }}
                className="text-[11px] px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-sky-400 border border-zinc-800 transition"
              >
                Пример: Мифы про AI в продакшене
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
