import React, { useState } from 'react';
import {
  Archive,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Clock,
} from 'lucide-react';
import { DraftItem, PersonaNotes } from '../types';
import { deleteDraft, updateDraftStatus, openTwitterComposer } from '../utils/storage';

interface Props {
  drafts: DraftItem[];
  onDraftsChanged: () => void;
  persona: PersonaNotes;
}

export const DraftsManager: React.FC<Props> = ({ drafts, onDraftsChanged, persona }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = drafts.filter((d) => (filterType === 'all' ? true : d.type === filterType));

  const filterNames: Record<string, string> = {
    all: 'Все',
    post: 'Посты',
    thread: 'Треды',
    reply: 'Ответы',
    quote: 'Цитаты',
    article: 'Статьи',
  };

  const handleDelete = (id: string) => {
    deleteDraft(id);
    onDraftsChanged();
  };

  const handleStatus = (id: string, status: 'draft' | 'queued' | 'published') => {
    updateDraftStatus(id, status);
    onDraftsChanged();
  };

  const handleCopy = (draft: DraftItem) => {
    let textToCopy = '';
    if (draft.type === 'post') {
      textToCopy = draft.content.text || '';
    } else if (draft.type === 'thread') {
      textToCopy = draft.content.parts?.map((p: any) => p.text).join('\n\n---\n\n') || '';
    } else if (draft.type === 'reply') {
      textToCopy = draft.content.replyText || '';
    } else if (draft.type === 'quote') {
      textToCopy = draft.content.quoteText || '';
    } else if (draft.type === 'article') {
      textToCopy = draft.content.markdown || '';
    }

    navigator.clipboard.writeText(textToCopy);
    setCopiedId(draft.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLaunch = (draft: DraftItem) => {
    let textToLaunch = '';
    if (draft.type === 'post') textToLaunch = draft.content.text || '';
    if (draft.type === 'thread') textToLaunch = draft.content.parts?.[0]?.text || '';
    if (draft.type === 'reply') textToLaunch = draft.content.replyText || '';
    if (draft.type === 'quote')
      textToLaunch = `${draft.content.quoteText || ''} ${draft.content.targetUrl || ''}`;
    if (draft.type === 'article') textToLaunch = draft.content.announcePost || '';

    openTwitterComposer(textToLaunch);
  };

  // Расчет рекомендуемых слотов публикации с шагом ≥ 2 часа (Правило AICB)
  const calculateQueueSlots = () => {
    const slots = [];
    const now = new Date();
    for (let i = 0; i < 4; i++) {
      const slotTime = new Date(now.getTime() + (i + 1) * 2 * 60 * 60 * 1000);
      const hours = slotTime.getHours().toString().padStart(2, '0');
      const mins = slotTime.getMinutes().toString().padStart(2, '0');
      slots.push(`${hours}:${mins}`);
    }
    return slots;
  };

  const slots = calculateQueueSlots();

  return (
    <div className="space-y-6">
      {/* Шапка и фильтры */}
      <div className="glass-panel rounded-2xl p-5 border border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Archive className="w-5 h-5 text-sky-400" />
            Черновики и расписание публикаций
          </h2>
          <p className="text-xs text-zinc-400">
            Сохраненные твиты, треды и калькулятор 2-часовых интервалов по алгоритму X
          </p>
        </div>

        {/* Фильтры */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['all', 'post', 'thread', 'reply', 'quote', 'article'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wider transition border cursor-pointer ${
                filterType === t
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {filterNames[t] || t}
            </button>
          ))}
        </div>
      </div>

      {/* Таймлайн темпа (Pacing rule) */}
      <div className="glass-panel rounded-2xl p-4 border border-zinc-800/80 text-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-zinc-300">
          <Clock className="w-4 h-4 text-sky-400" />
          <span>
            <strong>Правило темпа AICB:</strong> Публикуйте с интервалом не менее 2 часов, чтобы твиты не пожирали охваты друг друга в алгоритме.
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-500">Рекомендуемые слоты сегодня:</span>
          {slots.map((s, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-sky-300 font-semibold"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Список черновиков */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((draft) => {
            return (
              <div
                key={draft.id}
                className="glass-panel rounded-2xl p-5 border border-zinc-800 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 text-sky-400 border border-zinc-800">
                      {filterNames[draft.type] || draft.type}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {new Date(draft.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-1">{draft.title}</h3>

                  <div className="text-xs text-zinc-300 mt-2 bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 line-clamp-3 font-sans leading-relaxed">
                    {draft.type === 'post' && draft.content.text}
                    {draft.type === 'thread' &&
                      `${draft.content.parts?.length} частей: ${draft.content.parts?.[0]?.text}`}
                    {draft.type === 'reply' && draft.content.replyText}
                    {draft.type === 'quote' && draft.content.quoteText}
                    {draft.type === 'article' && draft.content.announcePost}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80">
                  {/* Статус публикации */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() =>
                        handleStatus(
                          draft.id,
                          draft.status === 'published' ? 'draft' : 'published'
                        )
                      }
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition cursor-pointer font-medium ${
                        draft.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {draft.status === 'published' ? '✓ Опубликован' : 'Отметить как готовый'}
                    </button>
                  </div>

                  {/* Действия */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(draft)}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition border border-zinc-800 cursor-pointer"
                      title="Скопировать текст"
                    >
                      {copiedId === draft.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => handleLaunch(draft)}
                      className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition cursor-pointer"
                      title="Открыть в 𝕏"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleDelete(draft.id)}
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 transition border border-zinc-800 cursor-pointer"
                      title="Удалить"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-12 border border-zinc-800 text-center flex flex-col items-center justify-center min-h-[300px] text-zinc-500 space-y-3">
          <Archive className="w-8 h-8 text-zinc-600" />
          <p className="text-sm">В этом разделе пока нет сохраненных черновиков.</p>
        </div>
      )}
    </div>
  );
};
