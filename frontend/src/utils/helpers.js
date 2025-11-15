export const safeJsonParse = (payload, fallback = {}) => {
  if (!payload) return fallback;
  try {
    if (typeof payload === 'object') return payload;
    return JSON.parse(payload);
  } catch (error) {
    console.warn('Failed to parse JSON payload', error);
    return fallback;
  }
};

export const getInitials = (value = '') => {
  const matches = value.trim().split(' ');
  if (!matches.length) return 'JD';
  return matches
    .map((chunk) => chunk.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};
