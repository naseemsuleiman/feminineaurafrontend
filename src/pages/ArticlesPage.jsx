import { useEffect, useState } from 'react';
import API from '../api';

const CATS = [
  { key: 'all', label: 'All' },
  { key: 'mental', label: 'Mental Aura' },
  { key: 'physical', label: 'Physical Aura' },
  { key: 'financial', label: 'Financial Aura' },
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [cat, setCat] = useState('all');

  useEffect(() => {
    const url = cat === 'all' ? '/articles/' : `/articles/?category=${cat}`;
    API.get(url).then(({ data }) => setArticles(data));
  }, [cat]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p className="uppercase tracking-[0.3em] text-xs text-rose-600 mb-4">Empowerment Hub</p>
        <h1 className="section-title">Read. Reflect. Rise.</h1>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {CATS.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition ${
              cat === c.key ? 'bg-rose-600 text-white' : 'bg-blush-100 text-mulberry hover:bg-blush-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <article key={a.id} className="card hover:-translate-y-1 transition">
            <p className="text-xs uppercase tracking-widest text-rose-600 mb-2">{a.category}</p>
            <h3 className="font-serif text-xl mb-2">{a.title}</h3>
            <p className="text-sm text-mulberry/70 leading-relaxed whitespace-pre-line">{a.body}</p>
          </article>
        ))}
        {!articles.length && (
          <p className="text-center col-span-full text-mulberry/60">No articles yet.</p>
        )}
      </div>
    </section>
  );
}