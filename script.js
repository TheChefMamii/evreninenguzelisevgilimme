/* --- AYARLAR --- */
const startDate = new Date("2025-05-30T00:00:00"); 
const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
const BOT_TOKEN = '8387694074:AAHF30x-1NcmE0Gs4v2jWMpyJPDuwy0XCa4'; 
const CHAT_ID = '6750266187';

/* --- GÜNCELLEME BİLDİRİM SİSTEMİ (YENİ) --- */
// BURAYI SEN HER YENİLİK YAPTIĞINDA DEĞİŞTİR (Örn: 1.3 yap)
const CURRENT_VERSION = "1.0"; 

function checkUpdates() {
    const lastSeenVersion = localStorage.getItem('lastSeenVersion');
    const dot = document.getElementById('update-dot');
    const menuDot = document.getElementById('menu-notification-dot');

    // Eğer son görülen versiyon, şimdiki versiyon değilse (yani yeniyse)
    if (lastSeenVersion !== CURRENT_VERSION) {
        dot.style.display = 'block'; // Butonun yanındaki nokta
        menuDot.style.display = 'block'; // Hamburger menüdeki nokta
    } else {
        dot.style.display = 'none';
        menuDot.style.display = 'none';
    }
}

// Güncellemeler sayfasına tıklayınca bu çalışır
function markUpdatesRead() {
    localStorage.setItem('lastSeenVersion', CURRENT_VERSION);
    document.getElementById('update-dot').style.display = 'none';
    document.getElementById('menu-notification-dot').style.display = 'none';
}

/* --- TEMA LİSTESİ --- */
const themes = [
    { id: 0, name: "Romantik Pembe (Varsayılan)", primary: "#f8bbd9", bg: "linear-gradient(135deg, #fff0f3 0%, #ffe4e9 100%)" },
    { id: 1, name: "Aşkın Kırmızısı", primary: "#e91e63", bg: "linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)" },
    { id: 2, name: "Gül Altını", primary: "#d4a574", bg: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)" },
    { id: 3, name: "Okyanus Mavisi", primary: "#4fc3f7", bg: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)" },
    { id: 4, name: "Nane Yeşili", primary: "#4db6ac", bg: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)" },
    { id: 5, name: "Gece Moru", primary: "#9c27b0", bg: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)" },
    { id: 6, name: "Gün Batımı", primary: "#ff9800", bg: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)" },
    { id: 7, name: "Klasik Kırmızı", primary: "#f44336", bg: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)" },
    { id: 8, name: "Gece Modu", primary: "#ba68c8", bg: "#1a1a1a", text: "#ffffff", glass: "rgba(255,255,255,0.1)", nav: "#2d2d2d" },
    { id: 9, name: "Yılbaşı Sihri", primary: "#4caf50", bg: "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)", isEvent: true },
    { id: 10, name: "Sevgililer Günü", primary: "#e91e63", bg: "linear-gradient(135deg, #fce4ec 0%, #f8bbd9 100%)", isEvent: true },
    { id: 11, name: "Doğum Günü", primary: "#ff9800", bg: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)", isEvent: true },
    { id: 12, name: "Anniversary", primary: "#9c27b0", bg: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)", isEvent: true }
];

/* --- BAŞLANGIÇ --- */
window.addEventListener("load", function() {
    initClock();
    initTheme();
    getAntalyaWeather(); // Hava Durumunu Başlat
    checkUpdates(); // Güncellemeleri Kontrol Et

    setTimeout(function() {
        document.getElementById("loading-screen").style.opacity = "0";
        setTimeout(() => {
            document.getElementById("loading-screen").style.display = "none";
            document.getElementById("welcome-screen").classList.remove("hidden");

            // Dokunma olayını dinle
            const welcomeScreen = document.getElementById("welcome-screen");
            const handleTouch = () => {
                welcomeScreen.removeEventListener('click', handleTouch);
                welcomeScreen.removeEventListener('touchstart', handleTouch);

                const appContainer = document.getElementById("app-container");
                document.getElementById("welcome-screen").style.opacity = "0";
                setTimeout(() => {
                    document.getElementById("welcome-screen").style.display = "none";
                    appContainer.classList.remove("hidden");
                    appContainer.style.display = "block";
                }, 800);
            };

            welcomeScreen.addEventListener('click', handleTouch);
            welcomeScreen.addEventListener('touchstart', handleTouch);
        }, 800);
    }, 3000);
});

