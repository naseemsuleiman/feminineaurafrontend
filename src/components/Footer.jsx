export default function Footer() {
  return (
    <footer className="mt-20 border-t border-blush-100 bg-blush-100/40">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-blush-200 to-rose-400 grid place-items-center text-white font-serif">❀</span>
            <span className="font-serif text-lg">Feminine Aura</span>
          </div>
          <p className="text-sm text-mulberry/70">
            Your daily dose of feminine wisdom — Self-love • Grace • Confidence • Healing.
          </p>
        </div>
        <div>
          <h4 className="font-serif text-lg mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-mulberry/70">
            <li><a href="/empowerment" className="hover:text-rose-600">Empowerment Hub</a></li>
            <li><a href="/budget-tracker" className="hover:text-rose-600">Budget Tracker</a></li>
            <li><a href="/wisdom" className="hover:text-rose-600">Daily Wisdom</a></li>
            <li><a href="/community" className="hover:text-rose-600">Community</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-lg mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-mulberry/70">
            <li><a href="#" className="hover:text-rose-600">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-rose-600">Terms</a></li>
            <li><a href="#" className="hover:text-rose-600">Cookies</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-serif text-lg mb-3">Follow</h4>
          <p className="text-sm text-mulberry/70">@fe.minineaura</p>
        </div>
      </div>
      <div className="border-t border-blush-100 py-4 text-center text-xs text-mulberry/60">
        © {new Date().getFullYear()} Feminine Aura. All rights reserved.
      </div>
    </footer>
  );
}