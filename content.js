let audioContext, analyser, microphone, isMonitoring = true;
let threshold = 0.68;
let cooldown = 0;
let screamBuffer = [];

async function startMonitoring() {
  if (!isMonitoring) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    analyser.fftSize = 64;
    monitorVolume();
  } catch(e) { console.error(e); }
}

function monitorVolume() {
  if (!isMonitoring) return;

  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);

  let sum = 0, max = 0;
  for (let v of dataArray) {
    sum += v;
    if (v > max) max = v;
  }
  const avg = sum / dataArray.length / 255;
  const peak = max / 255;

  screamBuffer.push(peak);
  if (screamBuffer.length > 18) screamBuffer.shift();

  if (screamBuffer.filter(p => p > 0.83).length >= 13 && Date.now() - cooldown > 15000) {
    triggerBreathingOverlay();
    cooldown = Date.now();
    screamBuffer = [];
  }

  setTimeout(monitorVolume, 55);
}

async function triggerBreathingOverlay() {
  // ... (same beautiful overlay as before)
  // At the END of breathing sequence when user clicks "I'm calm now":
  chrome.storage.sync.get(['coins'], (data) => {
    const newCoins = (data.coins || 0) + 5;
    chrome.storage.sync.set({ coins: newCoins });
  });

  // You can also show a "+5 coins!" message on overlay
}