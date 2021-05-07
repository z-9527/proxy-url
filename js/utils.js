const Storage = (function (chrome) {
  function getStorageSyncData(keys) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(keys, (items) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(items);
      });
    });
  }

  function setStorageSyncData(items) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set(items, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve("success");
      });
    });
  }

  function removeStorageSyncData(keys) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.remove(keys, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve("success");
      });
    });
  }

  function onStorageChange(key, handle) {
    chrome.storage.onChanged.addListener(function (changes) {
      if (!key || typeof key === "function") {
        handle(changes);
      } else if (changes.hasOwnProperty(key)) {
        handle(changes[key]);
      }
    });
  }

  return {
    getStorageSyncData,
    setStorageSyncData,
    removeStorageSyncData,
    onStorageChange,
  };
})(chrome);
