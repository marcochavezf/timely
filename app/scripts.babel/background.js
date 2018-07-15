'use strict';
let lastDayTime = -1;
let initRequiredDayTime = -1;
let activeTabs = [];

initAnalytics('background');
chrome.runtime.onInstalled.addListener(details => {
  console.log('previousVersion', details.previousVersion);
});

chrome.tabs.onUpdated.addListener(tabId => {
  chrome.pageAction.show(tabId);
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  executeWithErrorHandling(() => {
    const { newDayTime, requireDayTime, dateNowKey } = request;
    if (newDayTime) {
      trackEventAnlytics('Close Page', dateNowKey);
      trackEventAnlytics(`New Total Time in ${dateNowKey}`, getTimeLabel(newDayTime));
      trackEventAnlytics(`Active Tabs Before Close Page ${dateNowKey}`, activeTabs.length);
      activeTabs = activeTabs.filter(e => e !== requireDayTime);
      if (activeTabs.length > 0) {
        return;
      }
      trackEventAnlytics(`Session Time in ${dateNowKey}`, getTimeLabel(newDayTime - lastDayTime));
      initRequiredDayTime = -1;
      const storageObj = {};
      storageObj[dateNowKey] = newDayTime;
      chrome.storage.sync.set(storageObj);
    } else 
    if (requireDayTime) {
      const dateNow = new Date();
      const dateNowKey = `${dateNow.getFullYear()}-${dateNow.getMonth()}-${dateNow.getDate()}`;
      trackEventAnlytics('Open Page', dateNowKey);
      chrome.storage.sync.get([dateNowKey], result => {
        const dayTime = result[dateNowKey] || 0;
        activeTabs.push(requireDayTime);
        trackEventAnlytics(`Total Time in Open Page ${ dateNowKey }`, getTimeLabel(dayTime));
        sendResponse({ dayTime, dateNowKey, initDayTime: initRequiredDayTime });
        if (initRequiredDayTime < 0) {
          initRequiredDayTime = requireDayTime;
          lastDayTime = dayTime;
        }
      });
    }
  });
  return true;
});