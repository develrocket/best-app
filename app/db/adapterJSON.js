import low from 'lowdb';
import storage from 'lowdb/lib/file-sync';

export default (path) => ({
  0: path,

  put(key, value, callback) {
    try {
      const store = low(path, { storage });
      store.set(key, value).value();
      store.write();
      callback(null, null);
    } catch (e) {
      callback(e);
    }
  },

  get(key, callback) {
    try {
      const store = low(path, { storage });
      callback(null, store.get(key).value());
    } catch (e) {
      callback(e);
    }
  },

  del(key, callback) {
    try {
      // TODO remove value. Do nothing at moment.
      callback(null, null);
    } catch (e) {
      callback(e);
    }
  },
});
