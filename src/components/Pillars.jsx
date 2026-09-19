import { Brain, Sparkles, Gem, Users, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const pillars = [
  {
    icon: Brain,
    title: 'Mental Aura',
    desc: 'Self-discovery questions, inner child healing, shadow work prompts.',
    link: '/empowerment?cat=mental',
  },
  {
    icon: Sparkles,
    title: 'Physical Aura',
    desc: 'Glow routines, posture, charismatic body language tips.',
    link: '/empowerment?cat=physical',
  },
  {
    icon: Gem,
    title: 'Financial Aura',
    desc: 'Financial freedom is self-care — start the 30-Day Budget Tracker.',
    link: '/budget-tracker',
  },
  {
    icon: Users,
    title: 'Community & Wisdom',
    desc: 'Daily advice, empowerment quotes, lifestyle upgrades.',
    link: '/community',
  },
];

export default function Pillars() {
  return (
    <section className="relative max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <span className="text-xs uppercase tracking-[0.3em] text-rose-600 font-medium">
          The Foundations
        </span>
        <h2 className="section-title mt-3">The Four Pillars</h2>
        <p className="text-mulberry/60 mt-3 max-w-xl mx-auto">
          Everything you need to glow — inside and out.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map(({ icon: Icon, title, desc, link }) => (
          <Link
            key={title}
            to={link}
            className="group relative bg-white rounded-3xl p-7 border border-blush-100 shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
          >
            {/* soft corner glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blush-100 group-hover:bg-blush-200 transition" />

            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blush-100 to-blush-200 flex items-center justify-center mb-5 group-hover:from-rose-400 group-hover:to-rose-600 transition">
                <Icon
                  size={22}
                  className="text-rose-600 group-hover:text-white transition"
                  strokeWidth={1.8}
                />
              </div>
              <h3 className="font-serif text-xl mb-2 text-mulberry">{title}</h3>
              <p className="text-sm text-mulberry/65 leading-relaxed">{desc}</p>
              <ArrowUpRight
                size={18}
                className="mt-5 text-rose-600 opacity-0 group-hover:opacity-100 transition"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}