import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Copy,
  Check,
  Code2,
} from 'lucide-react';

interface Props {
  initialCode?: string;
  onSendToPost?: (text: string) => void;
}

export const TerminalStudio: React.FC<Props> = ({ initialCode = '', onSendToPost }) => {
  const [code, setCode] = useState(
    initialCode ||
      `// Бенчмарк продакшен-миграции базы данных
async function executeBatch() {
  const start = performance.now();
  const res = await db.query('SELECT * FROM events WHERE unindexed = false');
  
  // Задержка упала с 420мс -> 18мс
  console.log(\`Батч обработан за \${(performance.now() - start).toFixed(1)}мс\`);
  return res.rows;
}`
  );
  const [title, setTitle] = useState('benchmark.ts');
  const [theme, setTheme] = useState<'obsidian' | 'cyberpunk' | 'blueprint' | 'amber'>('obsidian');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [canvasScale, setCanvasScale] = useState(2);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const themes = {
    obsidian: {
      name: 'Obsidian Ночь',
      gradientStart: '#111827',
      gradientEnd: '#030712',
      windowBg: '#090a0f',
      headerBg: '#131722',
      textColor: '#e2e8f0',
      commentColor: '#64748b',
      keywordColor: '#38bdf8',
      numberColor: '#34d399',
      borderColor: '#1e293b',
    },
    cyberpunk: {
      name: 'Cyberpunk Неон',
      gradientStart: '#2e0854',
      gradientEnd: '#090117',
      windowBg: '#0d0221',
      headerBg: '#19053b',
      textColor: '#f1f5f9',
      commentColor: '#9333ea',
      keywordColor: '#f43f5e',
      numberColor: '#06b6d4',
      borderColor: '#4c1d95',
    },
    blueprint: {
      name: 'Чертеж Blueprint',
      gradientStart: '#0f2942',
      gradientEnd: '#05111d',
      windowBg: '#0b1d30',
      headerBg: '#132d4a',
      textColor: '#e0f2fe',
      commentColor: '#7dd3fc',
      keywordColor: '#38bdf8',
      numberColor: '#fbbf24',
      borderColor: '#1e40af',
    },
    amber: {
      name: 'Ретро Amber CRT',
      gradientStart: '#2d1b00',
      gradientEnd: '#0d0700',
      windowBg: '#120b02',
      headerBg: '#211404',
      textColor: '#fbbf24',
      commentColor: '#92400e',
      keywordColor: '#f59e0b',
      numberColor: '#fef3c7',
      borderColor: '#78350f',
    },
  };

  const drawCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentTheme = themes[theme];
    const width = 840;
    const lines = code.split('\n');
    const lineHeight = 24;
    const padding = 40;
    const windowHeaderHeight = 44;
    const codeAreaHeight = Math.max(160, lines.length * lineHeight + 40);
    const windowWidth = 720;
    const windowHeight = windowHeaderHeight + codeAreaHeight;
    const totalHeight = windowHeight + padding * 2;

    canvas.width = width * canvasScale;
    canvas.height = totalHeight * canvasScale;
    ctx.scale(canvasScale, canvasScale);

    // Фоновый градиент
    const bgGrad = ctx.createLinearGradient(0, 0, width, totalHeight);
    bgGrad.addColorStop(0, currentTheme.gradientStart);
    bgGrad.addColorStop(1, currentTheme.gradientEnd);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, totalHeight);

    // Фоновая сетка
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, totalHeight);
      ctx.stroke();
    }

    // Тело окна
    const winX = (width - windowWidth) / 2;
    const winY = padding;
    const radius = 14;

    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 35;
    ctx.shadowOffsetY = 15;

    ctx.beginPath();
    ctx.roundRect(winX, winY, windowWidth, windowHeight, radius);
    ctx.fillStyle = currentTheme.windowBg;
    ctx.fill();

    ctx.strokeStyle = currentTheme.borderColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.shadowColor = 'transparent';

    // Заголовок окна macOS
    ctx.beginPath();
    ctx.roundRect(winX, winY, windowWidth, windowHeaderHeight, [radius, radius, 0, 0]);
    ctx.fillStyle = currentTheme.headerBg;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(winX, winY + windowHeaderHeight);
    ctx.lineTo(winX + windowWidth, winY + windowHeaderHeight);
    ctx.strokeStyle = currentTheme.borderColor;
    ctx.stroke();

    // Кнопки окна
    const dotY = winY + windowHeaderHeight / 2;
    const dots = [
      { x: winX + 22, color: '#ff5f56' },
      { x: winX + 38, color: '#ffbd2e' },
      { x: winX + 54, color: '#27c93f' },
    ];
    dots.forEach((d) => {
      ctx.beginPath();
      ctx.arc(d.x, dotY, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = d.color;
      ctx.fill();
    });

    // Название файла
    ctx.font = '500 12px "Inter", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'center';
    ctx.fillText(title, winX + windowWidth / 2, dotY + 4);

    // Текст кода
    ctx.textAlign = 'left';
    ctx.font = '500 13px "JetBrains Mono", monospace';
    const textStartX = winX + (showLineNumbers ? 55 : 28);
    const startY = winY + windowHeaderHeight + 28;

    lines.forEach((line, idx) => {
      const y = startY + idx * lineHeight;

      if (showLineNumbers) {
        ctx.fillStyle = '#475569';
        ctx.textAlign = 'right';
        ctx.fillText(String(idx + 1), textStartX - 18, y);
        ctx.textAlign = 'left';
      }

      if (line.trim().startsWith('//') || line.trim().startsWith('#')) {
        ctx.fillStyle = currentTheme.commentColor;
      } else if (/\b(function|async|await|const|let|var|return|if|else|import|from|export|функция)\b/.test(line)) {
        ctx.fillStyle = currentTheme.keywordColor;
      } else {
        ctx.fillStyle = currentTheme.textColor;
      }

      ctx.fillText(line, textStartX, y);
    });

    // Водяной знак
    ctx.font = '600 11px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.textAlign = 'right';
    ctx.fillText('𝕏 Craft', winX + windowWidth - 20, winY + windowHeight - 16);
  };

  useEffect(() => {
    drawCard();
  }, [code, title, theme, showLineNumbers, canvasScale]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${title.replace(/\.[^/.]+$/, '')}-snapshot.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } catch (e) {
      console.error(e);
      handleDownload();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Настройки карточки */}
      <div className="lg:col-span-5 space-y-5">
        <div className="glass-panel rounded-2xl p-5 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Code2 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Генератор карточек кода для 𝕏
              </h3>
              <p className="text-[11px] text-zinc-400">
                Эстетичные скриншоты терминала и кода, увеличивающие CTR твита
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Заголовок окна / Имя файла
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500 transition font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Цветовая тема
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(themes) as (keyof typeof themes)[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition ${
                    theme === t
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {themes[t].name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="text-xs text-zinc-300 font-semibold cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showLineNumbers}
                onChange={(e) => setShowLineNumbers(e.target.checked)}
                className="rounded bg-zinc-900 border-zinc-700 text-cyan-500 w-4 h-4"
              />
              Показывать номера строк
            </label>

            <span className="text-[11px] text-zinc-500 font-mono">Retina 2x качество</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Фрагмент кода или вывод консоли
            </label>
            <textarea
              rows={9}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-cyan-500 transition font-mono leading-relaxed"
            />
          </div>

          {/* Кнопки */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleCopyImage}
              className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Картинка в буфере!' : 'Скопировать картинку'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>PNG</span>
            </button>
          </div>
        </div>
      </div>

      {/* Превью Canvas */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Превью высокого разрешения
          </span>
          <span className="text-[11px] text-zinc-500">Прикрепите к твиту для роста просмотров</span>
        </div>

        <div className="glass-panel rounded-2xl p-4 border border-zinc-800 flex items-center justify-center overflow-hidden bg-black/60 min-h-[460px]">
          <canvas
            ref={canvasRef}
            className="max-w-full rounded-xl shadow-2xl border border-zinc-800/80"
            style={{ maxHeight: '520px', objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  );
};
