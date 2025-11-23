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

// ÖZEL GÜNLER LİSTESİ (Ay-Gün formatında: MM-DD)
const SPECIAL_DATES = {
    '12-14': 'DOĞUM GÜNÜ ❤️', 
    '01-01': 'YILBAŞI 🥳',
    '05-10': 'İLİŞKİ YILDÖNÜMÜ 💍' 
};


// DOM Elementleri
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const calendarGrid = document.getElementById('calendarGrid');
const currentMonthYearEl = document.getElementById('currentMonthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const complimentEl = document.getElementById('compliment');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettings = document.getElementById('closeSettings');
const themeToggle = document.getElementById('themeToggle');
const themeOptions = document.getElementById('themeOptions'); 
const heartSpeedRange = document.getElementById('heartSpeed');
const heartSpeedValue = document.getElementById('heartSpeedValue');
const musicToggleBtn = document.getElementById('musicToggleBtn'); // Yeni buton ID'si
const musicState = document.getElementById('musicState');
const backgroundMusic = document.getElementById('backgroundMusic');

let heartInterval; 
let currentDate = new Date(); 

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

// 2. Kalp Yağmuru (DÜZELTİLDİ: h.className = 'heart' EKLENDİ)
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
function setTheme(themeName) {
    document.body.className = document.body.className.replace(/\btheme-[a-z-]+\b/g, ''); 
    
    if (themeName !== 'default') {
        document.body.classList.add(`theme-${themeName}`);
    }
    
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    localStorage.setItem('theme', themeName);

    // Aktif butonu işaretle
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === themeName) {
            btn.classList.add('active');
        }
    });
}

// 4. Müzik Yönetimi
function toggleMusic() {
  if (backgroundMusic.paused) {
    backgroundMusic.play().then(() => {
      localStorage.setItem('musicOn', 'true');
      musicState.textContent = 'Açık';
    }).catch(error => {
      console.error("Müzik Oynatma Hatası:", error);
      // Hata olsa bile görsel durumu güncelle
      localStorage.setItem('musicOn', 'false');
      musicState.textContent = 'Kapalı';
    });
  } else {
    backgroundMusic.pause();
    localStorage.setItem('musicOn', 'false');
    musicState.textContent = 'Kapalı';
  }
}

// 5. İltifat Göster
function showCompliment() {
  const randomIndex = Math.floor(Math.random() * compliments.length);
  complimentEl.textContent = compliments[randomIndex];
}

// 6. Takvimi Oluşturma
function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth(); 
  const today = new Date();

  const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  currentMonthYearEl.textContent = `${monthNames[month]} ${year}`;

  const firstDayOfMonth = new Date(year, month, 1).getDay(); 
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let existingDays = calendarGrid.querySelectorAll('.day:not(.header)');
  existingDays.forEach(day => day.remove());

  // Boşlukları doldurma
  let startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 
  for (let i = 0; i < startDay; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.classList.add('day');
    calendarGrid.appendChild(emptyDay);
  }

  // Takvim hücrelerini doldurma
  for (let i = 1; i <= daysInMonth; i++) {
    const dayEl = document.createElement('div');
    dayEl.classList.add('day');
    dayEl.textContent = i;
    
    dayEl.classList.add('current-month');

    // Bugün kontrolü
    if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      dayEl.classList.add('today');
      dayEl.title = 'Bugün';
    }

    // ÖZEL GÜNLERİ İŞARETLEME
    const monthDayKey = `${(month + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
    if (SPECIAL_DATES[monthDayKey]) {
        dayEl.classList.add('special');
        dayEl.title = SPECIAL_DATES[monthDayKey]; 
    }

    calendarGrid.appendChild(dayEl);
  }
}

// Takvim navigasyon fonksiyonları
function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
}

// --- Uygulama Başlangıcı ---

function initialize() {
  // Sayaç ve iltifatı başlat
  updateTimer();
  setInterval(updateTimer, 1000);
  showCompliment();
  setInterval(showCompliment, 10000); 

  // Takvimi yükle
  renderCalendar(currentDate);

  // Tema Yükle
  const savedTheme = localStorage.getItem('theme') || 'default';
  setTheme(savedTheme); 
  
  // Karanlık Mod Yükle
  const isDarkMode = localStorage.getItem('darkMode') === 'true';
  themeToggle.checked = isDarkMode;
  if (isDarkMode) {
      document.body.classList.add('dark-mode');
  }

  // Kalp Yağmuru Hızı Yükle
  const currentHeartSpeed = parseInt(localStorage.getItem('heartSpeed')) || 500;
  heartSpeedRange.value = currentHeartSpeed;
  startHeartRain(currentHeartSpeed);
  
  // Müzik Durumu Yükle
  const isMusicOn = localStorage.getItem('musicOn') !== 'false';
  if (isMusicOn) {
      musicState.textContent = 'Açık';
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
  settingsModal.style.display = 'flex'; // Display flex olarak güncellendi
};
closeSettings.onclick = () => {
  settingsModal.style.display = 'none';
};
window.onclick = (event) => {
  if (event.target === settingsModal) {
    settingsModal.style.display = 'none';
  }
};

// Karanlık Tema Değiştir
themeToggle.onchange = () => {
    document.body.classList.toggle('dark-mode', themeToggle.checked);
    localStorage.setItem('darkMode', themeToggle.checked);
    renderCalendar(currentDate); 
};

// Tema Seçimi Dinleyicisi
themeOptions.onclick = (event) => {
    if (event.target.classList.contains('theme-btn')) {
        const themeName = event.target.dataset.theme;
        setTheme(themeName);
        renderCalendar(currentDate); 
    }
};

// Kalp Hızı Değiştir
heartSpeedRange.oninput = () => {
  startHeartRain(heartSpeedRange.value);
};

// Müzik Düğmesi
musicToggleBtn.onclick = toggleMusic;

// Takvim Navigasyonu
prevMonthBtn.onclick = prevMonth;
nextMonthBtn.onclick = nextMonth;