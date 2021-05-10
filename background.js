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

// background里有时不触发storage change，所以没有将逻辑写到这里
// chrome.runtime.onInstalled.addListener(async () => {
//   onStorageChange("proxyUrlList", async function (res) {
//     const oldRules = await getDynamicRules();
//     const oldRulesId = oldRules.map((item) => item.id);
//     if (oldRulesId.length) {
//       await updateDynamicRules({ removeRuleIds: oldRulesId });
//     }
//     const addRules = handleData(res.newValue);
//     if (addRules.length) {
//       await updateDynamicRules({ addRules });
//     }
//   });
// });
