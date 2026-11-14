// Complete ISO 4217 world currency fallback list (161 active currencies)
const ALL_ISO_CURRENCIES = [
  'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN',
  'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL',
  'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY',
  'COP', 'CRC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP',
  'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD',
  'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HTG', 'HUF', 'IDR', 'ILS', 'INR',
  'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF',
  'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL',
  'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR',
  'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR',
  'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR',
  'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD',
  'SHP', 'SLE', 'SOS', 'SRD', 'SSP', 'STN', 'SVC', 'SYP', 'SZL', 'THB',
  'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX',
  'USD', 'UYU', 'UZS', 'VES', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XOF',
  'XPF', 'YER', 'ZAR', 'ZMW', 'ZWL',
];

const PINNED_CODES = ['KES', 'USD', 'EUR', 'GBP', 'NGN', 'UGX', 'TZS', 'ZAR', 'CAD', 'AUD', 'INR', 'AED'];

function getCurrencySymbol(code) {
  try {
    const parts = new Intl.NumberFormat('en', {
      style: 'currency',
      currency: code,
      currencyDisplay: 'narrowSymbol',
    }).formatToParts(0);
    return parts.find((p) => p.type === 'currency')?.value || code;
  } catch {
    return code;
  }
}

export function getAllWorldCurrencies() {
  let codes = ALL_ISO_CURRENCIES;
  if (typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function') {
    try {
      const supported = Intl.supportedValuesOf('currency');
      codes = Array.from(new Set([...ALL_ISO_CURRENCIES, ...supported]));
    } catch {
      codes = ALL_ISO_CURRENCIES;
    }
  }

  let displayNames = null;
  if (typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function') {
    try {
      displayNames = new Intl.DisplayNames(['en'], { type: 'currency' });
    } catch {
      displayNames = null;
    }
  }

  const mapped = codes.map((code) => {
    const name = displayNames ? displayNames.of(code) || code : code;
    const symbol = getCurrencySymbol(code);
    return {
      code,
      name,
      symbol,
      label: `${code} — ${name} (${symbol})`,
    };
  });

  const pinned = PINNED_CODES
    .map((code) => mapped.find((c) => c.code === code))
    .filter(Boolean);

  const rest = mapped
    .filter((c) => !PINNED_CODES.includes(c.code))
    .sort((a, b) => a.code.localeCompare(b.code));

  return { pinned, rest, all: [...pinned, ...rest] };
}

export function formatCurrency(amount, currency = 'KES') {
  const num = Number(amount) || 0;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'KES',
    }).format(num);
  } catch {
    return `${currency || 'KES'} ${num.toFixed(2)}`;
  }
}

const RATES_CACHE_KEY = 'fa_usd_rates_cache';
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export async function getUsdExchangeRates() {
  try {
    const cached = JSON.parse(localStorage.getItem(RATES_CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS && cached.rates) {
      return cached.rates;
    }
  } catch {
    // Ignore storage parse errors
  }

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    if (data?.result === 'success' && data?.rates) {
      localStorage.setItem(
        RATES_CACHE_KEY,
        JSON.stringify({ timestamp: Date.now(), rates: data.rates })
      );
      return data.rates;
    }
  } catch {
    // Offline or blocked fallback
  }

  return { USD: 1, KES: 129, EUR: 0.92, GBP: 0.79, NGN: 1550, UGX: 3700, TZS: 2600, ZAR: 18 };
}