const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const PHONE_PATTERN = /(?<!\w)(?:\+?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}(?!\w)/g;
const JWT_PATTERN = /\beyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\b/g;
const ADDRESS_PATTERN =
  /\b(?:av(?:enida)?\.?|calle|jr\.?|jiron|urb\.?|mz\.?|lote|pasaje|psje\.?)\s+[a-zA-Z0-9#\-.,\s]{4,80}/gi;
const LONG_NUMBER_PATTERN = /\b\d{8,}\b/g;

const SENSITIVE_KEY_PATTERN =
  /(password|token|secret|cookie|authorization|email|phone|telefono|celular|dni|address|direccion|medical|history|document|patient|consent|radiograph)/i;

type SanitizerOptions = {
  maxDepth?: number;
  maxEntries?: number;
  maxArrayLength?: number;
  maxStringLength?: number;
};

const DEFAULT_OPTIONS: Required<SanitizerOptions> = {
  maxDepth: 4,
  maxEntries: 60,
  maxArrayLength: 30,
  maxStringLength: 300,
};

export function redactSensitiveText(input: string, maxLength = DEFAULT_OPTIONS.maxStringLength): string {
  return input
    .replace(EMAIL_PATTERN, '[redacted-email]')
    .replace(PHONE_PATTERN, '[redacted-phone]')
    .replace(JWT_PATTERN, '[redacted-jwt]')
    .replace(ADDRESS_PATTERN, '[redacted-address]')
    .replace(LONG_NUMBER_PATTERN, '[redacted-number]')
    .slice(0, maxLength);
}

export function redactSensitiveData(
  value: unknown,
  options: SanitizerOptions = {},
  depth = 0,
  visited = new WeakSet<object>()
): unknown {
  const config = { ...DEFAULT_OPTIONS, ...options };

  if (depth > config.maxDepth) return '[truncated-depth]';
  if (typeof value === 'string') return redactSensitiveText(value, config.maxStringLength);
  if (typeof value === 'number' || typeof value === 'boolean' || value == null) return value;

  if (Array.isArray(value)) {
    return value
      .slice(0, config.maxArrayLength)
      .map((item) => redactSensitiveData(item, config, depth + 1, visited));
  }

  if (typeof value === 'object') {
    const target = value as Record<string, unknown>;
    if (visited.has(target)) return '[circular]';
    visited.add(target);

    const entries = Object.entries(target).slice(0, config.maxEntries);
    const sanitized: Record<string, unknown> = {};

    for (const [key, val] of entries) {
      if (SENSITIVE_KEY_PATTERN.test(key)) {
        sanitized[key] = '[redacted]';
        continue;
      }
      sanitized[key] = redactSensitiveData(val, config, depth + 1, visited);
    }

    return sanitized;
  }

  return '[unsupported]';
}

export function getErrorMessage(error: unknown, fallback = 'Error interno'): string {
  if (error instanceof Error && typeof error.message === 'string' && error.message.trim()) {
    return redactSensitiveText(error.message.trim());
  }

  if (typeof error === 'string' && error.trim()) {
    return redactSensitiveText(error.trim());
  }

  return fallback;
}

export function toClientSafeMessage(message: string, status: number): string {
  if (status >= 500) return 'Error interno';

  const sanitized = redactSensitiveText(message || 'Solicitud invalida');
  return sanitized || 'Solicitud invalida';
}

export function logSanitizedError(context: string, error: unknown): void {
  const safePayload = redactSensitiveData(error);
  console.error(`[${context}]`, safePayload);
}
