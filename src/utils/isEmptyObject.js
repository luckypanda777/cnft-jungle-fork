const isEmptyObject = (object) => {
  if (!object) return false;

  return !Object.values(object).some((x) => x !== null && x !== '');
};

const getFromLocalStorage = (name, type, ifNotFound = []) => {
  const saved = typeof window !== 'undefined' ? localStorage.getItem(name) : false;

  if (!saved) {
    return ifNotFound;
  }

  return type === 'array'
    ? saved.split(',')
    : type === 'object'
    ? JSON.parse(saved)
    : saved;
};

const removeFromLocalStorage = (name) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(name);
  }
};

const setLocalStorage = (name, value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(name, value);
  }
};

export { isEmptyObject, getFromLocalStorage, removeFromLocalStorage, setLocalStorage };
