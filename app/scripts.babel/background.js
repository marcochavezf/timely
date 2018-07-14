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
  const { newDayTime, requireDayTime } = request;
  if (newDayTime) {
    activeTabs = activeTabs.filter(e => e !== requireDayTime);
    if (activeTabs.length > 0) {
      return;
    }
    initRequiredDayTime = -1;
    chrome.storage.sync.set({dayTime: newDayTime}, function() {
      console.log('Value is set to ' + newDayTime);
    });
  } else 
  if (requireDayTime) {
    chrome.storage.sync.get(['dayTime'], function(result) {
      const { dayTime } = result;
      activeTabs.push(requireDayTime);
      sendResponse({ dayTime, initDayTime: initRequiredDayTime });
      if (initRequiredDayTime < 0) {
        initRequiredDayTime = requireDayTime;
      }
    });
  }
  return true;
});