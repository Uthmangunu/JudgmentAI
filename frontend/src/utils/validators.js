const REDDIT_REGEX = /(reddit\.com|redd\.it)/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value = '') => EMAIL_REGEX.test(String(value).toLowerCase());
export const isValidPassword = (value = '') => String(value).length >= 8;
export const isValidRedditUrl = (value = '') => REDDIT_REGEX.test(String(value).toLowerCase());
