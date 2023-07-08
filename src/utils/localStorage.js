const localStorageUtils = {
    get(key) {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    },
  
    set(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };
  
  export default localStorageUtils;
  