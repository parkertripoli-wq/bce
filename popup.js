const REPO_RAW = "https://raw.githubusercontent.com/parkertripoli-wq/bce/main/";

let currentVersion = "2.0";   // Update this when you change version in manifest

async function checkForUpdates() {
  try {
    const res = await fetch(REPO_RAW + "manifest.json");
    if (!res.ok) throw new Error("Failed to fetch");
    
    const remoteManifest = await res.json();
    const remoteVersion = remoteManifest.version;

    if (remoteVersion !== currentVersion) {
      document.getElementById('update-btn').style.display = 'block';
      document.getElementById('update-btn').onclick = () => {
        showUpdateInstructions(remoteVersion);
      };
    }
  } catch(e) {
    console.log("Update check failed (maybe offline)", e);
  }
}

function showUpdateInstructions(newVersion) {
  const msg = `New version ${newVersion} available!\n\n` +
              `1. Go to chrome://extensions/\n` +
              `2. Enable Developer Mode\n` +
              `3. Click "Load unpacked" and select your updated folder\n\n` +
              `Or manually download files from:\n` +
              REPO_RAW;

  alert(msg);
}

// Load coins
chrome.storage.sync.get(['coins'], (data) => {
  document.getElementById('coin-count').textContent = data.coins || 0;
});

// Button handlers
document.getElementById('shop-btn').onclick = () => chrome.tabs.create({ url: chrome.runtime.getURL('shop.html') });
document.getElementById('settings-btn').onclick = () => chrome.tabs.create({ url: chrome.runtime.getURL('settings.html') });

// Check for updates when popup opens
checkForUpdates();
// Also check every 30 minutes
setInterval(checkForUpdates, 30 * 60 * 1000);
