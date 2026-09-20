import { useEffect, useState } from 'react';
import API from '../api';

/**
 * Returns { isLive, loading } where isLive = true means show the real site.
 */
export default function useSiteStatus() {
  const [isLive, setIsLive] = useState(null); // null = loading

  useEffect(() => {
    let mounted = true;
    API.get('/site-status/')
      .then(({ data }) => {
        if (mounted) setIsLive(!!data.is_live);
      })
      .catch(() => {
        if (mounted) setIsLive(false); // fail safe → Coming Soon
      });
    return () => { mounted = false; };
  }, []);

  return { isLive, loading: isLive === null };
}