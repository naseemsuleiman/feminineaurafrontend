import QuoteCarousel from '../components/QuoteCarousel';
import Newsletter from '../components/Newsletter';

export default function Wisdom() {
  return (
    <div className="py-12">
      <div className="text-center mb-4">
        <p className="uppercase tracking-[0.3em] text-xs text-rose-600">Daily Wisdom</p>
        <h1 className="section-title mt-3">Whispers for the Becoming Woman</h1>
      </div>
      <QuoteCarousel />
      <Newsletter />
    </div>
  );
}