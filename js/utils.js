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

const Cookies = (function (chrome) {
  function getAll(details) {
    return new Promise((resolve, reject) => {
      chrome.cookies.getAll(details, (items) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(items);
      });
    });
  }

  function getCurTabCookies() {
    return new Promise(async (resolve, reject) => {
      const tab = await getCurrentTab();
      const { hostname } = new URL(tab.url);
      chrome.cookies.getAll({ domain: hostname }, (items) => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(items);
      });
    });
  }

  function setCookies(details) {
    return Promise.all(details.map((item) => chrome.cookies.set(item)));
  }

  function removeCookies(details) {
    return new Promise((resolve, reject) => {
      chrome.cookies.remove(details, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve("success");
      });
    });
  }

  return {
    getAll,
    getCurTabCookies,
    setCookies,
    removeCookies,
  };
})(chrome);

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function copyToClip(content) {
  var aux = document.createElement("input");
  aux.setAttribute("value", content);
  aux.style.cssText = " position: fixed;top: -100%;";
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
}
