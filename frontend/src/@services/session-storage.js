class SessionStorage {
  constructor(sessionStorage) {
    this.sessionStorage = sessionStorage;
  }

  getSessionStorage() {
    return this.sessionStorage;
  }

  getItem(key) {
    try {
      return JSON.parse(this.getSessionStorage().getItem(key)).value;
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  setItem(key, value) {
    return this.getSessionStorage().setItem(key, JSON.stringify({ value }));
  }
  removeItem(key) {
    return this.getSessionStorage().removeItem(key);
  }
}

export default new SessionStorage(localStorage);