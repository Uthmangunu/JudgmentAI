export const formatDate = (value) => {
  if (!value) return 'Unknown date';
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
};

export const truncateText = (value, length = 80) => {
  if (!value) return '';
  return value.length > length ? `${value.slice(0, length)}…` : value;
};