/* --- ANTALYA HAVA DURUMU (GitHub Fix + 20 Derece Kuralı) --- */
function getAntalyaWeather() {
    const wIcon = document.getElementById('w-icon');
    const wTemp = document.getElementById('w-temp');
    const wMsg = document.getElementById('w-msg');

    // Antalya Koordinatları
    const lat = 36.8841;
    const lon = 30.7056;
    
    // HTTPS protokolü kullanıyoruz, GitHub'da sorun çıkmaz
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(response => {
            if (!response.ok) throw new Error('Hava durumu alınamadı');
            return response.json();
        })
        .then(data => {
            const temp = Math.round(data.current_weather.temperature);
            const code = data.current_weather.weathercode;
            
            // İkon Seçimi
            if(code <= 3) wIcon.className = "fa-solid fa-sun";
            else if(code > 3 && code < 50) wIcon.className = "fa-solid fa-cloud";
            else if(code >= 50) wIcon.className = "fa-solid fa-cloud-rain";
            
            wTemp.innerText = `Antalya ${temp}°C`;

            // --- SICAKLIK MANTIĞI (20 DERECE SINIR) ---
            if (temp <= 20) {
                wMsg.innerText = "Sıkı giyin güzelim, üşüme 🧥";
            } else if (temp > 20 && temp < 28) {
                wMsg.innerText = "Hava güzel, tadını çıkar ⛅";
            } else {
                wMsg.innerText = "Çok sıcak, bol su iç 💧";
            }
        })
        .catch(err => {
            console.log("Hava Durumu Hatası:", err);
            wTemp.innerText = "Antalya"; 
            // Hata olursa mesajı gizlemek yerine tatlı bir şey yazalım
            wMsg.innerText = "Seninle hava hep güzel ☀️"; 
        });
}

/* --- TEMA MOTORU --- */
function initTheme() {
    const themeGrid = document.querySelector(".theme-grid");
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    let eventThemeId = null;

    // Özel günler için otomatik tema değişimi
    if(month === 10 && day === 31) eventThemeId = 6; // Halloween - Gün Batımı
    if(month === 2 && day === 14) eventThemeId = 10; // Sevgililer Günü
    if((month === 12 && day === 31) || (month === 1 && day === 1)) eventThemeId = 9; // Yılbaşı
    if(month === 5 && day === 30) eventThemeId = 11; // Doğum Günü (örnek tarih, değiştirilebilir)
    if(month === 3 && day === 15) eventThemeId = 12; // Anniversary (örnek tarih, değiştirilebilir)
    if(month === 4 && day === 23) eventThemeId = 9; // Ulusal Egemenlik ve Çocuk Bayramı - Yılbaşı teması
    if(month === 5 && day === 19) eventThemeId = 10; // Atatürk'ü Anma Gençlik ve Spor Bayramı - Sevgililer teması
    if(month === 8 && day === 30) eventThemeId = 6; // Zafer Bayramı - Gün Batımı
    if(month === 10 && day === 29) eventThemeId = 7; // Cumhuriyet Bayramı - Kırmızı

    let savedTheme = localStorage.getItem("selectedTheme");

    if(eventThemeId !== null && !savedTheme) {
        applyTheme(eventThemeId);
    } else if(savedTheme) {
        applyTheme(parseInt(savedTheme));
    }

    themes.forEach(theme => {
        const btn = document.createElement("div");
        btn.classList.add("theme-btn");
        
        if(theme.bg.includes("linear-gradient")) {
            btn.style.background = theme.bg;
        } else {
            btn.style.backgroundColor = theme.bg;
        }
        
        if(theme.isEvent) {
            btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles" style="color:white; font-size:12px; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);"></i>';
        }

        btn.onclick = () => {
            applyTheme(theme.id);
            localStorage.setItem("selectedTheme", theme.id);
        };
        themeGrid.appendChild(btn);
    });
}

function applyTheme(id) {
    const theme = themes.find(t => t.id === id);
    if(!theme) return;

    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--bg-gradient', theme.bg);
    root.style.setProperty('--text-color', theme.text || '#333');
    root.style.setProperty('--text-secondary', theme.text ? '#aaa' : '#777');
    root.style.setProperty('--glass-bg', theme.glass || 'rgba(255, 255, 255, 0.6)');
    root.style.setProperty('--nav-bg', theme.nav || 'white');

    document.querySelectorAll(".theme-btn").forEach((btn, index) => {
        if(index === id) btn.classList.add("active");
        else btn.classList.remove("active");
    });
}

