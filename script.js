/* --- AYARLAR --- */
const startDate = new Date("2025-05-30T00:00:00"); 
const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
const BOT_TOKEN = '8387694074:AAHF30x-1NcmE0Gs4v2jWMpyJPDuwy0XCa4'; 
const CHAT_ID = '6750266187';

/* --- TEMA LİSTESİ --- */
const themes = [
    { 
        id: 0, 
        name: "Aşk Pembesi 💕", 
        primary: "#ff69b4", 
        bg: "linear-gradient(135deg, #fff0f5 0%, #ffe4e9 100%)",
        hearts: "#ff69b4",
        particles: ['❤️', '💕', '💖']
    },
    { 
        id: 1, 
        name: "Gül Pembesi 🌸", 
        primary: "#ff1493", 
        bg: "linear-gradient(135deg, #ffe4ec 0%, #ffb3d9 100%)",
        hearts: "#ff1493",
        particles: ['💕', '💖', '💗']
    },
    { 
        id: 2, 
        name: "Güneş Sarısı ☀️", 
        primary: "#ffd700", 
        bg: "linear-gradient(135deg, #fffbea 0%, #fff4cc 100%)",
        hearts: "#ffd700",
        particles: ['💛', '⭐', '✨']
    },
    { 
        id: 3, 
        name: "Turuncu Aşk 🧡", 
        primary: "#ff8c00", 
        bg: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)",
        hearts: "#ff8c00",
        particles: ['🧡', '🔶', '💛']
    },
    { 
        id: 4, 
        name: "Mevsim Teması 🍂", 
        primary: "#dynamic", 
        bg: "#dynamic",
        hearts: "#dynamic",
        particles: [],
        isSeasonal: true
    },
    { 
        id: 5, 
        name: "Özel Gün 🎉", 
        primary: "#dynamic", 
        bg: "#dynamic",
        hearts: "#dynamic",
        particles: [],
        isEvent: true
    }
];

