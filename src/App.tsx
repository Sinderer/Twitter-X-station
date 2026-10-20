import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { PostStudio } from './components/PostStudio';
import { ThreadStudio } from './components/ThreadStudio';
import { ReplyStudio } from './components/ReplyStudio';
import { QuoteStudio } from './components/QuoteStudio';
import { ArticleStudio } from './components/ArticleStudio';
import { MarketDataStudio } from './components/MarketDataStudio';
import { TerminalStudio } from './components/TerminalStudio';
import { HumanizerStudio } from './components/HumanizerStudio';
import { SkillsLibrary } from './components/SkillsLibrary';
import { DraftsManager } from './components/DraftsManager';
import { PersonaNotesModal } from './components/PersonaNotesModal';
import { PersonaNotes, MarketDataResponse, DraftItem } from './types';
import { getStoredPersona, getStoredDrafts } from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('post');
  const [persona, setPersona] = useState<PersonaNotes>(getStoredPersona());
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [marketData, setMarketData] = useState<MarketDataResponse | null>(null);
  const [drafts, setDrafts] = useState<DraftItem[]>(getStoredDrafts());
  const [terminalInitialCode, setTerminalInitialCode] = useState<string>('');

  const refreshDrafts = () => {
    setDrafts(getStoredDrafts());
  };

  const fetchMarketData = async () => {
    try {
      const res = await fetch('/api/market-data');
      if (res.ok) {
        const data = await res.json();
        setMarketData(data);
      }
    } catch (e) {
      console.warn('Failed to load market data', e);
    }
  };

  useEffect(() => {
    fetchMarketData();
    // Poll market data every 90 seconds
    const interval = setInterval(fetchMarketData, 90000);
    return () => clearInterval(interval);
  }, []);

  const handleSendToTerminal = (text: string) => {
    setTerminalInitialCode(text);
    setActiveTab('terminal');
  };

  const handleUseMarketInPost = (topic: string) => {
    setActiveTab('post');
  };

  const handleUseMarketInThread = (topic: string) => {
    setActiveTab('thread');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-white">
      {/* App Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        marketData={marketData}
        onOpenPersona={() => setIsPersonaOpen(true)}
        persona={persona}
        draftsCount={drafts.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'post' && (
          <PostStudio
            persona={persona}
            marketData={marketData}
            onSelectForTerminal={handleSendToTerminal}
            onPostSaved={refreshDrafts}
          />
        )}

        {activeTab === 'thread' && (
          <ThreadStudio
            persona={persona}
            marketData={marketData}
            onPostSaved={refreshDrafts}
          />
        )}

        {activeTab === 'humanizer' && (
          <HumanizerStudio
            persona={persona}
            onPostSaved={refreshDrafts}
            onSendToPost={(text) => {
              setActiveTab('post');
            }}
          />
        )}

        {activeTab === 'reply' && (
          <ReplyStudio persona={persona} onPostSaved={refreshDrafts} />
        )}

        {activeTab === 'quote' && (
          <QuoteStudio persona={persona} onPostSaved={refreshDrafts} />
        )}

        {activeTab === 'article' && (
          <ArticleStudio persona={persona} onPostSaved={refreshDrafts} />
        )}

        {activeTab === 'market' && (
          <MarketDataStudio
            marketData={marketData}
            onRefresh={fetchMarketData}
            onUseInPost={handleUseMarketInPost}
            onUseInThread={handleUseMarketInThread}
          />
        )}

        {activeTab === 'terminal' && (
          <TerminalStudio initialCode={terminalInitialCode} />
        )}

        {activeTab === 'skills' && (
          <SkillsLibrary
            onSelectSkill={(skillId) => {
              if (skillId === 'social-post' || skillId === 'post') setActiveTab('post');
              else if (skillId === 'social-thread' || skillId === 'thread') setActiveTab('thread');
              else if (skillId === 'human-writing' || skillId === 'humanizer') setActiveTab('humanizer');
              else if (skillId === 'social-reply' || skillId === 'reply') setActiveTab('reply');
              else if (skillId === 'social-quote' || skillId === 'quote') setActiveTab('quote');
              else if (skillId === 'x-article' || skillId === 'article') setActiveTab('article');
              else if (skillId === 'market-data' || skillId === 'market') setActiveTab('market');
              else if (skillId === 'code-animation' || skillId === 'terminal') setActiveTab('terminal');
            }}
          />
        )}

        {activeTab === 'drafts' && (
          <DraftsManager
            drafts={drafts}
            onDraftsChanged={refreshDrafts}
            persona={persona}
          />
        )}
      </main>

      {/* Voice & Persona Modal */}
      <PersonaNotesModal
        isOpen={isPersonaOpen}
        onClose={() => setIsPersonaOpen(false)}
        persona={persona}
        onSave={(updated) => setPersona(updated)}
      />

      {/* Подвал */}
      <footer className="border-t border-zinc-900 py-4 px-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>X Craft Studio · Создано на основе плейбуков AICB Content Skills</span>
          <span>Twitter Premium · Конкретные цифры · Высокое удержание аудитории</span>
        </div>
      </footer>
    </div>
  );
}
