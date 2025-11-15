// script.js

// Global Değişkenler
const startDate = new Date('2023-05-10T00:00:00');
const compliments = [
  "Gözlerin yıldızlar gibi parlıyor ❤️",
  "Seninle geçirdiğim her saniye mucize.",
  "Gülüşün dünyayı aydınlatıyor.",
  "Senin gibi biriyle tanışmak hayatımın en güzel olayı.",
  "Kalbim seninle atıyor.",
  "Her sabah seni düşünerek uyanıyorum.",
  "Sen bir hazine gibisin.",
  "Yanında kendimi evimde hissediyorum.",
  "Seni sevmek en güzel bağımlılık.",
  "Geleceğim sensin."
];

// DOM Elementleri
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const calendarGrid = document.getElementById('calendarGrid');
const monthYear = document.getElementById('monthYear');
const complimentEl = document.getElementById('compliment');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const themeToggle = document.getElementById('themeToggle');
const heartSpeedRange = document.getElementById('heartSpeed');
const heartSpeedValue = document.getElementById('heartSpeedValue');
const musicBtn = document.getElementById('musicBtn');
const musicState = document.getElementById('musicState');
const backgroundMusic = document.getElementById('backgroundMusic');

let heartInterval; // Kalp yağmuru için interval ID'si


// --- Temel İşlevler ---

// 1. Sayaç Güncelleme
function updateTimer() {
  const now = new Date();
  const diff = now - startDate;
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const mins = Math.floor((diff % (1000*60*60)) / (1000*60));
  const secs = Math.floor((diff % (1000*60)) / 1000);
  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = hours;
  document.getElementById('mins').textContent = mins;
  document.getElementById('secs').textContent = secs;
}

// 2. Kalp Yağmuru
function createHeart() {
  const h = document.createElement('div');
  h.className = 'heart';
  h.innerHTML = '❤️';
  h.style.left = Math.random() * 100 + 'vw';
  h.style.animationDuration = Math.random() * 4 + 5 + 's';
  h.style.fontSize = Math.random() * 0.8 + 1.2 + 'rem';
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 10000);
}

function startHeartRain(speed) {
  if (heartInterval) clearInterval(heartInterval);
  heartInterval = setInterval(createHeart, speed);
  localStorage.setItem('heartSpeed', speed);
  heartSpeedValue.textContent = speed;
}

// 3. Tema Yönetimi
function applyTheme(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'true');
        themeToggle.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'false');
        themeToggle.checked = false;
    }
}

// 4. Müzik Yönetimi
function toggleMusic() {
    if (backgroundMusic.paused) {
        backgroundMusic.play().then(() => {
            localStorage.setItem('musicOn', 'true');
            musicState.textContent = 'Açık';
        }).catch(error => {
            // Tarayıcı otomatik oynatmayı engellediğinde
            alert("Müzik otomatik oynatılamadı. Lütfen tekrar deneyin. (Tarayıcı engeli)");
            console.error("Müzik Oynatma Hatası:", error);
            localStorage.setItem('musicOn', 'false');
            musicState.textContent = 'Kapalı';
        });
    } else {
        backgroundMusic.pause();
        localStorage.setItem('musicOn', 'false');
        musicState.textContent = 'Kapalı';
    }
    // Menü kapansın
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
}

// --- Başlangıç Yüklemesi ---

function initialize() {
  document.getElementById('spinner').style.display = 'none';

  // Sayaç ve İltifat
  setInterval(updateTimer, 1000);
  updateTimer();
  setInterval(() => {
      const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
      complimentEl.textContent = randomCompliment;
  }, 10000); // Her 10 saniyede bir iltifat değişsin

  // Takvim
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const months = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  monthYear.textContent = `${months[month]} ${year}`;
  const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month+1, 0).getDate();
  for(let i=0; i<firstDay; i++) { calendarGrid.innerHTML += `<div class="day"></div>`; }
  for(let d=1; d<=daysInMonth; d++) {
    const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
    calendarGrid.innerHTML += `<div class="day ${isToday?'today':''}">${d}</div>`;
  }
  complimentEl.textContent = compliments[now.getDate() % compliments.length]; // İlk iltifat

  // --- Ayarları Yükle ---
  
  // Tema Yükle
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  applyTheme(isDarkMode);

  // Kalp Hızı Yükle
  const currentHeartSpeed = parseInt(localStorage.getItem('heartSpeed')) || 500;
  heartSpeedRange.value = currentHeartSpeed;
  startHeartRain(currentHeartSpeed);
  
  // Müzik Durumu Yükle
  const isMusicOn = localStorage.getItem('musicOn') !== 'false';
  if (isMusicOn) {
      musicState.textContent = 'Açık';
      // Müzik sadece kullanıcı etkileşiminden sonra otomatik başlar (toggleMusic veya herhangi bir tıklama)
  } else {
      backgroundMusic.pause();
      musicState.textContent = 'Kapalı';
  }
}

window.onload = initialize;

// --- Etkinlik Dinleyicileri (Event Listeners) ---

// Sidebar Yönetimi
menuBtn.onclick = () => {
  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
};
overlay.onclick = () => {
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
  settingsModal.style.display = 'none';
};

// Ayarlar Modal Yönetimi
settingsBtn.onclick = () => {
  settingsModal.style.display = 'block';
  sidebar.classList.remove('open'); 
  overlay.classList.remove('show');
};
closeSettings.onclick = () => {
  settingsModal.style.display = 'none';
};
window.onclick = (event) => {
  if (event.target == settingsModal) {
    settingsModal.style.display = 'none';
  }
};

// Ayar Değişiklikleri
themeToggle.onchange = (e) => {
    applyTheme(e.target.checked);
};
heartSpeedRange.oninput = (e) => {
    startHeartRain(parseInt(e.target.value));
};

// Müzik butonu
musicBtn.onclick = toggleMusic;