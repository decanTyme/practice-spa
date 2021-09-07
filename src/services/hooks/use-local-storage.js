import { useState } from "react";

function useLocalStorage(key, initVal) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initVal;
    } catch (error) {
      console.error(error);
      return initVal;
    }
  });

  const setValue = (value) => {
    try {
      if (value === null) {
        window.localStorage.removeItem(key);
        setStoredValue(null);
        return;
      }
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
