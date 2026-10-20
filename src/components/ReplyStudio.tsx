import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ShieldCheck,
  BookmarkPlus,
  CheckCircle2,
} from 'lucide-react';
import { PersonaNotes, ReplyResult } from '../types';
import { validateTweetText } from '../utils/rulesValidator';
import { saveDraft, openTwitterComposer } from '../utils/storage';

interface Props {
  persona: PersonaNotes;
  onPostSaved?: () => void;
}

export const ReplyStudio: React.FC<Props> = ({ persona, onPostSaved }) => {
  const [targetAuthor, setTargetAuthor] = useState('');
  const [targetText, setTargetText] = useState('');
  const [replyIntent, setReplyIntent] = useState('Ответ с цифрой (Исправить факт или дать точную метрику)');
  const [customInstructions, setCustomInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [replies, setReplies] = useState<ReplyResult[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const [editedText, setEditedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const angles = [
    'Ответ с цифрой (Исправить факт или дать точную метрику)',
    'Скрытый нюанс / Подводный камень (Указать на скрытый компромисс)',
    'Контр-пример (Реальный кейс, где правило сломалось)',
    'Вопрос, двигающий дискуссию (Острый развивающий вопрос)',
    'Ответ своему сообществу (Под своими постами: по делу и емко)',
  ];

  const handleGenerate = async () => {
    if (!targetText.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: 'social-reply',
          topic: targetText,
          targetPost: {
            author: targetAuthor || '@автор',
            text: targetText,
          },
          persona,
          customInstructions: `${replyIntent}. ${customInstructions}`,
        }),
      });

      const data = await res.json();
      if (data.replies && data.replies.length > 0) {
        setReplies(data.replies);
        setSelectedIdx(0);
        setEditedText(data.replies[0].text);
      } else {
        setErrorMessage('Не удалось сгенерировать ответы. Попробуйте еще раз.');
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
    setEditedText(replies[idx].text);
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
      type: 'reply',
      title: `Ответ @${targetAuthor || 'посту'}: ${editedText.slice(0, 30)}...`,
      content: { targetAuthor, targetText, replyText: editedText },
      status: 'draft',
      tags: ['social-reply'],
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
    if (onPostSaved) onPostSaved();
  };

  const validation = validateTweetText(editedText, persona.isPremium);

  // Проверка на фальшивые шаблонные ответы бота
  const isBotLike = /^(отличный пост|отличный тред|супер мысль|полностью согласен|великолепно|great post|great question)/i.test(
    editedText.trim()
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Исходный твит и настройки */}
      <div className="lg:col-span-5 space-y-5">
        <div className="glass-panel rounded-2xl p-5 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <MessageSquare className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                social-reply Студия
              </h3>
              <p className="text-[11px] text-zinc-400">
                1–3 предложения, привлекающие качественных читателей
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Автор исходного твита (Хэндл)
            </label>
            <input
              type="text"
              value={targetAuthor}
              onChange={(e) => setTargetAuthor(e.target.value)}
              placeholder="например: @sama или @paulg"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Текст твита, на который вы отвечаете
            </label>
            <textarea
              rows={4}
              value={targetText}
              onChange={(e) => setTargetText(e.target.value)}
              placeholder="Вставьте твит, под которым хотите ответить..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Стратегический угол ответа
            </label>
            <select
              value={replyIntent}
              onChange={(e) => setReplyIntent(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 transition"
            >
              {angles.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Ваш конкретный контр-факт или цифра
            </label>
            <input
              type="text"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="например: в 2026 бенчмарк изменился до 14%, а не 40%..."
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
            onClick={handleGenerate}
            disabled={loading || !targetText.trim()}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-zinc-950 font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Формируем экспертные ответы...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Сгенерировать 3 ответа
              </>
            )}
          </button>
        </div>

        {/* Правила AICB для ответов */}
        <div className="glass-panel rounded-2xl p-4 border border-zinc-800/80 text-xs text-zinc-400 space-y-2">
          <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-emerald-400" />
            Правила умных ответов в X:
          </div>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-400">
            <li>
              <strong>Строго 1–3 предложения:</strong> Первое отвечает прямо по сути, следующие дают подтверждающую деталь.
            </li>
            <li>
              <strong>Добавляет ОДНУ ценность:</strong> Точную цифру, исключение из правил или вопрос, двигающий беседу.
            </li>
            <li>
              <strong>Никакого подхалимажа:</strong> «Отличный тред!» считывается аудиторией как бот. Будьте равным экспертом.
            </li>
          </ul>
        </div>
      </div>

      {/* Варианты и редактор ответа */}
      <div className="lg:col-span-7 space-y-5">
        {replies.length > 0 ? (
          <div className="space-y-4">
            {/* Вкладки вариантов */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {replies.map((r, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border transition flex items-center gap-2 ${
                    selectedIdx === i
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-zinc-800 text-[10px] flex items-center justify-center font-mono">
                    {i + 1}
                  </span>
                  <span>{r.angle}</span>
                </button>
              ))}
            </div>

            {/* Почему привлекает подписчиков */}
            {replies[selectedIdx]?.whyItEarnsFollowers && (
              <div className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  <strong>Эффект на аудиторию:</strong> {replies[selectedIdx].whyItEarnsFollowers}
                </span>
              </div>
            )}

            {/* Превью диалога в ленте */}
            <div className="space-y-3">
              {/* Исходный твит (родитель) */}
              <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-4 text-xs opacity-75">
                <div className="flex items-center gap-2 font-bold text-zinc-400 mb-1.5">
                  <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px]">
                    OP
                  </span>
                  <span>{targetAuthor || '@автор'}</span>
                </div>
                <p className="text-zinc-300 whitespace-pre-wrap">{targetText}</p>
              </div>

              {/* Редактор вашего ответа */}
              <div className="glass-panel-glow rounded-2xl p-5 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Ваш экспертный ответ
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

                {isBotLike && (
                  <div className="text-xs p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      Обнаружено шаблонное начало! Уберите комплименты и переходите сразу к содержанию.
                    </span>
                  </div>
                )}

                {/* Действия */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-700/60 transition"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Скопировано!' : 'Скопировать ответ'}</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-700/60 transition"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{savedSuccess ? 'В черновиках!' : 'В черновики'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => openTwitterComposer(editedText)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Открыть в 𝕏</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-12 border border-zinc-800 text-center flex flex-col items-center justify-center min-h-[420px] text-zinc-400 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <MessageSquare className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="max-w-md">
              <h4 className="text-base font-bold text-white mb-1">
                Студия умных ответов
              </h4>
              <p className="text-xs text-zinc-400">
                Вставьте твит из вашей ленты или вирального обсуждения, чтобы сформулировать ответ с точной цифрой, контр-примером или развивающим вопросом.
              </p>
            </div>
            <button
              onClick={() => {
                setTargetAuthor('@techfounder');
                setTargetText(
                  'PostgreSQL не масштабируется дальше 100k записей в секунду. Каждый упирается в эту стену и вынужден переходить на NoSQL.'
                );
                setReplyIntent('Контр-пример (Реальный кейс, где правило сломалось)');
                setCustomInstructions(
                  'Мы выдерживаем 250k записей/сек на обычном Postgres с партиционированием и тюнингом wal_buffers.'
                );
              }}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-zinc-800 transition"
            >
              Пример: Развенчание мифа о масштабировании Postgres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
