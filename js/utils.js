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

  function pick(obj, arr) {
    return arr.reduce((total, item) => {
      total[item] = obj[item];
      return total;
    }, {});
  }

  function setCookies(details) {
    return Promise.allSettled(
      details.map((item) => {
        const detail = pick(item, [
          "domain",
          "expirationDate",
          "httpOnly",
          "name",
          "path",
          "sameSite",
          "secure",
          "storeId",
          "value",
        ]);
        detail.url =
          "http" + (item.secure ? "s" : "") + "://" + item.domain + item.path;
        return chrome.cookies.set(detail);
      })
    );
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

const Request = (function (chrome) {
  function getDynamicRules() {
    return new Promise((resolve, reject) => {
      chrome.declarativeNetRequest.getDynamicRules(function (res) {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(res);
      });
    });
  }

  function updateDynamicRules(options) {
    return new Promise((resolve, reject) => {
      chrome.declarativeNetRequest.updateDynamicRules(options, function (res) {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        resolve(res);
      });
    });
  }

  function handleData(arr) {
    if (!Array.isArray(arr)) {
      return;
    }
    return arr.reduce((total, item, index) => {
      if (item.enable) {
        total.push({
          id: index + 1,
          priority: 1,
          action: {
            type: "redirect",
            redirect: { regexSubstitution: item.replace },
          },
          condition: {
            regexFilter: item.original,
            resourceTypes: [
              "main_frame",
              "stylesheet",
              "script",
              "image",
              "font",
              "media",
            ],
          },
        });
      }
      return total;
    }, []);
  }
  async function changeRules(list) {
    const oldRules = await getDynamicRules();
    const oldRulesId = oldRules.map((item) => item.id);
    if (oldRulesId.length) {
      await updateDynamicRules({ removeRuleIds: oldRulesId });
    }
    const addRules = handleData(list);
    if (addRules.length) {
      await updateDynamicRules({ addRules });
    }
  }
  return {
    getDynamicRules,
    updateDynamicRules,
    changeRules
  };
})(chrome);

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function copyToClip(content) {
  let aux = document.createElement("input");
  aux.setAttribute("value", content);
  aux.style.cssText = " position: fixed;top: -100%;";
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
}

function getClipboard() {
  let pasteTarget = document.createElement("div");
  pasteTarget.contentEditable = true;
  pasteTarget.style.cssText = " position: fixed;top: -100%;";
  document.body.appendChild(pasteTarget);
  pasteTarget.focus();
  document.execCommand("Paste", null, null);
  let paste = pasteTarget.innerText;
  document.body.removeChild(pasteTarget);
  return paste;
}
