import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Lightbulb,
  ExternalLink,
  BookmarkPlus,
  Share2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { PersonaNotes, XArticleResult } from '../types';
import { saveDraft, openTwitterComposer } from '../utils/storage';

interface Props {
  persona: PersonaNotes;
  onPostSaved?: () => void;
}

export const ArticleStudio: React.FC<Props> = ({ persona, onPostSaved }) => {
  const [topic, setTopic] = useState('');
  const [headlineEngine, setHeadlineEngine] = useState('Движок Контраст / Деньги');
  const [customInstructions, setCustomInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState<XArticleResult | null>(null);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedAnnounce, setCopiedAnnounce] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skill: 'x-article',
          topic,
          persona,
          customInstructions: `${headlineEngine}. ${customInstructions}`,
        }),
      });

      const data = await res.json();
      if (data.title && data.markdown) {
        setArticle(data);
      } else {
        setErrorMessage('Не удалось сгенерировать статью. Пожалуйста, уточните тему.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage('Ошибка: ' + (err.message || 'Сбой сети'));
    } finally {
      setLoading(false);
    }
  };

  const copyMarkdown = () => {
    if (!article) return;
    navigator.clipboard.writeText(article.markdown);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const copyAnnounce = () => {
    if (!article?.announcePost) return;
    navigator.clipboard.writeText(article.announcePost);
    setCopiedAnnounce(true);
    setTimeout(() => setCopiedAnnounce(false), 2000);
  };

  const handleSaveDraft = () => {
    if (!article) return;
    saveDraft({
      type: 'article',
      title: article.title,
      content: article,
      status: 'draft',
      tags: ['x-article', 'longform'],
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
    if (onPostSaved) onPostSaved();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Левая колонка: Настройки статьи */}
      <div className="lg:col-span-4 space-y-5">
        <div className="glass-panel rounded-2xl p-5 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
                <FileText className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  x-article Студия
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Нативные лонгриды для Premium+ редактора (x.com/i/article)
                </p>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-pink-400" />
              Premium+
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Тема статьи и личный опыт
            </label>
            <textarea
              rows={4}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="например: как мы переписали конвейер видео с нуля, сократили задержку на 70% и срезали расходы с $3,400 до $450 в месяц..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Формула заголовка (Плейбук AICB)
            </label>
            <select
              value={headlineEngine}
              onChange={(e) => setHeadlineEngine(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-pink-500 transition"
            >
              <option value="Движок Контраст / Деньги">
                Контраст / Деньги (Объект + контраст $ или времени + итог)
              </option>
              <option value="Провокационный вопрос">
                Провокационный вопрос (Дилемма, которую все игнорируют)
              </option>
              <option value="Архитектурный постмортем">
                Архитектурный постмортем (Что сломалось и точный рецепт починки)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Оговорки / Грабли для включения
            </label>
            <input
              type="text"
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="например: указать, что это решение не подойдет для мультирегиона..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-pink-500 transition"
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
            className="w-full py-3 rounded-xl bg-pink-500 hover:bg-pink-400 disabled:opacity-50 text-zinc-950 font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
          >
            {loading ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin" />
                Пишем статью по стандартам AICB...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Сгенерировать статью и анонс-твит
              </>
            )}
          </button>
        </div>

        {/* Правила X Articles */}
        <div className="glass-panel rounded-2xl p-4 border border-zinc-800/80 text-xs text-zinc-400 space-y-2">
          <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-pink-400" />
            Анатомия статьи x-article:
          </div>
          <ul className="list-disc pl-4 space-y-1 text-[11px] text-zinc-400">
            <li>
              <strong>Голос инженера:</strong> Рассказывайте, что реально сделано с цифрами, без маркетинговой воды.
            </li>
            <li>
              <strong>Холодный хук:</strong> Раскрывайте главный инсайт уже в первом абзаце.
            </li>
            <li>
              <strong>H2 Заголовки-вопросы:</strong> Оформляйте разделы как вопросы, которые читатель держит в голове.
            </li>
            <li>
              <strong>Честная оговорка (Caveat):</strong> Честно укажите, кому этот подход не подойдет.
            </li>
          </ul>
        </div>
      </div>

      {/* Правая колонка: Результат статьи и анонс-твит */}
      <div className="lg:col-span-8 space-y-5">
        {article ? (
          <div className="space-y-5">
            {/* Карточка твита-анонса */}
            <div className="glass-panel-glow rounded-2xl p-5 border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Share2 className="w-4 h-4" />
                  Твит-анонс для ленты (Хук + ссылка)
                </span>
                <button
                  onClick={copyAnnounce}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 border border-zinc-700 transition"
                >
                  {copiedAnnounce ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAnnounce ? 'Скопировано' : 'Скопировать твит'}</span>
                </button>
              </div>

              <p className="text-sm text-zinc-200 bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/80 whitespace-pre-wrap font-sans leading-relaxed">
                {article.announcePost}
              </p>

              <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
                <span>
                  Длина: <strong>{article.announcePost.length}</strong> / 280 знаков
                </span>
                <button
                  onClick={() => openTwitterComposer(article.announcePost)}
                  className="text-sky-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  Открыть в композере 𝕏 <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Текст статьи в Markdown */}
            <div className="glass-panel rounded-2xl p-6 border border-zinc-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white">{article.title}</h2>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                    <span>Время чтения: {article.estimatedReadingTime}</span>
                    {article.coverIdea && <span>· Обложка: {article.coverIdea}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyMarkdown}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition"
                  >
                    {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMarkdown ? 'Markdown скопирован!' : 'Скопировать Markdown для X'}</span>
                  </button>

                  <button
                    onClick={handleSaveDraft}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5 text-pink-400" />
                    <span>{savedSuccess ? 'В черновиках!' : 'В черновики'}</span>
                  </button>
                </div>
              </div>

              {/* Область чтения Markdown */}
              <div className="prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-sans bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/60 max-h-[500px] overflow-y-auto">
                {article.markdown}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel rounded-2xl p-12 border border-zinc-800 text-center flex flex-col items-center justify-center min-h-[420px] text-zinc-400 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
              <FileText className="w-7 h-7 text-pink-400" />
            </div>
            <div className="max-w-md">
              <h4 className="text-base font-bold text-white mb-1">
                Студия нативных лонгридов X Articles
              </h4>
              <p className="text-xs text-zinc-400">
                Создавайте подробные инженерные разборы и операционные руководства для публикации в редакторе x.com/i/article вместе с готовым постом-анонсом.
              </p>
            </div>
            <button
              onClick={() => {
                setTopic(
                  'Как мы перевели векторный поиск с Pinecone на pgvector в self-hosted Postgres, сократили задержку с 180мс до 24мс и сэкономили $2,400 в месяц.'
                );
                setHeadlineEngine('Движок Контраст / Деньги');
              }}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-pink-400 border border-zinc-800 transition"
            >
              Пример: Миграция с Pinecone на pgvector
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
