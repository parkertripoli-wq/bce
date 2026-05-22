let coins = 0;

chrome.storage.sync.get(['coins'], (data) => {
  coins = data.coins || 0;
  document.getElementById('coin-count').textContent = coins;
});

document.getElementById('shop-btn').onclick = () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('shop.html') });
};

document.getElementById('settings-btn').onclick = () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });
};