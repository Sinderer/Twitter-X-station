import { PersonaNotes, DraftItem } from '../types';

const PERSONA_STORAGE_KEY = 'xcraft_persona_notes_v2';
const DRAFTS_STORAGE_KEY = 'xcraft_drafts_v2';

export const DEFAULT_PERSONA: PersonaNotes = {
  username: 'builder',
  displayName: 'Tech Creator',
  bio: 'Инженер и фаундер. Пишу про боевой прод, архитектуру, AI и реальные цифры без корпоративной воды.',
  audience: 'Разработчики, фаундеры, крипто/AI операторы и думающая тех-аудитория.',
  language: 'Русский',
  voiceRules: 'Прямой, острый, с юмором, основанный на цифрах и личном опыте. Первая строка всегда цепляет.',
  bannedWords: 'Осознайте это, Согласны?, 🧵, #followme, синергия, парадигма, успешный успех, тред ниже',
  examples: `1. 48 часов. Рендер шел в 3 раза дольше расчетного. Фикс занял одну строчку в Dockerfile.
2. Хватит спорить о скорости JS фреймворков. Вашим юзерам все равно, пока запрос к базе длится 900мс.
3. Наш счет за сервера упал с $840 до $110 в месяц. Всего 3 фикса; первый — удаление неиндексированного JOIN.`,
  isPremium: true,
  isPremiumPlus: true,
  enableCryptoMode: false,
  postingHours: '10:00 - 22:00',
};

export function getStoredPersona(): PersonaNotes {
  try {
    const raw = localStorage.getItem(PERSONA_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_PERSONA, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to parse persona notes from storage', e);
  }
  return DEFAULT_PERSONA;
}

export function saveStoredPersona(persona: PersonaNotes): void {
  try {
    localStorage.setItem(PERSONA_STORAGE_KEY, JSON.stringify(persona));
  } catch (e) {
    console.error('Failed to save persona notes to storage', e);
  }
}

export function getStoredDrafts(): DraftItem[] {
  try {
    const raw = localStorage.getItem(DRAFTS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse drafts from storage', e);
  }
  return [];
}

export function saveDraft(draft: Omit<DraftItem, 'id' | 'createdAt'>): DraftItem {
  const drafts = getStoredDrafts();
  const newItem: DraftItem = {
    ...draft,
    id: `draft_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  drafts.unshift(newItem);
  try {
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
  } catch (e) {
    console.error('Failed to save drafts to storage', e);
  }
  return newItem;
}

export function deleteDraft(id: string): void {
  const drafts = getStoredDrafts().filter((d) => d.id !== id);
  try {
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
  } catch (e) {
    console.error('Failed to delete draft from storage', e);
  }
}

export function updateDraftStatus(id: string, status: 'draft' | 'queued' | 'published'): void {
  const drafts = getStoredDrafts().map((d) => (d.id === id ? { ...d, status } : d));
  try {
    localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
  } catch (e) {
    console.error('Failed to update draft in storage', e);
  }
}

// Ссылка на композер X
export function getTwitterIntentUrl(text: string): string {
  const encoded = encodeURIComponent(text);
  return `https://twitter.com/intent/tweet?text=${encoded}`;
}

export function openTwitterComposer(text: string): void {
  const url = getTwitterIntentUrl(text);
  try {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (e) {
    console.error('Failed to open intent URL', e);
  }
}

