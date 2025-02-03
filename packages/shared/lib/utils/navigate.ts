export const navigate = (url: string) => {
  const getUrl = chrome.runtime.getURL(url);
  chrome.tabs.create({ url: getUrl });
};
