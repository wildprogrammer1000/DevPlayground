const getItem = (storage, key) => {
  const jsonStr = storage.getItem(key);
  if (!jsonStr) return null;
  return JSON.parse(jsonStr);
};

const setItem = (storage, key, value) => {
  const str = value ? value : null;
  storage.setItem(key, JSON.stringify(str));
};

const removeItem = (storage, key) => {
  storage.removeItem(key);
};

export const getSessionItem = (key) => {
  return getItem(sessionStorage, key);
};

export const setSessionItem = (key, value) => {
  setItem(sessionStorage, key, value);
};

export const removeSessionItem = (key) => {
  removeItem(sessionStorage, key);
};
