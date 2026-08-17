'use client';

import React from 'react';
import { Sparkles, Lightbulb, TreePine, Info, CheckCircle2 } from 'lucide-react';

interface ChatMessageContentProps {
  content: string;
  isBot: boolean;
}

export function ChatMessageContent({ content, isBot }: ChatMessageContentProps) {
  if (!isBot) {
    return <div className="leading-relaxed text-[12px] font-medium">{content}</div>;
  }

  // Split into logical blocks (paragraphs, lists, callout boxes)
  const lines = content.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let blockKey = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      const items = [...currentList];
      currentList = [];
      renderedElements.push(
        <div key={`list-${blockKey++}`} className="space-y-1.5 my-2">
          {items.map((item, idx) => {
            // Check if item contains key-value pair like: **Sepeda Motor:** ~0.195 kg CO2e / km
            const colonMatch = item.match(/^\s*-\s*\*\*(.*?)\*\*:?\s*(.*)$/);
            if (colonMatch) {
              const label = colonMatch[1];
              const rest = colonMatch[2];

              // Color coding based on carbon level or highlights
              const isZero = rest.toLowerCase().includes('0 kg') || rest.toLowerCase().includes('zero');
              const isHigh = label.toLowerCase().includes('sapi') || label.toLowerCase().includes('mobil') || label.toLowerCase().includes('ac');
              const isLow = rest.toLowerCase().includes('hemat') || rest.toLowerCase().includes('efisien') || label.toLowerCase().includes('bus') || label.toLowerCase().includes('krl') || label.toLowerCase().includes('sayur');

              return (
                <div
                  key={idx}
                  className={`p-2 rounded-xl text-[11.5px] border flex flex-col sm:flex-row sm:items-center justify-between gap-1 transition-colors ${
                    isZero
                      ? 'bg-emerald-50/90 border-emerald-300/80 text-emerald-950 font-semibold shadow-xs'
                      : isLow
                      ? 'bg-teal-50/70 border-teal-200/80 text-slate-800'
                      : isHigh
                      ? 'bg-amber-50/60 border-amber-200/80 text-slate-800'
                      : 'bg-slate-50/80 border-slate-200/70 text-slate-800'
                  }`}
                >
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    {label}
                  </span>
                  <span className="text-slate-600 text-[11px]">
                    {renderInlineFormatted(rest)}
                  </span>
                </div>
              );
            }

            // Normal list item
            const cleanText = item.replace(/^\s*-\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2 text-[11.5px] text-slate-700 pl-1">
                <span className="text-emerald-600 font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{renderInlineFormatted(cleanText)}</span>
              </div>
            );
          })}
        </div>
      );
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    // Bullet point line
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      currentList.push(trimmed);
      continue;
    }

    // Otherwise flush pending list
    flushList();

    // Callout box (Tips, Saran, Catatan, Formula)
    if (trimmed.startsWith('💡') || trimmed.startsWith('🌱') || trimmed.startsWith('🎯') || trimmed.startsWith('🐄') || trimmed.startsWith('🍽️') && trimmed.includes('Tips')) {
      renderedElements.push(
        <div
          key={`callout-${blockKey++}`}
          className="my-2.5 p-3 bg-gradient-to-r from-emerald-50 to-teal-50/70 border border-emerald-200/80 rounded-2xl text-[11.5px] text-emerald-950 space-y-1 shadow-xs"
        >
          <div className="font-bold flex items-center gap-1.5 text-emerald-900 text-xs">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span>{renderInlineFormatted(trimmed.split(':')[0] || 'Tips Si Eco')}</span>
          </div>
          <div className="text-emerald-900/90 leading-relaxed pl-5">
            {renderInlineFormatted(trimmed.includes(':') ? trimmed.substring(trimmed.indexOf(':') + 1).trim() : trimmed)}
          </div>
        </div>
      );
      continue;
    }

    // Title / Heading line (contains bold or emoji header)
    if (trimmed.startsWith('🚗') || trimmed.startsWith('🍽️') || trimmed.startsWith('🔌') || trimmed.startsWith('♻️') || trimmed.startsWith('📊') || trimmed.startsWith('🏆') || trimmed.startsWith('🌿') || trimmed.startsWith('###')) {
      const cleanTitle = trimmed.replace(/^###\s*/, '');
      renderedElements.push(
        <div
          key={`header-${blockKey++}`}
          className="mt-2 mb-1 text-[12.5px] font-extrabold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-1.5"
        >
          {renderInlineFormatted(cleanTitle)}
        </div>
      );
      continue;
    }

    // Standard paragraph
    renderedElements.push(
      <p key={`p-${blockKey++}`} className="my-1.5 leading-relaxed text-[12px] text-slate-700">
        {renderInlineFormatted(trimmed)}
      </p>
    );
  }

  flushList();

  return <div className="space-y-1">{renderedElements}</div>;
}

/**
 * Format inline markdown like **bold**, *italic*, and tags
 */
function renderInlineFormatted(text: string): React.ReactNode {
  // Regex to match **bold** and *italic*
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const inner = part.slice(2, -2);
      return (
        <strong key={index} className="font-bold text-slate-900">
          {inner}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      const inner = part.slice(1, -1);
      return (
        <span key={index} className="italic text-emerald-800 font-medium">
          {inner}
        </span>
      );
    }
    return part;
  });
}
