import React, { useState } from 'react';
import {
  TrendingUp,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Activity,
  Zap,
} from 'lucide-react';
import { MarketDataResponse } from '../types';

interface Props {
  marketData: MarketDataResponse | null;
  onRefresh: () => void;
  onUseInPost: (topic: string) => void;
  onUseInThread: (topic: string) => void;
}

export const MarketDataStudio: React.FC<Props> = ({
  marketData,
  onRefresh,
  onUseInPost,
  onUseInThread,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 500);
  };

  return (
    <div className="space-y-6">
      {/* Шапка раздела */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel rounded-2xl p-5 border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              market-data Хаб рыночной альфы
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Polymarket & Binance
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Закон AICB: «То, что реально, остается реальным». Никогда не придумывайте цифры — берите точные данные прогнозов и суточных движений для виральных твитов.
            </p>
          </div>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 border border-zinc-700/80 transition cursor-pointer"
        >
          <RotateCcw className={`w-3.5 h-3.5 text-emerald-400 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Обновить данные</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Рынков прогнозов (Polymarket) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              <span>Главные рынки прогнозов Polymarket</span>
            </h3>
            <span className="text-[11px] text-zinc-500 font-mono">Настроения толпы</span>
          </div>

          <div className="space-y-3">
            {marketData?.predictions?.map((pred, idx) => {
              const yesProb = pred.outcomePrices?.Yes !== undefined ? pred.outcomePrices.Yes : 50;
              const noProb = 100 - yesProb;

              return (
                <div
                  key={idx}
                  className="glass-panel rounded-2xl p-4 border border-zinc-800/90 hover:border-zinc-700 transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {pred.category}
                        </span>
                        <span className="text-[11px] font-mono text-zinc-500">
                          Объем: ${(pred.volume24hr || 100000).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white leading-snug">
                        {pred.title}
                      </h4>
                    </div>

                    <a
                      href={`https://polymarket.com/event/${pred.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
                      title="Открыть на Polymarket"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Шкала вероятностей */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono font-bold">
                      <span className="text-emerald-400">Да {yesProb}%</span>
                      <span className="text-rose-400">Нет {noProb}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden flex">
                      <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{ width: `${yesProb}%` }}
                      />
                      <div
                        className="bg-rose-500 h-full transition-all"
                        style={{ width: `${noProb}%` }}
                      />
                    </div>
                  </div>

                  {/* Быстрые действия */}
                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/60">
                    <button
                      onClick={() =>
                        onUseInPost(
                          `Вероятность на Polymarket по событию "${pred.title}": сейчас составляет ${yesProb}% за "Да". В чем толпа ошибается:`
                        )
                      }
                      className="flex-1 py-1.5 px-3 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Создать твит</span>
                    </button>
                    <button
                      onClick={() =>
                        onUseInThread(
                          `Разбор объемов и ставок на Polymarket по теме "${pred.title}" (${yesProb}% вероятность при объеме $${(pred.volume24hr || 100000).toLocaleString()}) и что известно крупным китам:`
                        )
                      }
                      className="flex-1 py-1.5 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Создать тред</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Котировки крипты */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Спот и крипто-метрики</span>
            </h3>
            <span className="text-[11px] text-zinc-500 font-mono">Суточный объем и дельта</span>
          </div>

          <div className="space-y-3">
            {marketData?.crypto?.map((c) => {
              const isPositive = c.change24h >= 0;
              return (
                <div
                  key={c.symbol}
                  className="glass-panel rounded-2xl p-4 border border-zinc-800/90 hover:border-zinc-700 transition"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xs text-white font-mono">
                        {c.symbol}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white font-mono">
                          {c.symbol}/USDT
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          24ч объем: ${(c.volumeUSD / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-zinc-100">
                        ${c.price > 1 ? c.price.toLocaleString() : c.price.toFixed(4)}
                      </div>
                      <div
                        className={`text-xs font-bold font-mono flex items-center justify-end ${
                          isPositive ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {isPositive ? '+' : ''}
                        {c.change24h.toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/60">
                    <button
                      onClick={() =>
                        onUseInPost(
                          `${c.symbol} показал движение ${c.change24h > 0 ? '+' : ''}${c.change24h.toFixed(1)}% за 24 часа при цене $${c.price}. Три ончейн-метрики, которые объясняют этот импульс:`
                        )
                      }
                      className="w-full py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-medium transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3 h-3 text-emerald-400" />
                      <span>Пост про движение {c.symbol}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
