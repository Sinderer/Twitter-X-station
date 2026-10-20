import React, { useState } from 'react';
import { PersonaNotes } from '../types';
import { saveStoredPersona } from '../utils/storage';
import { X, Check, BookOpen, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  persona: PersonaNotes;
  onSave: (updated: PersonaNotes) => void;
}

export const PersonaNotesModal: React.FC<Props> = ({ isOpen, onClose, persona, onSave }) => {
  const [formData, setFormData] = useState<PersonaNotes>(persona);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredPersona(formData);
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[#0e121e] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Заголовок */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                NOTES.md — Профиль и голос автора
              </h2>
              <p className="text-xs text-zinc-400">
                Закон AICB: алгоритм читает ваш файл заметок перед созданием любого поста.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Имя и Хэндл в X */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
                Отображаемое имя в 𝕏
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="Tech Creator"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
                Хэндл (@username)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-zinc-500 text-sm">@</span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.replace('@', '') })}
                  placeholder="builder"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition font-mono"
                />
              </div>
            </div>
          </div>

          {/* Подписка Twitter Premium */}
          <div className="bg-zinc-950/80 border border-zinc-800 p-4 rounded-xl space-y-2">
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-400 fill-sky-400/20" />
                Тариф подписки X (Twitter)
              </span>
              <span className="text-[11px] text-sky-400 font-mono">Premium включен</span>
            </label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isPremium: true, isPremiumPlus: true })}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-left flex items-center justify-between ${
                  formData.isPremium
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}
              >
                <span>X Premium / Premium+</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isPremium: false, isPremiumPlus: false })}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition text-left flex items-center justify-between ${
                  !formData.isPremium
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                }`}
              >
                <span>Базовый (до 280 знаков)</span>
                {!formData.isPremium && <Check className="w-3.5 h-3.5 text-sky-400" />}
              </button>
            </div>
            <p className="text-[11px] text-zinc-500">
              В режиме Premium поддерживаются лонгпосты до 25 000 знаков, статьи X Articles и синяя галочка верификации в превью.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
                Миссия аккаунта / Био
              </label>
              <input
                type="text"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Инженер и фаундер. Пишу про боевой прод..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
                Целевая аудитория
              </label>
              <input
                type="text"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                placeholder="Разработчики, фаундеры, тех-лиды..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Стиль и правила тональности
            </label>
            <textarea
              rows={2}
              value={formData.voiceRules}
              onChange={(e) => setFormData({ ...formData, voiceRules: e.target.value })}
              placeholder="Прямой, основанный на цифрах, без воды, хук в первой строке..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                Что НИКОГДА не должно появляться (Запрещенные слова)
              </label>
              <span className="text-[11px] text-zinc-500">Через запятую</span>
            </div>
            <textarea
              rows={2}
              value={formData.bannedWords}
              onChange={(e) => setFormData({ ...formData, bannedWords: e.target.value })}
              placeholder="Осознайте это, Согласны?, 🧵, #followme, синергия, успешный успех..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Примеры ваших лучших твитов (Образцы ритма)
            </label>
            <p className="text-[11px] text-zinc-400 mb-1.5">
              Правило AICB: «Примеры работают лучше любых прилагательных». Добавьте 2-3 ваших твита, которые собрали хороший отклик.
            </p>
            <textarea
              rows={4}
              value={formData.examples}
              onChange={(e) => setFormData({ ...formData, examples: e.target.value })}
              placeholder="Вставьте 2-3 примера ваших удачных постов..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-sky-500 transition font-mono text-xs"
            />
          </div>

          {/* Кнопки сохранения */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold text-sm transition shadow-lg shadow-sky-500/20"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Сохранено!
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Сохранить профиль
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