/* --- SAAT --- */
function initClock() {
    const clockEl = document.getElementById("live-clock");
    setInterval(() => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        clockEl.innerText = `${hours}:${minutes}`;
    }, 1000);
}

/* --- MENÜ İŞLEMLERİ --- */
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if(sidebar.style.left === '0px') {
        sidebar.style.left = '-80%';
        overlay.style.display = 'none';
        sidebar.classList.remove('active');
    } else {
        sidebar.style.left = '0px';
        overlay.style.display = 'block';
        sidebar.classList.add('active');
    }
}
function openMsgModal() { toggleMenu(); document.getElementById('msg-modal').classList.remove('hidden'); }
function closeMsgModal() { document.getElementById('msg-modal').classList.add('hidden'); }

function openInfoModal() { toggleMenu(); document.getElementById('info-modal').classList.remove('hidden'); }
function closeInfoModal() { document.getElementById('info-modal').classList.add('hidden'); }

/* --- TELEGRAM --- */
document.getElementById('sendMsg').onclick = () => {
    const msgInput = document.getElementById('messageText');
    const msg = msgInput.value.trim();
    if(!msg) { alert('Boş mesaj mı? :('); return; }
    
    const btn = document.getElementById('sendMsg');
    btn.innerText = "Gönderiliyor..."; btn.disabled = true;

    fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: `❤️ Mesaj:\n\n${msg}` })
    }).then(r=>r.json()).then(d=>{
        if(d.ok) { alert('Gitti aşkım! ❤️'); msgInput.value = ''; closeMsgModal(); }
        else alert('Hata oluştu');
    }).finally(()=>{ btn.innerText = "Gönder ❤️"; btn.disabled = false; });
};

/* --- MENÜ GEÇİŞİ --- */
function switchTab(tabName) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    if(tabName === 'home') {
        document.getElementById('home-page').classList.add('active');
        document.querySelector('.nav-item:nth-child(1)').classList.add('active');
    } else if(tabName === 'settings') {
        document.getElementById('settings-page').classList.add('active');
        document.querySelector('.nav-item:nth-child(2)').classList.add('active');
    } else if(tabName === 'game') {
        document.getElementById('game-page').classList.add('active');
        initGame();
    }
}

/* --- AŞKIN CİPSLERİ OYUNU --- */
let gameState = {
    playerHearts: 3,
    botHearts: 3,
    currentTurn: 'player', // 'player' or 'bot'
    chips: [],
    gameOver: false
};

function initGame() {
    gameState = {
        playerHearts: 3,
        botHearts: 3,
        currentTurn: 'player',
        chips: [],
        gameOver: false
    };

    // 9 cips oluştur, 3'ü bomba
    const bombPositions = [];
    while(bombPositions.length < 3) {
        const pos = Math.floor(Math.random() * 9);
        if(!bombPositions.includes(pos)) bombPositions.push(pos);
    }

    for(let i = 0; i < 9; i++) {
        gameState.chips.push({
            isBomb: bombPositions.includes(i),
            opened: false
        });
    }

    updateGameUI();
    updateGameMessage('Sıra sende! Bir cips seç 💋');
}

function updateGameUI() {
    // Kalpleri güncelle
    const playerHeartsEl = document.querySelector('.player-info:first-child .hearts');
    const botHeartsEl = document.querySelector('.player-info:last-child .hearts');

    playerHeartsEl.innerHTML = '';
    botHeartsEl.innerHTML = '';

    for(let i = 0; i < 3; i++) {
        const playerHeart = document.createElement('span');
        playerHeart.className = 'heart';
        playerHeart.textContent = '❤️';
        if(i >= gameState.playerHearts) playerHeart.classList.add('lost');
        playerHeartsEl.appendChild(playerHeart);

        const botHeart = document.createElement('span');
        botHeart.className = 'heart';
        botHeart.textContent = '❤️';
        if(i >= gameState.botHearts) botHeart.classList.add('lost');
        botHeartsEl.appendChild(botHeart);
    }

    // Cipsleri güncelle
    const gameBoard = document.querySelector('.game-board');
    gameBoard.innerHTML = '';

    gameState.chips.forEach((chip, index) => {
        const chipEl = document.createElement('div');
        chipEl.className = 'chip';
        chipEl.onclick = () => selectChip(index);

        if(chip.opened) {
            chipEl.classList.add('opened');
            if(chip.isBomb) {
                chipEl.classList.add('bomb');
                chipEl.textContent = '💣';
            } else {
                chipEl.classList.add('safe');
                chipEl.textContent = '💋';
            }
        } else {
            chipEl.textContent = '🍟';
        }

        gameBoard.appendChild(chipEl);
    });
}

