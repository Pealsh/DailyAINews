import { useEffect, useState } from 'react';
import DayCard from './DayCard.jsx';
import DetailSheet from './DetailSheet.jsx';

const BASE = import.meta.env.BASE_URL;

export default function App() {
  const [list, setList] = useState(null);
  const [file, setFile] = useState(() => (location.hash ? location.hash.slice(1) + '.md' : null));

  useEffect(() => {
    fetch(`${BASE}news/index.json`, { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : []))
      .then(setList)
      .catch(() => setList([]));
  }, []);

  useEffect(() => {
    const onPop = () => setFile(location.hash ? location.hash.slice(1) + '.md' : null);
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, []);

  const open = (f) => {
    history.pushState(null, '', `#${f.replace('.md', '')}`);
    setFile(f);
  };
  const close = () => {
    if (location.hash) history.back();
    else setFile(null);
  };

  return (
    <>
      <header className="top">
        <div className="top-inner">
          <h1>AI Daily</h1>
          <p className="sub">毎朝のAIニュース</p>
        </div>
      </header>
      <main>
        {list && list.length === 0 && <p className="empty">まだニュースがありません</p>}
        <ul className="list">
          {list?.map((n, i) => <DayCard key={n.file} news={n} index={i} onOpen={open} />)}
        </ul>
      </main>
      <DetailSheet file={file} onClose={close} />
    </>
  );
}
