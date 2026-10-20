import React from 'react';
import {
  Feather,
  GitCommit,
  MessageSquare,
  Repeat,
  FileText,
  TrendingUp,
  Terminal,
  BookOpen,
  Archive,
  Sliders,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import { MarketDataResponse, PersonaNotes } from '../types';

export type ActiveTab =
  | 'post'
  | 'thread'
  | 'reply'
  | 'quote'
  | 'article'
  | 'humanizer'
  | 'market'
  | 'terminal'
  | 'skills'
  | 'drafts';

interface Props {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  marketData: MarketDataResponse | null;
  onOpenPersona: () => void;
  persona: PersonaNotes;
  draftsCount: number;
}

export const Header: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  marketData,
  onOpenPersona,
  persona,
  draftsCount,
}) => {
  const tabs = [
    { id: 'post' as ActiveTab, label: 'Пост / Лонгпост', icon: Feather, skill: 'social-post' },
    { id: 'thread' as ActiveTab, label: 'Конструктор тредов', icon: GitCommit, skill: 'social-thread' },
    { id: 'humanizer' as ActiveTab, label: 'Очеловечивание', icon: UserCheck, skill: 'human-writing' },
    { id: 'reply' as ActiveTab, label: 'Умный ответ', icon: MessageSquare, skill: 'social-reply' },
    { id: 'quote' as ActiveTab, label: 'Цитата (QRT)', icon: Repeat, skill: 'social-quote' },
    { id: 'article' as ActiveTab, label: 'Статья X Articles', icon: FileText, skill: 'x-article' },
    { id: 'market' as ActiveTab, label: 'Рыночная альфа', icon: TrendingUp, skill: 'market-data' },
    { id: 'terminal' as ActiveTab, label: 'Карточки кода', icon: Terminal, skill: 'code-animation' },
    { id: 'skills' as ActiveTab, label: 'Плейбуки AICB', icon: BookOpen },
    { id: 'drafts' as ActiveTab, label: 'Черновики', icon: Archive, badge: draftsCount },
  ];

  return (
    <header className="border-b border-zinc-800/80 bg-[#090b12]/95 backdrop-blur-md sticky top-0 z-40">
      {/* Верхняя лента котировок и рынков Polymarket */}
      {marketData && (
        <div className="bg-zinc-950/80 border-b border-zinc-800/50 px-4 py-1.5 text-[11px] overflow-x-auto no-scrollbar flex items-center justify-between gap-6">
          <div className="flex items-center gap-2 shrink-0 text-zinc-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-zinc-300">Данные реального времени:</span>
          </div>

          <div className="flex items-center gap-5 overflow-x-auto no-scrollbar whitespace-nowrap text-xs">
            {marketData.crypto?.slice(0, 4).map((coin) => (
              <div key={coin.symbol} className="flex items-center gap-1.5 font-mono">
                <span className="text-zinc-400 font-semibold">{coin.symbol}</span>
                <span className="text-zinc-200">
                  ${coin.price > 1 ? coin.price.toLocaleString() : coin.price.toFixed(3)}
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    coin.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {coin.change24h >= 0 ? '+' : ''}
                  {coin.change24h.toFixed(1)}%
                </span>
              </div>
            ))}

            {marketData.predictions?.slice(0, 2).map((pred, i) => (
              <div key={i} className="flex items-center gap-1.5 text-zinc-300 font-mono">
                <span className="text-amber-400 text-[10px] font-semibold bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                  Polymarket
                </span>
                <span className="truncate max-w-[170px] text-zinc-300 text-[11px]">
                  {pred.title}
                </span>
                {pred.outcomePrices?.Yes !== undefined && (
                  <span className="text-sky-400 font-bold text-[11px]">
                    {pred.outcomePrices.Yes}% Да
                  </span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('market')}
            className="text-sky-400 hover:text-sky-300 text-[11px] font-medium flex items-center gap-1 shrink-0 transition"
          >
            Все рынки <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Основная панель навигации */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Логотип и статус Premium */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-white shadow-inner font-black text-xl">
            𝕏
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                X Craft Studio
              </span>
              {persona.isPremium ? (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-sky-400 fill-sky-400/20" />
                  Premium+
                </span>
              ) : (
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
                  Базовый
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Студия контента для Twitter Premium на базе плейбуков AICB
            </p>
          </div>
        </div>

        {/* Профиль автора и быстрые действия */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPersona}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-200 border border-zinc-700/60 transition group"
            title="Настроить голос и правила NOTES.md"
          >
            <Sliders className="w-3.5 h-3.5 text-sky-400 group-hover:rotate-45 transition duration-200" />
            <span className="hidden md:inline">Голос автора</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-sky-300 font-mono">
              @{persona.username || 'creator'}
            </span>
          </button>

          <a
            href="https://twitter.com/compose/post"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Композер 𝕏</span>
          </a>
        </div>
      </div>

      {/* Вкладки инструментов */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition relative ${
                  isActive
                    ? 'text-sky-400 bg-sky-500/10 border border-sky-500/25 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-300 font-mono">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