/* --- BAŞLANGIÇ --- */
window.addEventListener("load", function() {
    initClock();
    initTheme();
    getAntalyaWeather();

    setTimeout(function() {
        document.getElementById("loading-screen").style.opacity = "0";
        setTimeout(() => {
            document.getElementById("loading-screen").style.display = "none";
            document.getElementById("welcome-screen").classList.remove("hidden");

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

/* --- ANTALYA HAVA DURUMU --- */
function getAntalyaWeather() {
    const wIcon = document.getElementById('w-icon');
    const wTemp = document.getElementById('w-temp');
    const wMsg = document.getElementById('w-msg');

    const lat = 36.8841;
    const lon = 30.7056;
    
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(response => {
            if (!response.ok) throw new Error('Hava durumu alınamadı');
            return response.json();
        })
        .then(data => {
            const temp = Math.round(data.current_weather.temperature);
            const code = data.current_weather.weathercode;
            
            if(code <= 3) wIcon.className = "fa-solid fa-sun";
            else if(code > 3 && code < 50) wIcon.className = "fa-solid fa-cloud";
            else if(code >= 50) wIcon.className = "fa-solid fa-cloud-rain";
            
            wTemp.innerText = `Antalya ${temp}°C`;

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
            wMsg.innerText = "Seninle hava hep güzel ☀️"; 
        });
}

/* --- TEMA MOTORU --- */
function initTheme() {
    const themeGrid = document.querySelector(".theme-grid");
    let savedTheme = localStorage.getItem("selectedTheme");

    if(savedTheme) {
        applyTheme(parseInt(savedTheme));
    } else {
        applyTheme(0);
    }

    themes.forEach(theme => {
        const btn = document.createElement("div");
        btn.classList.add("theme-btn");
        
        if(theme.isSeasonal) {
            btn.style.background = "linear-gradient(45deg, #4caf50, #ff5722, #ff8c00, #2196f3)";
            btn.innerHTML = '<i class="fa-solid fa-leaf" style="color:white; font-size:16px;"></i>';
        } else if(theme.isEvent) {
            btn.style.background = "linear-gradient(45deg, #ff0000, #ffd700, #4caf50)";
            btn.innerHTML = '<i class="fa-solid fa-gift" style="color:white; font-size:16px;"></i>';
        } else {
            if(theme.bg.includes("linear-gradient")) {
                btn.style.background = theme.bg;
            } else {
                btn.style.backgroundColor = theme.bg;
            }
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

    let primary, bg, hearts, particles;

    // Mevsim Teması
    if(theme.isSeasonal) {
        const month = new Date().getMonth() + 1;
        if(month >= 3 && month <= 5) { // İlkbahar
            primary = "#4caf50"; 
            bg = "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)"; 
            hearts = "#4caf50";
            particles = ['💚', '🌸', '🌼', '🌺', '🌷'];
        } else if(month >= 6 && month <= 8) { // Yaz
            primary = "#ff5722"; 
            bg = "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)"; 
            hearts = "#ff5722";
            particles = ['🔥', '❤️‍🔥', '☀️', '🌞'];
        } else if(month >= 9 && month <= 11) { // Sonbahar
            primary = "#ff8c00"; 
            bg = "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)"; 
            hearts = "#ff8c00";
            particles = ['🍂', '🍁', '🧡', '🍃'];
        } else { // Kış
            primary = "#2196f3"; 
            bg = "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)"; 
            hearts = "#2196f3";
            particles = ['❄️', '⛄', '💙', '☃️'];
        }
    }
    else if(theme.isEvent) {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        
        if(month === 2 && day === 14) { // Sevgililer
            primary = "#ff1493"; 
            bg = "linear-gradient(135deg, #ffe4ec 0%, #ffb3d9 100%)"; 
            hearts = "#ff1493";
            particles = ['💕', '💖', '💗', '💝', '💘'];
        } else if((month === 12 && day === 31) || (month === 1 && day === 1)) { // Yılbaşı
            primary = "#4caf50"; 
            bg = "linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)"; 
            hearts = "#ff0000";
            particles = ['🎄', '🎁', '⭐', '✨', '🎅'];
        } else if(month === 4 && day === 23) { // 23 Nisan
            primary = "#ff0000"; 
            bg = "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)"; 
            hearts = "#ff0000";
            particles = ['🇹🇷', '❤️', '🎈', '🎉'];
        } else if(month === 5 && day === 19) { // 19 Mayıs
            primary = "#2196f3"; 
            bg = "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)"; 
            hearts = "#2196f3";
            particles = ['🇹🇷', '💙', '⚽', '🏃'];
        } else if(month === 8 && day === 30) { // 30 Ağustos
            primary = "#ff0000"; 
            bg = "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)"; 
            hearts = "#ff0000";
            particles = ['🇹🇷', '❤️', '🎖️', '⭐'];
        } else if(month === 10 && day === 29) { // 29 Ekim
            primary = "#ff0000"; 
            bg = "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)"; 
            hearts = "#ff0000";
            particles = ['🇹🇷', '❤️', '🎉', '🎊'];
        } else { 
            primary = "#ff69b4"; 
            bg = "linear-gradient(135deg, #fff0f5 0%, #ffe4e9 100%)"; 
            hearts = "#ff69b4";
            particles = ['💖', '💕', '❤️'];
        }
    }
    else {
        primary = theme.primary;
        bg = theme.bg;
        hearts = theme.hearts;
        particles = theme.particles;
    }

    const root = document.documentElement;
    root.style.setProperty('--primary-color', primary);
    root.style.setProperty('--bg-gradient', bg);
    root.style.setProperty('--text-color', '#333');
    root.style.setProperty('--text-secondary', '#777');
    root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.6)');
    root.style.setProperty('--nav-bg', 'white');

    document.querySelectorAll(".theme-btn").forEach((btn, index) => {
        if(index === id) btn.classList.add("active");
        else btn.classList.remove("active");
    });

    // SÜREKLI AKAN ANİMASYONU BAŞLAT
    startContinuousParticles(particles, hearts);
}

// SÜREKLI AKAN PARTİKÜLLER
let particleInterval = null;

function startContinuousParticles(particles, color) {
    // Önceki animasyonu durdur
    if(particleInterval) {
        clearInterval(particleInterval);
    }
    
    // Mevcut partikülleri temizle
    document.querySelectorAll('.particle').forEach(p => p.remove());
    
    // Yeni animasyonu başlat - SÜREKLI
    particleInterval = setInterval(() => {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = particles[Math.floor(Math.random() * particles.length)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.color = color;
        particle.style.fontSize = (15 + Math.random() * 20) + 'px';
        particle.style.setProperty('--random-x', (Math.random() * 100 - 50) + 'px');
        particle.style.animationDuration = (4 + Math.random() * 3) + 's';
        particle.style.opacity = (0.3 + Math.random() * 0.7);
        document.body.appendChild(particle);
        
        // 7 saniye sonra sil
        setTimeout(() => particle.remove(), 7000);
    }, 400); // Her 400ms'de bir partikül
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
    }
}

/* --- MÜZİK & SAYAÇ --- */
musicToggle.addEventListener('change', function() { this.checked ? music.play().catch(()=>{}) : music.pause(); });

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