import Hero from '../components/Hero';
import Pillars from '../components/Pillars';
import QuoteCarousel from '../components/QuoteCarousel';
import Newsletter from '../components/Newsletter';
import { Heart, Sparkles, Gem, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <Hero />
      <Pillars />
      <BrandStrip />
      <QuoteCarousel />
      <FeaturedSection />
      <Newsletter />
    </>
  );
}

function BrandStrip() {
  const items = [
    { icon: Heart, label: 'Self-Love' },
    { icon: Sparkles, label: 'Grace' },
    { icon: Gem, label: 'Confidence' },
    { icon: BookOpen, label: 'Healing' },
  ];
  return (
    <section className="border-y border-blush-100 bg-white/50">
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center justify-center gap-3 text-mulberry/70">
            <Icon size={18} className="text-rose-600" />
            <span className="font-serif text-lg">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturedSection() {
  const features = [
    {
      tag: 'Financial',
      title: 'The 30-Day Budget Tracker',
      desc: 'Track essentials, wants & savings, daily. Financial freedom is self-care.',
      to: '/budget-tracker',
      cta: 'Start tracking',
    },
    {
      tag: 'Empowerment',
      title: 'Read. Reflect. Rise.',
      desc: 'Bite-sized essays on charisma, healing, and becoming her.',
      to: '/empowerment',
      cta: 'Read articles',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <span className="text-xs uppercase tracking-[0.3em] text-rose-600 font-medium">
          Start Here
        </span>
        <h2 className="section-title mt-3">Where Would You Like to Begin?</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((f) => (
          <Link
            key={f.title}
            to={f.to}
            className="group card !p-10 hover:-translate-y-1.5 transition-all"
          >
            <span className="text-xs uppercase tracking-[0.25em] text-rose-600 font-medium">
              {f.tag}
            </span>
            <h3 className="font-serif text-2xl md:text-3xl mt-3 mb-3">{f.title}</h3>
            <p className="text-mulberry/65 leading-relaxed">{f.desc}</p>
            <span className="inline-block mt-6 text-rose-600 font-medium group-hover:translate-x-1 transition">
              {f.cta} →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}