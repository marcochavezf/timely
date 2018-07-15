'use strict';
let initRequiredDayTime = -1;
let activeTabs = [];

chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(tabId => {
  chrome.pageAction.show(tabId);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { newDayTime, requireDayTime, dateNowKey } = request;
  if (newDayTime) {
    activeTabs = activeTabs.filter(e => e !== requireDayTime);
    if (activeTabs.length > 0) {
      return;
    }
    initRequiredDayTime = -1;
    const storageObj = {};
    storageObj[dateNowKey] = newDayTime;
    chrome.storage.sync.set(storageObj);
  } else 
  if (requireDayTime) {
    const dateNow = new Date();
    const dateNowKey = `${dateNow.getFullYear()}-${dateNow.getMonth()}-${dateNow.getDate()}`;
    chrome.storage.sync.get([dateNowKey], result => {
      const dayTime = result[dateNowKey] || 0;
      activeTabs.push(requireDayTime);
      sendResponse({ dayTime, dateNowKey, initDayTime: initRequiredDayTime });
      if (initRequiredDayTime < 0) {
        initRequiredDayTime = requireDayTime;
      }
    });
  }
  return true;
});