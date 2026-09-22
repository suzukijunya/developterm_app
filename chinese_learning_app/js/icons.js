// 画面で使うアイコン(インラインSVG)。絵文字より端末差が少なくくっきり表示できる
const Icons = {
  speaker:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 9.2v5.6h3.8l4.9 4.1V5.1L7.3 9.2z" fill="currentColor"/><path d="M15.6 8.6a4.6 4.6 0 0 1 0 6.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M18.3 6a8.3 8.3 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  // ゆっくり再生(カメ)
  slow:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.8 15.2a7.2 6.6 0 0 1 14.4 0z" fill="currentColor"/><path d="M6.4 9.9l3.6 2.6 3.6-2.6M10 12.5v2.7" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M16.6 13.6c.9-.2 1.3-1.7 2.9-1.7a1.9 1.9 0 0 1 0 3.8h-2.6" fill="currentColor"/><path d="M5.6 15.2v3M13.6 15.2v3M2.8 15.2 1.4 16.3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  mic:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8.6" y="2.8" width="6.8" height="11.6" rx="3.4" fill="currentColor"/><path d="M5.4 11.2a6.6 6.6 0 0 0 13.2 0M12 17.9v3.3M8.6 21.2h6.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  pause:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4.5" width="3.6" height="15" rx="1.4" fill="currentColor"/><rect x="14.4" y="4.5" width="3.6" height="15" rx="1.4" fill="currentColor"/></svg>',
  play:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.2v13.6a1 1 0 0 0 1.5.9l10.6-6.8a1 1 0 0 0 0-1.8L9.5 4.3A1 1 0 0 0 8 5.2z" fill="currentColor"/></svg>',
  retry:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M19.8 3.8v4.6h-4.6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  next:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 5.5 16 12l-6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  prev:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  translate:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5.5h9M8 3.5v2M5.5 5.5c.6 3.3 2.6 5.7 5.5 7M10.5 5.5c-.8 3.6-3 6.3-6.5 7.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12.5 20.5l4-9.5 4 9.5M14 17.3h5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};