function selectChip(index) {
    if(gameState.gameOver || gameState.chips[index].opened) return;

    gameState.chips[index].opened = true;
    const isBomb = gameState.chips[index].isBomb;

    if(isBomb) {
        if(gameState.currentTurn === 'player') {
            gameState.playerHearts--;
            updateGameMessage('Mami\'ye 1 öpücük borçlusun! 😘');
            // Telegram mesajı gönder
            sendTelegramMessage(`Sevgilim yandı! Skor: ${gameState.playerHearts}-${gameState.botHearts}`);
        } else {
            gameState.botHearts--;
            updateGameMessage('Mami yandı, sana borçlu! 💋');
            // Telegram mesajı gönder
            sendTelegramMessage(`Ben yandım! Skor: ${gameState.playerHearts}-${gameState.botHearts}`);
        }
    } else {
        gameState.currentTurn = gameState.currentTurn === 'player' ? 'bot' : 'player';
        updateGameMessage(gameState.currentTurn === 'player' ? 'Sıra sende! 💋' : 'Mami düşünüyor... 🤔');

        if(gameState.currentTurn === 'bot') {
            setTimeout(botTurn, 1500);
        }
    }

    updateGameUI();
    checkGameOver();
}

function botTurn() {
    if(gameState.gameOver) return;

    // Bot rastgele kapalı cips seçer
    const closedChips = gameState.chips.map((chip, index) => chip.opened ? -1 : index).filter(i => i !== -1);
    if(closedChips.length === 0) return;

    const randomIndex = closedChips[Math.floor(Math.random() * closedChips.length)];
    selectChip(randomIndex);
}

function updateGameMessage(message) {
    document.querySelector('.game-message').textContent = message;
}

function checkGameOver() {
    if(gameState.playerHearts <= 0 || gameState.botHearts <= 0) {
        gameState.gameOver = true;
        const winner = gameState.playerHearts > gameState.botHearts ? 'Sen kazandın!' : 'Mami kazandı!';
        updateGameMessage(`${winner} 🎉`);

        // Oyun bitince yeniden başlat butonu göster
        const gameBoard = document.querySelector('.game-board');
        const restartBtn = document.createElement('button');
        restartBtn.className = 'game-btn';
        restartBtn.textContent = 'Tekrar Oyna';
        restartBtn.onclick = () => initGame();
        gameBoard.appendChild(restartBtn);
    }
}

function sendTelegramMessage(message) {
    // Mevcut Telegram fonksiyonunu çağır
    const msgInput = document.getElementById('messageText');
    const originalValue = msgInput.value;
    msgInput.value = message;

    // Mevcut gönderim fonksiyonunu tetikle
    document.getElementById('sendMsg').click();

    // Gecikmeli olarak orijinal değeri geri yükle
    setTimeout(() => {
        msgInput.value = originalValue;
    }, 1000);
}

/* --- MÜZİK & SAYAÇ --- */
musicToggle.addEventListener('change', function() { this.checked ? music.play().catch(()=>{}) : music.pause(); });

// Ses seviyesi ayarı
const volumeSlider = document.getElementById('volume-slider');
const savedVolume = localStorage.getItem('musicVolume') || 0.5;
music.volume = savedVolume;
volumeSlider.value = savedVolume;

volumeSlider.addEventListener('input', function() {
    music.volume = this.value;
    localStorage.setItem('musicVolume', this.value);
});

function updateCounter() {
    const now = new Date();
    const diff = now - startDate;
    const totalSeconds = Math.floor(Math.abs(diff) / 1000);
    document.getElementById("days").innerText = Math.floor(totalSeconds / 3600 / 24);
    document.getElementById("hours").innerText = String(Math.floor((totalSeconds / 3600) % 24)).padStart(2,'0');
    document.getElementById("minutes").innerText = String(Math.floor((totalSeconds / 60) % 60)).padStart(2,'0');
    document.getElementById("seconds").innerText = String(Math.floor(totalSeconds % 60)).padStart(2,'0');
}
setInterval(updateCounter, 1000); updateCounter();