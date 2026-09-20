import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

/**
 * Secret entry point:
 *   /enter?key=fa-preview-2026
 * Sets a preview flag locally, then sends the user to /preview.
 */
const SECRET_KEY = 'fa-preview-2026';

export default function EnterPreview() {
  const [params] = useSearchParams();
  const nav = useNavigate();

  useEffect(() => {
    const key = params.get('key');
    if (key === SECRET_KEY) {
      localStorage.setItem('fa_preview', '1');
    }
    nav('/preview', { replace: true });
  }, [params, nav]);

  return (
    <div className="min-h-screen grid place-items-center bg-blush-50 text-mulberry/60">
      <Sparkles className="animate-pulse text-rose-400" />
    </div>
  );
}z