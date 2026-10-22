import { formatDate } from './parse.js';

export default function DayCard({ news, index, onOpen }) {
  return (
    <li className="card" style={{ '--i': index }}>
      <button onClick={() => onOpen(news.file)}>
        {news.day && <span className="card-day">{news.day}</span>}
        <span className="card-date">{formatDate(news.date)}</span>
        <ul className="card-heads">
          {news.heads.map((h) => <li key={h}>{h}</li>)}
        </ul>
        <span className="card-meta">
          {news.count}件のニュース <span className="arrow">→</span>
        </span>
      </button>
    </li>
  );
}
