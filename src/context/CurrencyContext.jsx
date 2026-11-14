import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { formatCurrency, getAllWorldCurrencies, getUsdExchangeRates } from '../utils/currencies';

const STORAGE_KEY = 'fa_currency';
const CURRENCY_EVENT = 'fa:currency-changed';

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children }) {
  const [currency, setCurrencyState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'KES'
  );
  const [usdRates, setUsdRates] = useState({ USD: 1, KES: 129 });

  useEffect(() => {
    getUsdExchangeRates().then(setUsdRates);
  }, []);

  const setCurrency = (nextCurrency) => {
    const code = (nextCurrency || 'KES').toUpperCase();
    setCurrencyState(code);
    localStorage.setItem(STORAGE_KEY, code);
    window.dispatchEvent(new CustomEvent(CURRENCY_EVENT, { detail: code }));
  };

  useEffect(() => {
    const onCustomChange = (e) => {
      if (e.detail && e.detail !== currency) setCurrencyState(e.detail);
    };
    const onStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) setCurrencyState(e.newValue);
    };
    window.addEventListener(CURRENCY_EVENT, onCustomChange);
    window.addEventListener('storage', onStorageChange);
    return () => {
      window.removeEventListener(CURRENCY_EVENT, onCustomChange);
      window.removeEventListener('storage', onStorageChange);
    };
  }, [currency]);

  const value = useMemo(() => {
    const worldCurrencies = getAllWorldCurrencies();
    const formatPrice = (amount, overrideCurrency) =>
      formatCurrency(amount, overrideCurrency || currency);

    const convertFromUSD = (usdAmount, targetCurrency = currency) => {
      const rate = usdRates[targetCurrency] || 1;
      return usdAmount * rate;
    };

    return {
      currency,
      setCurrency,
      formatPrice,
      convertFromUSD,
      worldCurrencies,
    };
  }, [currency, usdRates]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  const [fallbackCurrency, setFallbackCurrency] = useState(
    () => localStorage.getItem(STORAGE_KEY) || 'KES'
  );
  const [usdRates, setUsdRates] = useState({ USD: 1, KES: 129 });

  useEffect(() => {
    if (ctx) return;
    getUsdExchangeRates().then(setUsdRates);
    const sync = () => setFallbackCurrency(localStorage.getItem(STORAGE_KEY) || 'KES');
    window.addEventListener(CURRENCY_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CURRENCY_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [ctx]);

  if (ctx) return ctx;

  const worldCurrencies = getAllWorldCurrencies();
  return {
    currency: fallbackCurrency,
    setCurrency: (next) => {
      const code = (next || 'KES').toUpperCase();
      localStorage.setItem(STORAGE_KEY, code);
      setFallbackCurrency(code);
      window.dispatchEvent(new CustomEvent(CURRENCY_EVENT, { detail: code }));
    },
    formatPrice: (amount, overrideCurrency) =>
      formatCurrency(amount, overrideCurrency || fallbackCurrency),
    convertFromUSD: (usdAmount, target = fallbackCurrency) =>
      usdAmount * (usdRates[target] || 1),
    worldCurrencies,
  };
}