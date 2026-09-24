import { useEffect, useState } from 'react';
import API from '../api';

export default function useSiteStatus() {
  const [isLive, setIsLive] = useState(null);

  useEffect(() => {
    let mounted = true;
    API.get('/site-status/')
      .then(({ data }) => { if (mounted) setIsLive(!!data.is_live); })
      .catch(() => { if (mounted) setIsLive(false); });
    return () => { mounted = false; };
  }, []);

  return { isLive, loading: isLive === null };
}