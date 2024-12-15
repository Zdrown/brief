// utils/localStorageHelper.js

const LocalStorageHelper = {
    /**
     * Get a value from localStorage and parse it as JSON.
     * @param {string} key - The key to retrieve.
     * @returns {any} - The parsed value or null if not found.
     */
    getItem(key) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error(`Error getting item from localStorage: ${key}`, error);
        return null;
      }
    },
  
    /**
     * Save a value to localStorage after stringifying it as JSON.
     * @param {string} key - The key to save.
     * @param {any} value - The value to save.
     */
    setItem(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error saving item to localStorage: ${key}`, error);
      }
    },
  
    /**
     * Remove a value from localStorage.
     * @param {string} key - The key to remove.
     */
    removeItem(key) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing item from localStorage: ${key}`, error);
      }
    },
  
    /**
     * Clear all localStorage values.
     */
    clear() {
      try {
        localStorage.clear();
      } catch (error) {
        console.error("Error clearing localStorage", error);
      }
    },
  };
  
  export default LocalStorageHelper;
  