function onStorageChange(key, handle) {
  chrome.storage.onChanged.addListener(function (changes) {
    if (!key || typeof key === "function") {
      handle(changes);
    } else if (changes.hasOwnProperty(key)) {
      handle(changes[key]);
    }
  });
}

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

chrome.runtime.onInstalled.addListener(async () => {
  onStorageChange("proxyUrlList", async function (res) {
    const oldRules = await getDynamicRules();
    const oldRulesId = oldRules.map((item) => item.id);
    const addRules = handleData(res.newValue);

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: oldRulesId,
      addRules,
    });
  });
});
