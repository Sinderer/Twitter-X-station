export interface PersonaNotes {
  username: string; // @handle
  displayName: string;
  bio: string;
  audience: string;
  language: string;
  voiceRules: string;
  bannedWords: string;
  examples: string;
  isPremium: boolean;
  isPremiumPlus: boolean;
  enableCryptoMode: boolean;
  postingHours: string;
}

export interface PostVariant {
  type: string;
  hookFormula: string;
  text: string;
  charCount: number;
  breakdown: string;
}

export interface ThreadPart {
  partNumber: number;
  role: string;
  text: string;
  charCount: number;
  mediaSuggestion?: string;
}

export interface ThreadResult {
  threadTitle: string;
  totalParts: number;
  parts: ThreadPart[];
  bookmarkIncentive?: string;
}

export interface ReplyResult {
  angle: string;
  text: string;
  charCount: number;
  whyItEarnsFollowers: string;
}

export interface QuoteResult {
  move: string;
  text: string;
  charCount: number;
  strategicPurpose: string;
}

export interface XArticleResult {
  title: string;
  announcePost: string;
  coverIdea: string;
  estimatedReadingTime: string;
  markdown: string;
}

export interface HumanRewriteResult {
  originalText: string;
  rewrittenText: string;
  mode: 'human' | 'crypto';
  removedPatterns: string[];
  humanScoreBefore: number;
  humanScoreAfter: number;
  breakdown?: string;
}

export interface CryptoTicker {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volumeUSD: number;
}

export interface PredictionMarket {
  title: string;
  slug: string;
  volume24hr: number;
  volumeTotal: number;
  outcomePrices: Record<string, number>;
  category: string;
}

export interface MarketDataResponse {
  timestamp: string;
  crypto: CryptoTicker[];
  predictions: PredictionMarket[];
}

export interface DraftItem {
  id: string;
  type: 'post' | 'thread' | 'reply' | 'quote' | 'article' | 'humanized';
  title: string;
  content: any;
  createdAt: string;
  status: 'draft' | 'queued' | 'published';
  tags: string[];
}
