import { useEffect, useRef, useState } from 'react';
import { marked } from 'marked';
import { parseNews, formatDate } from './parse.js';

const BASE = import.meta.env.BASE_URL;

export default function DetailSheet({ file, onClose }) {
  const [news, setNews] = useState(null);
  const panel = useRef(null);
  const body = useRef(null);
  const drag = useRef({ y0: null, dy: 0 });
  const isOpen = Boolean(file && news);

  useEffect(() => {
    if (!file) return;
    let alive = true;
    fetch(`${BASE}news/${file}`)
      .then((r) => (r.ok ? r.text() : Promise.reject()))
      .then((md) => {
        if (!alive) return;
        setNews({ ...parseNews(md), file });
        if (body.current) body.current.scrollTop = 0;
      })
      .catch(onClose);
    return () => { alive = false; };
  }, [file]);

  useEffect(() => {
    document.body.classList.toggle('lock', isOpen);
    const onKey = (e) => e.key === 'Escape' && isOpen && onClose();
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [isOpen]);

  // iOS: 下スワイプで閉じる（スマホ幅のみ）
  const onTouchStart = (e) => {
    if (matchMedia('(min-width: 768px)').matches) return;
    if (body.current.scrollTop > 0 && !e.target.closest('.panel-head, .grab')) return;
    drag.current = { y0: e.touches[0].clientY, dy: 0 };
    panel.current.style.transition = 'none';
  };
  const onTouchMove = (e) => {
    const d = drag.current;
    if (d.y0 === null) return;
    d.dy = Math.max(0, e.touches[0].clientY - d.y0);
    panel.current.style.transform = `translateY(${d.dy}px)`;
  };
  const onTouchEnd = () => {
    const d = drag.current;
    if (d.y0 === null) return;
    panel.current.style.transition = '';
    panel.current.style.transform = '';
    if (d.dy > 120) onClose();
    drag.current = { y0: null, dy: 0 };
  };

  return (
    <div className={`sheet${isOpen ? ' open' : ''}`} aria-hidden={!isOpen}>
      <div className="backdrop" onClick={onClose} />
      <article
        ref={panel} className="panel" role="dialog" aria-modal="true"
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      >
        <div className="grab" />
        <header className="panel-head">
          <button className="close" onClick={onClose} aria-label="閉じる">✕</button>
          <p className="day">{news?.day}</p>
          <h2>{news && formatDate(news.date || news.file.slice(0, 10))}</h2>
        </header>
        <div ref={body} className="panel-body">
          {news?.items.map((it, i) => (
            <section className="item" key={`${news.file}-${i}`} style={{ '--i': i }}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{it.title}</h3>
              <div
                className="md"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(it.body).replace(/<a /g, '<a target="_blank" rel="noopener" '),
                }}
              />
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
